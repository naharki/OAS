from django.db import models

class Plan(models.Model):
    registration_number = models.PositiveIntegerField(verbose_name="दर्ता नम्बर", unique=True, blank=True, null=True)
    plan_name = models.TextField(verbose_name="आयोजनाको नाम")
    ward_number = models.CharField(max_length=10, verbose_name="वडा नं.")
    location = models.TextField(verbose_name="स्थान")
    allocated_budget = models.BigIntegerField(verbose_name="विनियोजित बजेट")
    implementation_level = models.CharField(max_length=50, verbose_name="कार्यान्वयन तह")
    implementation_status = models.CharField(max_length=50, verbose_name="कार्यान्वयनको अवस्था")
    date = models.CharField(max_length=20, verbose_name="मिति")  # Nepali date, store as string

    def __str__(self):
        return f"{self.registration_number} - {self.plan_name}"
    class Meta:
        ordering =['registration_number']

class Projects (models.Model):
    registration_number = models.PositiveIntegerField(verbose_name="दर्ता नम्बर", unique=True, blank=True, null=True)
    plan_name = models.TextField(verbose_name="आयोजनाको नाम")
    ward_number = models.CharField(max_length=10, verbose_name="वडा नं.")
    location = models.TextField(verbose_name="स्थान")
    allocated_budget = models.BigIntegerField(verbose_name="विनियोजित बजेट")
    implementation_level = models.CharField(max_length=50, verbose_name="कार्यान्वयन तह")
    implementation_status = models.CharField(max_length=50, verbose_name="कार्यान्वयनको अवस्था")
    date = models.CharField(max_length=20, verbose_name="मिति")  # Nepali date, store as string

    def __str__(self):
        return f"{self.registration_number} - {self.plan_name}"
    class Meta:
        ordering =['registration_number']


