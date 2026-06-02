import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../store/slices/authSlice';
import { setSidebar } from '../store/slices/uiSlice';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard', end: true },
  { to: '/employees', icon: 'badge', label: 'Employees' },
  { to: '/departments', icon: 'corporate_fare', label: 'Departments' },
  { to: '/projects', icon: 'account_tree', label: 'Projects' },
  { to: '/attendance', icon: 'calendar_today', label: 'Attendance' },
  { to: '/payroll', icon: 'payments', label: 'Payroll' },
  { to: '/reports', icon: 'bar_chart', label: 'Reports' },
  { to: '/notifications', icon: 'notifications', label: 'Notifications' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarOpen } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-full w-sidebar-width bg-primary-container flex flex-col border-r border-outline-variant shadow-sm z-50 overflow-hidden"
        >
          {/* ── STATIC HEADER (logo) ── */}
          <div className="flex-shrink-0 px-6 pt-6 pb-6 border-b border-white/10">
            <h1 className="font-headline-md text-headline-md font-bold text-on-primary">TeamForge</h1>
            <p className="text-on-primary-container opacity-70 font-label-sm text-label-sm uppercase tracking-widest mt-1">
              Where Teams, Projects, and Growth Connect
            </p>
          </div>

          {/* ── SCROLLABLE NAVIGATION + FOOTER ── */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container border-l-4 border-secondary-fixed font-bold'
                      : 'text-on-primary-container hover:bg-white/10'
                  }`
                }
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* User profile + logout — scrolls with nav */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
              <div className="px-4 py-3 text-on-primary-container">
                <p className="font-label-md text-label-md">{user?.name}</p>
                <p className="font-label-sm text-label-sm opacity-60">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors font-label-md text-label-md"
              >
                <span className="material-symbols-outlined">logout</span>
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
