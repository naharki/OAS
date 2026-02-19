from django.db import models

class Ward(models.Model):
    number = models.IntegerField(unique=True, null =True, blank=True)
    ward_location = models.CharField(max_length=200, null =True, blank=True)
    
    def __str__(self):
        return f"Ward {self.number}"
    class Meta:
        ordering =['number']