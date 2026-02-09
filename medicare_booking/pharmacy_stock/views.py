from django.shortcuts import render
from .models import Pharmacy_Medicine

def stock_list(request):
    stocks = Pharmacy_Medicine.objects.all()
    return render(request, 'pharmacy_stock/stock_list.html', {'stocks': stocks})
