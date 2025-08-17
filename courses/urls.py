# courses/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, ModuleViewSet, ActivityViewSet # Adicione ModuleViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'modules', ModuleViewSet) # Adicione esta linha
router.register(r'activities', ActivityViewSet) # Adicione esta linha

urlpatterns = [
    path('', include(router.urls)),
]