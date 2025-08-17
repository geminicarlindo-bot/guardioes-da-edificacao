# courses/serializers.py
from rest_framework import serializers
from .models import Course, Module, Activity # Adicione Activity

# ADICIONE ESTE NOVO SERIALIZER
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'title', 'description', 'activity_type', 'order']

# ATUALIZE O MODULESERIALIZER
class ModuleSerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(many=True, read_only=True) # Adicione esta linha

    class Meta:
        model = Module
        fields = ['id', 'title', 'order', 'activities'] # Adicione 'activities'

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'professor', 'created_at', 'modules']
        # ADICIONE A LINHA ABAIXO
        read_only_fields = ['professor']