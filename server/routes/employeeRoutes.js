const express = require('express');
const router = express.Router();
const { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getEmployees)
  .post(protect, authorize('Super Admin', 'Admin', 'HR Manager'), createEmployee);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, authorize('Super Admin', 'Admin', 'HR Manager'), updateEmployee)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteEmployee);

module.exports = router;
