from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Plan

from config.settings import redis_client

def time(request):
    return JsonResponse({
        "api": "python",
        "currentTime": datetime.now().isoformat()
    })
    
def ping(request):
    return JsonResponse({"message": "pong"}, status=200)


@csrf_exempt
def redis_write(request):
    # Expect POST with JSON: {"key": "mykey", "value": "myvalue"}
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)
    try:
        data = json.loads(request.body)
        key = data.get("key")
        value = data.get("value")
        if not key or value is None:
            return JsonResponse({"error": "key and value required"}, status=400)
        
        redis_client.set(key, value)
        return JsonResponse({"message": f"Set {key} = {value}"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def redis_read(request):
    # Expect GET with ?key=mykey
    key = request.GET.get("key")
    if not key:
        return JsonResponse({"error": "key query param required"}, status=400)
    try:
        value = redis_client.get(key)
        if value is None:
            return JsonResponse({"error": "key not found"}, status=404)
        # Redis returns bytes, decode to str
        return JsonResponse({"key": key, "value": value.decode()})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@csrf_exempt
def create_plan(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    try:
        data = json.loads(request.body)
        userId = data.get("userId")
        plan_text = data.get("plan")
        if userId is None or not plan_text:
            return JsonResponse({"error": "Missing userId or plan"}, status=400)

        plan = Plan(userId=int(userId), plan=plan_text)
        plan.save()
        return JsonResponse({"message": "Plan saved", "plan": plan_text})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def read_plans(request):
    try:
        userId = request.GET.get("userId")
        if not userId:
            return JsonResponse({"error": "userId query param required"}, status=400)
        userId = int(userId)
        plans = Plan.objects.filter(userId=userId)
        return JsonResponse({
            "plans": [{"userId": p.userId, "plan": p.plan} for p in plans]
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)