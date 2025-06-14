from django.urls import path
from .views import time, ping, redis_write, redis_read, create_plan, read_plans

urlpatterns = [
    path('', time),  # now responds to "/"
    path('ping/', ping, name='ping'),
    path('redis_write', redis_write),
    path('redis_read', redis_read),
    path('plan_write', create_plan),
    path('plan_read', read_plans),
]
