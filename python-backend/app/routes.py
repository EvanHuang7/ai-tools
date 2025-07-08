from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
import os
import requests
from io import BytesIO

from .models import Plan, KafkaMessage
from .config import IMAGEKIT_PRIVATE_KEY, IMAGEKIT_UPLOAD_URL
from .utils import append_transformation
from .auth_middleware import clerk_auth_required

# gRPC imports
import grpc
from gen import greeter_pb2, greeter_pb2_grpc

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
        grpc_host = os.getenv("GRPC_HOST", "localhost")
        grpc_port = os.getenv("GRPC_PORT", "50051")
        channel = grpc.insecure_channel(f"{grpc_host}:{grpc_port}")
        client = greeter_pb2_grpc.GreeterServiceStub(channel)

        # Create the request message
        request_message = greeter_pb2.HelloRequest(name="Python Backend")

        # Call the SayHello RPC
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
        image = request.files.get("image")
        if not image:
            return jsonify({"error": "No image provided"}), 400

        # 1. Upload original file to ImageKit
        upload_response = requests.post(
            IMAGEKIT_UPLOAD_URL,
            files={"file": image},
            data={"fileName": image.filename},
            auth=(IMAGEKIT_PRIVATE_KEY, "")
        )
        upload_data = upload_response.json()
        original_url = upload_data["url"]
        if not original_url:
            return jsonify({"error": "Upload to ImageKit failed", "details": upload_data}), 500

        # 2. Apply background removal transformation
        transformed_url = append_transformation(original_url, "e-bgremove")

        # 3. Download transformed image (background removed)
        transformed_img_res = requests.get(transformed_url)
        if transformed_img_res.status_code != 200:
            return jsonify({"error": "Failed to download transformed image"}), 500

        # 4. Re-upload transformed image as a new file
        new_upload = requests.post(
            IMAGEKIT_UPLOAD_URL,
            files={"file": BytesIO(transformed_img_res.content)},
            data={"fileName": f"bg_removed_{image.filename}"},
            auth=(IMAGEKIT_PRIVATE_KEY, "")
        )

        if new_upload.status_code != 200:
            return jsonify({"error": "Failed to upload background-removed image"}), 500

        new_data = new_upload.json()
        return jsonify({"processed_url": new_data["url"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500