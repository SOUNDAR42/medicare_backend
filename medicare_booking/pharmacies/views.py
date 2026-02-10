from django.shortcuts import render
from rest_framework import viewsets, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import PharmacySerializer
from .models import Pharmacy
from medicare_booking.services import search_entities_by_pincode

class PharmacyViewSet(viewsets.ModelViewSet):
    queryset = Pharmacy.objects.all()
    serializer_class = PharmacySerializer

    @action(detail=True, methods=['get'])
    def medicine(self, request, pk=None):
        from pharmacy_stock.models import Pharmacy_Medicine
        from pharmacy_stock.serializers import SimplifiedPharmacyMedicineSerializer
        
        pharmacy = self.get_object()
        medicines = Pharmacy_Medicine.objects.filter(pharmacy=pharmacy)
        serializer = SimplifiedPharmacyMedicineSerializer(medicines, many=True)
        return Response(serializer.data)

class PharmacySearchAPIView(views.APIView):
    def get(self, request):
        pincode = request.GET.get('pincode')
        if not pincode:
            return Response({"error": "Pincode is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        from hospitals.models import Hospital
        pharmacies, message = search_entities_by_pincode(Pharmacy, pincode, Hospital)
        serializer = PharmacySerializer(pharmacies, many=True)
        return Response({
            "results": serializer.data,
            "message": message
        })

from django.db.models import Q

def pharmacy_list(request):
    query = request.GET.get('q')
    if query:
        pharmacies = Pharmacy.objects.filter(
            Q(pharmacy_name__icontains=query) |
            Q(address__icontains=query)
        )
    else:
        pharmacies = Pharmacy.objects.all()
    return render(request, 'pharmacies/pharmacy_list.html', {'pharmacies': pharmacies, 'query': query})
