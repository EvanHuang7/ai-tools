from flask import Blueprint, request, jsonify, current_app, g
from datetime import datetime
import time as pytime
import requests
from io import BytesIO
from json import loads

from . import secrets
from . import constants
from . import utils
from . import service
from .models import Plan, KafkaMessage, Image
from .auth_middleware import clerk_auth_required

# gRPC imports
import grpc
from gen import greeter_pb2, greeter_pb2_grpc, app_pb2, app_pb2_grpc

bp = Blueprint("main", __name__)

# Public routes
@bp.route("/")
def time():
    return jsonify({
        "api": "python",
        "currentTime": datetime.now().isoformat()
    })

@bp.route("/ping", methods=["GET"])
@bp.route("/ping/", methods=["GET"])
def ping():
    return jsonify({"message": "pong"}), 200

# Protected routes
@bp.route("/redis_write", methods=["POST"])
@clerk_auth_required
def redis_write():
    try:
        data = request.get_json()
        key = data.get("key")
        value = data.get("value")
        if not key or value is None:
            return jsonify({"error": "key and value required"}), 400

        redis_client = current_app.redis_client
        redis_client.set(key, value)

        return jsonify({"message": f"Set {key} = {value}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/redis_read", methods=["GET"])
@clerk_auth_required
def redis_read():
    key = request.args.get("key")
    if not key:
        return jsonify({"error": "key query param required"}), 400

    redis_client = current_app.redis_client
    try:
        value = redis_client.get(key)
        if value is None:
            return jsonify({"error": "key not found"}), 404
        return jsonify({"key": key, "value": value.decode()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/plan_write", methods=["POST"])
@clerk_auth_required
def create_plan():
    try:
        data = request.get_json()
        userId = data.get("userId")
        plan_text = data.get("plan")
        if userId is None or not plan_text:
            return jsonify({"error": "Missing userId or plan"}), 400
        plan = Plan(userId=int(userId), plan=plan_text).save()

        return jsonify({"message": "Plan saved", "plan": plan_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route("/plan_read", methods=["GET"])
@clerk_auth_required
def read_plans():
    try:
        userId = request.args.get("userId", type=int)
        if userId is None:
            return jsonify({"error": "userId query param required"}), 400
        plans = Plan.objects(userId=userId)

        return jsonify({
            "plans": [{"userId": p.userId, "plan": p.plan} for p in plans]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# gRPC call to go backend
@bp.route("/grpc-greet", methods=["GET"])
@clerk_auth_required
def grpc_greet():
    try:
        # Connect to the gRPC server (Go server running on 50051 port)
        channel = grpc.insecure_channel(f"{constants.grpc_host}:{constants.grpc_port}")
        client = greeter_pb2_grpc.GreeterServiceStub(channel)

        # Create the request message
        request_message = greeter_pb2.HelloRequest(name="Python Backend")

        # Call the SayHello gRPC
        response = client.SayHello(request_message, timeout=3)  # 3 seconds timeout

        return jsonify({"message": response.message})

    except grpc.RpcError as e:
        return jsonify({"error": f"gRPC call failed: {e}"}), 500
    
# List kafka message
@bp.route("/listKafkaMessages", methods=["GET"])
@clerk_auth_required
def listKafkaMessages():
    try:
        kafkaMessages = KafkaMessage.objects()
        return jsonify({
            "messages": [{"message": m.message} for m in kafkaMessages]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
# TODO: use Ingest latteer
@bp.route("/remove-bg", methods=["POST"])
@clerk_auth_required
def remove_background():
    try:
        # Check the current monthly usage based on user plan first
        current_monthly_usage = service.get_image_feature_monthly_usage(g.user_id)
        
        monthly_limit = 0
        if g.user_plan == "free_user":
            monthly_limit = constants.free_user_image_feature_monthly_limit
        elif g.user_plan == "standard_user":
            monthly_limit = constants.standard_user_image_feature_monthly_limit
        elif g.user_plan == "pro_user":
            monthly_limit = constants.pro_user_image_feature_monthly_limit
        
        if current_monthly_usage >= monthly_limit:
            return jsonify({"error": "You've exceeded your monthly remove bg image feature usage limit. Please upgrade your plan to continue."}), 500
        
        # Step1: Upload original file to ImageKit
        image = request.files.get("image")
        if not image:
            return jsonify({"error": "No image provided"}), 400

        upload_response = requests.post(
            constants.imagekit_upload_url,
            files={"file": image},
            data={"fileName": image.filename},
            auth=(secrets.imagekit_private_key, "")
        )
        upload_data = upload_response.json()
        original_url = upload_data["url"]
        if not original_url:
            return jsonify({"error": "Upload to ImageKit failed", "details": upload_data}), 500

        # Step2: Apply background removal transformation
        transformed_url = utils.append_transformation(original_url, "e-bgremove")

        # Step3: Download transformed image (background removed)
        transformed_img_res = requests.get(transformed_url)
        if transformed_img_res.status_code != 200:
            return jsonify({"error": "Failed to download transformed image"}), 500

        # Step4: Re-upload transformed image as a new file
        new_upload_response = requests.post(
            constants.imagekit_upload_url,
            files={"file": BytesIO(transformed_img_res.content)},
            data={"fileName": f"bg_removed_{image.filename}"},
            auth=(secrets.imagekit_private_key, "")
        )

        if new_upload_response.status_code != 200:
            return jsonify({"error": "Failed to upload background-removed image"}), 500

        new_upload_data = new_upload_response.json()
        result_image_url = new_upload_data["url"]
        if not result_image_url:
            return jsonify({"error": "Upload processed image to ImageKit failed", "details": new_upload_data}), 500
        
        # Step5: Create data in mongodb
        created_image = Image(userId=g.user_id, inputImageUrl=original_url, resultImageUrl=result_image_url).save()
        
        # Step6: Increase feature montly usage for user
        service.increment_image_feature_monthly_usage(g.user_id)
        
        return jsonify({
            "success": True,
            "image": {
                "id": str(created_image.id),
                "inputImageUrl": original_url,
                "resultImageUrl": result_image_url
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@bp.route("/list-removed-bg-images", methods=["GET"])
@clerk_auth_required
def list_removed_bg_images():
    try:
        images = Image.objects(userId=g.user_id)

        return jsonify({
            "images": [{"id": str(img.id), "inputImageUrl": img.inputImageUrl, "resultImageUrl": img.resultImageUrl} for img in images]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# gRPC call to get app features usage
@bp.route("/get-app-usage", methods=["GET"])
@clerk_auth_required
def get_app_usage():
    try:
        # Connect to the gRPC server (Go server running on 50051 port)
        channel = grpc.insecure_channel(f"{constants.grpc_host}:{constants.grpc_port}")
        client = app_pb2_grpc.AppServiceStub(channel)

        # Create the request message
        request_message = app_pb2.GetAppMonthlyUsageKeyRequest(userId=g.user_id)

        # Step 1: Call the GetAppMonthlyUsageKey gRPC to collect app usage
        # NOTE: Python service (via gRPC) -> Go service (via GCP pubsub) ->
        # Node service (via RabbitMQ message) -> Python service create redis record.
        response = client.GetAppMonthlyUsageKey(request_message, timeout=3)  # 3 seconds timeout
        
        # Step 2: Poll app usage from Redis every second up to 5 times
        redis_client = current_app.redis_client
        redis_value = None
        for _ in range(5):
            redis_value = redis_client.get(response.redisKey)
            if redis_value:
                break
            # wait 1 second before retry
            pytime.sleep(1)

        # Step 3: Decode redis value and add remove bg image feature usage to it
        if redis_value:
            try:
                parsed_value = loads(redis_value)
            except Exception:
                parsed_value = redis_value.decode("utf-8") if isinstance(redis_value, bytes) else redis_value
                
            # Get remove bg image feature usage
            current_rm_bg_image_monthly_usage = service.get_image_feature_monthly_usage(g.user_id)
            
            # Add "removeBgImageFeatureUsage" to parsed_value
            if isinstance(parsed_value, dict):
                parsed_value["removeBgImageFeatureUsage"] = current_rm_bg_image_monthly_usage
                
            return jsonify({
                "appFeaturesUsage": parsed_value,
            })
        else:
            return jsonify({
                "message": "Timed out waiting for Redis value"
            }), 504
    except grpc.RpcError as e:
        return jsonify({"error": f"gRPC call failed: {e}"}), 500