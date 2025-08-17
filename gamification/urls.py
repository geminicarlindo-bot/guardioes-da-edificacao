# gamification/urls.py
from django.urls import path
from .views import CompleteActivityView

urlpatterns = [
    path('complete-activity/', CompleteActivityView.as_view(), name='complete_activity'),
]