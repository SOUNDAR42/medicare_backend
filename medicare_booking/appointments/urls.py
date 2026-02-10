from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointsViewSet, BookHospitalAppointmentView, HospitalAppointmentListView

router = DefaultRouter()
router.register(r'', AppointsViewSet)

urlpatterns = [
    path('book-hospital/', BookHospitalAppointmentView.as_view(), name='book-hospital'),
    path('hospital-list/<str:hospital_id>/', HospitalAppointmentListView.as_view(), name='hospital-appt-list'),
    path('', include(router.urls)),
]
