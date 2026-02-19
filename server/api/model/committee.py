from django.db import models
from rest_framework.response import Response
# from .committee import Member

class Committee(models.Model):
    name = models.CharField(max_length=200)
    register_number = models.IntegerField(unique=True)
    committee_type = models.ForeignKey('CommitteeType', on_delete=models.SET_NULL, null=True, blank=True)
    ward = models.ForeignKey('Ward', on_delete=models.SET_NULL, null=True, blank=True)
    address = models.CharField(max_length=300, blank=True, null=True)
    register_number = models.CharField(max_length=100, unique=True, blank=True, null=True)
    created_date = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    def committee_gender_stats(self):
        """
        Returns gender stats for this committee.
        """
        members = self.members.all()  # uses related_name='members' in Member model
        total_members = members.count()
        male_count = members.filter(sex='male').count()
        female_count = members.filter(sex='female').count()

        male_percentage = (male_count / total_members * 100) if total_members else 0
        female_percentage = (female_count / total_members * 100) if total_members else 0

        return {
            'total_members': total_members,
            'male_count': male_count,
            'female_count': female_count,
            'male_percentage': round(male_percentage, 2),
            'female_percentage': round(female_percentage, 2)
        }
    class Meta:
          ordering =['-created_at']

class Member(models.Model):
    committee = models.ForeignKey(
        "Committee",
        on_delete=models.CASCADE,
        related_name="members"
    )

    SEX_CHOICES = [
        ('male', 'पुरुष'),
        ('female', 'महिला'),
    ]

    ROLE_CHOICES = [
        ('adhyaksha', 'अध्यक्ष'),
        ('upadhyaksha', 'उपाध्यक्ष'),
        ('sachiv', 'सचिव'),
        ('kosadhyaksha', 'कोषाध्यक्ष'),
        ('sadasya', 'सदस्य'),
    ]

    # Priority mapping for auto-ordering
    ROLE_PRIORITY = {
        "adhyaksha": 1,
        "upadhyaksha": 2,
        "sachiv": 3,
        "kosadhyaksha": 4,
        "sadasya": 5,
    }

    name = models.CharField(max_length=200)
    father_name = models.CharField(max_length=200, blank=True)
    address = models.CharField(max_length=255, blank=True)
    mobile_number = models.CharField(max_length=20, blank=True)

    citizenship_number = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique citizenship number to prevent duplicate members"
    )

    sex = models.CharField(
        max_length=10,
        choices=SEX_CHOICES,
        default="male"
    )

    designation = models.CharField(
        max_length=50,
        choices=ROLE_CHOICES,
        default="sadasya"
    )

    is_account_holder = models.BooleanField(
        default=False,
        help_text="Is this member an account holder?"
    )
    is_monitoring_committee_member = models.BooleanField(
        default=False,
        help_text="Is this member in monitoring committee?"
    )
    role_priority = models.PositiveIntegerField(default=99)
    created_at = models.DateTimeField(auto_now_add=True)

    
    def save(self, *args, **kwargs):
        self.role_priority = self.ROLE_PRIORITY.get(self.designation, 99)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["role_priority", "name"]
