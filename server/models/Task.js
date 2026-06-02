const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Task = sequelize.define('Task', {
  _id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  projectId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('Todo', 'In Progress', 'Review', 'Done'), defaultValue: 'Todo' },
  assignedToId: { type: DataTypes.UUID },
  deadline: { type: DataTypes.DATE },
}, { timestamps: true });

module.exports = Task;
