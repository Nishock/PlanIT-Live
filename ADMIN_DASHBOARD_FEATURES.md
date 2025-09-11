# Admin Dashboard Features

This document describes the new admin/manager dashboard features that have been added to the PlanIT application.

## Features Overview

### 1. Admin/Manager Dashboard (`/dashboard/admin`)

- **Access Control**: Only users with `admin` or `manager` roles can access this page
- **Task Management**: View all tasks across all users and workspaces
- **Task Assignment**: Create and assign tasks to any user in the system
- **Advanced Filtering**: Filter tasks by status, user, and due date
- **Real-time Updates**: Tasks are updated in real-time when assigned

### 2. Task Assignment Flow

When an admin/manager assigns a task:

1. **Database Storage**: Task is saved to MongoDB with `assignedTo` field set to the user's ID
2. **Email Notification**: Automatic email sent to the assigned user using Nodemailer
3. **Real-time Notification**: Socket.IO event emitted to the assigned user's dashboard
4. **Toast Notification**: User receives immediate notification on their dashboard

### 3. Real-time Notifications

- **Socket.IO Integration**: Real-time task assignment notifications
- **Badge Counter**: Shows number of new tasks in the sidebar
- **Toast Notifications**: Immediate feedback when tasks are assigned
- **Auto-clear**: Badge counter clears when user visits the tasks page

## API Endpoints

### Admin Tasks API (`/api/admin/tasks`)

- **GET**: List all tasks with filtering options
- **POST**: Assign a new task to a user

### Admin Users API (`/api/admin/users`)

- **GET**: List all users for task assignment

## Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration (for task assignment notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Setup Instructions

### 1. Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `SMTP_PASS`

### 2. Socket.IO Server

The application includes Socket.IO client integration. For a complete real-time setup, you may want to run a separate Socket.IO server or integrate it with your existing server.

### 3. User Roles

Ensure users have the correct roles:
- `admin`: Full access to admin dashboard
- `manager`: Full access to admin dashboard
- `member`: Regular user access (redirected to main dashboard)

## Usage

### For Admins/Managers:

1. Navigate to `/dashboard/admin`
2. Use the "Assign Task" button to create new tasks
3. Fill in task details and select the assigned user
4. Submit to assign the task

### For Users:

1. Receive email notifications for new task assignments
2. See real-time toast notifications on the dashboard
3. View new task count badge in the sidebar
4. Tasks automatically appear in their task board

## File Structure

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
└── email-service.ts              # Email notification service

components/
└── dashboard/
    └── dashboard-sidebar.tsx     # Updated sidebar with admin link
```

## Security Features

- **Role-based Access Control**: Only admin/manager users can access admin features
- **JWT Authentication**: All API endpoints require valid authentication
- **Input Validation**: All form inputs are validated before processing
- **Error Handling**: Comprehensive error handling and user feedback

## Troubleshooting

### Email Not Sending
- Check SMTP credentials in environment variables
- Verify email service allows SMTP connections
- Check server logs for email errors

### Socket.IO Not Working
- Verify `NEXT_PUBLIC_SOCKET_URL` is set correctly
- Check browser console for connection errors
- Ensure Socket.IO server is running (if separate)

### Admin Dashboard Not Accessible
- Verify user has `admin` or `manager` role
- Check authentication token is valid
- Clear browser cache and try again
