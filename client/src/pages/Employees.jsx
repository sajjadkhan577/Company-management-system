import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../store/slices/uiSlice';
import Modal from '../components/Modal';
import axios from '../api/axios';

const STATUS_COLORS = {
  Active: 'bg-secondary-container text-on-secondary-container',
  'On Leave': 'bg-tertiary-fixed text-on-tertiary-fixed',
  Terminated: 'bg-surface-container-highest text-on-surface-variant',
};

const emptyForm = { name: '', email: '', password: 'TeamForge@123', designation: '', department: '', joiningDate: '', salary: '', status: 'Active', contactNumber: '', address: '' };

export default function Employees() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { modal } = useSelector((s) => s.ui);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, onLeave: 0, depts: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [filters, setFilters] = useState({ department: '', status: '', search: searchParams.get('search') || '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filters.department) params.append('department', filters.department);
      if (filters.status) params.append('status', filters.status);
      const { data } = await axios.get(`/employees?${params}`);
      let list = data.employees;
      if (filters.search) {
        const s = filters.search.toLowerCase();
        list = list.filter(e => e.user?.name?.toLowerCase().includes(s) || e.user?.email?.toLowerCase().includes(s) || e.designation?.toLowerCase().includes(s));
      }
      setEmployees(list);
      setTotalPages(data.pages);
      setTotalCount(data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, filters]);

  const fetchDepts = async () => {
    try { const { data } = await axios.get('/departments'); setDepartments(data); } catch (e) {}
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/dashboard');
      setStats({ total: data.totalEmployees, active: data.activeEmployees, onLeave: data.totalEmployees - data.activeEmployees, depts: data.totalDepartments });
    } catch (e) {}
  };

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
  useEffect(() => { fetchDepts(); fetchStats(); }, []);

  const handleOpenAdd = () => { setForm(emptyForm); setError(''); dispatch(openModal({ type: 'add' })); };
  const handleOpenEdit = (emp) => {
    setForm({ name: emp.user?.name || '', email: emp.user?.email || '', password: '', designation: emp.designation, department: emp.department?._id || '', joiningDate: emp.joiningDate?.split('T')[0] || '', salary: emp.salary, status: emp.status, contactNumber: emp.contactNumber || '', address: emp.address || '' });
    setError('');
    dispatch(openModal({ type: 'edit', data: emp }));
  };
  const handleOpenDelete = (emp) => { dispatch(openModal({ type: 'delete', data: emp })); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (modal.type === 'add') {
        await axios.post('/employees', form);
      } else {
        await axios.put(`/employees/${modal.data._id}`, form);
      }
      dispatch(closeModal());
      fetchEmployees(); fetchStats();
    } catch (err) { setError(err.response?.data?.message || 'Something went wrong'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await axios.delete(`/employees/${modal.data._id}`); dispatch(closeModal()); fetchEmployees(); fetchStats(); }
    catch (err) { setError(err.response?.data?.message || 'Delete failed'); }
    finally { setSaving(false); }
  };

  const handleExport = () => {
    const csv = ['Name,Email,Department,Designation,Status', ...employees.map(e => `${e.user?.name},${e.user?.email},${e.department?.name || ''},${e.designation},${e.status}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'employees.csv'; a.click();
  };

  const modalOpen = modal.open && (modal.type === 'add' || modal.type === 'edit');
  const deleteOpen = modal.open && modal.type === 'delete';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Employee Directory</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage and organize your enterprise workforce efficiently.</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined">person_add</span>New Employee
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Department:</span>
            <select value={filters.department} onChange={e => { setFilters({...filters, department: e.target.value}); setPage(1); }} className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-on-surface p-0 pr-6">
              <option value="">All Departments</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Status:</span>
            <select value={filters.status} onChange={e => { setFilters({...filters, status: e.target.value}); setPage(1); }} className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-on-surface p-0 pr-6">
              <option value="">All Statuses</option><option>Active</option><option>On Leave</option><option>Terminated</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">search</span>
            <input value={filters.search} onChange={e => { setFilters({...filters, search: e.target.value}); setPage(1); }} placeholder="Search employees..." className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-on-surface w-40" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="p-2 rounded-lg hover:bg-surface-container-highest transition-colors" title="Export CSV">
            <span className="material-symbols-outlined text-on-surface-variant">download</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                {['Photo','Name','Email','Department','Position','Status','Actions'].map(h => (
                  <th key={h} className={`px-6 py-4 font-label-md text-label-md text-on-surface-variant ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant font-body-md">No employees found</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold">
                      {emp.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-label-md text-label-md text-on-surface cursor-pointer hover:text-secondary" onClick={() => navigate(`/employees/${emp._id}`)}>{emp.user?.name}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface-variant">{emp.user?.email}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface">{emp.department?.name || '—'}</td>
                  <td className="px-6 py-4 font-body-sm text-body-sm text-on-surface">{emp.designation}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${STATUS_COLORS[emp.status] || 'bg-surface-container text-on-surface-variant'}`}>{emp.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => navigate(`/employees/${emp._id}`)} className="p-1.5 rounded hover:bg-surface-container-highest text-on-surface-variant" title="View"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button onClick={() => handleOpenEdit(emp)} className="p-1.5 rounded hover:bg-surface-container-highest text-on-surface-variant" title="Edit"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button onClick={() => handleOpenDelete(emp)} className="p-1.5 rounded hover:bg-error-container text-error" title="Delete"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Showing {employees.length} of {totalCount} employees</span>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-50"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i+1)} className={`px-4 py-1.5 rounded-lg font-label-md text-label-md ${page === i+1 ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest'}`}>{i+1}</button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => p+1)} className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-50"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Staff', value: stats.total, icon: 'groups', sub: '+4 this month' },
          { label: 'Active Now', value: stats.active, icon: 'check_circle', sub: `${stats.total > 0 ? ((stats.active/stats.total)*100).toFixed(1) : 0}% utilization` },
          { label: 'On Leave', value: stats.onLeave, icon: 'event_busy', sub: 'Currently away' },
          { label: 'Departments', value: stats.depts, icon: 'hub', sub: 'Enterprise Wide' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">{s.label}</span>
              <span className="material-symbols-outlined text-secondary">{s.icon}</span>
            </div>
            <div className="font-headline-lg text-headline-lg text-primary">{s.value}</div>
            <div className="text-on-surface-variant text-label-sm mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} title={modal.type === 'add' ? 'Add New Employee' : 'Edit Employee'} onConfirm={handleSave} confirmText={modal.type === 'add' ? 'Add Employee' : 'Save Changes'} loading={saving}>
        {error && <p className="mb-3 p-2 bg-error-container text-on-error-container rounded text-sm">{error}</p>}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[['name','Full Name','text'],['email','Email','email'],['designation','Designation','text'],['contactNumber','Phone','text'],['joiningDate','Joining Date','date'],['salary','Salary','number']].map(([field, label, type]) => (
              <div key={field}>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">{label}</label>
                <input type={type} value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm focus:ring-1 focus:ring-secondary focus:border-secondary" />
              </div>
            ))}
          </div>
          {modal.type === 'add' && (
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm focus:ring-1 focus:ring-secondary" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Department</label>
              <select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm focus:ring-1 focus:ring-secondary">
                <option value="">Select Department</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm focus:ring-1 focus:ring-secondary">
                <option>Active</option><option>On Leave</option><option>Terminated</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Address</label>
            <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} rows={2}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-body-sm focus:ring-1 focus:ring-secondary resize-none" />
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteOpen} title="Delete Employee" onConfirm={handleDelete} confirmText="Delete" loading={saving}>
        <p className="font-body-md text-body-md text-on-surface-variant">Are you sure you want to delete <strong>{modal.data?.user?.name}</strong>? This action cannot be undone.</p>
        {error && <p className="mt-3 p-2 bg-error-container text-on-error-container rounded text-sm">{error}</p>}
      </Modal>
    </motion.div>
  );
}
