from django.db import models
from medicare_booking.utils import generate_custom_id

class Medicine(models.Model):
    medicine_id = models.CharField(max_length=45, primary_key=True, blank=True)
    medicine_name = models.CharField(max_length=45)
    description = models.TextField()
    dosage_form = models.CharField(max_length=45)

    def save(self, *args, **kwargs):
        if not self.medicine_id:
            self.medicine_id = generate_custom_id(Medicine, 'medicine_id', 'MED')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.medicine_name
