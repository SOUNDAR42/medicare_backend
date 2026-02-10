from django.shortcuts import render
from rest_framework import viewsets
from .models import Medicine
from .serializers import MedicineSerializer

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer

from django.db.models import Q

def medicine_list(request):
    query = request.GET.get('q')
    if query:
        medicines = Medicine.objects.filter(
            Q(medicine_name__icontains=query) |
            Q(description__icontains=query)
        )
    else:
        medicines = Medicine.objects.all()
    return render(request, 'medicines/medicine_list.html', {'medicines': medicines, 'query': query})
