# store/urls.py
from django.urls import path
from .views import StoreItemListView, PurchaseItemView

urlpatterns = [
    path('items/', StoreItemListView.as_view(), name='store_items'),
    path('purchase/', PurchaseItemView.as_view(), name='purchase_item'),
]