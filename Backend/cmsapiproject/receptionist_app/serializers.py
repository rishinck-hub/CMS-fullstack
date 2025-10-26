from rest_framework import serializers
from .models import Patient, Appointment, Billing
from django.utils import timezone

# ===================== PATIENT SERIALIZER =====================

class PatientSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = '__all__'

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or f"Patient {obj.id}"

    def validate_phone(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return value

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        return value


# ===================== NESTED NAME SERIALIZERS =====================

class DoctorNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment._meta.get_field('doctor').related_model
        fields = ['id', 'full_name']

    def get_full_name(self, obj):
        if hasattr(obj, "user"):
            name = f"{obj.user.first_name} {obj.user.last_name}".strip()
            return name or obj.user.username
        return f"Doctor {obj.id}"


class ReceptionistNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment._meta.get_field('receptionist').related_model
        fields = ['id', 'full_name']

    def get_full_name(self, obj):
        if hasattr(obj, "user"):
            name = f"{obj.user.first_name} {obj.user.last_name}".strip()
            return name or obj.user.username
        return f"Receptionist {obj.id}"


# ===================== APPOINTMENT SERIALIZER =====================

# new: accept either the related model pk OR the related model lookup by user id
class StaffOrUserRelatedField(serializers.PrimaryKeyRelatedField):
    """
    PrimaryKeyRelatedField that tries to resolve the provided integer as:
      - the related object's PK, or
      - the related object's user__id
    This lets the frontend send a user id (e.g. receptionist.user.id) and still match the Staff record.
    """
    def to_internal_value(self, data):
        queryset = self.get_queryset()
        # try direct PK first
        try:
            return queryset.get(pk=data)
        except Exception:
            pass
        # try user__id fallback
        try:
            return queryset.get(user__id=data)
        except Exception:
            raise serializers.ValidationError(f'Invalid pk "{data}" - object does not exist.')

class AppointmentSerializer(serializers.ModelSerializer):
    # doctor/patient remain standard PrimaryKeyRelatedField -> map to relation
    doctor_id = serializers.PrimaryKeyRelatedField(
        source='doctor',
        queryset=Appointment._meta.get_field('doctor').related_model.objects.all()
    )
    patient_id = serializers.PrimaryKeyRelatedField(
        source='patient',
        queryset=Appointment._meta.get_field('patient').related_model.objects.all()
    )
    # use StaffOrUserRelatedField for receptionist to accept user-id or staff-pk
    receptionist_id = StaffOrUserRelatedField(
        source='receptionist',
        queryset=Appointment._meta.get_field('receptionist').related_model.objects.all()
    )

    # nested read-only representations for display
    doctor = DoctorNameSerializer(read_only=True)
    patient = PatientSerializer(read_only=True)
    receptionist = ReceptionistNameSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'date_time',
            'status',
            'doctor_id',
            'patient_id',
            'receptionist_id',
            'doctor',
            'patient',
            'receptionist',
        ]

    def validate_status(self, value):
        if value not in ['Scheduled', 'Completed', 'Cancelled']:
            raise serializers.ValidationError("Invalid status.")
        return value

    def validate_date_time(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Appointment cannot be in the past.")
        return value

    def validate(self, data):
        # Prevent double-booking doctor for the same time
        # PrimaryKeyRelatedField provides the model instance under 'doctor' key (source)
        doctor = data.get('doctor')
        date_time = data.get('date_time')
        if doctor and date_time:
            qs = Appointment.objects.filter(doctor=doctor, date_time=date_time)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError("Doctor already has an appointment at this time.")
        return data


# ===================== BILLING SERIALIZER =====================

class BillingSerializer(serializers.ModelSerializer):
    appointment_id = serializers.IntegerField(source='appointment.id', read_only=True)
    created_by_id = serializers.IntegerField(source='created_by.id', read_only=True)

    class Meta:
        model = Billing
        fields = [
            'id',
            'consultation_fee',
            'medicine_fee',
            'total_fee',    
            'timestamp',
            'appointment_id',
            'created_by_id',
        ]
        read_only_fields = ('consultation_fee', 'total_fee')

    def validate(self, data):
        # Safely obtain values: prefer incoming data, fall back to instance values (for updates), else 0
        instance = getattr(self, 'instance', None)
        def get_val(key, default=0):
            if key in data:
                return data[key]
            if instance is not None:
                return getattr(instance, key, default)
            return default

        consultation = get_val('consultation_fee', 0)
        medicine = get_val('medicine_fee', 0)
        total = get_val('total_fee', consultation + medicine)

        # Ensure numeric types for comparisons
        try:
            consultation = float(consultation)
            medicine = float(medicine)
            total = float(total)
        except (TypeError, ValueError):
            raise serializers.ValidationError("Fees must be numeric values.")

        if consultation < 0 or medicine < 0:
            raise serializers.ValidationError("Fees must be non-negative numbers.")
        if abs(total - (consultation + medicine)) > 0.01:
            raise serializers.ValidationError("Total fee must be sum of consultation and medicine fees.")
        return data
