# Role-Based Authentication System

This document describes the comprehensive role-based authentication system implemented in the Clinic Management System.

## Overview

The system implements a multi-layered authentication and authorization system with:
- **Backend**: Django REST Framework with JWT authentication and custom permissions
- **Frontend**: React with context-based state management and route protection
- **Roles**: Admin, Doctor, Receptionist, Pharmacist

## Backend Implementation

### 1. User Model
```python
class User(AbstractUser):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Receptionist', 'Receptionist'),
        ('Doctor', 'Doctor'),
        ('Pharmacist', 'Pharmacist'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
```

### 2. Permission Classes
Located in `Backend/cmsapiproject/common/permissions.py`:

- **Individual Role Permissions**: `IsAdmin`, `IsDoctor`, `IsReceptionist`, `IsPharmacist`
- **Combined Permissions**: `IsAdminOrDoctor`, `IsAdminOrReceptionist`, etc.
- **Flexible Permission**: `HasRole(['Admin', 'Doctor'])` - accepts array of roles
- **Object-level Permission**: `IsOwnerOrAdmin` - for data access control

### 3. API Endpoints
- `GET /admin/me/` - Get current user with profile data
- `GET /admin/dashboard/` - Get role-specific dashboard data
- `POST /token/` - Login endpoint
- `POST /token/refresh/` - Refresh token

### 4. Usage in Views
```python
from common.permissions import IsAdmin, HasRole

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]  # Only admins can access

class SomeView(APIView):
    permission_classes = [HasRole(['Admin', 'Doctor'])]  # Multiple roles
```

## Frontend Implementation

### 1. Authentication Context
Located in `Frontent/cms_front/src/context/AuthContext.jsx`:

```javascript
const { 
  user, 
  isAuthenticated, 
  loading,
  login, 
  logout, 
  updateUser,
  hasRole,
  hasPermission
} = useAuth();
```

### 2. Role Context
Located in `Frontent/cms_front/src/context/RoleContext.jsx`:

```javascript
const { 
  role, 
  hasRole, 
  hasPermission,
  getRoleBasedRoutes,
  getRoleBasedMenuItems
} = useRole();
```

### 3. Route Protection

#### Protected Routes (Authentication Only)
```javascript
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardComponent />
  </ProtectedRoute>
} />
```

#### Role-Based Routes
```javascript
<Route path="/admin/*" element={
  <RoleBasedRoute roles={['Admin']}>
    <AdminRoutes />
  </RoleBasedRoute>
} />
```

### 4. Component Protection

#### Using RoleGuard
```javascript
<RoleGuard roles={['Admin', 'Doctor']} fallback={<div>Access denied</div>}>
  <SensitiveComponent />
</RoleGuard>
```

#### Using Convenience Components
```javascript
<AdminOnly fallback={<div>Admin access required</div>}>
  <AdminPanel />
</AdminOnly>

<DoctorOnly>
  <DoctorDashboard />
</DoctorOnly>
```

### 5. Permission-Based Rendering
```javascript
const canManagePatients = usePermission('manage_patients');

return (
  <div>
    {canManagePatients && <ManagePatientsButton />}
  </div>
);
```

## Role Permissions

### Admin
- **Permissions**: All permissions (`*`)
- **Access**: All routes and features
- **Responsibilities**: User management, system configuration

### Doctor
- **Permissions**: `view_patients`, `manage_consultations`, `view_prescriptions`
- **Access**: Patient records, consultation management
- **Responsibilities**: Patient care, medical records

### Receptionist
- **Permissions**: `manage_patients`, `schedule_appointments`, `view_appointments`
- **Access**: Patient registration, appointment scheduling
- **Responsibilities**: Patient intake, appointment management

### Pharmacist
- **Permissions**: `manage_medicines`, `process_prescriptions`, `view_inventory`
- **Access**: Medicine inventory, prescription processing
- **Responsibilities**: Medicine management, prescription fulfillment

## Usage Examples

### 1. Login Flow
```javascript
const handleLogin = async (username, password) => {
  const tokens = await login(username, password);
  const user = await getCurrentUser();
  login(user, tokens.access, tokens.refresh);
  navigate("/dashboard"); // Redirects to role-specific dashboard
};
```

### 2. Dashboard Redirect
```javascript
// Automatically redirects based on user role
<Route path="/dashboard" element={<DashboardRedirect />} />
```

### 3. Conditional Navigation
```javascript
const menuItems = getRoleBasedMenuItems();
// Returns role-specific menu items
```

### 4. API Calls with Authentication
```javascript
// Tokens are automatically attached via axios interceptor
const userData = await getCurrentUser();
const dashboardData = await getDashboardData();
```

## Security Features

### 1. Token Management
- JWT access tokens (30 minutes)
- Refresh tokens (1 day)
- Automatic token refresh
- Secure token storage in localStorage

### 2. Route Protection
- Authentication required for protected routes
- Role-based access control
- Automatic redirects for unauthorized access
- Loading states during authentication checks

### 3. Component-Level Security
- Conditional rendering based on roles/permissions
- Fallback components for unauthorized access
- Granular permission checking

### 4. Backend Security
- JWT authentication middleware
- Custom permission classes
- Object-level permissions
- CORS configuration

## Testing the System

### 1. Create Test Users
```python
# In Django shell
from admin_app.models import User

# Create admin user
admin = User.objects.create_user(
    username='admin',
    password='admin123',
    role='Admin'
)

# Create doctor user
doctor = User.objects.create_user(
    username='doctor',
    password='doctor123',
    role='Doctor'
)
```

### 2. Test Frontend
1. Navigate to `/login`
2. Login with different role users
3. Verify role-specific redirects
4. Test route protection
5. Check component visibility

### 3. Test API Endpoints
```bash
# Login
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Get user profile
curl -X GET http://localhost:8000/api/admin/me/ \
  -H "Authorization: Bearer <access_token>"
```

## Best Practices

### 1. Backend
- Always use permission classes in views
- Implement object-level permissions for sensitive data
- Use the flexible `HasRole` class for multiple role access
- Validate user roles in serializers

### 2. Frontend
- Use `ProtectedRoute` for authentication-only routes
- Use `RoleBasedRoute` for role-specific routes
- Implement loading states for authentication checks
- Use `RoleGuard` for component-level protection
- Leverage convenience components (`AdminOnly`, etc.)

### 3. Security
- Never trust client-side role checks alone
- Always validate permissions on the backend
- Use HTTPS in production
- Implement proper token expiration
- Log authentication events

## Troubleshooting

### Common Issues

1. **Token Expired**: Implement automatic refresh or redirect to login
2. **Role Not Recognized**: Check role spelling and case sensitivity
3. **Permission Denied**: Verify user has required role/permission
4. **Route Not Found**: Ensure route is properly protected and user has access

### Debug Tips

1. Check browser console for authentication errors
2. Verify token in localStorage
3. Check network requests for 401/403 responses
4. Use Django admin to verify user roles
5. Test API endpoints directly with curl/Postman

## Future Enhancements

1. **Role Hierarchy**: Implement role inheritance
2. **Dynamic Permissions**: Database-driven permission system
3. **Audit Logging**: Track authentication and authorization events
4. **Multi-factor Authentication**: Add 2FA support
5. **Session Management**: Advanced session handling
6. **API Rate Limiting**: Implement rate limiting per role
