const { Department, Employee, User, Notification } = require('../models');

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        {
          model: Employee,
          as: 'manager',
          include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const enriched = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await Employee.count({
          where: {
            departmentId: dept._id,
            status: 'Active',
          }
        });
        return {
          ...dept.toJSON(),
          employeeCount,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id, {
      include: [
        {
          model: Employee,
          as: 'manager',
          include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }]
        }
      ]
    });

    if (!dept) return res.status(404).json({ message: 'Department not found' });

    const employees = await Employee.findAll({
      where: { departmentId: dept._id },
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }],
      attributes: ['designation', 'status', 'employeeId', 'joiningDate', 'salary', 'contactNumber', 'address']
    });

    res.json({
      ...dept.toJSON(),
      employees,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createDepartment = async (req, res) => {
  const { name, description, manager, budget } = req.body;
  try {
    const dept = await Department.create({
      name,
      description,
      budget,
      managerId: manager || null,
    });

    await Notification.create({
      title: 'Department Created',
      message: `${name} department has been created.`,
      type: 'system',
      link: '/departments',
    });

    const populated = await Department.findByPk(dept._id, {
      include: [
        {
          model: Employee,
          as: 'manager',
          include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }]
        }
      ]
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });

    const { name, description, manager, budget } = req.body;

    if (name !== undefined) dept.name = name;
    if (description !== undefined) dept.description = description;
    if (budget !== undefined) dept.budget = budget;
    if (manager !== undefined) dept.managerId = manager || null;

    await dept.save();

    const populated = await Department.findByPk(dept._id, {
      include: [
        {
          model: Employee,
          as: 'manager',
          include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }]
        }
      ]
    });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findByPk(req.params.id);
    if (!dept) return res.status(404).json({ message: 'Department not found' });

    await Employee.update({ departmentId: null }, { where: { departmentId: dept._id } });
    await dept.destroy();

    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
