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

class EquipItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        item_id = request.data.get('item_id')
        profile = request.user.profile

        try:
            item_to_equip = StoreItem.objects.get(id=item_id)
        except StoreItem.DoesNotExist:
            return Response({'error': 'Item não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Verifica se o usuário realmente possui o item
        if not ProfileInventory.objects.filter(profile=profile, item=item_to_equip).exists():
            return Response({'error': 'Você não possui este item.'}, status=status.HTTP_403_FORBIDDEN)

        # Lógica para equipar baseado no tipo do item
        item_type = item_to_equip.item_type
        if item_type == 'capacete':
            profile.equipped_capacete = item_to_equip
        elif item_type == 'luva':
            profile.equipped_luva = item_to_equip
        elif item_type == 'ferramenta':
            profile.equipped_ferramenta = item_to_equip
        else:
            return Response({'error': 'Tipo de item desconhecido.'}, status=status.HTTP_400_BAD_REQUEST)

        profile.save()

        return Response({'message': f'{item_to_equip.name} equipado com sucesso!'}, status=status.HTTP_200_OK)

class UnequipItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        item_type = request.data.get('item_type')
        profile = request.user.profile

        if item_type == 'capacete':
            profile.equipped_capacete = None
        elif item_type == 'luva':
            profile.equipped_luva = None
        elif item_type == 'ferramenta':
            profile.equipped_ferramenta = None
        else:
            return Response({'error': 'Tipo de item inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        profile.save()
        return Response({'message': f'Item do tipo {item_type} foi removido.'}, status=status.HTTP_200_OK)