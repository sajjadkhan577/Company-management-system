const { sequelize } = require('./db');
const { User, Employee, Department, Project, Notification } = require('./models');

const seed = async () => {
  // Sync DB (force: true will wipe and recreate)
  await sequelize.sync({ force: true });
  console.log('Connected to MySQL and synced tables');

  // Create super admin user
  const admin = await User.create({ name: 'Alex Rivera', email: 'admin@corpadmin.com', password: 'Admin@123', role: 'Super Admin' });
  const hrUser = await User.create({ name: 'Elena Lopez', email: 'hr@corpadmin.com', password: 'Admin@123', role: 'HR Manager' });

  // Create departments
  const eng = await Department.create({ name: 'Engineering', description: 'Software development and architecture', budget: 500000 });
  const design = await Department.create({ name: 'Product Design', description: 'UI/UX and product design', budget: 200000 });
  const marketing = await Department.create({ name: 'Marketing', description: 'Brand strategy and campaigns', budget: 150000 });
  const hr = await Department.create({ name: 'Human Resources', description: 'Talent acquisition and management', budget: 100000 });

  // Create employees (Users first)
  const e1User = await User.create({ name: 'Jordan Dax', email: 'j.dax@corpadmin.com', password: 'Admin@123', role: 'Employee' });
  const e2User = await User.create({ name: 'Sarah Miller', email: 's.miller@corpadmin.com', password: 'Admin@123', role: 'Employee' });
  const e3User = await User.create({ name: 'Robert King', email: 'r.king@corpadmin.com', password: 'Admin@123', role: 'Employee' });
  const e4User = await User.create({ name: 'Marcus Wong', email: 'm.wong@corpadmin.com', password: 'Admin@123', role: 'Employee' });

  const emp1 = await Employee.create({ userId: e1User._id, employeeId: 'EMP0001', departmentId: eng._id, designation: 'Senior Architect', joiningDate: new Date('2021-03-15'), salary: 8500, status: 'Active', contactNumber: '+1-555-0101' });
  const emp2 = await Employee.create({ userId: e2User._id, employeeId: 'EMP0002', departmentId: design._id, designation: 'Lead UI Designer', joiningDate: new Date('2022-01-10'), salary: 7000, status: 'Active', contactNumber: '+1-555-0102' });
  const emp3 = await Employee.create({ userId: e3User._id, employeeId: 'EMP0003', departmentId: marketing._id, designation: 'Brand Strategist', joiningDate: new Date('2020-06-01'), salary: 6500, status: 'On Leave', contactNumber: '+1-555-0103' });
  const emp4 = await Employee.create({ userId: e4User._id, employeeId: 'EMP0004', departmentId: eng._id, designation: 'DevOps Lead', joiningDate: new Date('2021-09-20'), salary: 9000, status: 'Active', contactNumber: '+1-555-0104' });
  const empHr = await Employee.create({ userId: hrUser._id, employeeId: 'EMP0005', departmentId: hr._id, designation: 'HR Manager', joiningDate: new Date('2019-11-05'), salary: 7500, status: 'Active', contactNumber: '+1-555-0105' });

  // Update dept managers
  await eng.update({ managerId: emp1._id });
  await design.update({ managerId: emp2._id });
  await hr.update({ managerId: empHr._id });

  // Create projects
  const p1 = await Project.create({ title: 'Cloud Infrastructure Scale', description: 'Vertical scaling of the primary database cluster for Asia-Pacific.', status: 'In Progress', progress: 42, startDate: new Date(), deadline: new Date('2026-10-30') });
  await p1.setAssignedTo([emp4._id]);

  const p2 = await Project.create({ title: 'Q4 Financial Reporting', description: 'Aggregating department data for the quarterly board meeting deck.', status: 'In Progress', progress: 65, deadline: new Date('2026-11-12') });
  await p2.setAssignedTo([emp1._id, emp2._id]);

  await Project.create({ title: 'Global Site Migration', description: 'Migrating the main corporate domain to the new cloud infrastructure.', status: 'Planning', progress: 15, deadline: new Date('2026-10-24') });
  await Project.create({ title: 'Security Audit v2', description: 'Annual compliance review and penetration testing for payroll modules.', status: 'Planning', progress: 0, deadline: new Date('2026-09-01') });
  await Project.create({ title: 'Internal Wiki Update', description: 'Standardizing documentation for the new onboarding flow.', status: 'Completed', progress: 100 });

  const p6 = await Project.create({ title: 'Mobile App Launch', description: 'Employee self-service mobile application for iOS and Android.', status: 'Testing', progress: 80, deadline: new Date('2026-12-01') });
  await p6.setAssignedTo([emp2._id]);

  // Create notifications
  await Notification.create({ title: 'New Employee Added', message: 'Jordan Dax joined the Engineering team.', type: 'employee', link: '/employees', isRead: false });
  await Notification.create({ title: 'Project Updated', message: 'Cloud Infrastructure Scale moved to In Progress.', type: 'project', link: '/projects', isRead: false });
  await Notification.create({ title: 'Payroll Alert', message: 'Payroll processing scheduled for end of month.', type: 'payroll', link: '/payroll', isRead: true });
  await Notification.create({ title: 'Leave Request', message: 'Robert King has requested Annual Leave.', type: 'leave', link: '/attendance', isRead: false });

  console.log('✅ Seed data created successfully!');
  console.log('\n🔑 Admin credentials:');
  console.log('   Email: admin@corpadmin.com');
  console.log('   Password: Admin@123');
  
  await sequelize.close();
};

seed().catch(err => {
  console.error(err);
  sequelize.close();
});
