from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Admin')


class IsReceptionist(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Receptionist')


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Doctor')


class IsPharmacist(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'Pharmacist')


# Combined/OR permissions used by various viewsets ------------------------------------------------
class IsAdminOrReceptionist(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('Admin', 'Receptionist'))


class IsAdminOrPharmacist(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('Admin', 'Pharmacist'))


class IsAdminOrDoctor(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('Admin', 'Doctor'))


class IsAdminOrReceptionistOrDoctor(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('Admin', 'Receptionist', 'Doctor'))


class IsAdminOrReceptionistOrPharmacist(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('Admin', 'Receptionist', 'Pharmacist'))


class IsAdminOrDoctorOrPharmacist(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('Admin', 'Doctor', 'Pharmacist'))


# Flexible role-based permission class
class HasRole(BasePermission):
    """
    Custom permission to check if user has any of the specified roles.
    Usage: permission_classes = [HasRole(['Admin', 'Doctor'])]
    """
    def __init__(self, allowed_roles):
        self.allowed_roles = allowed_roles

    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role in self.allowed_roles
        )


# Object-level permissions for data access control
class IsOwnerOrAdmin(BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Admin can access everything
        if request.user.role == 'Admin':
            return True
        
        # Check if user is the owner of the object
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False