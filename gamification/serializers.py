# gamification/serializers.py
from rest_framework import serializers
from users.models import Profile

class LeaderboardSerializer(serializers.ModelSerializer):
    # Pega o username do usuário relacionado ao perfil
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'level', 'xp']