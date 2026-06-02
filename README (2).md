# CorpAdmin Enterprise Suite

A fully functional production-ready full-stack **Company Management System** built with the MERN stack, preserving the exact Google Stitch UI design.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, React Router, Redux Toolkit, Framer Motion, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (or Local) |
| Auth | JWT + bcrypt |

---

## 📁 Project Structure

```
nexus enterprise/
├── client/          # React frontend
│   ├── src/
│   │   ├── api/        # Axios instance
│   │   ├── components/ # Sidebar, Navbar, Modal, MetricCard
│   │   ├── layouts/    # DashboardLayout, AuthLayout
│   │   ├── pages/      # All page components
│   │   └── store/      # Redux slices
└── server/          # Express backend
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── db.js
    ├── index.js
    └── seed.js
```

---

## ⚡ Quick Start

### 1. Configure Environment

**server/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/corpadmin     # or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- ✅ Admin user: `admin@corpadmin.com` / `Admin@123`
- ✅ 5 sample employees
- ✅ 4 departments
- ✅ 6 projects
- ✅ Sample notifications

### 4. Run the Application

Open **two terminal windows**:

**Terminal 1 – Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 – Frontend:**
```bash
cd client
npm run dev
```

Then open: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Default Login

| Email | Password | Role |
|-------|----------|------|
| admin@corpadmin.com | Admin@123 | Super Admin |
| hr@corpadmin.com | Admin@123 | HR Manager |

---

## 📌 Features

### ✅ Authentication
- JWT login/register with bcrypt hashing
- Protected routes (redirects to login if unauthenticated)
- Auto-logout on token expiry

### ✅ Dashboard
- Real-time stats: employees, departments, projects, attendance rate
- Interactive Recharts (Bar chart, Pie chart)
- Recent activity feed from notifications
- Export data as JSON

### ✅ Employee Management
- Full CRUD (Add, Edit, Delete, View profile)
- Search, filter by department and status
- Pagination (10 per page)
- Export employee list as CSV
- Employee profile with attendance and payroll tabs

### ✅ Department Management
- Card-based UI with employee count and budget
- Assign managers
- Full CRUD

### ✅ Project Management
- Kanban board with drag-and-drop across columns
- Progress slider
- Priority labels (High, Medium, Low)
- Full CRUD

### ✅ Attendance
- Check-in / Check-out per employee
- Leave request form
- Leave approval/rejection
- Attendance records table

### ✅ Payroll
- Generate payroll with bonus & deductions
- Auto-calculates net pay from employee salary
- Mark as Paid
- Download payslip as text file
- Filter by month and status

### ✅ Reports
- Employee, Payroll, Project, Attendance reports
- CSV export for all report types
- Live charts (bar, pie)

### ✅ Notifications
- Real-time notification list
- Mark individual / all as read
- Click to navigate to related page

### ✅ Settings
- Password change (connected to backend)
- Dark mode toggle
- Profile information view
- Notification preferences

### ✅ Sidebar & Navbar
- Active page highlighting
- Collapsible sidebar with animation
- Notification badge with count
- User profile dropdown
- Global search (navigates to employees)

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel
# Set environment variable: VITE_API_URL=https://your-api.onrender.com/api
```

### Backend → Render
1. Push the `server/` folder to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a strong random string
   - `NODE_ENV` = production

### Database → MongoDB Atlas
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get your connection string
3. Replace `MONGO_URI` in server `.env` and Render environment

---

## 🔐 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login & get token |
| GET | /api/auth/profile | Get current user |
| PUT | /api/auth/password | Change password |
| GET/POST | /api/employees | List / Add employees |
| GET/PUT/DELETE | /api/employees/:id | Get / Update / Delete |
| GET/POST | /api/departments | List / Add |
| GET/POST | /api/projects | List / Add |
| GET/POST | /api/attendance | Records / Check-in |
| POST | /api/attendance/checkout | Check-out |
| GET/POST | /api/attendance/leaves | Leaves |
| PUT | /api/attendance/leaves/:id | Approve/Reject |
| GET/POST | /api/payroll | List / Generate |
| PUT/DELETE | /api/payroll/:id | Update / Delete |
| GET | /api/dashboard | Dashboard stats |
| GET | /api/notifications | All notifications |
| PUT | /api/notifications/read-all | Mark all read |
| PUT | /api/notifications/:id/read | Mark one read |
