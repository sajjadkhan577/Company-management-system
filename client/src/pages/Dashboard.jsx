import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import axios from '../api/axios';
import MetricCard from '../components/MetricCard';

const COLORS = ['#4edea3', '#006c49', '#d8e3fb', '#bcc7de', '#ba1a1a'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('Last 30 Days');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, notifRes] = await Promise.all([
          axios.get('/dashboard'),
          axios.get('/notifications'),
        ]);
        setStats(dashRes.data);
        setActivities(notifRes.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = () => {
    const data = JSON.stringify(stats, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'dashboard-export.json'; a.click();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-6 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Enterprise Dashboard</h2>
          <p className="text-on-surface-variant font-body-md mt-1">Operational performance and workforce analytics.</p>
        </div>
        <div className="flex gap-3">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="px-4 py-2 bg-surface-container-highest text-on-surface rounded-md font-label-md text-label-md border-none focus:ring-secondary">
            <option>Last 30 Days</option><option>Last 7 Days</option><option>This Quarter</option>
          </select>
          <button onClick={handleExport}
            className="px-4 py-2 bg-secondary text-on-secondary rounded-md font-label-md text-label-md flex items-center gap-2 shadow-md hover:brightness-110 transition-all">
            <span className="material-symbols-outlined text-body-md">download</span>Export Data
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div onClick={() => navigate('/employees')} className="cursor-pointer">
          <MetricCard title="Total Employees" value={stats?.totalEmployees ?? '—'} icon="groups" trendLabel="4.2%" trend={1} borderColor="border-l-secondary-fixed" />
        </div>
        <div onClick={() => navigate('/employees')} className="cursor-pointer">
          <MetricCard title="Active Employees" value={stats?.activeEmployees ?? '—'} icon="check_circle" trendLabel="2.1%" trend={1} borderColor="border-l-secondary-fixed" />
        </div>
        <div onClick={() => navigate('/departments')} className="cursor-pointer">
          <MetricCard title="Departments" value={stats?.totalDepartments ?? '—'} icon="corporate_fare" borderColor="border-l-tertiary-fixed" />
        </div>
        <div onClick={() => navigate('/projects')} className="cursor-pointer">
          <MetricCard title="Active Projects" value={stats?.activeProjects ?? '—'} icon="assignment" trendLabel="8.1%" trend={1} borderColor="border-l-secondary-fixed" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Attendance Chart */}
          <div className="bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline-sm text-headline-sm">Attendance Overview (Last 7 Days)</h4>
              <select className="bg-surface-container-low border-none rounded-md text-label-sm focus:ring-secondary text-on-surface">
                <option>Weekly View</option><option>Daily View</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.attendanceData || []}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#006c49" radius={[4, 4, 0, 0]} name="Present" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Project Status */}
          <div className="bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm">
            <h4 className="font-headline-sm text-headline-sm mb-6">Project Status Distribution</h4>
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={stats?.projectDist || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, count }) => count > 0 ? name : ''}>
                    {(stats?.projectDist || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {(stats?.projectDist || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{item.name}: <strong>{item.count}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline-sm text-headline-sm">Recent Activity</h4>
              <button onClick={() => navigate('/notifications')} className="text-secondary font-label-sm text-label-sm hover:underline">View All</button>
            </div>
            <div className="space-y-5 flex-1 overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-on-surface-variant font-body-sm text-body-sm text-center py-8">No recent activity</p>
              ) : activities.map((a, i) => (
                <div key={a._id || i} className="flex gap-4 relative">
                  {i < activities.length - 1 && <div className="absolute top-10 left-5 w-px h-10 bg-outline-variant/30" />}
                  <div className="z-10 bg-secondary-fixed/20 text-secondary w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {a.type === 'employee' ? 'person_add' : a.type === 'project' ? 'task_alt' : a.type === 'payroll' ? 'payments' : 'notifications'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-label-md text-on-surface">{a.title}</p>
                      <span className="text-label-sm text-on-surface-variant text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mt-1">{a.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Insights Banner */}
            <div className="mt-6 p-4 bg-primary-container rounded-lg text-on-primary">
              <p className="font-label-sm opacity-80 mb-1">Attendance Rate Today</p>
              <p className="font-headline-sm text-headline-sm text-secondary-fixed">{stats?.attendanceRate ?? 0}%</p>
              <button onClick={() => navigate('/attendance')} className="mt-3 w-full py-2 bg-secondary text-on-secondary rounded font-label-md text-label-sm hover:brightness-110 transition-all">
                View Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => navigate('/projects')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-on-secondary rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform z-50">
        <span className="material-symbols-outlined text-[28px]">add</span>
        <span className="absolute right-16 bg-primary text-on-primary px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Create Project</span>
      </button>
    </motion.div>
  );
}
