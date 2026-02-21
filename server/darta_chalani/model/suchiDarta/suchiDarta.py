from django.db import models

class SuchiDarta(models.Model):
    darta_number = models.PositiveIntegerField(unique=True, editable=False)
    pan_Vat_number = models.PositiveIntegerField(unique=True)
    darta_date = models.CharField(max_length=20)  # Store Nepali date as string (YYYY-MM-DD format)
    firm_name = models.CharField(max_length=200)
    tax_clearance_FY = models.CharField(max_length=20)
    application_date = models.CharField(max_length=20)  # Store Nepali date as string (YYYY-MM-DD format)
    firm_address = models.TextField(null=True, blank=True)
    contact_person = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=20)
    firm_darta_number = models.CharField(max_length=100)
    firm_registration_address = models.TextField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    firm_working_sector = models.CharField(max_length=100)
    suchikrit_dastur_bill_number = models.CharField(max_length=100)
    suchikrit_dastur_bill_date = models.CharField(max_length=20)  # Store Nepali date as string (YYYY-MM-DD format)
    remarks = models.TextField(null=True, blank=True)


    def __str__(self):
     return str(self.darta_number)

    class Meta:
        ordering = ['darta_number']

    def save(self, *args, **kwargs):
        if not self.pk:  # only on create
            last = SuchiDarta.objects.order_by('-darta_number').first()
            self.darta_number = (last.darta_number + 1) if last else 1
        super().save(*args, **kwargs)