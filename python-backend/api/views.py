from django.http import JsonResponse
from datetime import datetime

def ping(request):
    return JsonResponse({
        "api": "python",
        "currentTime": datetime.now().isoformat()
    })
