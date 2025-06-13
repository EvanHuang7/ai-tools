from django.http import JsonResponse
from datetime import datetime

def time(request):
    return JsonResponse({
        "api": "python",
        "currentTime": datetime.now().isoformat()
    })
    
def ping(request):
    return JsonResponse({"message": "pong"}, status=200)
