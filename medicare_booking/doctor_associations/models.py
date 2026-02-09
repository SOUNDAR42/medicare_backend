from django.db import models
from doctors.models import Doctor
from hospitals.models import Hospital
from specializations.models import Specialization

class Doctor_Hospital(models.Model):
    doctor_instance_id = models.CharField(max_length=100, primary_key=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    specialization = models.ForeignKey(Specialization, on_delete=models.CASCADE)
    fees = models.CharField(max_length=50) # kept as String as per request
    is_available = models.BooleanField(default=True)
    working_hours = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.doctor.doctor_name} at {self.hospital.hospital_name}"
