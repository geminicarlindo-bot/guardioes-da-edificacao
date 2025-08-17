# store/admin.py
from django.contrib import admin
from .models import StoreItem, ProfileInventory

admin.site.register(StoreItem)
admin.site.register(ProfileInventory)