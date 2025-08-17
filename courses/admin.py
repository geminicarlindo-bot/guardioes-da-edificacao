# courses/admin.py
from django.contrib import admin
from .models import Course, Module, Activity # Importe todos os modelos do app

# Registre seus modelos aqui.
admin.site.register(Course)
admin.site.register(Module)
admin.site.register(Activity)