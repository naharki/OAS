from django.db import models, transaction

class Section_model(models.Model):
    
    section_name = models.CharField(max_length=200)
    section_eng_name = models.CharField(max_length=200)
    section_rank_number = models.PositiveIntegerField(unique=True)


    def __str__(self):
        return str(self.section_name)

    class Meta:
        ordering = ['section_rank_number']