const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Notification = sequelize.define('Notification', {
  _id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('employee', 'leave', 'payroll', 'project', 'attendance', 'system'), defaultValue: 'system' },
  link: { type: DataTypes.STRING, defaultValue: '/' },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  recipientId: { type: DataTypes.UUID },
}, { timestamps: true });

module.exports = Notification;
