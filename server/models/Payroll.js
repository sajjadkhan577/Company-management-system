const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Payroll = sequelize.define('Payroll', {
  _id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  employeeId: { type: DataTypes.UUID, allowNull: false },
  month: { type: DataTypes.STRING, allowNull: false },
  basicSalary: { type: DataTypes.FLOAT, allowNull: false },
  bonus: { type: DataTypes.FLOAT, defaultValue: 0 },
  deductions: { type: DataTypes.FLOAT, defaultValue: 0 },
  netPay: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('Pending', 'Processed', 'Paid'), defaultValue: 'Pending' },
  paymentDate: { type: DataTypes.DATE },
}, { timestamps: true });

module.exports = Payroll;
