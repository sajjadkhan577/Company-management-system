const { connectDB } = require('./db.mongo');
const { User, Employee, Department, Project, Notification } = require('./models/index.mongo');

const seed = async () => {
  await connectDB();

  // Reset collections
  await Promise.all([
    User.deleteMany({}),
    Employee.deleteMany({}),
    Department.deleteMany({}),
    Project.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  // Users
  const admin = await User.create({
    name: 'Alex Rivera',
    email: 'admin@corpadmin.com',
    password: 'Admin@123',
    role: 'Super Admin',
  });

  await User.create({
    name: 'Elena Lopez',
    email: 'hr@corpadmin.com',
    password: 'Admin@123',
    role: 'HR Manager',
  });

  const e1User = await User.create({ name: 'Jordan Dax', email: 'j.dax@corpadmin.com', password: 'Admin@123', role: 'Employee' });
  const e2User = await User.create({ name: 'Sarah Miller', email: 's.miller@corpadmin.com', password: 'Admin@123', role: 'Employee' });
  const e3User = await User.create({ name: 'Robert King', email: 'r.king@corpadmin.com', password: 'Admin@123', role: 'Employee' });
  const e4User = await User.create({ name: 'Marcus Wong', email: 'm.wong@corpadmin.com', password: 'Admin@123', role: 'Employee' });

  // Departments
  const eng = await Department.create({ name: 'Engineering', description: 'Software development and architecture', budget: 500000 });
  const design = await Department.create({ name: 'Product Design', description: 'UI/UX and product design', budget: 200000 });
  const marketing = await Department.create({ name: 'Marketing', description: 'Brand strategy and campaigns', budget: 150000 });
  const hrDept = await Department.create({ name: 'Human Resources', description: 'Talent acquisition and management', budget: 100000 });

  // Employees
  const emp1 = await Employee.create({
    user: e1User._id,
    employeeId: 'EMP0001',
    department: eng._id,
    designation: 'Senior Architect',
    joiningDate: new Date('2021-03-15'),
    salary: 8500,
    status: 'Active',
    contactNumber: '+1-555-0101',
    address: '—',
  });

  const emp2 = await Employee.create({
    user: e2User._id,
    employeeId: 'EMP0002',
    department: design._id,
    designation: 'Lead UI Designer',
    joiningDate: new Date('2022-01-10'),
    salary: 7000,
    status: 'Active',
    contactNumber: '+1-555-0102',
    address: '—',
  });

  const emp3 = await Employee.create({
    user: e3User._id,
    employeeId: 'EMP0003',
    department: marketing._id,
    designation: 'Brand Strategist',
    joiningDate: new Date('2020-06-01'),
    salary: 6500,
    status: 'On Leave',
    contactNumber: '+1-555-0103',
    address: '—',
  });

  const emp4 = await Employee.create({
    user: e4User._id,
    employeeId: 'EMP0004',
    department: eng._id,
    designation: 'DevOps Lead',
    joiningDate: new Date('2021-09-20'),
    salary: 9000,
    status: 'Active',
    contactNumber: '+1-555-0104',
    address: '—',
  });

  // Use admin user as HR manager employee for demo seed
  const empHr = await Employee.create({
    user: admin._id,
    employeeId: 'EMP0005',
    department: hrDept._id,
    designation: 'HR Manager',
    joiningDate: new Date('2019-11-05'),
    salary: 7500,
    status: 'Active',
    contactNumber: '+1-555-0105',
    address: '—',
  });

  eng.manager = emp1._id;
  design.manager = emp2._id;
  hrDept.manager = empHr._id;
  await Promise.all([eng.save(), design.save(), hrDept.save()]);

  // Projects
  await Project.create({
    title: 'Cloud Infrastructure Scale',
    description: 'Vertical scaling of the primary database cluster for Asia-Pacific.',
    status: 'In Progress',
    progress: 42,
    startDate: new Date(),
    deadline: new Date('2026-10-30'),
    assignedTo: [emp4._id],
  });

  await Project.create({
    title: 'Q4 Financial Reporting',
    description: 'Aggregating department data for the quarterly board meeting deck.',
    status: 'In Progress',
    progress: 65,
    deadline: new Date('2026-11-12'),
    assignedTo: [emp1._id, emp2._id],
  });

  await Project.create({
    title: 'Global Site Migration',
    description: 'Migrating the main corporate domain to the new cloud infrastructure.',
    status: 'Planning',
    progress: 15,
    deadline: new Date('2026-10-24'),
  });

  await Project.create({
    title: 'Security Audit v2',
    description: 'Annual compliance review and penetration testing for payroll modules.',
    status: 'Planning',
    progress: 0,
    deadline: new Date('2026-09-01'),
  });

  await Project.create({
    title: 'Internal Wiki Update',
    description: 'Standardizing documentation for the new onboarding flow.',
    status: 'Completed',
    progress: 100,
  });

  await Project.create({
    title: 'Mobile App Launch',
    description: 'Employee self-service mobile application for iOS and Android.',
    status: 'Testing',
    progress: 80,
    deadline: new Date('2026-12-01'),
    assignedTo: [emp2._id],
  });

  // Notifications
  await Notification.create({
    title: 'New Employee Added',
    message: 'Jordan Dax joined the Engineering team.',
    type: 'employee',
    link: '/employees',
    isRead: false,
    recipient: admin._id,
  });

  await Notification.create({
    title: 'Project Updated',
    message: 'Cloud Infrastructure Scale moved to In Progress.',
    type: 'project',
    link: '/projects',
    isRead: false,
    recipient: admin._id,
  });

  await Notification.create({
    title: 'Payroll Alert',
    message: 'Payroll processing scheduled for end of month.',
    type: 'payroll',
    link: '/payroll',
    isRead: true,
    recipient: admin._id,
  });

  await Notification.create({
    title: 'Leave Request',
    message: 'Robert King has requested Annual Leave.',
    type: 'leave',
    link: '/attendance',
    isRead: false,
    recipient: admin._id,
  });

  console.log('✅ MongoDB seed completed');
  console.log('Admin:', 'admin@corpadmin.com / Admin@123');
  console.log('HR:', 'hr@corpadmin.com / Admin@123');
};

seed().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});

