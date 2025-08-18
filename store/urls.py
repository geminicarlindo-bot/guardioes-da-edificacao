# store/urls.py
from django.urls import path
from .views import StoreItemListView, PurchaseItemView, EquipItemView, UnequipItemView

urlpatterns = [
    path('items/', StoreItemListView.as_view(), name='store_items'),
    path('purchase/', PurchaseItemView.as_view(), name='purchase_item'),
    path('equip/', EquipItemView.as_view(), name='equip_item'), # Adicione esta linha
    path('unequip/', UnequipItemView.as_view(), name='unequip_item'), # ADICIONE ESTA LINHA

]