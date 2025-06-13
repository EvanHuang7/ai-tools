from django.urls import path
from .views import time, ping

urlpatterns = [
    path('', time),  # now responds to "/"
    path('ping/', ping, name='ping')
]
