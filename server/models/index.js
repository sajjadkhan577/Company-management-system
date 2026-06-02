const { sequelize } = require('../db');
const User = require('./User');
const Employee = require('./Employee');
const Department = require('./Department');
const Project = require('./Project');
const Task = require('./Task');
const Attendance = require('./Attendance');
const Payroll = require('./Payroll');
const Leave = require('./Leave');
const Notification = require('./Notification');

// Associations
Employee.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Employee, { foreignKey: 'userId', as: 'employee' });

Employee.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(Employee, { foreignKey: 'departmentId', as: 'employees' });

Department.belongsTo(Employee, { foreignKey: 'managerId', as: 'manager' });

// Project Employees (Many to Many)
Project.belongsToMany(Employee, { through: 'ProjectEmployees', as: 'assignedTo' });
Employee.belongsToMany(Project, { through: 'ProjectEmployees', as: 'projects' });

Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });

Task.belongsTo(Employee, { foreignKey: 'assignedToId', as: 'assignedTo' });

Attendance.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Attendance, { foreignKey: 'employeeId', as: 'attendances' });

Payroll.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Payroll, { foreignKey: 'employeeId', as: 'payrolls' });

Leave.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Leave, { foreignKey: 'employeeId', as: 'leaves' });

Leave.belongsTo(User, { foreignKey: 'approvedById', as: 'approvedBy' });

Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

module.exports = {
  sequelize,
  User,
  Employee,
  Department,
  Project,
  Task,
  Attendance,
  Payroll,
  Leave,
  Notification
};

