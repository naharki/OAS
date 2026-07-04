from django.db import models
from .section import Section_model
from .designation import Designation_model
from .level import Level_model

class Employee(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=10, unique=True)
    email = models.EmailField(unique=True, blank=True, null=True)
  

    
    # Structural Relations (The Core Linkups)
    section = models.ForeignKey(
        Section_model,
        on_delete=models.PROTECT,
        related_name='employees'
    )
    designation = models.ForeignKey(
        Designation_model,
        on_delete=models.PROTECT,
        related_name='employees'
    )
    level = models.ForeignKey(
        Level_model,
        on_delete=models.PROTECT, 
        related_name='employees'
    )
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"