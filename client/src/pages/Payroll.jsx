import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../store/slices/uiSlice';
import Modal from '../components/Modal';
import axios from '../api/axios';

export default function Payroll() {
  const dispatch = useDispatch();
  const { modal } = useSelector((s) => s.ui);
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ month: '', status: '' });
  const [form, setForm] = useState({ employeeId: '', month: '', bonus: 0, deductions: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.month) params.append('month', filter.month);
      if (filter.status) params.append('status', filter.status);
      const [payRes, empRes] = await Promise.all([axios.get(`/payroll?${params}`), axios.get('/employees?limit=100')]);
      setPayrolls(payRes.data);
      setEmployees(empRes.data.employees);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const handleGenerate = async () => {
    setSaving(true); setError('');
    try { await axios.post('/payroll', form); dispatch(closeModal()); fetchData(); }
    catch (err) { setError(err.response?.data?.message || 'Error generating payroll'); }
    finally { setSaving(false); }
  };

  const handleMarkPaid = async (id) => {
    try { await axios.put(`/payroll/${id}`, { status: 'Paid' }); fetchData(); }
    catch (err) { alert(err.response?.data?.message || 'Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this payroll record?')) return;
    try { await axios.delete(`/payroll/${id}`); fetchData(); }
    catch (err) { alert('Delete failed'); }
  };

  const handleDownloadSlip = async (p) => {
    try {
      const response = await axios.get(`/payroll/${p._id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const a = document.createElement('a'); a.href = url; a.download = `payslip-${p.employee?.user?.name}-${p.month}.pdf`; a.click();
    } catch (err) {
      alert('Failed to download payslip');
    }
  };

  const totalNetPay = payrolls.reduce((sum, p) => sum + (p.netPay || 0), 0);
  const totalBonus = payrolls.reduce((sum, p) => sum + (p.bonus || 0), 0);
  const paidCount = payrolls.filter(p => p.status === 'Paid').length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Payroll Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Generate, manage, and track employee compensation.</p>
        </div>
        <button onClick={() => { setForm({ employeeId: '', month: new Date().toLocaleString('default',{month:'long',year:'numeric'}), bonus: 0, deductions: 0 }); setError(''); dispatch(openModal({ type: 'generate' })); }}
          className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span>Generate Payroll
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Payroll', value: `$${totalNetPay.toLocaleString()}`, icon: 'payments', color: 'text-secondary' },
          { label: 'Total Bonus', value: `$${totalBonus.toLocaleString()}`, icon: 'card_giftcard', color: 'text-secondary' },
          { label: 'Records', value: payrolls.length, icon: 'receipt_long', color: 'text-primary' },
          { label: 'Paid', value: paidCount, icon: 'check_circle', color: 'text-secondary' },
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

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Month:</span>
          <input type="text" placeholder="e.g. May 2026" value={filter.month} onChange={e => setFilter({...filter, month: e.target.value})} className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-on-surface w-32" />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Status:</span>
          <select value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})} className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-on-surface p-0 pr-4">
            <option value="">All</option><option>Pending</option><option>Processed</option><option>Paid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low border-b border-outline-variant/30">
              <tr>{['Employee', 'Month', 'Basic', 'Bonus', 'Deductions', 'Net Pay', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center"><div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
              ) : payrolls.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-on-surface-variant">No payroll records. Generate one!</td></tr>
              ) : payrolls.map(p => (
                <tr key={p._id} className="hover:bg-surface-container-lowest group">
                  <td className="px-6 py-4 font-label-md text-label-md">{p.employee?.user?.name || '—'}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">{p.month}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm">${p.basicSalary?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-secondary">+${p.bonus?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-error">-${p.deductions?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-label-md text-label-md font-bold">${p.netPay?.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${p.status === 'Paid' ? 'bg-secondary-container text-on-secondary-container' : p.status === 'Processed' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDownloadSlip(p)} title="Download Payslip" className="p-1.5 rounded hover:bg-surface-container-highest text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">download</span></button>
                      {p.status !== 'Paid' && <button onClick={() => handleMarkPaid(p._id)} title="Mark Paid" className="p-1.5 rounded hover:bg-secondary-container text-secondary"><span className="material-symbols-outlined text-[18px]">check_circle</span></button>}
                      <button onClick={() => handleDelete(p._id)} title="Delete" className="p-1.5 rounded hover:bg-error-container text-error"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Payroll Modal */}
      <Modal isOpen={modal.open && modal.type === 'generate'} title="Generate Payroll" onConfirm={handleGenerate} confirmText="Generate" loading={saving}>
        {error && <p className="mb-3 p-2 bg-error-container text-on-error-container rounded text-sm">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Employee *</label>
            <select value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary">
              <option value="">Select Employee</option>
              {employees.map(e => <option key={e._id} value={e._id}>{e.user?.name} — ${e.salary?.toLocaleString()}/mo</option>)}
            </select>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Month *</label>
            <input type="text" placeholder="e.g. May 2026" value={form.month} onChange={e => setForm({...form, month: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Bonus ($)</label>
              <input type="number" min={0} value={form.bonus} onChange={e => setForm({...form, bonus: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Deductions ($)</label>
              <input type="number" min={0} value={form.deductions} onChange={e => setForm({...form, deductions: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
            </div>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
