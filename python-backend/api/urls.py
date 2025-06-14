from django.urls import path
from .views import time, ping, redis_write, redis_read

urlpatterns = [
    path('', time),  # now responds to "/"
    path('ping/', ping, name='ping'),
    path('redis_write', redis_write),
    path('redis_read', redis_read),
]
