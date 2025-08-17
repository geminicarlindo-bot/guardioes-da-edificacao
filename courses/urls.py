# courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ActivityViewSet # Adicione ActivityViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'activities', ActivityViewSet) # Adicione esta linha

urlpatterns = [
    path('', include(router.urls)),
]