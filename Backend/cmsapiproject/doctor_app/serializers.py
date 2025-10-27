from rest_framework import serializers
from .models import Consultation, Prescription, PrescriptionMedicine

class PrescriptionMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionMedicine
        fields = ['id', 'medicine_name', 'quantity', 'dosage', 'frequency', 'duration', 'notes']

class ConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    patient_id = serializers.IntegerField(source='patient.id', read_only=True)
    
    class Meta:
        model = Consultation
        fields = ['id', 'appointment', 'doctor', 'patient', 'patient_id', 'patient_name', 'symptoms', 'diagnosis', 'notes', 'date_time']
    
    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}"
        return ""

class PrescriptionSerializer(serializers.ModelSerializer):
    medicines = PrescriptionMedicineSerializer(many=True, read_only=True)
    consultation_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Prescription
        fields = ['id', 'consultation', 'doctor', 'dosage', 'frequency', 'duration', 'prescription_notes', 'date_time', 'medicines', 'consultation_details']
        read_only_fields = ['medicines']
    
    def get_consultation_details(self, obj):
        if obj.consultation:
            return {
                'patient_name': f"{obj.consultation.patient.first_name} {obj.consultation.patient.last_name}",
                'diagnosis': obj.consultation.diagnosis,
                'appointment_id': obj.consultation.appointment.id
            }
        return None

class PrescriptionMedicineWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionMedicine
        fields = ['medicine_name', 'quantity', 'dosage', 'frequency', 'duration', 'notes']