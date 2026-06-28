# appsystem/models.py
from django.db import models

class AppSystem(models.Model):
    code = models.CharField(max_length=50, unique=True)  # DARTA, PLANNING, HOSPITAL
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
