from django.db import models

class Chalani(models.Model):
    chalani_samuha = models.CharField(max_length=100, default='मुख्य समुह')
    chalani_number = models.PositiveIntegerField(unique=True, editable=False)
    chalani_date = models.DateField()
    letter_receiver = models.CharField(max_length=200)
    letter_date = models.DateField()
    subject = models.CharField(max_length=300)
    remarks = models.TextField(blank=True, null=True)
    sender_section = models.CharField(max_length=100)

    def __str__(self):
     return str(self.chalani_number)

    class Meta:
        ordering = ['chalani_number']
    def save(self, *args, **kwargs):
        if not self.pk:  # only on create
            last = Chalani.objects.order_by('-chalani_number').first()
            self.chalani_number = (last.chalani_number + 1) if last else 1
        super().save(*args, **kwargs)