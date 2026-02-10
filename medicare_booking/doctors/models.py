from django.db import models
from medicare_booking.utils import generate_custom_id

class Doctor(models.Model):
    doctor_id = models.CharField(max_length=50, primary_key=True, blank=True)
    doctor_name = models.CharField(max_length=255)
    experience = models.IntegerField()
    password = models.CharField(max_length=100, default='password')

    def save(self, *args, **kwargs):
        if not self.doctor_id:
            self.doctor_id = generate_custom_id(Doctor, 'doctor_id', 'DOC')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.doctor_name
