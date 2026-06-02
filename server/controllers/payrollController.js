const { Payroll, Employee, Notification, User } = require('../models');
const PDFDocument = require('pdfkit');

const populatePayroll = [
  {
    model: Employee,
    as: 'employee',
    attributes: ['employeeId', 'departmentId', 'designation', 'salary'],
    include: [{ model: User, as: 'user', attributes: ['name', 'email', 'role'] }]
  }
];

const getPayrolls = async (req, res) => {
  try {
    const { month, status } = req.query;
    const where = {};
    if (month) where.month = month;
    if (status) where.status = status;

    const payrolls = await Payroll.findAll({
      where,
      include: populatePayroll,
      order: [['createdAt', 'DESC']]
    });

    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const generatePayroll = async (req, res) => {
  try {
    const { employeeId, month, bonus = 0, deductions = 0 } = req.body;

    const emp = await Employee.findByPk(employeeId, {
      include: [{ model: User, as: 'user' }]
    });
    if (!emp) return res.status(404).json({ message: 'Employee not found' });

    const existing = await Payroll.findOne({
      where: { employeeId, month }
    });

    if (existing) return res.status(400).json({ message: 'Payroll already generated for this month' });

    const netPay = Number(emp.salary) + Number(bonus) - Number(deductions);

    const payroll = await Payroll.create({
      employeeId,
      month,
      basicSalary: emp.salary,
      bonus,
      deductions,
      netPay,
      status: 'Processed',
    });

    await Notification.create({
      title: 'Payroll Generated',
      message: `Payroll for ${emp.user?.name || 'Employee'} for ${month} has been generated.`,
      type: 'payroll',
      link: '/payroll',
      recipientId: req.user ? req.user._id : null,
    });

    res.status(201).json(payroll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePayrollStatus = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

    payroll.status = req.body.status;
    payroll.paymentDate = new Date();
    await payroll.save();

    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id);
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

    await payroll.destroy();
    res.json({ message: 'Payroll deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const downloadPayslip = async (req, res) => {
  try {
    const payroll = await Payroll.findByPk(req.params.id, {
      include: populatePayroll
    });
    if (!payroll) return res.status(404).json({ message: 'Payroll not found' });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-disposition', `attachment; filename=payslip-${payroll.employee.user.name.replace(/\s+/g, '-')}-${payroll.month}.pdf`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('TeamForge', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Where Teams, Projects, and Growth Connect', { align: 'center' });
    doc.moveDown(2);
    
    // Title
    doc.fontSize(16).font('Helvetica-Bold').text('OFFICIAL PAYSLIP', { align: 'center' });
    doc.moveDown(1.5);

    // Employee Info
    doc.fontSize(12).font('Helvetica-Bold').text('Employee Information:');
    doc.font('Helvetica').fontSize(10);
    doc.text(`Name: ${payroll.employee.user.name}`);
    doc.text(`Employee ID: ${payroll.employee.employeeId}`);
    doc.text(`Designation: ${payroll.employee.designation}`);
    doc.text(`Month: ${payroll.month}`);
    doc.text(`Status: ${payroll.status}`);
    doc.moveDown(2);

    // Earnings
    doc.fontSize(12).font('Helvetica-Bold').text('Earnings & Deductions:');
    doc.moveDown(0.5);
    
    const tableTop = doc.y;
    doc.font('Helvetica').fontSize(10);
    
    doc.text('Basic Salary:', 50, tableTop);
    doc.text(`$${payroll.basicSalary.toLocaleString()}`, 400, tableTop, { align: 'right' });
    
    doc.text('Bonus:', 50, tableTop + 20);
    doc.text(`$${payroll.bonus.toLocaleString()}`, 400, tableTop + 20, { align: 'right' });

    doc.text('Deductions:', 50, tableTop + 40);
    doc.text(`-$${payroll.deductions.toLocaleString()}`, 400, tableTop + 40, { align: 'right' });

    doc.moveTo(50, tableTop + 65).lineTo(500, tableTop + 65).stroke();

    doc.font('Helvetica-Bold').fontSize(12);
    doc.text('NET PAY:', 50, tableTop + 80);
    doc.text(`$${payroll.netPay.toLocaleString()}`, 400, tableTop + 80, { align: 'right' });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPayrolls, generatePayroll, updatePayrollStatus, deletePayroll, downloadPayslip };
