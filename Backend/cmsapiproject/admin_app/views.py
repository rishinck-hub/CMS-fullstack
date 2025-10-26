from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Specialization, Staff, Doctor
from .serializers import UserSerializer, SpecializationSerializer, StaffSerializer, DoctorSerializer
from common.permissions import IsDoctor, IsPharmacist, IsAdmin, IsReceptionist ,IsAdminOrReceptionist
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrReceptionist]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'role', 'is_active', 'date_joined']
    ordering = ['username']

class SpecializationViewSet(viewsets.ModelViewSet):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [IsAdminOrReceptionist]

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAdminOrReceptionist]

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAdminOrReceptionist]


class MeView(APIView):
    """Return current authenticated user info with profile data."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        user_data = serializer.data
        
        # Add profile data based on role
        try:
            if user.role == 'Doctor':
                doctor_profile = Doctor.objects.get(user=user)
                from .serializers import DoctorSerializer
                profile_serializer = DoctorSerializer(doctor_profile)
                user_data['profile'] = profile_serializer.data
            elif user.role in ['Admin', 'Receptionist', 'Pharmacist']:
                staff_profile = Staff.objects.get(user=user)
                from .serializers import StaffSerializer
                profile_serializer = StaffSerializer(staff_profile)
                user_data['profile'] = profile_serializer.data
        except (Doctor.DoesNotExist, Staff.DoesNotExist):
            user_data['profile'] = None
            
        return Response(user_data)


class CreateUserWithProfiles(APIView):
    """Create a User and optional Staff/Doctor records atomically."""
    permission_classes = [IsAuthenticated, IsAdminOrReceptionist]

    def post(self, request):
        from .serializers import UserWithProfilesSerializer

        # Defensive: clean empty or null nested objects that may be sent by the client
        # request.data can be a QueryDict or regular dict - normalize to a shallow dict
        try:
            payload = request.data.copy()
        except Exception:
            # fallback: coerce to dict
            payload = dict(request.data)

        # remove doctor/staff if they are null/empty/'null' string or an empty dict/list
        for key in ('staff', 'doctor'):
            if key in payload:
                val = payload.get(key)
                # handle JSON null / Python None
                if val is None:
                    payload.pop(key, None)
                    continue
                # handle string representations like 'null' or empty string
                if isinstance(val, str) and val.strip().lower() in ('', 'null', 'none'):
                    payload.pop(key, None)
                    continue
                # handle QueryDict/list coming from form-data where value may be list or dict
                if isinstance(val, (list, tuple)) and len(val) == 0:
                    payload.pop(key, None)
                    continue
                if isinstance(val, dict):
                    # if all values are blank/null, remove the key
                    if all(v in (None, '') for v in val.values()):
                        payload.pop(key, None)

        serializer = UserWithProfilesSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"id": user.id, "username": user.username}, status=201)


class DashboardView(APIView):
    """Return role-specific dashboard data."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        dashboard_data = {
            'user': {
                'id': user.id,
                'username': user.username,
                'role': user.role,
                'is_active': user.is_active
            }
        }
        
        # Add role-specific data
        if user.role == 'Admin':
            dashboard_data.update({
                'total_users': User.objects.count(),
                'total_doctors': Doctor.objects.count(),
                'total_staff': Staff.objects.count(),
                'recent_users': UserSerializer(User.objects.order_by('-date_joined')[:5], many=True).data
            })
        elif user.role == 'Doctor':
            try:
                doctor = Doctor.objects.get(user=user)
                dashboard_data.update({
                    'specialization': doctor.specialization.name if doctor.specialization else None,
                    'experience': doctor.experience,
                    'consultation_fee': doctor.consultation_fee
                })
            except Doctor.DoesNotExist:
                pass
        elif user.role == 'Receptionist':
            dashboard_data.update({
                'can_manage_patients': True,
                'can_schedule_appointments': True
            })
        elif user.role == 'Pharmacist':
            dashboard_data.update({
                'can_manage_medicines': True,
                'can_process_prescriptions': True
            })
            
        return Response(dashboard_data)

from django.core.mail import send_mail

def send_welcome_email(user, password):
    full_name = f"{user.first_name} {user.last_name}".strip()
    subject = "Welcome to the Clinic Management System"
    message = f"""
Hi {full_name or user.username},

Your account has been created!

Username: {user.username}
Password: {password}
Role: {user.role}
Name: {full_name}

You can now login to your account.

Please change your password after your first login.

- Clinic Management admin
    """
    send_mail(
        subject,
        message,
        'admin@yclinicMs.com',  # Replace with your sender address
        [user.email],
        fail_silently=False,
    )
