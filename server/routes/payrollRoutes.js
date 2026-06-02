const express = require('express');
const router = express.Router();
const { getPayrolls, generatePayroll, updatePayrollStatus, deletePayroll, downloadPayslip } = require('../controllers/payrollController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPayrolls).post(protect, authorize('Super Admin', 'Admin', 'HR Manager'), generatePayroll);
router.route('/:id').put(protect, authorize('Super Admin', 'Admin'), updatePayrollStatus).delete(protect, authorize('Super Admin', 'Admin'), deletePayroll);
router.get('/:id/download', protect, downloadPayslip);

module.exports = router;
