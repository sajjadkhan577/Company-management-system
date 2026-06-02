const { Project, Task, Notification, Employee, User } = require('../models');

const populateProjectInclude = [
  {
    model: Employee,
    as: 'assignedTo',
    attributes: ['_id', 'designation', 'employeeId', 'salary', 'status', 'contactNumber', 'address', 'joiningDate'],
    include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }]
  }
];

const populateTaskInclude = [
  {
    model: Employee,
    as: 'assignedTo',
    attributes: ['_id', 'designation', 'employeeId', 'status'],
    include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }]
  },
  {
    model: Project,
    as: 'project',
    attributes: ['title', 'status', 'progress', 'deadline']
  }
];

const getProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const projects = await Project.findAll({
      where,
      include: populateProjectInclude,
      order: [['createdAt', 'DESC']]
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: populateProjectInclude
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const tasks = await Task.findAll({
      where: { projectId: req.params.id },
      include: populateTaskInclude,
      order: [['createdAt', 'DESC']]
    });

    res.json({ ...project.toJSON(), tasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const body = { ...req.body };
    const project = await Project.create(body);

    if (body.assignedTo && Array.isArray(body.assignedTo)) {
      await project.setAssignedTo(body.assignedTo);
    }

    await Notification.create({
      title: 'New Project Created',
      message: `Project "${project.title}" has been created.`,
      type: 'project',
      link: `/projects/${project._id}`,
      isRead: false,
      recipientId: req.user ? req.user._id : null,
    });

    const enriched = await Project.findByPk(project._id, { include: populateProjectInclude });
    res.status(201).json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const update = { ...req.body };
    await project.update(update);

    if (update.assignedTo && Array.isArray(update.assignedTo)) {
      await project.setAssignedTo(update.assignedTo);
    }

    const enriched = await Project.findByPk(project._id, { include: populateProjectInclude });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await Task.destroy({ where: { projectId: req.params.id } });
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const body = { ...req.body };
    const task = await Task.create({
      ...body,
      projectId: req.params.id,
      assignedToId: req.body.assignedTo || null,
    });

    const populated = await Task.findByPk(task._id, { include: populateTaskInclude });
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const body = { ...req.body };
    if (body.assignedTo !== undefined) {
      body.assignedToId = body.assignedTo || null;
    }

    await task.update(body);

    const populated = await Task.findByPk(task._id, { include: populateTaskInclude });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createTask,
  updateTask,
  deleteTask,
};
