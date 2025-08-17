# gamification/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from courses.models import Activity
from users.models import Profile
from .serializers import LeaderboardSerializer
from .models import Badge, ProfileBadge # Importe os modelos de Badge

class CompleteActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        activity_id = request.data.get('activity_id')
        profile = request.user.profile
        if not activity_id:
            return Response({'error': 'Activity ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            activity = Activity.objects.get(id=activity_id)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)

        # Lógica de XP e Moedas
        profile.xp += 100
        profile.moedas += 25

        # Lógica de level up
        level_threshold = profile.level * 500
        if profile.xp >= level_threshold:
            profile.level += 1

        profile.save()

        # --- LÓGICA PARA CONCEDER BADGE ---
        badge_awarded = None
        # Verifica se o usuário tem apenas 1 atividade completa (esta que ele acabou de fazer)
        # Para isso, precisamos de um M2M no Profile. Vamos simplificar por agora.
        # Supondo que o Badge com ID=1 é o de "Primeira Atividade"
        try:
            first_activity_badge = Badge.objects.get(id=1)
            # Tenta criar a relação. Se já existir, dará um erro que vamos ignorar.
            _, created = ProfileBadge.objects.get_or_create(profile=profile, badge=first_activity_badge)
            if created:
                badge_awarded = first_activity_badge.title
        except Badge.DoesNotExist:
            # O badge com id=1 não existe, então não fazemos nada.
            pass 
        # --- FIM DA LÓGICA DO BADGE ---

        response_data = {
            'message': f'Atividade "{activity.title}" concluída!',
            'new_xp': profile.xp,
            'new_level': profile.level,
            'new_moedas': profile.moedas,
        }

        if badge_awarded:
            response_data['badge_awarded'] = f'Você ganhou um novo badge: {badge_awarded}!'

        return Response(response_data, status=status.HTTP_200_OK)

class LeaderboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Pega todos os perfis, ordena por XP (do maior para o menor) e limita aos 10 primeiros
        profiles = Profile.objects.order_by('-xp')[:10]
        serializer = LeaderboardSerializer(profiles, many=True)
        return Response(serializer.data)