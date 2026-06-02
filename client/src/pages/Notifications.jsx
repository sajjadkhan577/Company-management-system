import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markRead, markAllRead } from '../store/slices/notificationSlice';

const TYPE_ICONS = { employee: 'person_add', leave: 'event_busy', payroll: 'payments', project: 'account_tree', attendance: 'calendar_today', system: 'notifications' };

export default function Notifications() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const unread = items.filter(n => !n.isRead);
  const read = items.filter(n => n.isRead);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Notifications</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{unread.length} unread notifications</p>
        </div>
        {unread.length > 0 && (
          <button onClick={() => dispatch(markAllRead())}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-dim transition-colors">
            <span className="material-symbols-outlined text-[18px]">done_all</span>Mark All Read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
          <span className="material-symbols-outlined text-[64px] mb-4 opacity-30">notifications_off</span>
          <p className="font-body-lg text-body-lg">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {unread.length > 0 && (
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">Unread</h3>
              <div className="space-y-3">
                {unread.map(n => (
                  <div key={n._id} onClick={() => { dispatch(markRead(n._id)); navigate(n.link || '/'); }}
                    className="glass-card rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-secondary">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-secondary-container text-[20px]">{TYPE_ICONS[n.type] || 'notifications'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-label-md text-label-md text-on-surface">{n.title}</p>
                        <span className="font-label-sm text-label-sm text-on-surface-variant text-xs ml-4">{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{n.message}</p>
                    </div>
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {read.length > 0 && (
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3">Read</h3>
              <div className="space-y-3">
                {read.map(n => (
                  <div key={n._id} onClick={() => navigate(n.link || '/')}
                    className="glass-card rounded-xl p-4 flex items-start gap-4 cursor-pointer hover:shadow-md transition-all opacity-70">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{TYPE_ICONS[n.type] || 'notifications'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-label-md text-label-md text-on-surface">{n.title}</p>
                        <span className="font-label-sm text-label-sm text-on-surface-variant text-xs ml-4">{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
