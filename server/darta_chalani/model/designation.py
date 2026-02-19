from django.db import models

class Designation(models.Model):
    title = models.CharField(max_length=100)
    english_title = models.CharField(max_length=100)
    view_order = models.PositiveIntegerField()

    def __str__(self):
        return self.title
    class Meta:
        ordering = ['view_order']