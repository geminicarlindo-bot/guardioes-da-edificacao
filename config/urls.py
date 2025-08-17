# config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')), # Adicione esta linha
    path('api/', include('courses.urls')), # Adicione esta linha
    path('api/store/', include('store.urls')), # Adicione esta linha
    path('api/gamification/', include('gamification.urls')), # Adicione esta linha

]