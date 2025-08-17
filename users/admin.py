# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Profile # Adicione Profile

# Esta classe customiza como os usuários são exibidos no admin
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Campos a serem exibidos na lista de usuários
    list_display = ('email', 'username', 'role', 'is_staff')
    # Campos a serem exibidos no formulário de edição do usuário
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),
    )

# Registra o nosso modelo com a customização acima
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Profile) # Adicione esta linha
