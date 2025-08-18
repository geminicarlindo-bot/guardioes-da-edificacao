# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save # Importe os signals
from django.dispatch import receiver # Importe o receiver

class CustomUser(AbstractUser):
    USER_ROLE_CHOICES = (
        ('aluno', 'Aluno'),
        ('professor', 'Professor'),
    )
    role = models.CharField(max_length=10, choices=USER_ROLE_CHOICES, default='aluno')

    # ADICIONE A LINHA ABAIXO PARA GARANTIR QUE O EMAIL SEJA ÚNICO
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    moedas = models.IntegerField(default=10)

    # ADICIONE OS CAMPOS ABAIXO
    equipped_capacete = models.ForeignKey('store.StoreItem', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    equipped_luva = models.ForeignKey('store.StoreItem', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    equipped_ferramenta = models.ForeignKey('store.StoreItem', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')

    def __str__(self):
        return self.user.username

# Este "signal" garante que um Profile seja criado para cada novo CustomUser
@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()