const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject, updateProject, deleteProject, createTask, updateTask, deleteTask } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProjects).post(protect, createProject);
router.route('/:id').get(protect, getProjectById).put(protect, updateProject).delete(protect, deleteProject);
router.route('/:id/tasks').post(protect, createTask);
router.route('/:id/tasks/:taskId').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
