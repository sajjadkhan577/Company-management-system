import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../store/slices/uiSlice';
import Modal from '../components/Modal';
import axios from '../api/axios';

const STATUS_COLORS = { Planning: 'bg-amber-100 text-amber-700', 'In Progress': 'bg-secondary-container text-on-secondary-container', Testing: 'bg-tertiary-fixed text-on-tertiary-fixed', Completed: 'bg-primary-container text-on-primary', 'On Hold': 'bg-surface-container-highest text-on-surface-variant' };
const PRIORITY_COLORS = { High: 'bg-primary-container text-on-primary border border-primary', Medium: 'bg-secondary-container text-on-secondary-container border border-secondary', Low: 'bg-surface-container-high text-on-surface-variant border border-outline-variant/50' };
const COLUMNS = ['Planning', 'In Progress', 'Completed'];

const emptyForm = { title: '', description: '', status: 'Planning', priority: 'Medium', startDate: '', deadline: '', progress: 0 };

export default function Projects() {
  const dispatch = useDispatch();
  const { modal } = useSelector((s) => s.ui);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ velocity: 0, utilization: 0, successRate: 0 });
  const [dragItem, setDragItem] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/projects');
      setProjects(data);
      const completed = data.filter(p => p.status === 'Completed').length;
      setStats({ velocity: data.length, utilization: 88, successRate: data.length > 0 ? Math.round((completed / data.length) * 100) : 0 });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleOpenAdd = () => { setForm(emptyForm); setError(''); dispatch(openModal({ type: 'add' })); };
  const handleOpenEdit = (p) => { setForm({ title: p.title, description: p.description || '', status: p.status, priority: p.priority || 'Medium', startDate: p.startDate?.split('T')[0] || '', deadline: p.deadline?.split('T')[0] || '', progress: p.progress || 0 }); setError(''); dispatch(openModal({ type: 'edit', data: p })); };
  const handleOpenDelete = (p) => dispatch(openModal({ type: 'delete', data: p }));

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (modal.type === 'add') await axios.post('/projects', form);
      else await axios.put(`/projects/${modal.data._id}`, form);
      dispatch(closeModal()); fetchProjects();
    } catch (err) { setError(err.response?.data?.message || 'Error saving'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try { await axios.delete(`/projects/${modal.data._id}`); dispatch(closeModal()); fetchProjects(); }
    catch (err) { setError(err.response?.data?.message || 'Delete failed'); }
    finally { setSaving(false); }
  };

  const handleDrop = async (status) => {
    if (!dragItem || dragItem.status === status) return;
    try { await axios.put(`/projects/${dragItem._id}`, { status }); fetchProjects(); }
    catch (e) { console.error(e); }
    setDragItem(null);
  };

  const modalOpen = modal.open && (modal.type === 'add' || modal.type === 'edit');
  const deleteOpen = modal.open && modal.type === 'delete';

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-end mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary">Project Pipeline</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage and track enterprise-level project lifecycle phases.</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-md font-label-md text-label-md shadow-sm active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[18px]">add</span>New Project
        </button>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => {
            const colProjects = projects.filter(p => p.status === col || (col === 'Planning' && !['In Progress', 'Testing', 'Completed', 'On Hold'].includes(p.status)));
            return (
              <div key={col} className="flex flex-col gap-4"
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDrop(col)}>
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col === 'Planning' ? 'bg-amber-500' : col === 'In Progress' ? 'bg-secondary' : 'bg-primary'}`} />
                    <h3 className="font-label-md text-label-md text-on-surface-variant">{col}</h3>
                    <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold">{colProjects.length}</span>
                  </div>
                </div>
                <div className="space-y-4 min-h-[100px]">
                  {colProjects.map((p) => (
                    <div key={p._id} draggable onDragStart={() => setDragItem(p)}
                      className="glass-card p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-grab border border-outline-variant/30">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${PRIORITY_COLORS[p.priority || 'Medium']}`}>{p.priority || 'Medium'}</span>
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenEdit(p)} className="p-1 rounded hover:bg-surface-container-highest text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                          <button onClick={() => handleOpenDelete(p)} className="p-1 rounded hover:bg-error-container text-error"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                        </div>
                      </div>
                      <h4 className="font-headline-sm text-headline-sm mb-1">{p.title}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-2">{p.description}</p>
                      {p.deadline && (
                        <div className="flex items-center gap-1 text-on-surface-variant mb-3">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          <span className="font-label-sm text-label-sm">{new Date(p.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                          <span>Progress</span><span>{p.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div className="bg-secondary h-full rounded-full transition-all" style={{ width: `${p.progress || 0}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {colProjects.length === 0 && (
                    <div className="border-2 border-dashed border-outline-variant/50 rounded-xl py-10 flex items-center justify-center text-on-surface-variant font-label-sm text-label-sm">Drop here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Projects', value: projects.length, icon: 'account_tree' },
          { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, icon: 'pending' },
          { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, icon: 'task_alt' },
          { label: 'Success Rate', value: `${stats.successRate}%`, icon: 'analytics' },
        ].map(s => (
          <div key={s.label} className="glass-card p-6 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">{s.label}</p>
            <div className="flex items-end justify-between mt-4">
              <span className="font-headline-lg text-headline-lg">{s.value}</span>
              <span className="material-symbols-outlined text-secondary">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} title={modal.type === 'add' ? 'Create Project' : 'Edit Project'} onConfirm={handleSave} confirmText="Save Project" loading={saving}>
        {error && <p className="mb-3 p-2 bg-error-container text-on-error-container rounded text-sm">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Project Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary">
                {['Planning','In Progress','Testing','Completed','On Hold'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary">
                {['High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-1 focus:ring-secondary" />
            </div>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Progress: {form.progress}%</label>
            <input type="range" min={0} max={100} value={form.progress} onChange={e => setForm({...form, progress: Number(e.target.value)})} className="w-full accent-secondary" />
          </div>
        </div>
      </Modal>
      <Modal isOpen={deleteOpen} title="Delete Project" onConfirm={handleDelete} confirmText="Delete" loading={saving}>
        <p className="font-body-md text-body-md text-on-surface-variant">Delete <strong>{modal.data?.title}</strong>? This will also delete all tasks.</p>
      </Modal>
    </motion.div>
  );
}
