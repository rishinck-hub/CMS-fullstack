from django.shortcuts import render
from rest_framework import viewsets
from .models import Patient, Appointment, Billing
from .serializers import PatientSerializer, AppointmentSerializer, BillingSerializer
from common.permissions import IsDoctor, IsPharmacist, IsAdmin, IsReceptionist, IsAdminOrReceptionist


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAdminOrReceptionist]


class AppointmentViewSet(viewsets.ModelViewSet):
    # ✅ Optimize related-object retrieval safely:
    # keep select_related for ForeignKey/OneToOne relationships (doctor->user, receptionist->user)
    # and use prefetch_related for 'patient' to avoid FieldError if it's M2M or a reverse relation.
    queryset = (
        Appointment.objects
        .select_related("doctor__user", "receptionist__user")
        .prefetch_related("patient")
        .all()
    )
    serializer_class = AppointmentSerializer
    permission_classes = [IsAdminOrReceptionist]


class BillingViewSet(viewsets.ModelViewSet):
    queryset = Billing.objects.all()
    serializer_class = BillingSerializer
    permission_classes = [IsAdminOrReceptionist]

