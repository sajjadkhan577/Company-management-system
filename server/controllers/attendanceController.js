const { Attendance, Leave, Employee, Notification, User } = require('../models');
const { Op } = require('sequelize');

const populateAttendance = [
  {
    model: Employee,
    as: 'employee',
    attributes: ['employeeId', 'designation', 'salary', 'status'],
    include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }]
  }
];

const populateLeave = [
  {
    model: Employee,
    as: 'employee',
    attributes: ['employeeId', 'designation', 'status'],
    include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }]
  },
  { model: User, as: 'approvedBy', attributes: ['name', 'email', 'role'] }
];

const getAttendance = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;

    const where = {};
    if (employeeId) where.employeeId = employeeId;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.date = { [Op.between]: [start, end] };
    }

    const records = await Attendance.findAll({
      where,
      include: populateAttendance,
      order: [['date', 'DESC']]
    });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await Attendance.findOne({
      where: {
        employeeId,
        date: { [Op.gte]: today, [Op.lt]: tomorrow }
      }
    });

    if (existing) return res.status(400).json({ message: 'Already checked in today' });

    const record = await Attendance.create({
      employeeId,
      date: new Date(),
      status: 'Present',
      checkIn: new Date(),
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const record = await Attendance.findOne({
      where: {
        employeeId,
        date: { [Op.gte]: today, [Op.lt]: tomorrow }
      }
    });

    if (!record) return res.status(404).json({ message: 'No check-in record for today' });

    record.checkOut = new Date();
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll({
      include: populateLeave,
      order: [['createdAt', 'DESC']]
    });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createLeave = async (req, res) => {
  try {
    const leave = await Leave.create({
      ...req.body,
      employeeId: req.body.employee,
    });

    const emp = await Employee.findByPk(req.body.employee, { include: [{ model: User, as: 'user' }] });

    await Notification.create({
      title: 'Leave Request',
      message: `${emp?.user?.name || 'Employee'} has submitted a leave request.`,
      type: 'leave',
      link: '/attendance',
      recipientId: req.user ? req.user._id : null,
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findByPk(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    leave.status = req.body.status;
    leave.approvedById = req.user._id;
    await leave.save();

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAttendance, checkIn, checkOut, getLeaves, createLeave, updateLeaveStatus };
