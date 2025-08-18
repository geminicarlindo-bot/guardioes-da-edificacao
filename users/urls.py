# users/urls.py
from django.urls import path
from .views import UserRegisterView, MyTokenObtainPairView, ProfileDetailView # Adicione ProfileDetailView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user_register'),
    # ATUALIZE A LINHA ABAIXO
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileDetailView.as_view(), name='profile_detail'), # ADICIONE ESTA LINHA

]