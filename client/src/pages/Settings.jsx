import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleDarkMode } from '../store/slices/uiSlice';
import axios from '../api/axios';

export default function Settings() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { darkMode } = useSelector((s) => s.ui);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMsg = (type, text) => { setMessage({ type, text }); setTimeout(() => setMessage({ type: '', text: '' }), 3000); };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return showMsg('error', 'New passwords do not match');
    setSaving(true);
    try {
      await axios.put('/auth/password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      showMsg('success', 'Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { showMsg('error', err.response?.data?.message || 'Failed to update password'); }
    finally { setSaving(false); }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/auth/profile', profileForm);
      showMsg('success', 'Profile updated successfully');
    } catch (err) { showMsg('error', err.response?.data?.message || 'Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handleThemeChange = async () => {
    dispatch(toggleDarkMode());
    try {
      await axios.put('/auth/preferences', { theme: !darkMode ? 'dark' : 'light' });
    } catch (err) { console.error('Failed to save preference'); }
  };

  const handleNotificationChange = async (key, val) => {
    try {
      await axios.put('/auth/preferences', { notifications: { [key]: val } });
    } catch (err) { console.error('Failed to save preference'); }
  };

  const tabs = ['profile', 'security', 'appearance', 'notifications'];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg text-primary">Settings</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage your account preferences and system settings.</p>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 font-body-sm text-body-sm ${message.type === 'success' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
          <span className="material-symbols-outlined text-[18px]">{message.type === 'success' ? 'check_circle' : 'error'}</span>{message.text}
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <div className="glass-card rounded-xl p-2">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md capitalize transition-colors text-left ${activeTab === t ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container-highest'}`}>
                <span className="material-symbols-outlined text-[20px]">{t === 'profile' ? 'person' : t === 'security' ? 'lock' : t === 'appearance' ? 'palette' : 'notifications'}</span>{t}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="col-span-12 md:col-span-9">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-headline-sm text-headline-sm mb-6">Profile Information</h3>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant/30">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm">{user?.name}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{user?.role}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{user?.email}</p>
                </div>
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Full Name</label>
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-secondary" />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Email</label>
                  <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-secondary" />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Role</label>
                  <input type="text" value={user?.role} disabled className="w-full px-3 py-2.5 bg-surface-container-highest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface-variant" />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:brightness-110 transition-all">
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-headline-sm text-headline-sm mb-6">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                {[['currentPassword','Current Password'],['newPassword','New Password'],['confirmPassword','Confirm New Password']].map(([field, label]) => (
                  <div key={field}>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{label}</label>
                    <input type="password" required value={passwordForm[field]} onChange={e => setPasswordForm({...passwordForm, [field]: e.target.value})}
                      className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-secondary" />
                  </div>
                ))}
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:brightness-110 disabled:opacity-60 transition-all">
                  {saving && <span className="w-4 h-4 border-2 border-on-secondary border-t-transparent rounded-full animate-spin"/>}
                  Update Password
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-outline-variant/30">
                <h4 className="font-headline-sm text-headline-sm mb-4">Security Info</h4>
                <div className="space-y-3">
                  {[['JWT Authentication', 'Enabled', 'lock'],['Password Hashing (bcrypt)', 'Enabled', 'security'],['Role-Based Access', 'Enabled', 'admin_panel_settings']].map(([label, val, icon]) => (
                    <div key={label} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">{icon}</span>
                        <span className="font-body-sm text-body-sm">{label}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-headline-sm text-headline-sm mb-6">Appearance Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">{darkMode ? 'dark_mode' : 'light_mode'}</span>
                    <div>
                      <p className="font-label-md text-label-md">Dark Mode</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Toggle between light and dark theme</p>
                    </div>
                  </div>
                  <button onClick={handleThemeChange} className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-secondary' : 'bg-surface-container-highest'}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                {[['Inter', 'Current font family'],['Glassmorphism', 'Card style'],['Compact', 'Layout density']].map(([label, desc]) => (
                  <div key={label} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                    <div>
                      <p className="font-label-md text-label-md">{label}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{desc}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-headline-sm text-headline-sm mb-6">Notification Preferences</h3>
              <div className="space-y-3">
                {[['New Employee Added','When a new employee joins'],['Leave Request','When an employee requests leave'],['Payroll Generated','When payroll is processed'],['Project Updates','When project status changes'],['Attendance Alerts','Daily attendance summary']].map(([label, desc]) => (
                  <div key={label} className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                    <div>
                      <p className="font-label-md text-label-md">{label}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{desc}</p>
                    </div>
                    <button onClick={() => handleNotificationChange(label, true)} className="relative w-12 h-6 rounded-full bg-secondary">
                      <span className="absolute top-1 translate-x-7 w-4 h-4 rounded-full bg-white shadow transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
