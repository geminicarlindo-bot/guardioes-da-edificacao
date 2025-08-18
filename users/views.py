# users/views.py
from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import UserSerializer # Criaremos a seguir
from .models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView # Adicione APIView
from .serializers import UserSerializer, MyTokenObtainPairSerializer, ProfileSerializer # Adicione ProfileSerializer

class UserRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny] # Qualquer um pode se registrar
    serializer_class = UserSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ProfileDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)