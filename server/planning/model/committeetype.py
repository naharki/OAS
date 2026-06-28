from django.db import models

class CommitteeType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    eng_name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, unique=True)
    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'api_committeetype'
        ordering = ['name']