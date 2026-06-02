import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleSidebar, toggleDarkMode } from '../store/slices/uiSlice';
import { fetchNotifications, markRead, markAllRead } from '../store/slices/notificationSlice';
import { logout } from '../store/slices/authSlice';

export default function TopNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items: notifications } = useSelector((s) => s.notifications);
  const { sidebarOpen, darkMode } = useSelector((s) => s.ui);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');
  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/employees?search=${search}`);
      setSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-8 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/50 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={() => dispatch(toggleSidebar())} className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">{sidebarOpen ? 'menu_open' : 'menu'}</span>
        </button>
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-secondary transition-all font-body-sm text-body-sm"
            placeholder="Search... (press Enter)"
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button onClick={() => dispatch(toggleDarkMode())} className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-error text-on-error text-[10px] rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-80 bg-white border border-outline-variant/50 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="flex justify-between items-center px-4 py-3 border-b border-outline-variant/30">
                  <span className="font-label-md text-label-md">Notifications</span>
                  <button onClick={() => dispatch(markAllRead())} className="text-secondary font-label-sm text-label-sm hover:underline">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-on-surface-variant font-body-sm text-body-sm">No notifications</p>
                  ) : notifications.slice(0, 10).map((n) => (
                    <div key={n._id} onClick={() => { dispatch(markRead(n._id)); navigate(n.link || '/'); setShowNotifs(false); }}
                      className={`px-4 py-3 border-b border-outline-variant/20 cursor-pointer hover:bg-surface-container-low transition-colors ${!n.isRead ? 'bg-secondary-container/20' : ''}`}>
                      <p className="font-label-md text-label-md">{n.title}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings Shortcut */}
        <button onClick={() => navigate('/settings')} className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div className="h-8 w-px bg-outline-variant" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden md:block">
              <p className="font-label-md text-label-md leading-none">{user?.name}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant">{user?.role}</p>
            </div>
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-12 w-48 bg-white border border-outline-variant/50 rounded-xl shadow-xl overflow-hidden z-50">
                <button onClick={() => { navigate('/settings'); setShowProfile(false); }} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-container-low transition-colors font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">person</span> Profile
                </button>
                <button onClick={() => { navigate('/settings'); setShowProfile(false); }} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-surface-container-low transition-colors font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-[18px]">settings</span> Settings
                </button>
                <div className="border-t border-outline-variant/30" />
                <button onClick={() => { dispatch(logout()); navigate('/login'); }} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-error-container transition-colors font-body-sm text-body-sm text-error">
                  <span className="material-symbols-outlined text-[18px]">logout</span> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
