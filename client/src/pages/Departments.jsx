import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../store/slices/uiSlice';
import Modal from '../components/Modal';
import axios from '../api/axios';

const emptyForm = { name: '', description: '', budget: '', manager: '' };

export default function Departments() {
  const dispatch = useDispatch();
  const { modal } = useSelector((s) => s.ui);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([axios.get('/departments'), axios.get('/employees?limit=100')]);
      setDepartments(deptRes.data);
      setEmployees(empRes.data.employees);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenAdd = () => { setForm(emptyForm); setError(''); dispatch(openModal({ type: 'add' })); };
  const handleOpenEdit = (dept) => { setForm({ name: dept.name, description: dept.description || '', budget: dept.budget || '', manager: dept.manager?._id || '' }); setError(''); dispatch(openModal({ type: 'edit', data: dept })); };
  const handleOpenDelete = (dept) => dispatch(openModal({ type: 'delete', data: dept }));

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (modal.type === 'add') await axios.post('/departments', form);
      else await axios.put(`/departments/${modal.data._id}`, form);
      dispatch(closeModal()); fetchData();
    } catch (err) { setError(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await axios.delete(`/departments/${modal.data._id}`); dispatch(closeModal()); fetchData(); }
    catch (err) { setError(err.response?.data?.message || 'Delete failed'); }
    finally { setSaving(false); }
  };

  const modalOpen = modal.open && (modal.type === 'add' || modal.type === 'edit');
  const deleteOpen = modal.open && modal.type === 'delete';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Department Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage organizational units and team structures.</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-secondary text-on-secondary px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:brightness-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span>New Department
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div key={dept._id} className="glass-card rounded-xl p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-container rounded-lg">
                  <span className="material-symbols-outlined text-on-primary">corporate_fare</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(dept)} className="p-1.5 rounded hover:bg-surface-container-highest text-on-surface-variant" title="Edit"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                  <button onClick={() => handleOpenDelete(dept)} className="p-1.5 rounded hover:bg-error-container text-error" title="Delete"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-primary mb-1">{dept.name}</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">{dept.description || 'No description'}</p>
              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20">
                <div className="text-center">
                  <div className="font-headline-sm text-headline-sm text-secondary">{dept.employeeCount || 0}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Employees</div>
                </div>
                <div className="text-center">
                  <div className="font-headline-sm text-headline-sm text-primary">${Number(dept.budget || 0).toLocaleString()}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Budget</div>
                </div>
                <div className="text-center">
                  <div className="font-label-md text-label-md text-on-surface">{dept.manager?.user?.name || '—'}</div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant">Manager</div>
                </div>
              </div>
            </div>
          ))}
          {departments.length === 0 && <p className="col-span-3 text-center py-20 text-on-surface-variant">No departments found. Create one!</p>}
        </div>
      )}

      <Modal isOpen={modalOpen} title={modal.type === 'add' ? 'Add Department' : 'Edit Department'} onConfirm={handleSave} confirmText="Save Department" loading={saving}>
        {error && <p className="mb-3 p-2 bg-error-container text-on-error-container rounded text-sm">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Department Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Budget ($)</label>
              <input type="number" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Manager</label>
              <select value={form.manager} onChange={e => setForm({...form, manager: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary">
                <option value="">Select Manager</option>
                {employees.map(e => <option key={e._id} value={e._id}>{e.user?.name}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Modal>
      <Modal isOpen={deleteOpen} title="Delete Department" onConfirm={handleDelete} confirmText="Delete" loading={saving}>
        <p className="font-body-md text-body-md text-on-surface-variant">Are you sure you want to delete <strong>{modal.data?.name}</strong>?</p>
      </Modal>
    </motion.div>
  );
}
