from django.db import models
from medicare_booking.utils import generate_custom_id

class Pharmacy(models.Model):
    pharmacy_id = models.CharField(max_length=45, primary_key=True, blank=True)
    pharmacy_name = models.CharField(max_length=45)
    address = models.TextField(null=True, blank=True)
    pincode = models.IntegerField()
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    contact = models.CharField(max_length=45)

    def save(self, *args, **kwargs):
        if not self.pharmacy_id:
            self.pharmacy_id = generate_custom_id(Pharmacy, 'pharmacy_id', 'PH')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.pharmacy_name
