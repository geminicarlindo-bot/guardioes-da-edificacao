# store/views.py
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import StoreItem, ProfileInventory
from .serializers import StoreItemSerializer

class StoreItemListView(generics.ListAPIView):
    queryset = StoreItem.objects.all()
    serializer_class = StoreItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class PurchaseItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        item_id = request.data.get('item_id')
        profile = request.user.profile

        try:
            item = StoreItem.objects.get(id=item_id)
        except StoreItem.DoesNotExist:
            return Response({'error': 'Item não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        if profile.moedas < item.price:
            return Response({'error': 'Moedas insuficientes.'}, status=status.HTTP_400_BAD_REQUEST)

        if ProfileInventory.objects.filter(profile=profile, item=item).exists():
            return Response({'error': 'Você já possui este item.'}, status=status.HTTP_400_BAD_REQUEST)

        profile.moedas -= item.price
        profile.save()

        ProfileInventory.objects.create(profile=profile, item=item)

        return Response({
            'message': f'Você comprou {item.name}!',
            'new_moedas': profile.moedas
        }, status=status.HTTP_200_OK)