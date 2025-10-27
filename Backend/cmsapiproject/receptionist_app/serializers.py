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
    # Read-only fields for display
    appointment_id = serializers.IntegerField(source='appointment.id', read_only=True)
    created_by_id = serializers.IntegerField(source='created_by.id', read_only=True)
    
    # Writable field for creating/updating bills
    appointment = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all()
    )

    class Meta:
        model = Billing
        fields = [
            'id',
            'appointment',
            'appointment_id',
            'consultation_fee',
            'medicine_fee',
            'total_fee',
            'is_paid',
            'timestamp',
            'created_by_id',
        ]
        read_only_fields = ('total_fee', 'timestamp')

    def validate_consultation_fee(self, value):
        if value < 0:
            raise serializers.ValidationError("Consultation fee must be non-negative.")
        return value

    def validate_medicine_fee(self, value):
        if value < 0:
            raise serializers.ValidationError("Medicine fee must be non-negative.")
        return value

    def validate(self, data):
        # Enforce one bill per appointment
        appointment = data.get('appointment')
        if appointment:
            # Check if a bill already exists for this appointment
            existing_bill = Billing.objects.filter(appointment=appointment)
            
            # If updating, exclude the current instance
            if self.instance:
                existing_bill = existing_bill.exclude(pk=self.instance.pk)
            
            # If creating a new bill and one already exists, raise an error
            if existing_bill.exists():
                raise serializers.ValidationError({
                    'appointment': 'A bill already exists for this appointment. One appointment can only have one bill.'
                })
        
        # Auto-calculate consultation fee from doctor if not provided
        if 'consultation_fee' not in data and not self.instance:
            try:
                if appointment:
                    data['consultation_fee'] = appointment.doctor.consultation_fee
            except Exception:
                pass
        
        # Ensure we have values
        consultation = data.get('consultation_fee', 0)
        medicine = data.get('medicine_fee', 0)
        
        # Calculate total (this will be overridden by model save, but we validate here)
        if self.instance:
            consultation = consultation if 'consultation_fee' in data else self.instance.consultation_fee
            medicine = medicine if 'medicine_fee' in data else self.instance.medicine_fee
        
        data['total_fee'] = float(consultation) + float(medicine)
        
        return data
