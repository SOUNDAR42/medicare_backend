from django.shortcuts import render
from rest_framework import viewsets, views, status
from rest_framework.response import Response
from .models import Hospital
from .serializers import HospitalSerializer
from medicare_booking.services import search_entities_by_pincode
from pharmacies.models import Pharmacy # For pincode reference

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

def hospital_search(request):
    pincode = request.GET.get('pincode')
    hospitals = []
    message = ""

    if pincode:
        hospitals, message = search_entities_by_pincode(Hospital, pincode, Pharmacy)
    else:
        hospitals = Hospital.objects.all()

    return render(request, 'hospitals/hospital_search.html', {'hospitals': hospitals, 'message': message})

class HospitalSearchAPIView(views.APIView):
    def get(self, request):
        pincode = request.GET.get('pincode')
        if not pincode:
            return Response({"error": "Pincode is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        hospitals, message = search_entities_by_pincode(Hospital, pincode, Pharmacy)
        serializer = HospitalSerializer(hospitals, many=True)
        return Response({
            "results": serializer.data,
            "message": message
        })

from django.db.models import Q

def hospital_list(request):
    query = request.GET.get('q')
    if query:
        hospitals = Hospital.objects.filter(
            Q(hospital_name__icontains=query) | 
            Q(address__icontains=query) |
            Q(pincode__icontains=query)
        )
    else:
        hospitals = Hospital.objects.all()
    return render(request, 'hospitals/hospital_list.html', {'hospitals': hospitals, 'query': query})
