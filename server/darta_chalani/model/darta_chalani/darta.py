from django.db import models, transaction

class Darta(models.Model):
    darta_samuha = models.CharField(max_length=100, default='मुख्य समुह')
    darta_number = models.PositiveIntegerField(unique=True, editable=False)
    darta_date = models.CharField(max_length=20)
    letter_sender = models.CharField(max_length=200)
    sender_email = models.EmailField(null=True, blank=True)
    sender_address = models.TextField(null=True, blank=True)
    letter_date = models.CharField(max_length=20)
    ref_number = models.CharField(max_length=100, blank=True)
    subject = models.CharField(max_length=300)
    remarks = models.TextField(blank=True, null=True)
    receiver_section = models.CharField(max_length=100)

    def __str__(self):
        return str(self.darta_number)

    class Meta:
        ordering = ['darta_number']

    def save(self, *args, **kwargs):
        if not self.pk:
            with transaction.atomic():
                last = Darta.objects.select_for_update().order_by('-darta_number').first()
                self.darta_number = (last.darta_number + 1) if last else 1
        super().save(*args, **kwargs)