# gamification/admin.py
from django.contrib import admin
from .models import Badge, ProfileBadge

admin.site.register(Badge)
admin.site.register(ProfileBadge)