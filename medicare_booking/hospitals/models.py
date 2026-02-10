from django.db import models
from medicare_booking.utils import generate_custom_id

class Hospital(models.Model):
    hospital_id = models.CharField(max_length=50, primary_key=True, blank=True)
    hospital_name = models.CharField(max_length=255)

    street = models.CharField(max_length=255, null=True, blank=True)
    district = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.IntegerField(null=True, blank=True)
    contact = models.CharField(max_length=50)
    # working_hours as CharField for flexibility (e.g., "9AM-5PM") as "timestamp/string" was requested.
    working_hours = models.CharField(max_length=100)
    password = models.CharField(max_length=100, default='password')

    def save(self, *args, **kwargs):
        if not self.hospital_id:
            self.hospital_id = generate_custom_id(Hospital, 'hospital_id', 'HOS')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.hospital_name
