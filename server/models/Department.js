const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Department = sequelize.define('Department', {
  _id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.STRING },
  managerId: { type: DataTypes.UUID },
  budget: { type: DataTypes.FLOAT, defaultValue: 0 },
}, { timestamps: true });

module.exports = Department;
