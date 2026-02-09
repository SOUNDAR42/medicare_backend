from django.shortcuts import render
from rest_framework import views, status
from rest_framework.response import Response
from .serializers import PharmacySerializer
from .models import Pharmacy
from medicare_booking.services import search_entities_by_pincode

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

def pharmacy_list(request):
    pharmacies = Pharmacy.objects.all()
    return render(request, 'pharmacies/pharmacy_list.html', {'pharmacies': pharmacies})
