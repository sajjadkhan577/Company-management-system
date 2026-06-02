const express = require('express');
const router = express.Router();
const { getDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDepartments).post(protect, authorize('Super Admin', 'Admin'), createDepartment);
router.route('/:id').get(protect, getDepartmentById).put(protect, authorize('Super Admin', 'Admin'), updateDepartment).delete(protect, authorize('Super Admin'), deleteDepartment);

module.exports = router;
