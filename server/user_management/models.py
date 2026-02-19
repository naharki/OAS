from django.contrib.auth.models import AbstractUser
from django.db import models
from .userManager import UserManager

class App(models.Model):
    # Custom user model can be extended here
    name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

class User (AbstractUser):
    Role_Choices = (
        ('superadmin', 'Super Admin'),
        ('admin', 'Admin'), 
        ('user', 'User'),
    )
    role = models.CharField(max_length=20, choices=Role_Choices)
    assigned_apps = models.ManyToManyField(App, blank=True, related_name='users')
    objects = UserManager()

    @property
    def accessible_apps(self):
        if self.role == 'superadmin':
            return App.objects.all()
        return self.assigned_apps.all()
    
    def __str__(self):
        return f"{self.username} - {self.role}"
    
   