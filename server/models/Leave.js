const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Leave = sequelize.define('Leave', {
  _id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  employeeId: { type: DataTypes.UUID, allowNull: false },
  type: { type: DataTypes.ENUM('Sick Leave', 'Annual Leave', 'Emergency Leave', 'Maternity/Paternity', 'Unpaid Leave'), allowNull: false },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  reason: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), defaultValue: 'Pending' },
  approvedById: { type: DataTypes.UUID },
}, { timestamps: true });

module.exports = Leave;
