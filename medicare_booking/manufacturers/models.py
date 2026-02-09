from django.db import models
from medicare_booking.utils import generate_custom_id

class Manufacturer(models.Model):
    manufacturer_id = models.CharField(max_length=45, primary_key=True, blank=True)
    manufacturer_name = models.CharField(max_length=45)

    def save(self, *args, **kwargs):
        if not self.manufacturer_id:
            self.manufacturer_id = generate_custom_id(Manufacturer, 'manufacturer_id', 'M')
        super().save(*args, **kwargs)

    def __str__(self):
        return self.manufacturer_name
