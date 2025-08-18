# store/models.py
from django.db import models

class StoreItem(models.Model):
    ITEM_TYPE_CHOICES = (
        ('capacete', 'Capacete'),
        ('luva', 'Luva'),
        ('ferramenta', 'Ferramenta'),
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.PositiveIntegerField()
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES)
    # image = models.ImageField(upload_to='store_items/') # Para o futuro
    asset_url = models.CharField(max_length=200, blank=True, help_text="Ex: capacete_azul.png")

    def __str__(self):
        return self.name

class ProfileInventory(models.Model):
    profile = models.ForeignKey('users.Profile', on_delete=models.CASCADE, related_name='inventory')
    item = models.ForeignKey(StoreItem, on_delete=models.CASCADE)
    purchased_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.profile.user.username} - {self.item.name}'