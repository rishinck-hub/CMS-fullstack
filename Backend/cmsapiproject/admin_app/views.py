from django.shortcuts import render
from rest_framework import viewsets
from .models import User, Specialization, Staff, Doctor
from .serializers import UserSerializer, SpecializationSerializer, StaffSerializer, DoctorSerializer
from common.permissions import IsDoctor, IsPharmacist, IsAdmin, IsReceptionist 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [IsAdmin]

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAdmin]

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAdmin]


class MeView(APIView):
    """Return current authenticated user info."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class CreateUserWithProfiles(APIView):
    """Create a User and optional Staff/Doctor records atomically."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        from .serializers import UserWithProfilesSerializer
        serializer = UserWithProfilesSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"id": user.id, "username": user.username}, status=201)
