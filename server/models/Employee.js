const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');
// Note: We'll set up associations later or here.
// For now, defining foreign keys manually is safer to avoid circular deps during init.

const Employee = sequelize.define('Employee', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: { // References User._id
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: '_id'
    }
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  departmentId: { // References Department._id
    type: DataTypes.UUID,
    allowNull: true,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  joiningDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Active', 'On Leave', 'Terminated'),
    defaultValue: 'Active',
  },
  contactNumber: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: true,
});

module.exports = Employee;
