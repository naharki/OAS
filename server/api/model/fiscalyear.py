from django.db import models

class FiscalYear(models.Model):
    name = models.CharField(max_length=9, unique=True)  
    eng_name = models.CharField(max_length=20, blank=True, null=True)
    code = models.CharField(max_length=10, unique=True, blank=True, null=True)
    start_year = models.IntegerField(unique=True, blank=True, null=True)
    end_year = models.IntegerField(unique=True, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-start_date']