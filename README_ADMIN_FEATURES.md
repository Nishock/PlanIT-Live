# Admin Dashboard Features - Complete Implementation

This document provides a complete overview of the admin/manager dashboard features that have been implemented in your PlanIT application.

## 🚀 Features Implemented

### 1. Admin/Manager Dashboard (`/dashboard/admin`)
- ✅ **Role-based Access Control**: Only `admin` and `manager` roles can access
- ✅ **Task Management**: View all tasks across all users and workspaces
- ✅ **Task Assignment**: Create and assign tasks to any user in the system
- ✅ **Advanced Filtering**: Filter by status, user, and due date
- ✅ **Real-time Updates**: Tasks update in real-time when assigned

### 2. Task Assignment Flow
When an admin/manager assigns a task:
1. ✅ **Database Storage**: Task saved to MongoDB with `assignedTo` field
2. ✅ **Email Notification**: Automatic email sent using Nodemailer
3. ✅ **Real-time Notification**: Socket.IO event emitted to user's dashboard
4. ✅ **Toast Notification**: Immediate feedback on user's dashboard

### 3. Real-time Notifications
- ✅ **Socket.IO Integration**: Real-time task assignment notifications
- ✅ **Badge Counter**: Shows number of new tasks in sidebar
- ✅ **Toast Notifications**: Immediate feedback when tasks are assigned
- ✅ **Auto-clear**: Badge counter clears when user visits tasks page

## 📁 File Structure

```
app/
├── dashboard/
│   └── admin/
│       └── page.tsx              # Admin dashboard page
└── api/
    └── admin/
        ├── tasks/
        │   └── route.ts          # Admin tasks API
        └── users/
            └── route.ts          # Admin users API

lib/
├── middleware/
│   └── auth.ts                   # Role-based auth middleware
├── socket-context.tsx            # Socket.IO context provider
├── socket-server.ts              # Socket.IO server setup
├── email.ts                      # Email helper functions
└── models/
    └── Task.ts                   # Updated with assignedTo field

components/
└── dashboard/
    └── dashboard-sidebar.tsx     # Updated sidebar with admin link

server.js                         # Custom server with Socket.IO
```

## 🔧 Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Database
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (for task assignment notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### 2. Email Configuration (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
3. Use the app password in `SMTP_PASS`

### 3. Running the Application

#### Development Mode (with Socket.IO)
```bash
npm run dev:socket
```

#### Production Mode (with Socket.IO)
```bash
npm run build
npm run start:socket
```

#### Regular Development Mode (without Socket.IO)
```bash
npm run dev
```

## 🎯 Usage Guide

### For Admins/Managers:

1. **Access Admin Dashboard**:
   - Login with admin/manager account
   - Navigate to `/dashboard/admin` or click "Admin Dashboard" in sidebar

2. **Assign Tasks**:
   - Click "Assign Task" button
   - Fill in task details:
     - Title (required)
     - Description (optional)
     - Priority (low/medium/high/urgent)
     - Due Date (optional)
     - Assign To (select user)
     - Workspace (select workspace)
   - Click "Assign Task"

3. **Filter and Search**:
   - Use search bar to find specific tasks
   - Filter by status (All/Todo/In Progress/Review/Done)
   - Filter by user
   - Filter by due date

### For Users:

1. **Receive Notifications**:
   - Email notification sent automatically
   - Real-time toast notification on dashboard
   - Badge counter in sidebar shows new task count

2. **View Assigned Tasks**:
   - Tasks automatically appear in task board
   - Click on Tasks in sidebar to view all tasks
   - Badge counter clears when visiting tasks page

## 🔌 API Endpoints

### Admin Tasks API (`/api/admin/tasks`)

#### GET - List all tasks
```typescript
GET /api/admin/tasks?status=todo&userId=123&dueDate=2024-01-01
```

**Query Parameters:**
- `status`: Filter by task status
- `userId`: Filter by user ID
- `dueDate`: Filter by due date

#### POST - Assign a task
```typescript
POST /api/admin/tasks
{
  "title": "Task Title",
  "description": "Task Description",
  "dueDate": "2024-01-01T00:00:00.000Z",
  "priority": "medium",
  "assignedToUserId": "user_id",
  "workspaceId": "workspace_id"
}
```

### Admin Users API (`/api/admin/users`)

#### GET - List all users
```typescript
GET /api/admin/users?role=member&isActive=true
```

**Query Parameters:**
- `role`: Filter by user role
- `isActive`: Filter by active status

## 🔐 Security Features

- **Role-based Access Control**: Only admin/manager users can access admin features
- **JWT Authentication**: All API endpoints require valid authentication
- **Input Validation**: All form inputs are validated before processing
- **Error Handling**: Comprehensive error handling and user feedback

## 📧 Email Templates

The email service sends beautiful HTML emails with:
- Task title and description
- Priority badge with color coding
- Due date information
- Direct link to view task in PlanIT
- Responsive design for mobile devices

## 🔄 Real-time Features

### Socket.IO Implementation

1. **Server Setup**:
   - Custom server with Socket.IO integration
   - Authentication middleware for secure connections
   - User room management for private messages

2. **Client Integration**:
   - Socket.IO context provider for app-wide access
   - Automatic connection management
   - Real-time event handling

3. **Event Flow**:
   - Admin assigns task → API creates task → Socket.IO emits event → User receives notification

## 🛠️ Troubleshooting

### Email Not Sending
- Check SMTP credentials in environment variables
- Verify email service allows SMTP connections
- Check server logs for email errors
- Ensure 2FA is enabled and app password is used for Gmail

### Socket.IO Not Working
- Verify `NEXT_PUBLIC_SOCKET_URL` is set correctly
- Check browser console for connection errors
- Ensure custom server is running (`npm run dev:socket`)
- Check authentication token is valid

### Admin Dashboard Not Accessible
- Verify user has `admin` or `manager` role
- Check authentication token is valid
- Clear browser cache and try again
- Check browser console for errors

### Task Assignment Failing
- Verify all required fields are filled
- Check that assigned user exists and is active
- Verify workspace exists
- Check server logs for detailed error messages

## 🧪 Testing

### Test Admin Dashboard Access
1. Login with admin/manager account
2. Navigate to `/dashboard/admin`
3. Verify you can see the admin interface

### Test Task Assignment
1. Use admin dashboard to assign a task
2. Verify task appears in assigned user's task list
3. Check that email notification is sent
4. Verify real-time notification appears

### Test Real-time Features
1. Open two browser windows
2. Login as admin in one, regular user in another
3. Assign task from admin dashboard
4. Verify notification appears in user's window immediately

## 📈 Performance Considerations

- **Database Indexing**: Tasks are indexed by `assignedTo` field for fast queries
- **Socket.IO Optimization**: Users only receive events for their own tasks
- **Email Queue**: Email sending doesn't block task creation
- **Error Handling**: Graceful degradation if Socket.IO or email fails

## 🔄 Future Enhancements

Potential improvements for the admin dashboard:
- Bulk task assignment
- Task templates
- Advanced analytics and reporting
- Team performance metrics
- Automated task scheduling
- Integration with external tools

---

## 🎉 Summary

The admin dashboard implementation provides a complete solution for:
- ✅ Task management across all users
- ✅ Real-time notifications
- ✅ Email notifications
- ✅ Role-based access control
- ✅ Modern, responsive UI
- ✅ TypeScript type safety
- ✅ Comprehensive error handling

All features are production-ready and follow best practices for security, performance, and user experience.
