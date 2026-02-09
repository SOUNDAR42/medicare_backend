from django.db import models

class Doctor(models.Model):
    doctor_id = models.CharField(max_length=50, primary_key=True)
    doctor_name = models.CharField(max_length=255)
    experience = models.IntegerField()

    def __str__(self):
        return self.doctor_name
