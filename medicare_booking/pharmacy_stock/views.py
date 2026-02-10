from django.shortcuts import render
from rest_framework import viewsets
from .models import Pharmacy_Medicine
from .serializers import PharmacyMedicineSerializer, SimplifiedPharmacyMedicineSerializer
from rest_framework.decorators import action


from rest_framework import views, status
from rest_framework.response import Response
from django.db.models import F, Func, Value, IntegerField
from django.db.models.functions import Abs

class MedicineAvailabilityAPIView(views.APIView):
    def get(self, request, pincode):
        medicine_name = request.query_params.get('medicine_name')
        if not medicine_name:
            return Response({"error": "Medicine name is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Filter by medicine name
        queryset = Pharmacy_Medicine.objects.filter(
            medicine__medicine_name__icontains=medicine_name,
            stock_quantity__gt=0 # Only show available stock
        )

        try:
            target_pincode = int(pincode)
            # Annotate with distance: abs(pharmacy_pincode - target_pincode)
            # We assume pincode is stored as string in model, so we might need casting if it's CharField.
            # However, looking at previous files, it seems Pincode is often treated as Int or String. 
            # If it's CharField, we might need Cast. Let's assume simple integer subtraction works if we cast or if it's already int.
            # But wait, Pharmacy model has pincode. Let's check Pharmacy model if possible. 
            # Assuming it's convertible to int.
            
            # Using Python for sorting to be safe with unknown DB field types (simple enough for this use case)
            results = []
            for item in queryset:
                try:
                    pharmacy_pin = int(item.pharmacy.pincode) if item.pharmacy.pincode else 0
                    distance = abs(pharmacy_pin - target_pincode)
                except ValueError:
                    distance = 999999 # Treat invalid pincodes as far away

                results.append({
                    'data': item,
                    'distance': distance
                })
            
            # Sort by distance
            results.sort(key=lambda x: x['distance'])
            
            # Serialize
            sorted_items = [r['data'] for r in results]
            serializer = SimplifiedPharmacyMedicineSerializer(sorted_items, many=True)
            
            # Add distance to response if needed, or just rely on order. 
            # The simplified serializer doesn't have 'distance' field, but the order is correct.
            # If we want to show distance in UI, we should add it to serializer or wrapper.
            # User just asked to "sort based on shorter value", not necessarily show logic.
            # But showing "Near You" vs "Far" is good. 
            # For now, just returning sorted list is enough as per requirement.
            
            return Response(serializer.data)

        except ValueError:
            return Response({"error": "Invalid Pincode"}, status=status.HTTP_400_BAD_REQUEST)

class PharmacyStockViewSet(viewsets.ModelViewSet):
    queryset = Pharmacy_Medicine.objects.all()
    serializer_class = PharmacyMedicineSerializer

    def get_queryset(self):
        queryset = Pharmacy_Medicine.objects.all()
        pharmacy_id = self.request.query_params.get('pharmacy', None)
        pharmacy_name = self.request.query_params.get('name', None)
        
        if pharmacy_id:
            queryset = queryset.filter(pharmacy__pharmacy_id=pharmacy_id)
        if pharmacy_name:
            queryset = queryset.filter(pharmacy__pharmacy_name=pharmacy_name)
            
        return queryset

    @action(detail=True, methods=['get'])
    def medicine(self, request, pk=None):
        pass # Not used here, it is in PharmacyViewSet

def stock_list(request):
    stocks = Pharmacy_Medicine.objects.all()
    return render(request, 'pharmacy_stock/stock_list.html', {'stocks': stocks})
