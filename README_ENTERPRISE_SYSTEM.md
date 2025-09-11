# Enterprise Login + Company Admin Request Approval System

This document describes the Enterprise Login and Company Admin Request Approval system implemented in the PlanIT 2.0 application.

## Overview

The system provides a secure enterprise portal for super administrators to manage company admin access requests. It includes:

- **Enterprise Login**: Secure authentication for super-admin and company-admin users
- **Admin Request Management**: Dashboard for reviewing and approving/rejecting admin access requests
- **Email Notifications**: Automated email notifications for approval/rejection decisions
- **Role-based Access Control**: Strict permissions ensuring only super-admins can manage requests

## Features

### 1. Enterprise Login (`/enterprise-login`)
- **Route**: `/enterprise-login`
- **Authentication**: Only users with `super-admin` or `company-admin` roles can access
- **Form Fields**:
  - Email (required)
  - Password (required)
- **Security**: JWT tokens stored in HTTP-only cookies
- **Redirect**: Successful login redirects to `/admin-requests`

### 2. Admin Requests Dashboard (`/admin-requests`)
- **Route**: `/admin-requests`
- **Access**: Only `super-admin` users
- **Features**:
  - View all admin access requests
  - Accept/reject pending requests
  - See request history with approval details
  - Real-time status updates

### 3. Admin Access Request Submission
- **API**: `POST /api/admin-access/request`
- **Purpose**: Allows regular users to submit admin access requests
- **Validation**: Prevents duplicate pending requests

## Database Models

### User Model Updates
```typescript
// New roles added
role: "super-admin" | "company-admin" | "owner" | "admin" | "manager" | "member" | "guest"
```

### AdminAccessRequest Model
```typescript
{
  userId: ObjectId,
  name: string,
  email: string,
  company: string,
  status: "pending" | "approved" | "rejected",
  reason?: string,
  approvedBy?: ObjectId,
  approvedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/enterprise-login` - Enterprise user authentication
- `POST /api/enterprise-logout` - Enterprise user logout

### Admin Requests Management
- `GET /api/admin-requests` - Fetch all admin requests (super-admin only)
- `PATCH /api/admin-requests/:id/accept` - Approve admin request
- `PATCH /api/admin-requests/:id/reject` - Reject admin request

### User Requests
- `POST /api/admin-access/request` - Submit admin access request

## Security Features

### JWT Authentication
- Tokens stored in HTTP-only cookies
- Automatic token validation on protected routes
- Role-based access control

### Middleware Protection
- Route-level protection for admin pages
- API-level protection for admin endpoints
- Automatic redirect to login for unauthorized access

### CSRF Protection
- HTTP-only cookies prevent XSS attacks
- SameSite cookie attributes
- Secure flag in production

## Default Super Admin Account

### Credentials
- **Email**: `phaniques.admin@phaniques.com`
- **Password**: `planiques@admin1234`
- **Role**: `super-admin`
- **Company**: `Phaniques`

### Setup
Run the seed script to create the default super admin:
```bash
npm run seed:super-admin
```

## Email Notifications

### Approval Email
- **Subject**: "Admin Access Approved"
- **Content**: Confirms approval and provides next steps

### Rejection Email
- **Subject**: "Admin Access Request Rejected"
- **Content**: Informs of rejection and provides support contact

## UI Components

### Status Badges
- **Pending**: Yellow badge
- **Approved**: Green badge
- **Rejected**: Red badge

### Actions
- **Accept**: Green button with checkmark icon
- **Reject**: Red button with X icon
- **Loading States**: Spinner animations during processing

## File Structure

```
app/
├── enterprise-login/
│   └── page.tsx                 # Enterprise login page
├── admin-requests/
│   └── page.tsx                 # Admin requests dashboard
└── api/
    ├── enterprise-login/
    │   └── route.ts             # Enterprise login API
    ├── enterprise-logout/
    │   └── route.ts             # Enterprise logout API
    ├── admin-requests/
    │   ├── route.ts             # Get all admin requests
    │   └── [id]/
    │       ├── accept/
    │       │   └── route.ts     # Approve request
    │       └── reject/
    │           └── route.ts     # Reject request
    └── admin-access/
        └── request/
            └── route.ts         # Submit admin request

lib/
├── models/
│   ├── User.ts                  # Updated with new roles
│   └── AdminAccessRequest.ts    # New model
├── middleware/
│   └── auth.ts                  # Updated auth middleware
└── jwt.ts                       # Updated JWT utilities

scripts/
└── seed-super-admin.js          # Super admin seed script

middleware.ts                     # Next.js middleware for route protection
```

## Usage Instructions

### 1. Setup
1. Run the seed script to create the super admin account
2. Ensure MongoDB is running and connected
3. Configure email settings for notifications

### 2. Super Admin Access
1. Navigate to `/enterprise-login`
2. Login with super admin credentials
3. Access the admin requests dashboard at `/admin-requests`

### 3. Managing Requests
1. View all pending, approved, and rejected requests
2. Click "Accept" or "Reject" buttons for pending requests
3. Monitor email notifications sent to users
4. Track approval history and timestamps

### 4. User Request Submission
1. Users can submit admin requests via API
2. Requests are automatically added to the dashboard
3. Super admins review and take action
4. Users receive email notifications of decisions

## Environment Variables

Ensure these environment variables are set:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
```

## Security Considerations

1. **Token Security**: JWT tokens are stored in HTTP-only cookies
2. **Role Validation**: Strict role checking at API and UI levels
3. **Input Validation**: All user inputs are validated and sanitized
4. **Error Handling**: Secure error messages that don't leak sensitive information
5. **Rate Limiting**: Consider implementing rate limiting for login attempts
6. **Audit Logging**: All admin actions are logged with timestamps

## Troubleshooting

### Common Issues

1. **Login Fails**: Check if super admin account exists and credentials are correct
2. **Access Denied**: Ensure user has correct role permissions
3. **Email Not Sending**: Verify email configuration and SMTP settings
4. **Database Errors**: Check MongoDB connection and model definitions

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Check server logs for backend errors
4. Validate database connections and queries

## Future Enhancements

1. **Audit Trail**: Complete audit logging of all admin actions
2. **Bulk Operations**: Approve/reject multiple requests at once
3. **Advanced Filtering**: Filter requests by status, date, company
4. **Export Functionality**: Export request data to CSV/PDF
5. **Two-Factor Authentication**: Additional security for enterprise accounts
6. **Request Comments**: Allow admins to add comments to requests
7. **Auto-approval Rules**: Configure automatic approval for certain criteria
