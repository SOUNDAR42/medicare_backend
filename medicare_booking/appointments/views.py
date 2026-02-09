from rest_framework import viewsets
from .models import Appoints
from .serializers import AppointsSerializer

class AppointsViewSet(viewsets.ModelViewSet):
    queryset = Appoints.objects.all()
    serializer_class = AppointsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        mobile_no = self.request.query_params.get('patient_mobile')
        if mobile_no:
            queryset = queryset.filter(patient_contact__mobileno=mobile_no)
        return queryset
