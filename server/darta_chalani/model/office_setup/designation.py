from django.db import models, transaction


class Designation_model(models.Model):  
    designation_name = models.CharField(max_length=200)
    designation_eng_name = models.CharField(max_length=200)
    designation_rank_number = models.PositiveIntegerField(unique=True)
    def __str__(self):
        return str(self.designation_name)

    class Meta:
        ordering = ['designation_rank_number']