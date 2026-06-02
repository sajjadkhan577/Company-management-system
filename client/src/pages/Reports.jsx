import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from '../api/axios';

const COLORS = ['#4edea3', '#006c49', '#d8e3fb', '#bcc7de', '#ba1a1a'];

export default function Reports() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [projects, setProjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReport, setActiveReport] = useState('employees');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [empRes, payRes, projRes, attRes] = await Promise.all([
          axios.get('/employees?limit=100'),
          axios.get('/payroll'),
          axios.get('/projects'),
          axios.get('/attendance'),
        ]);
        setEmployees(empRes.data.employees);
        setPayrolls(payRes.data);
        setProjects(projRes.data);
        setAttendance(attRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const exportCSV = (data, filename, headers, getRow) => {
    const rows = [headers.join(','), ...data.map(getRow)].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
  };

  const reports = [
    { key: 'employees', label: 'Employee Report', icon: 'badge' },
    { key: 'payroll', label: 'Payroll Report', icon: 'payments' },
    { key: 'projects', label: 'Project Report', icon: 'account_tree' },
    { key: 'attendance', label: 'Attendance Report', icon: 'calendar_today' },
  ];

  const payrollByMonth = payrolls.reduce((acc, p) => {
    const existing = acc.find(a => a.month === p.month);
    if (existing) existing.total += p.netPay;
    else acc.push({ month: p.month, total: p.netPay });
    return acc;
  }, []);

  const statusDist = ['Planning','In Progress','Completed','On Hold','Testing'].map(s => ({ name: s, value: projects.filter(p => p.status === s).length }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Reports & Analytics</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Generate and export comprehensive organizational reports.</p>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        {reports.map(r => (
          <button key={r.key} onClick={() => setActiveReport(r.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-label-md text-label-md transition-all ${activeReport === r.key ? 'bg-secondary text-on-secondary shadow-md' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest border border-outline-variant'}`}>
            <span className="material-symbols-outlined text-[18px]">{r.icon}</span>{r.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <>
          {/* Employee Report */}
          {activeReport === 'employees' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={() => exportCSV(employees, 'employee-report', ['Name','Email','Dept','Position','Status','Salary'], e => `${e.user?.name},${e.user?.email},${e.department?.name || ''},${e.designation},${e.status},${e.salary}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:brightness-110">
                  <span className="material-symbols-outlined text-[18px]">download</span>Export CSV
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {[{ l:'Total',v:employees.length },{ l:'Active',v:employees.filter(e=>e.status==='Active').length },{ l:'On Leave',v:employees.filter(e=>e.status==='On Leave').length },{ l:'Terminated',v:employees.filter(e=>e.status==='Terminated').length }].map(s=>(
                  <div key={s.l} className="glass-card rounded-xl p-4 text-center">
                    <div className="font-headline-md text-headline-md text-primary">{s.v}</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-outline-variant/30">
                    <tr>{['Name','Email','Department','Position','Status','Salary'].map(h=><th key={h} className="px-4 py-3 font-label-md text-label-md text-on-surface-variant">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {employees.map(e=>(
                      <tr key={e._id} className="hover:bg-surface-container-lowest">
                        <td className="px-4 py-3 font-label-md text-label-md">{e.user?.name}</td>
                        <td className="px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">{e.user?.email}</td>
                        <td className="px-4 py-3 font-body-sm text-body-sm">{e.department?.name || '—'}</td>
                        <td className="px-4 py-3 font-body-sm text-body-sm">{e.designation}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${e.status==='Active'?'bg-secondary-container text-on-secondary-container':'bg-surface-container-highest text-on-surface-variant'}`}>{e.status}</span></td>
                        <td className="px-4 py-3 font-body-sm text-body-sm">${e.salary?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payroll Report */}
          {activeReport === 'payroll' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={() => exportCSV(payrolls, 'payroll-report', ['Employee','Month','Basic','Bonus','Deductions','NetPay','Status'], p => `${p.employee?.user?.name},${p.month},${p.basicSalary},${p.bonus},${p.deductions},${p.netPay},${p.status}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:brightness-110">
                  <span className="material-symbols-outlined text-[18px]">download</span>Export CSV
                </button>
              </div>
              <div className="bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm">
                <h4 className="font-headline-sm text-headline-sm mb-4">Monthly Payroll Summary</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={payrollByMonth}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Total']} />
                    <Bar dataKey="total" fill="#006c49" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Project Report */}
          {activeReport === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={() => exportCSV(projects, 'project-report', ['Title','Status','Priority','Progress','Deadline'], p => `${p.title},${p.status},${p.priority||''},${p.progress}%,${p.deadline?new Date(p.deadline).toLocaleDateString():''}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:brightness-110">
                  <span className="material-symbols-outlined text-[18px]">download</span>Export CSV
                </button>
              </div>
              <div className="flex gap-6 items-center bg-white border border-outline-variant/30 rounded-xl p-6 shadow-sm">
                <ResponsiveContainer width="40%" height={200}>
                  <PieChart>
                    <Pie data={statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name,value})=>value>0?name:''}>
                      {statusDist.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {statusDist.map((s,i)=>(
                    <div key={s.name} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{background:COLORS[i%COLORS.length]}}/>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{s.name}: <strong>{s.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Attendance Report */}
          {activeReport === 'attendance' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={() => exportCSV(attendance, 'attendance-report', ['Employee','Date','Status','CheckIn','CheckOut'], a => `${a.employee?.user?.name},${new Date(a.date).toLocaleDateString()},${a.status},${a.checkIn?new Date(a.checkIn).toLocaleTimeString():''},${a.checkOut?new Date(a.checkOut).toLocaleTimeString():''}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:brightness-110">
                  <span className="material-symbols-outlined text-[18px]">download</span>Export CSV
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[{l:'Total Records',v:attendance.length},{l:'Present',v:attendance.filter(a=>a.status==='Present').length},{l:'Absent',v:attendance.filter(a=>a.status==='Absent').length}].map(s=>(
                  <div key={s.l} className="glass-card rounded-xl p-4 text-center">
                    <div className="font-headline-md text-headline-md text-primary">{s.v}</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
