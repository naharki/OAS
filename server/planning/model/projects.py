from django.db import models
class ProjectState (models.TextChoices):
    ENTRY = "ENTRY", "Entry"
    ESTIMATE = "ESTIMATE", "Estimate"
    EXECUTING_UNIT_SELECTED = "EXECUTING_UNIT_SELECTED", 'Executing unit Selected'
    CONTRACT = "CONTRACT", "Contract"
    WORK_ORDER = "WORK_ORDER", "Work Order"
    WORK_COMPLETE = "WORK_COMPLETE", "Work Complete"

class Project (models.Model):
    registration_number = models.PositiveIntegerField(verbose_name="दर्ता नम्बर", unique=True, blank=True, null=True)
    plan_name = models.TextField(verbose_name="आयोजनाको नाम")
    committee = models.ForeignKey('Committee', on_delete=models.PROTECT, blank=True, null=True)
    ward_number = models.CharField(max_length=10, verbose_name="वडा नं.")
    location = models.TextField(verbose_name="स्थान")
    allocated_budget = models.BigIntegerField(verbose_name="विनियोजित बजेट")
    implementation_level = models.CharField(max_length=50, verbose_name="कार्यान्वयन तह")
    implementation_status = models.CharField(max_length=50, verbose_name="कार्यान्वयनको अवस्था")
    state = models.CharField(max_length=30,choices=ProjectState.choices,default = ProjectState.ENTRY,db_index = True)
    date = models.CharField(max_length=20, verbose_name="मिति") 
    contract_amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.registration_number} - {self.plan_name}"
    class Meta:
        ordering =['registration_number']

# cost head for estimation
class CostHead(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
    
# estimate  cost head
class ProjectEstimate ( models.Model):
    project = models.OneToOneField(Project, on_delete=models.CASCADE,related_name='estimate')
    engineer_name = models.CharField(max_length=100)
    estimate_date = models.CharField(max_length=15)

    estimated_cost = models.DecimalField(
        max_digit = 14, 
        decimal_places=2
    )