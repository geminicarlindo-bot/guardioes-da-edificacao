# gamification/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from courses.models import Activity

class CompleteActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        activity_id = request.data.get('activity_id')
        if not activity_id:
            return Response({'error': 'Activity ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            activity = Activity.objects.get(id=activity_id)
        except Activity.DoesNotExist:
            return Response({'error': 'Activity not found'}, status=status.HTTP_404_NOT_FOUND)

        # Lógica simples de XP e Nível
        profile = request.user.profile
        profile.xp += 100 # Adiciona 100 XP por atividade

        # Lógica de level up: a cada 500 XP
        level_threshold = profile.level * 500
        if profile.xp >= level_threshold:
            profile.level += 1

        profile.save()

        return Response({
            'message': f'Atividade "{activity.title}" concluída!',
            'new_xp': profile.xp,
            'new_level': profile.level
        }, status=status.HTTP_200_OK)