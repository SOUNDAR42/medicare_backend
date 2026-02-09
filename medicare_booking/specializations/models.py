from django.db import models

class Specialization(models.Model):
    specialization_id = models.AutoField(primary_key=True)
    specialization_name = models.CharField(max_length=255)

    def __str__(self):
        return self.specialization_name
