import uuid
from django.db import models
from patients.models import Patient
from doctor_associations.models import Doctor_Hospital

class Appoints(models.Model):
    appointment_id = models.CharField(max_length=100, primary_key=True)
    doctor_instance = models.ForeignKey(Doctor_Hospital, on_delete=models.CASCADE)
    # Using mobile no as patient_id reference since it's the PK of Patient
    patient_contact = models.ForeignKey(Patient, on_delete=models.CASCADE)
    token_no = models.CharField(max_length=50, blank=True)
    appointment_date = models.DateField()
    urgency_score = models.IntegerField(default=1)

    def save(self, *args, **kwargs):
        if not self.appointment_id:
             self.appointment_id = str(uuid.uuid4())
        if not self.token_no:
            # Count existing appointments for this doctor on this date
            existing_count = Appoints.objects.filter(
                doctor_instance=self.doctor_instance, 
                appointment_date=self.appointment_date
            ).count()
            self.token_no = f"T{existing_count + 1}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Appt {self.appointment_id}: {self.patient_contact.name}"
