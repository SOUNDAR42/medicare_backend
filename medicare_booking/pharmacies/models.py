from django.db import models
from medicare_booking.utils import generate_custom_id

class Pharmacy(models.Model):
    pharmacy_id = models.CharField(max_length=45, primary_key=True, blank=True)
    pharmacy_name = models.CharField(max_length=45)
    street = models.CharField(max_length=255, null=True, blank=True)
    district = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.IntegerField()
    contact = models.CharField(max_length=45)
    password = models.CharField(max_length=100, default='password')

    def save(self, *args, **kwargs):
        if not self.pharmacy_id:
            self.pharmacy_id = generate_custom_id(Pharmacy, 'pharmacy_id', 'PH')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.pharmacy_name
