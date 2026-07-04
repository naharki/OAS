from django.db import models, transaction

class Level_model(models.Model):  
    level_name = models.CharField(max_length=200)
    level_eng_name = models.CharField(max_length=200)
    level_rank_number = models.PositiveIntegerField(blank=True, null=True)
  
    def __str__(self):
        return str(self.level_name)

    class Meta:
        ordering = ['level_rank_number']