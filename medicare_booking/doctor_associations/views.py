from rest_framework import viewsets
from .models import Doctor_Hospital
from .serializers import DoctorHospitalSerializer

class DoctorHospitalViewSet(viewsets.ModelViewSet):
    queryset = Doctor_Hospital.objects.all()
    serializer_class = DoctorHospitalSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        spec_id = self.request.query_params.get('specialization_id')
        if spec_id:
            queryset = queryset.filter(specialization__specialization_id=spec_id)
        return queryset
