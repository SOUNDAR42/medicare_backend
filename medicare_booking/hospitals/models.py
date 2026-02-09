from django.db import models

class Hospital(models.Model):
    hospital_id = models.AutoField(primary_key=True)
    hospital_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)
    pincode = models.IntegerField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    contact = models.CharField(max_length=50)
    # working_hours as CharField for flexibility (e.g., "9AM-5PM") as "timestamp/string" was requested.
    working_hours = models.CharField(max_length=100)

    def __str__(self):
        return self.hospital_name
