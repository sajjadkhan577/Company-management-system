const { Employee, User, Notification, Department } = require('../models');
const { Op } = require('sequelize');

const getEmployees = async (req, res) => {
  try {
    const { department, status, search, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const offset = (pageNum - 1) * limitNum;

    const where = {};
    if (department) where.departmentId = department;
    if (status) where.status = status;

    const userWhere = {};
    if (search && String(search).trim()) {
      const q = String(search).trim();
      userWhere[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } }
      ];
    }

    const { count, rows } = await Employee.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'role'], where: Object.keys(userWhere).length ? userWhere : undefined },
        { model: Department, as: 'department', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: limitNum,
      offset
    });

    res.json({
      employees: rows,
      total: count,
      pages: Math.ceil(count / limitNum) || 1,
      currentPage: pageNum,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'role'] },
        { model: Department, as: 'department', attributes: ['name'] }
      ]
    });

    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createEmployee = async (req, res) => {
  try {
    const {
      name, email, password, designation, department, joiningDate,
      salary, status, contactNumber, address, role,
    } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({
      name, email, password: password || 'TeamForge@123', role: role || 'Employee',
    });

    const lastEmp = await Employee.findOne({ order: [['createdAt', 'DESC']], attributes: ['employeeId'] });
    const lastNum = lastEmp?.employeeId?.startsWith('EMP')
      ? parseInt(lastEmp.employeeId.replace('EMP', ''), 10)
      : NaN;
    const empId = !isNaN(lastNum) ? `EMP${String(lastNum + 1).padStart(4, '0')}` : 'EMP0001';

    const emp = await Employee.create({
      userId: user._id,
      employeeId: empId,
      designation,
      departmentId: department || null,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      salary,
      status: status || 'Active',
      contactNumber,
      address,
    });

    await Notification.create({
      title: 'New Employee Added',
      message: `${name} has joined as ${designation}.`,
      type: 'employee',
      link: `/employees/${emp._id}`,
    });

    const populated = await Employee.findByPk(emp._id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'role'] },
        { model: Department, as: 'department', attributes: ['name'] }
      ]
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    const {
      name, email, designation, department, salary, status, contactNumber, address,
    } = req.body;

    if (name || email) {
      const user = await User.findByPk(emp.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (email && email !== user.email) {
        const taken = await User.findOne({ where: { email } });
        if (taken && String(taken._id) !== String(user._id)) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        user.email = email;
      }
      if (name) user.name = name;
      await user.save();
    }

    if (designation !== undefined) emp.designation = designation;
    if (department !== undefined) emp.departmentId = department || null;
    if (salary !== undefined && salary !== null && salary !== '') emp.salary = salary;
    if (status) emp.status = status;
    if (contactNumber !== undefined) emp.contactNumber = contactNumber;
    if (address !== undefined) emp.address = address;

    await emp.save();

    const populated = await Employee.findByPk(emp._id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email', 'role'] },
        { model: Department, as: 'department', attributes: ['name'] }
      ]
    });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    await User.destroy({ where: { _id: emp.userId } });
    await Employee.destroy({ where: { _id: emp._id } });

    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee,
};
