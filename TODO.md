# CorpAdmin Conversion TODO

## Backend (MongoDB/Mongoose) — Phase A
- [x] Added Mongoose model files under `server/models/*.mongo.js`
- [x] Added Mongo connection in `server/db.mongo.js`
- [x] Switched `server/index.js` to use Mongo connection
- [x] Migrated auth (`authController`, `authMiddleware`) to Mongoose
- [ ] Convert remaining Sequelize controllers to Mongoose
  - [ ] `employeeController`
  - [x] `departmentController`
  - [ ] `projectController` (+ tasks)
  - [ ] `attendanceController` (+ leaves)
  - [ ] `payrollController`
  - [ ] `notificationController`
  - [ ] `dashboardController`

- [ ] Convert `server/seed.js` to MongoDB seeding
- [ ] Ensure endpoint response shapes exactly match React expectations
- [ ] Add request validation + sanitization for security

## Frontend (behavior only; preserve UI) — Phase B
- [ ] Ensure all pages call backend endpoints that match required behavior
- [ ] Settings: persist profile/theme/notification preferences to backend
- [ ] Payroll: change payslip download to fetch backend-generated PDF
- [ ] Reports: implement real exports as required (PDF/Excel/CSV) if UI already supports

## Integration & Quality
- [ ] Verify all buttons/modals/tables perform real CRUD actions
- [ ] Seed dummy data into MongoDB (script replacing Sequelize seed)
- [ ] Run end-to-end tests:
  - [ ] Login
  - [ ] Employees CRUD
  - [ ] Department CRUD
  - [ ] Projects Kanban drag/drop + status updates
  - [ ] Attendance check-in/out + leave approve/reject
  - [ ] Payroll generate + mark paid + payslip download
  - [ ] Notifications read + redirect
  - [ ] Settings persistence
- [ ] Deployment docs: Render backend, Vercel frontend, MongoDB Atlas

