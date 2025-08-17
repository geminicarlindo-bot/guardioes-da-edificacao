# courses/views.py
from rest_framework import viewsets, permissions
from .models import Course, Module, Activity # Adicione Module e Activity
from .serializers import CourseSerializer, ModuleSerializer, ActivitySerializer # Adicione os novos

# Uma permissão customizada para garantir que só professores possam criar/editar
class IsProfessorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'professor'

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsProfessorOrReadOnly]

    # SUBSTITUA A FUNÇÃO ABAIXO
    def get_queryset(self):
        # Primeiro, verificamos se o usuário está logado e se é um usuário real
        if self.request.user.is_authenticated:
            # Se for professor, mostramos apenas os cursos dele
            if self.request.user.role == 'professor':
                return Course.objects.filter(professor=self.request.user)

        # Para todos os outros casos (alunos logados ou usuários anônimos), mostramos todos os cursos
        return Course.objects.all()

    def perform_create(self, serializer):
        # Associa o curso ao professor que o criou
        serializer.save(professor=self.request.user)

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        course = serializer.validated_data['course']
        if course.professor != self.request.user:
            raise permissions.PermissionDenied("Você não tem permissão para adicionar módulos neste curso.")
        serializer.save()
class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated] # Somente usuários logados

    # Garantir que um professor só possa criar atividades em seus próprios cursos
    def perform_create(self, serializer):
        module = serializer.validated_data['module']
        if module.course.professor != self.request.user:
            raise permissions.PermissionDenied("Você não tem permissão para adicionar atividades neste módulo.")
        serializer.save()