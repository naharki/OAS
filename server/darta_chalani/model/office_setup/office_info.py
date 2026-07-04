from django.db import models

class Office_model(models.Model):
    name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200, blank=True, null=True)
    location = models.CharField(max_length=200)
    established_date = models.DateField()
    email = models.EmailField(max_length=254, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    website = models.URLField(max_length=200, blank=True, null=True)
    slogan = models.CharField(max_length=255, blank=True, null=True)
    nishan_chap = models.ImageField(upload_to='images/nishan_chap/', null=True, blank=True)  
    office_logo = models.ImageField(upload_to='images/office_logo/', null=True, blank=True)  
     

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'darta_Chalani_office_model'
