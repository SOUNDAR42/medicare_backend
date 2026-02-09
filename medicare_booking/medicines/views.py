from django.shortcuts import render
from .models import Medicine

def medicine_list(request):
    medicines = Medicine.objects.all()
    return render(request, 'medicines/medicine_list.html', {'medicines': medicines})
