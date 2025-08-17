# gamification/urls.py
from django.urls import path
from .views import CompleteActivityView, LeaderboardView # Adicione a LeaderboardView

urlpatterns = [
    path('complete-activity/', CompleteActivityView.as_view(), name='complete_activity'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'), # Adicione esta linha
]