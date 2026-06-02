const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Project = sequelize.define('Project', {
  _id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('Planning', 'In Progress', 'Testing', 'Completed', 'On Hold'), defaultValue: 'Planning' },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 },
  startDate: { type: DataTypes.DATE },
  deadline: { type: DataTypes.DATE },
}, { timestamps: true });

module.exports = Project;
