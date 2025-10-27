from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from .models import Consultation, Prescription, PrescriptionMedicine
from .serializers import ConsultationSerializer, PrescriptionSerializer, PrescriptionMedicineWriteSerializer
from common.permissions import IsDoctor, IsPharmacist, IsAdmin, IsReceptionist, IsAdminOrDoctor
from receptionist_app.models import Appointment


class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.select_related('appointment', 'doctor', 'patient').all()
    serializer_class = ConsultationSerializer
    permission_classes = [IsAdminOrDoctor]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by doctor if not admin
        if not self.request.user.is_staff:
            doctor = getattr(self.request.user, 'doctor', None)
            if doctor:
                queryset = queryset.filter(doctor=doctor)
        return queryset

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.select_related('consultation', 'doctor').prefetch_related('medicines').all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAdminOrDoctor]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by doctor if not admin
        if not self.request.user.is_staff:
            doctor = getattr(self.request.user, 'doctor', None)
            if doctor:
                queryset = queryset.filter(doctor=doctor)
        return queryset
    
    @action(detail=True, methods=['post'])
    def add_medicine(self, request, pk=None):
        """Add medicine to a prescription"""
        prescription = self.get_object()
        serializer = PrescriptionMedicineWriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(prescription=prescription)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'], url_path='remove_medicine/(?P<medicine_pk>[0-9]+)')
    def remove_medicine(self, request, pk=None, medicine_pk=None):
        """Remove medicine from a prescription"""
        prescription = self.get_object()
        try:
            medicine = prescription.medicines.get(id=medicine_pk)
            medicine.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PrescriptionMedicine.DoesNotExist:
            return Response({'error': 'Medicine not found in prescription'}, status=status.HTTP_404_NOT_FOUND)


class DoctorAppointmentViewSet(viewsets.ModelViewSet):
    """ViewSet for doctors to view and update their appointments"""
    permission_classes = [IsAuthenticated, IsDoctor]
    
    def get_queryset(self):
        # Get the doctor associated with the authenticated user
        from admin_app.models import Doctor
        try:
            doctor = Doctor.objects.get(user=self.request.user)
            # Return appointments for this doctor
            appointments = Appointment.objects.filter(doctor=doctor).select_related('patient', 'doctor', 'receptionist')
            
            # Filter by status if provided
            status_filter = self.request.query_params.get('status', None)
            if status_filter:
                appointments = appointments.filter(status=status_filter)
            
            # Filter by today if requested
            if self.request.query_params.get('today', False):
                today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
                today_end = today_start + timedelta(days=1)
                appointments = appointments.filter(date_time__gte=today_start, date_time__lt=today_end)
            
            return appointments
        except Doctor.DoesNotExist:
            return Appointment.objects.none()
    
    def get_serializer_class(self):
        from receptionist_app.serializers import AppointmentSerializer
        return AppointmentSerializer
    
    def update(self, request, *args, **kwargs):
        # Only allow updating status for security
        if 'status' not in request.data:
            return Response({'error': 'Only status updates are allowed'}, status=400)
        
        # Only allow specific status values
        allowed_statuses = ['Scheduled', 'in_consultation', 'Completed', 'Cancelled']
        if request.data.get('status') not in allowed_statuses:
            return Response({'error': 'Invalid status value'}, status=400)
        
        return super().update(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's appointments for the doctor"""
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        from admin_app.models import Doctor
        from receptionist_app.serializers import AppointmentSerializer
        
        try:
            doctor = Doctor.objects.get(user=request.user)
            appointments = Appointment.objects.filter(
                doctor=doctor,
                date_time__gte=today_start,
                date_time__lt=today_end
            ).select_related('patient', 'doctor', 'receptionist')
            
            serializer = AppointmentSerializer(appointments, many=True)
            return Response(serializer.data)
        except Doctor.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)
