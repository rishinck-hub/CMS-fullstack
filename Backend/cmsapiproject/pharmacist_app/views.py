from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta
from .models import Medicine, PrescriptionMedicine, MedicineStockHistory, MedicineBilling
from .serializers import MedicineSerializer, PrescriptionMedicineSerializer, MedicineStockHistorySerializer, MedicineBillingSerializer
from common.permissions import IsDoctor, IsPharmacist, IsAdmin, IsReceptionist, IsAdminOrPharmacist
from doctor_app.models import Prescription

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [IsAdmin | IsPharmacist]
    
    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        """Update medicine stock with history tracking"""
        medicine = self.get_object()
        change = request.data.get('change', 0)
        reason = request.data.get('reason', 'Manual adjustment')
        
        if not change:
            return Response({'error': 'Change amount is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            change = int(change)
            new_stock = medicine.stock + change
            
            if new_stock < 0:
                return Response({'error': 'Stock cannot be negative'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Update stock
            medicine.stock = new_stock
            medicine.save()
            
            # Create stock history
            MedicineStockHistory.objects.create(
                medicine=medicine,
                change=change,
                reason=reason
            )
            
            serializer = self.get_serializer(medicine)
            return Response(serializer.data)
            
        except ValueError:
            return Response({'error': 'Invalid change amount'}, status=status.HTTP_400_BAD_REQUEST)

class PrescriptionMedicineViewSet(viewsets.ModelViewSet):
    queryset = PrescriptionMedicine.objects.all()
    serializer_class = PrescriptionMedicineSerializer
    permission_classes = [IsAdmin | IsPharmacist]

class MedicineStockHistoryViewSet(viewsets.ModelViewSet):
    queryset = MedicineStockHistory.objects.all()
    serializer_class = MedicineStockHistorySerializer
    permission_classes = [IsAdmin | IsPharmacist]

class PrescriptionViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for pharmacists to view prescriptions"""
    queryset = Prescription.objects.select_related('consultation', 'doctor', 'consultation__patient').prefetch_related('medicines').all()
    permission_classes = [IsAdminOrPharmacist]
    
    def get_serializer_class(self):
        from doctor_app.serializers import PrescriptionSerializer
        return PrescriptionSerializer
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get prescriptions that haven't been billed yet"""
        # Get prescriptions that don't have billing records
        billed_prescription_ids = MedicineBilling.objects.values_list('prescription_id', flat=True)
        pending_prescriptions = self.get_queryset().exclude(id__in=billed_prescription_ids)
        
        serializer = self.get_serializer(pending_prescriptions, many=True)
        return Response(serializer.data)

class MedicineBillingViewSet(viewsets.ModelViewSet):
    queryset = MedicineBilling.objects.select_related('prescription', 'patient', 'created_by').all()
    serializer_class = MedicineBillingSerializer
    permission_classes = [IsAdminOrPharmacist]

    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Custom action to return dashboard statistics for pharmacist"""
        from rest_framework.serializers import ModelSerializer
        
        # Get all medicines and count
        medicines = Medicine.objects.all()
        total_medicines = medicines.count()
        
        # Get low stock medicines (stock < 10)
        low_stock_medicines = medicines.filter(stock__lt=10)
        low_stock_count = low_stock_medicines.count()
        
        # Get all billings
        all_billings = MedicineBilling.objects.all()
        total_billings = all_billings.count()
        
        # Get today's date range
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        
        # Get today's billings
        today_billings = all_billings.filter(timestamp__gte=today_start, timestamp__lt=today_end)
        today_billings_count = today_billings.count()
        
        # Calculate revenue
        total_revenue = all_billings.aggregate(Sum('total_medicine_fee'))['total_medicine_fee__sum'] or 0
        today_revenue = today_billings.aggregate(Sum('total_medicine_fee'))['total_medicine_fee__sum'] or 0
        
        # Get low stock items with details
        class MedicineSerializerSimplified(ModelSerializer):
            class Meta:
                model = Medicine
                fields = ['id', 'name', 'description', 'stock', 'price_per_unit']
        
        low_stock_items_data = MedicineSerializerSimplified(low_stock_medicines, many=True).data
        
        stats = {
            'totalMedicines': total_medicines,
            'lowStockMedicines': low_stock_count,
            'totalBillings': total_billings,
            'todayBillings': today_billings_count,
            'totalRevenue': float(total_revenue),
            'todayRevenue': float(today_revenue)
        }
        
        return Response({
            'stats': stats,
            'lowStockItems': low_stock_items_data
        })
    
    @action(detail=False, methods=['post'])
    def create_billing(self, request):
        """Create billing for a prescription"""
        prescription_id = request.data.get('prescription_id')
        
        if not prescription_id:
            return Response({'error': 'Prescription ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            prescription = Prescription.objects.get(id=prescription_id)
        except Prescription.DoesNotExist:
            return Response({'error': 'Prescription not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if billing already exists
        if MedicineBilling.objects.filter(prescription=prescription).exists():
            return Response({'error': 'Billing already exists for this prescription'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get pharmacist user
        pharmacist = getattr(request.user, 'pharmacist', None)
        if not pharmacist:
            return Response({'error': 'Pharmacist profile not found'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create billing
        billing_data = {
            'prescription': prescription_id,
            'patient': prescription.consultation.patient.id,
            'created_by': pharmacist.id
        }
        
        serializer = self.get_serializer(data=billing_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)