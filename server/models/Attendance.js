const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Attendance = sequelize.define('Attendance', {
  _id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  employeeId: { type: DataTypes.UUID, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('Present', 'Absent', 'Half Day', 'On Leave'), allowNull: false },
  checkIn: { type: DataTypes.DATE },
  checkOut: { type: DataTypes.DATE },
  notes: { type: DataTypes.STRING },
}, { timestamps: true });

module.exports = Attendance;
