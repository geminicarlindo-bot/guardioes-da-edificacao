# users/serializers.py
from rest_framework import serializers
from .models import CustomUser, Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from store.models import StoreItem, ProfileInventory # Importe os modelos da loja


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Adiciona informações customizadas ao token
        token['username'] = user.username
        token['role'] = user.role
        token['xp'] = user.profile.xp
        token['level'] = user.profile.level
        token['moedas'] = user.profile.moedas # ADICIONE ESTA LINHA

        return token

class EquippedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreItem
        fields = ['id', 'name', 'asset_url', 'item_type']

class InventoryItemSerializer(serializers.ModelSerializer):
    item = EquippedItemSerializer(read_only=True)
    class Meta:
        model = ProfileInventory
        fields = ['item']

class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    inventory = InventoryItemSerializer(many=True, read_only=True)
    equipped_capacete = EquippedItemSerializer(read_only=True)
    equipped_luva = EquippedItemSerializer(read_only=True)
    equipped_ferramenta = EquippedItemSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = '__all__'