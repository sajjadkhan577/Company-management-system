import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../store/slices/uiSlice';
import Modal from '../components/Modal';
import axios from '../api/axios';

export default function Attendance() {
  const dispatch = useDispatch();
  const { modal } = useSelector((s) => s.ui);
  const [records, setRecords] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('records');
  const [leaveForm, setLeaveForm] = useState({ employee: '', type: 'Annual Leave', startDate: '', endDate: '', reason: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, leaveRes, empRes] = await Promise.all([
        axios.get('/attendance'),
        axios.get('/attendance/leaves'),
        axios.get('/employees?limit=100'),
      ]);
      setRecords(attRes.data);
      setLeaves(leaveRes.data);
      setEmployees(empRes.data.employees);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCheckIn = async (empId) => {
    try { await axios.post('/attendance/checkin', { employeeId: empId }); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Check-in failed'); }
  };

  const handleCheckOut = async (empId) => {
    try { await axios.post('/attendance/checkout', { employeeId: empId }); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Check-out failed'); }
  };

  const handleLeaveSubmit = async () => {
    setSaving(true); setError('');
    try { await axios.post('/attendance/leaves', leaveForm); dispatch(closeModal()); fetchData(); }
    catch (err) { setError(err.response?.data?.message || 'Error submitting leave'); }
    finally { setSaving(false); }
  };

  const handleLeaveAction = async (id, status) => {
    try { await axios.put(`/attendance/leaves/${id}`, { status }); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Update failed'); }
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayRecords = records.filter(r => new Date(r.date) >= today);
  const presentToday = todayRecords.filter(r => r.status === 'Present').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Attendance Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Track employee attendance, check-ins, and leave requests.</p>
        </div>
        <button onClick={() => { setLeaveForm({ employee: '', type: 'Annual Leave', startDate: '', endDate: '', reason: '' }); setError(''); dispatch(openModal({ type: 'leave' })); }}
          className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span>New Leave Request
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Present Today', value: presentToday, icon: 'check_circle', color: 'text-secondary' },
          { label: 'Total Employees', value: employees.length, icon: 'groups', color: 'text-primary' },
          { label: 'Pending Leaves', value: pendingLeaves, icon: 'pending_actions', color: 'text-amber-500' },
          { label: 'Attendance Rate', value: employees.length > 0 ? `${Math.round((presentToday/employees.length)*100)}%` : '—', icon: 'analytics', color: 'text-secondary' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{s.label}</span>
              <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
            </div>
            <div className="font-headline-md text-headline-md text-primary">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-outline-variant/30">
        {['records', 'leaves', 'check-in'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 font-label-md text-label-md capitalize transition-colors border-b-2 -mb-px ${activeTab === t ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant hover:text-primary'}`}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <>
          {/* Records Tab */}
          {activeTab === 'records' && (
            <div className="glass-card rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-outline-variant/30">
                    <tr>{['Employee', 'Date', 'Status', 'Check In', 'Check Out'].map(h => <th key={h} className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {records.slice(0, 20).map(r => (
                      <tr key={r._id} className="hover:bg-surface-container-lowest">
                        <td className="px-6 py-3 font-label-md text-label-md">{r.employee?.user?.name || '—'}</td>
                        <td className="px-6 py-3 font-body-sm text-body-sm text-on-surface-variant">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.status === 'Present' ? 'bg-secondary-container text-on-secondary-container' : r.status === 'Absent' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-highest text-on-surface-variant'}`}>{r.status}</span></td>
                        <td className="px-6 py-3 font-body-sm text-body-sm">{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—'}</td>
                        <td className="px-6 py-3 font-body-sm text-body-sm">{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '—'}</td>
                      </tr>
                    ))}
                    {records.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">No attendance records found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leaves Tab */}
          {activeTab === 'leaves' && (
            <div className="glass-card rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-low border-b border-outline-variant/30">
                    <tr>{['Employee', 'Type', 'From', 'To', 'Reason', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {leaves.map(l => (
                      <tr key={l._id} className="hover:bg-surface-container-lowest">
                        <td className="px-6 py-3 font-label-md text-label-md">{l.employee?.user?.name || '—'}</td>
                        <td className="px-6 py-3 font-body-sm text-body-sm">{l.type}</td>
                        <td className="px-6 py-3 font-body-sm text-body-sm text-on-surface-variant">{new Date(l.startDate).toLocaleDateString()}</td>
                        <td className="px-6 py-3 font-body-sm text-body-sm text-on-surface-variant">{new Date(l.endDate).toLocaleDateString()}</td>
                        <td className="px-6 py-3 font-body-sm text-body-sm text-on-surface-variant">{l.reason || '—'}</td>
                        <td className="px-6 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${l.status === 'Approved' ? 'bg-secondary-container text-on-secondary-container' : l.status === 'Rejected' ? 'bg-error-container text-on-error-container' : 'bg-amber-100 text-amber-700'}`}>{l.status}</span></td>
                        <td className="px-6 py-3">
                          {l.status === 'Pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleLeaveAction(l._id, 'Approved')} className="px-2 py-1 bg-secondary text-on-secondary rounded text-xs font-bold hover:brightness-110">Approve</button>
                              <button onClick={() => handleLeaveAction(l._id, 'Rejected')} className="px-2 py-1 bg-error text-on-error rounded text-xs font-bold hover:brightness-110">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {leaves.length === 0 && <tr><td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant">No leave requests</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Check-In Tab */}
          {activeTab === 'check-in' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map(emp => {
                const todayRec = todayRecords.find(r => r.employee?._id === emp._id);
                return (
                  <div key={emp._id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold shrink-0">{emp.user?.name?.charAt(0)}</div>
                      <div>
                        <p className="font-label-md text-label-md">{emp.user?.name}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{emp.designation}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!todayRec ? (
                        <button onClick={() => handleCheckIn(emp._id)} className="px-3 py-1.5 bg-secondary text-on-secondary rounded-lg text-xs font-bold hover:brightness-110 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">login</span>In
                        </button>
                      ) : !todayRec.checkOut ? (
                        <button onClick={() => handleCheckOut(emp._id)} className="px-3 py-1.5 bg-primary-container text-on-primary rounded-lg text-xs font-bold hover:brightness-110 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">logout</span>Out
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 bg-surface-container text-on-surface-variant rounded-lg text-xs font-bold">Done</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {employees.length === 0 && <p className="col-span-3 text-center py-10 text-on-surface-variant">No employees found</p>}
            </div>
          )}
        </>
      )}

      {/* Leave Request Modal */}
      <Modal isOpen={modal.open && modal.type === 'leave'} title="Submit Leave Request" onConfirm={handleLeaveSubmit} confirmText="Submit Request" loading={saving}>
        {error && <p className="mb-3 p-2 bg-error-container text-on-error-container rounded text-sm">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Employee *</label>
            <select value={leaveForm.employee} onChange={e => setLeaveForm({...leaveForm, employee: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary">
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e._id} value={e._id}>{e.user?.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Leave Type</label>
            <select value={leaveForm.type} onChange={e => setLeaveForm({...leaveForm, type: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary">
              {['Sick Leave','Annual Leave','Emergency Leave','Maternity/Paternity','Unpaid Leave'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Start Date</label>
              <input type="date" value={leaveForm.startDate} onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">End Date</label>
              <input type="date" value={leaveForm.endDate} onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
            </div>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Reason</label>
            <textarea rows={3} value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary resize-none" />
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
