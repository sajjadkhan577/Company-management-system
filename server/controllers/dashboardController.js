const { Employee, Department, Project, Attendance, Payroll } = require('../models');
const { Op } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.count();
    const activeEmployees = await Employee.count({ where: { status: 'Active' } });
    const totalDepartments = await Department.count();

    const activeProjects = await Project.count({
      where: {
        status: { [Op.in]: ['Planning', 'In Progress', 'Testing'] }
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await Attendance.count({
      where: {
        date: { [Op.gte]: today, [Op.lt]: tomorrow },
        status: 'Present',
      }
    });

    const attendanceRate = activeEmployees > 0
      ? Math.round((todayAttendance / activeEmployees) * 100)
      : 0;

    const payrollTotal = await Payroll.sum('netPay') || 0;

    const attendanceData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);

      const count = await Attendance.count({
        where: {
          date: { [Op.gte]: d, [Op.lt]: next },
          status: 'Present',
        }
      });

      attendanceData.push({
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        count,
      });
    }

    const statuses = ['Planning', 'In Progress', 'Testing', 'Completed', 'On Hold'];
    const projectDist = await Promise.all(
      statuses.map(async (s) => ({
        name: s,
        count: await Project.count({ where: { status: s } }),
      }))
    );

    res.json({
      totalEmployees,
      activeEmployees,
      totalDepartments,
      activeProjects,
      attendanceRate,
      payrollTotal,
      attendanceData,
      projectDist,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats };
