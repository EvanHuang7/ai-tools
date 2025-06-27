from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
import os
import json

from .models import Plan, KafkaMessage
# gRPC imports
import grpc
from gen import greeter_pb2, greeter_pb2_grpc

bp = Blueprint("main", __name__)

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

@bp.route("/redis_write", methods=["POST"])
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
def listKafkaMessages():
    try:
        kafkaMessages = KafkaMessage.objects()
        return jsonify({
            "messages": [{"message": m.message} for m in kafkaMessages]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500