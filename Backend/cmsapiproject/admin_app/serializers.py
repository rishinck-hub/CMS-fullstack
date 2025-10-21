from rest_framework import serializers
from .models import User, Specialization, Staff, Doctor
from datetime import date

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'role', 'is_active')
        extra_kwargs = {'password': {'write_only': True}}
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value      
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = '__all__'

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Specialization name cannot be empty.")
        return value

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'

    def validate_phone(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return value

    def validate_blood_group(self, value):
        valid_groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
        if value not in valid_groups:
            raise serializers.ValidationError("Invalid blood group.")
        return value

    def validate_phone(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Enter a valid phone number.")
        return value

    def validate_dob(self, value):
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise serializers.ValidationError("Staff must be at least 18 years old.")
        return value

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

    def validate_experience(self, value):
        if value < 0:
            raise serializers.ValidationError("Experience cannot be negative.")
        return value

    def validate_consultation_fee(self, value):
        if value <= 0:
            raise serializers.ValidationError("Consultation fee must be greater than zero.")
        return value

    def validate(self, data):
        # Assuming Doctor.user is linked to a Staff object with dob
        user = data.get('user')
        try:
            staff = user.staff
            dob = staff.dob
            today = date.today()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            if age < 25:
                raise serializers.ValidationError("Doctor must be at least 25 years old.")
        except AttributeError:
            raise serializers.ValidationError("Doctor must be linked with staff that has a valid date of birth.")
        return data


class StaffDataSerializer(serializers.Serializer):
    phone = serializers.CharField(required=False, allow_blank=True)
    blood_group = serializers.CharField(required=False, allow_blank=True)
    dob = serializers.DateField(required=False)
    hire_date = serializers.DateField(required=False)
    address = serializers.CharField(required=False, allow_blank=True)


class DoctorDataSerializer(serializers.Serializer):
    specialization = serializers.IntegerField()  # expect specialization id
    experience = serializers.IntegerField(required=False)
    consultation_fee = serializers.DecimalField(max_digits=8, decimal_places=2, required=False)


class UserWithProfilesSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=[('Admin','Admin'),('Receptionist','Receptionist'),('Doctor','Doctor'),('Pharmacist','Pharmacist')])
    is_active = serializers.BooleanField(default=True)
    password = serializers.CharField(write_only=True)

    staff = StaffDataSerializer(required=False)
    doctor = DoctorDataSerializer(required=False)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def create(self, validated_data):
        from django.db import transaction
        staff_data = validated_data.pop('staff', None)
        doctor_data = validated_data.pop('doctor', None)

        with transaction.atomic():
            password = validated_data.pop('password')
            user = User(
                username=validated_data['username'],
                email=validated_data.get('email', ''),
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                role=validated_data.get('role', 'Admin'),
                is_active=validated_data.get('is_active', True),
            )
            user.set_password(password)
            user.save()

            if staff_data:
                Staff.objects.create(user=user, **staff_data)

            if doctor_data:
                spec_id = doctor_data.pop('specialization')
                spec = Specialization.objects.get(pk=spec_id)
                Doctor.objects.create(user=user, specialization=spec, **doctor_data)

            # Optionally perform side-effects after commit (email, audit)
            # transaction.on_commit(lambda: send_welcome_email(user))

        return user
