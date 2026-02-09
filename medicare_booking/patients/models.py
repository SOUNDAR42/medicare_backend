from django.db import models

class Patient(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    # Pincode as Integer field as per requirements, though usually string is better for leading zeros.
    pincode = models.IntegerField()
    mobileno = models.CharField(max_length=15, primary_key=True)
    gender = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.name} ({self.mobileno})"
