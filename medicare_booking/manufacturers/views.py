from django.shortcuts import render
from rest_framework import viewsets
from .models import Manufacturer
from .serializers import ManufacturerSerializer

class ManufacturerViewSet(viewsets.ModelViewSet):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer

def manufacturer_list(request):
    manufacturers = Manufacturer.objects.all()
    return render(request, 'manufacturers/manufacturer_list.html', {'manufacturers': manufacturers})
