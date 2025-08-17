# courses/models.py
from django.db import models
from users.models import CustomUser # Importa nosso modelo de usuário

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    professor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='courses')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Module(models.Model):
    title = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    order = models.PositiveIntegerField() # Para definir a ordem dos módulos

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.course.title} - {self.title}'

class Activity(models.Model):
    ACTIVITY_TYPE_CHOICES = (
        ('missao', 'Missão'),
        ('quiz', 'Quiz'),
        ('desafio', 'Desafio'),
    )
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='activities')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    activity_type = models.CharField(max_length=10, choices=ACTIVITY_TYPE_CHOICES)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title