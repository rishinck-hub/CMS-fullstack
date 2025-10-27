from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConsultationViewSet, PrescriptionViewSet, DoctorAppointmentViewSet

router = DefaultRouter()
router.register(r'consultations', ConsultationViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'appointments', DoctorAppointmentViewSet, basename='doctor-appointments')

urlpatterns = [
    path('', include(router.urls)),
]
