from django.db import models
from pharmacies.models import Pharmacy
from medicines.models import Medicine
from manufacturers.models import Manufacturer
from medicare_booking.utils import generate_custom_id

class Pharmacy_Medicine(models.Model):
    medicine_instance_id = models.CharField(max_length=45, primary_key=True, blank=True)
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE)
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField()
    expiry_date = models.DateField()
    is_available = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.medicine_instance_id:
            self.medicine_instance_id = generate_custom_id(Pharmacy_Medicine, 'medicine_instance_id', 'PHME')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.pharmacy.pharmacy_name} - {self.medicine.medicine_name}"
