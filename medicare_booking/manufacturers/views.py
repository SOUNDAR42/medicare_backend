from django.shortcuts import render
from .models import Manufacturer

def manufacturer_list(request):
    manufacturers = Manufacturer.objects.all()
    return render(request, 'manufacturers/manufacturer_list.html', {'manufacturers': manufacturers})
