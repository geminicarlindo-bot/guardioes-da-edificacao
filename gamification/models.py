# gamification/models.py
from django.db import models
from users.models import Profile

class Badge(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    # No futuro, podemos adicionar um campo de imagem:
    # image = models.ImageField(upload_to='badges/')

    def __str__(self):
        return self.title

class ProfileBadge(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Garante que um usuário não possa ganhar o mesmo badge duas vezes
        unique_together = ('profile', 'badge')

    def __str__(self):
        return f'{self.profile.user.username} - {self.badge.title}'