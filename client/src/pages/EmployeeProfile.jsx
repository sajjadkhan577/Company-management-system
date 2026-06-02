import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../api/axios';

export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [empRes, attRes, payRes] = await Promise.all([
          axios.get(`/employees/${id}`),
          axios.get(`/attendance?employeeId=${id}`),
          axios.get(`/payroll`),
        ]);
        setEmp(empRes.data);
        setAttendance(attRes.data.slice(0, 10));
        setPayrolls(payRes.data.filter(p => p.employee?._id === id).slice(0, 6));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"/></div>;
  if (!emp) return <div className="text-center py-20 text-on-surface-variant">Employee not found</div>;

  const tabs = ['overview', 'attendance', 'payroll'];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Back button */}
      <button onClick={() => navigate('/employees')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 font-label-md text-label-md">
        <span className="material-symbols-outlined">arrow_back</span>Back to Employees
      </button>

      {/* Profile Header */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold text-3xl shrink-0">
            {emp.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="font-headline-md text-headline-md text-primary">{emp.user?.name}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{emp.designation}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">mail</span>{emp.user?.email}</span>
              {emp.contactNumber && <span className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">phone</span>{emp.contactNumber}</span>}
              <span className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">corporate_fare</span>{emp.department?.name || 'No Department'}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${emp.status === 'Active' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>{emp.status}</span>
            <div className="text-right">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Employee ID</p>
              <p className="font-label-md text-label-md text-primary">{emp.employeeId}</p>
            </div>
            <div className="text-right">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Joined</p>
              <p className="font-label-md text-label-md text-primary">{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '—'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-outline-variant/30">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 font-label-md text-label-md capitalize transition-colors border-b-2 -mb-px ${activeTab === t ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>{t}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6">
            <h4 className="font-headline-sm text-headline-sm mb-4">Personal Details</h4>
            <div className="space-y-3">
              {[['Full Name', emp.user?.name], ['Email', emp.user?.email], ['Phone', emp.contactNumber || '—'], ['Address', emp.address || '—'], ['Role', emp.user?.role]].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
                  <span className="font-body-sm text-body-sm text-on-surface">{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-xl p-6">
            <h4 className="font-headline-sm text-headline-sm mb-4">Employment Details</h4>
            <div className="space-y-3">
              {[['Employee ID', emp.employeeId], ['Department', emp.department?.name || '—'], ['Designation', emp.designation], ['Joining Date', emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : '—'], ['Salary', `$${Number(emp.salary).toLocaleString()}`], ['Status', emp.status]].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
                  <span className="font-body-sm text-body-sm text-on-surface">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant/30">
                <tr>{['Date', 'Status', 'Check In', 'Check Out'].map(h => <th key={h} className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {attendance.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant font-body-sm">No attendance records</td></tr>
                ) : attendance.map(a => (
                  <tr key={a._id} className="hover:bg-surface-container-lowest">
                    <td className="px-6 py-3 font-body-sm text-body-sm">{new Date(a.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.status === 'Present' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>{a.status}</span></td>
                    <td className="px-6 py-3 font-body-sm text-body-sm">{a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '—'}</td>
                    <td className="px-6 py-3 font-body-sm text-body-sm">{a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payroll Tab */}
      {activeTab === 'payroll' && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant/30">
                <tr>{['Month', 'Basic Salary', 'Bonus', 'Deductions', 'Net Pay', 'Status'].map(h => <th key={h} className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {payrolls.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant font-body-sm">No payroll records</td></tr>
                ) : payrolls.map(p => (
                  <tr key={p._id} className="hover:bg-surface-container-lowest">
                    <td className="px-6 py-3 font-label-md text-label-md">{p.month}</td>
                    <td className="px-6 py-3 font-body-sm">${p.basicSalary?.toLocaleString()}</td>
                    <td className="px-6 py-3 font-body-sm text-secondary">+${p.bonus?.toLocaleString()}</td>
                    <td className="px-6 py-3 font-body-sm text-error">-${p.deductions?.toLocaleString()}</td>
                    <td className="px-6 py-3 font-label-md text-label-md">${p.netPay?.toLocaleString()}</td>
                    <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.status === 'Paid' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
