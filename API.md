# API Documentation

Complete API reference for Nexus Enterprise backend.

## Base URL

Development: `http://localhost:5000`
Production: `https://api.nexusenterprise.com`

## Authentication

All endpoints (except `/api/auth/register` and `/api/auth/login`) require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Response Format

All responses are JSON:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "error": null
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "error": "error_code"
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication Endpoints

### Register User

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

### Login User

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

### Logout User

```
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Employee Endpoints

### Get All Employees

```
GET /api/employees
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `department` (optional) - Filter by department ID
- `search` (optional) - Search by name or email

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "position": "Developer",
      "department": "Engineering",
      "joinDate": "2024-01-15",
      "status": "active"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### Get Employee by ID

```
GET /api/employees/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "position": "Senior Developer",
    "department": "Engineering",
    "joinDate": "2024-01-15",
    "salary": 75000,
    "status": "active",
    "address": "123 Main St",
    "city": "New York",
    "country": "USA"
  }
}
```

### Create Employee

```
POST /api/employees
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "position": "Manager",
  "department": 1,
  "joinDate": "2024-01-15",
  "salary": 80000,
  "address": "456 Oak Ave",
  "city": "New York",
  "country": "USA"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "position": "Manager",
    "department": 1,
    "joinDate": "2024-01-15",
    "salary": 80000,
    "status": "active"
  },
  "message": "Employee created successfully"
}
```

### Update Employee

```
PUT /api/employees/:id
```

**Request Body:** (All fields optional)
```json
{
  "name": "Jane Smith Updated",
  "position": "Senior Manager",
  "salary": 85000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Jane Smith Updated",
    "position": "Senior Manager",
    "salary": 85000
  },
  "message": "Employee updated successfully"
}
```

### Delete Employee

```
DELETE /api/employees/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

---

## Attendance Endpoints

### Get Attendance Records

```
GET /api/attendance
```

**Query Parameters:**
- `employeeId` (optional) - Filter by employee
- `date` (optional) - Filter by date (YYYY-MM-DD)
- `month` (optional) - Filter by month (YYYY-MM)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "employeeName": "John Doe",
      "date": "2024-01-15",
      "checkIn": "09:00:00",
      "checkOut": "17:30:00",
      "status": "present",
      "hours": 8.5
    }
  ]
}
```

### Mark Attendance

```
POST /api/attendance
```

**Request Body:**
```json
{
  "employeeId": 1,
  "date": "2024-01-15",
  "status": "present"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employeeId": 1,
    "date": "2024-01-15",
    "status": "present"
  },
  "message": "Attendance marked successfully"
}
```

### Check In/Out

```
POST /api/attendance/checkin
POST /api/attendance/checkout
```

**Request Body:**
```json
{
  "employeeId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": 1,
    "time": "09:00:00",
    "type": "checkin"
  }
}
```

---

## Department Endpoints

### Get All Departments

```
GET /api/departments
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Engineering",
      "manager": "John Manager",
      "employeeCount": 15,
      "budget": 500000
    }
  ]
}
```

### Create Department

```
POST /api/departments
```

**Request Body:**
```json
{
  "name": "Marketing",
  "manager": 5,
  "budget": 200000
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Marketing",
    "manager": 5,
    "budget": 200000
  }
}
```

---

## Payroll Endpoints

### Get Payroll Records

```
GET /api/payroll
```

**Query Parameters:**
- `employeeId` (optional)
- `month` (optional, YYYY-MM)
- `status` (optional: pending, processed, paid)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "employeeName": "John Doe",
      "month": "2024-01",
      "salary": 75000,
      "deductions": 5000,
      "netSalary": 70000,
      "status": "paid",
      "processedDate": "2024-01-31"
    }
  ]
}
```

### Generate Payslip

```
GET /api/payroll/:id/payslip
```

**Response:** PDF file download

### Process Payroll

```
POST /api/payroll/process
```

**Request Body:**
```json
{
  "month": "2024-01",
  "departmentId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "processedCount": 15,
    "totalAmount": 1050000,
    "month": "2024-01"
  },
  "message": "Payroll processed successfully"
}
```

---

## Project Endpoints

### Get All Projects

```
GET /api/projects
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Website Redesign",
      "description": "Redesign company website",
      "manager": "John Manager",
      "status": "in-progress",
      "startDate": "2024-01-01",
      "endDate": "2024-03-31",
      "taskCount": 12,
      "completedTasks": 8
    }
  ]
}
```

### Create Project

```
POST /api/projects
```

**Request Body:**
```json
{
  "name": "Mobile App",
  "description": "Develop mobile application",
  "manager": 1,
  "startDate": "2024-02-01",
  "endDate": "2024-06-30"
}
```

**Response:** (201 Created)

---

## Notification Endpoints

### Get Notifications

```
GET /api/notifications
```

**Query Parameters:**
- `unread` (optional: true/false)
- `limit` (optional, default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "type": "leave_approved",
      "message": "Your leave request has been approved",
      "read": false,
      "createdAt": "2024-01-15T10:00:00"
    }
  ],
  "unreadCount": 5
}
```

### Mark as Read

```
PUT /api/notifications/:id/read
```

### Clear All Notifications

```
DELETE /api/notifications
```

---

## Dashboard Endpoints

### Get Dashboard Summary

```
GET /api/dashboard/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEmployees": 150,
    "presentToday": 145,
    "onLeave": 5,
    "departmentCount": 8,
    "activeProjects": 12,
    "pendingApprovals": 3
  }
}
```

### Get Charts Data

```
GET /api/dashboard/charts
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attendanceByDepartment": [],
    "salaryDistribution": [],
    "projectTimeline": []
  }
}
```

---

## Error Handling

### Common Error Responses

**Unauthorized:**
```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token"
}
```

**Not Found:**
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Resource not found"
}
```

**Validation Error:**
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": {
    "email": "Invalid email format"
  }
}
```

---

## Rate Limiting

- 100 requests per minute per IP address
- 1000 requests per hour per token

Exceeding limits returns HTTP 429 with:
```json
{
  "error": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}
```

---

## Webhooks (Future)

Webhooks can be configured to receive real-time notifications for:
- Employee status changes
- Attendance updates
- Payroll processing
- Project milestones
- Leave approvals

---

For more details, see [DEVELOPMENT.md](DEVELOPMENT.md)
