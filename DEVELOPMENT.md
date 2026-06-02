# Development Guide

Detailed information for developers working on Nexus Enterprise.

## Project Overview

Nexus Enterprise is a full-stack MERN application (currently using MySQL) for comprehensive company management.

## Development Environment Setup

### System Requirements
- Node.js v16+
- npm v7+
- MySQL 5.7+ (currently used)
- MongoDB 4.4+ (planned for migration)
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/sajjadkhan577/Company-management-system.git
cd Company-management-system

# Install all dependencies
npm run install-all

# Create .env file from example
cp .env.example .env

# Update .env with your local settings
# - Set DB_HOST, DB_USER, DB_PASSWORD
# - Set other configuration as needed

# Initialize database
npm run seed

# Start development servers
npm run dev
```

Frontend will be available at: http://localhost:5173
Backend will be available at: http://localhost:5000

## Project Architecture

### Frontend Structure

```
client/src/
├── api/              # API integration (axios setup)
├── assets/           # Images, fonts, etc.
├── components/       # Reusable components
│   ├── MetricCard
│   ├── Modal
│   ├── Sidebar
│   └── TopNavbar
├── layouts/          # Page layouts
│   └── DashboardLayout
├── pages/            # Page components
│   ├── Dashboard
│   ├── Employees
│   ├── Attendance
│   ├── Payroll
│   ├── Projects
│   ├── Departments
│   ├── Reports
│   ├── Settings
│   ├── Notifications
│   ├── Login
│   ├── Register
│   └── EmployeeProfile
├── store/            # Redux configuration
│   ├── store.js
│   └── slices/       # Redux slices
│       ├── authSlice
│       ├── uiSlice
│       └── notificationSlice
├── App.jsx           # Root component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

### Backend Structure

```
server/
├── controllers/      # Request handlers
│   ├── authController
│   ├── employeeController
│   ├── departmentController
│   ├── attendanceController
│   ├── payrollController
│   ├── projectController
│   ├── notificationController
│   └── dashboardController
├── models/           # Database models (Sequelize)
│   ├── User
│   ├── Employee
│   ├── Department
│   ├── Attendance
│   ├── Leave
│   ├── Payroll
│   ├── Project
│   ├── Task
│   └── Notification
├── routes/           # API route definitions
│   ├── authRoutes
│   ├── employeeRoutes
│   ├── departmentRoutes
│   ├── attendanceRoutes
│   ├── payrollRoutes
│   ├── projectRoutes
│   ├── notificationRoutes
│   └── dashboardRoutes
├── middleware/       # Custom middleware
│   └── authMiddleware
├── db.js             # Database connection
├── index.js          # Express app setup
├── seed.js           # Database seeding
└── package.json
```

## Frontend Development

### Adding a New Page

1. Create component in `src/pages/NewPage.jsx`:
```jsx
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';

const NewPage = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold">New Page</h1>
        {/* Page content */}
      </div>
    </DashboardLayout>
  );
};

export default NewPage;
```

2. Add route to `App.jsx`:
```jsx
import NewPage from './pages/NewPage';

// In routes config
{ path: '/new-page', element: <NewPage /> }
```

3. Add navigation link in `Sidebar.jsx` if needed

### State Management (Redux)

Using Redux Toolkit:

```jsx
// In a component
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogin = (userData) => {
    dispatch(setUser(userData));
  };

  return <div>{/* Component JSX */}</div>;
};
```

### API Integration

Using axios from `src/api/axios.js`:

```jsx
import axios from '../api/axios';

// In component or action
const fetchEmployees = async () => {
  try {
    const response = await axios.get('/api/employees');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
};
```

### Styling

Using Tailwind CSS:

```jsx
// Example component with Tailwind classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Action
  </button>
</div>
```

Common Tailwind patterns:
- Flexbox: `flex items-center justify-between`
- Spacing: `p-4 m-2 gap-4`
- Colors: `bg-blue-500 text-gray-900 border-gray-200`
- States: `hover:bg-blue-600 focus:outline-none`

## Backend Development

### Creating an API Endpoint

1. Create controller in `server/controllers/newController.js`:
```javascript
const Model = require('../models/Model');

const getAll = async (req, res) => {
  try {
    const items = await Model.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAll };
```

2. Create route in `server/routes/newRoutes.js`:
```javascript
const express = require('express');
const { getAll } = require('../controllers/newController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAll);

module.exports = router;
```

3. Register route in `server/index.js`:
```javascript
const newRoutes = require('./routes/newRoutes');
app.use('/api/new', newRoutes);
```

### Database Models

Creating a Sequelize model in `server/models/NewModel.js`:

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../db').sequelize;

const NewModel = sequelize.define('NewModel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'new_models',
  timestamps: true,
});

module.exports = NewModel;
```

### Middleware

Custom middleware example in `server/middleware/`:

```javascript
const customMiddleware = (req, res, next) => {
  // Perform actions
  req.customProperty = 'value';
  next();
};

module.exports = customMiddleware;
```

## Common Development Tasks

### Running Tests
```bash
npm test
```

### Running Linter
```bash
cd client && npm run lint
```

### Building for Production
```bash
cd client && npm run build
```

### Seeding Database
```bash
npm run seed
```

### Checking Database
- Use phpMyAdmin at `http://localhost/phpmyadmin`
- Database name: `nexus_enterprise`

## MongoDB Migration

Currently transitioning from MySQL to MongoDB. See TODO.md for progress.

### Migration Steps
1. Create Mongoose models in `server/models/`
2. Migrate controllers to use Mongoose
3. Update routes to use new models
4. Create MongoDB seed script
5. Test all endpoints

## Debugging

### Frontend Debugging
- Use browser DevTools (F12)
- Redux DevTools extension (Chrome)
- Console logs for debugging

### Backend Debugging
- Use `console.log()` or debugger
- Check server logs in terminal
- Use Postman to test API endpoints

## Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Memoization with React.memo()
- Image optimization
- CSS minification

### Backend
- Database indexing
- Query optimization
- Caching strategies
- Load balancing

## Deployment

See hosting documentation for deployment steps.

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 5000 (server)
npx kill-port 5000

# Kill process on port 5173 (client)
npx kill-port 5173
```

**Database connection error**
- Check MySQL is running
- Verify DB credentials in .env
- Check database exists

**Module not found**
- Delete node_modules and package-lock.json
- Run `npm run install-all` again

## Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Sequelize Docs](https://sequelize.org)

## Getting Help

- Check existing issues on GitHub
- Review code comments and documentation
- Ask in pull request discussions
- Contact maintainers

---

Happy coding! 🚀
