# TeamForge - Company Management System

A comprehensive, modern web-based company management platform designed to streamline HR operations, employee management, attendance tracking, payroll processing, and project management.

## 🎯 Features

### Core Modules
- **Dashboard** - Overview of key metrics and statistics
- **Employee Management** - Add, edit, and manage employee records
- **Attendance & Leave** - Track attendance and manage leave requests
- **Payroll Management** - Manage salaries, payroll reports, and payslips
- **Department Management** - Organize employees by departments
- **Project Management** - Create and track projects with task assignments
- **Reports & Analytics** - Generate comprehensive business reports
- **Notifications** - Real-time notification system
- **User Settings** - Configure preferences and profile settings

### Technical Features
- ✅ Role-based authentication and authorization
- ✅ Real-time notifications
- ✅ Responsive design (Desktop & Mobile)
- ✅ Data visualization with charts
- ✅ PDF report generation
- ✅ Modern UI with Tailwind CSS
- ✅ State management with Redux
- ✅ RESTful API architecture

## 🏗️ Project Structure

```
Company-management-system/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── store/         # Redux store configuration
│   │   ├── api/           # API integration
│   │   └── assets/        # Static assets
│   └── package.json
├── server/                 # Express.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── package.json
├── package.json           # Root package with scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MySQL Server (current setup) or MongoDB (future migration)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sajjadkhan577/Company-management-system.git
cd Company-management-system
```

2. **Install all dependencies**
```bash
npm run install-all
```

This will install dependencies for the root, server, and client directories.

3. **Configure environment variables**
```bash
# Copy the example env file and update with your settings
cp .env.example .env
```

Edit `.env` with your database credentials and other configurations.

4. **Setup Database**
```bash
# Seed initial data
npm run seed
```

5. **Start the development server**
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 5173) concurrently.

## 📝 Available Scripts

### Root Level
```bash
npm run dev              # Start both client and server in development mode
npm run server           # Start only the server
npm run client           # Start only the client
npm run seed             # Seed the database with initial data
npm run install-all      # Install dependencies for all packages
```

### Server
```bash
cd server
npm run dev              # Start server with nodemon
npm start                # Start server in production
npm run seed             # Seed database
```

### Client
```bash
cd client
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint
npm run preview          # Preview production build
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Framer Motion** - Animation library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Sequelize** - ORM (transitioning to MongoDB)
- **MySQL** - Database (current)
- **MongoDB** - Database (planned migration)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **PDFKit** - PDF generation

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:
1. Users register or login with credentials
2. Server validates and returns a JWT token
3. Token is stored in Redux store and localStorage
4. Token is sent with each API request in Authorization header
5. Server validates token before processing requests

## 📊 Database Schema

Key entities:
- **Users** - System users and authentication
- **Employees** - Employee records and profiles
- **Departments** - Organizational departments
- **Attendance** - Daily attendance records
- **Leave** - Leave requests and management
- **Payroll** - Salary and payroll information
- **Projects** - Project management and tracking
- **Tasks** - Tasks within projects
- **Notifications** - System notifications

## 🔄 API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Employee Routes
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance Routes
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/:id` - Update attendance

### Payroll Routes
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll` - Create payroll
- `GET /api/payroll/:id/payslip` - Generate payslip

*See `server/routes/` for complete API documentation.*

## 🐛 Known Issues & Roadmap

### Current Phase
- [ ] Complete MongoDB migration from MySQL
- [ ] Implement remaining Mongoose controllers
- [ ] Add request validation and sanitization
- [ ] Complete backend-driven reports generation

### Future Enhancements
- [ ] Email notifications integration
- [ ] SMS alerts
- [ ] Two-factor authentication
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Slack integration
- [ ] Calendar integration

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Sajjad Khan** - Initial work

## 📧 Support

For support, email support@nexusenterprise.com or open an issue on GitHub.

## 🙏 Acknowledgments

- React community
- Tailwind CSS team
- Express.js community
- All contributors and users

---

**Made with ❤️ for modern enterprise management**
