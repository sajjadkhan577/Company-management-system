import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register, clearError } from '../store/slices/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return setFormError('Passwords do not match');
    const result = await dispatch(register({ name: form.name, email: form.email, password: form.password }));
    if (!result.error) navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-bright flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>
      <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-xl shadow-sm mb-4">
            <span className="material-symbols-outlined text-[32px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-1">TeamForge</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Where Teams, Projects, and Growth Connect</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm p-8" style={{ backdropFilter: 'blur(12px)' }}>
          {(error || formError) && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>{error || formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[{ id: 'name', label: 'Full Name', type: 'text', icon: 'person', placeholder: 'John Doe' },
              { id: 'email', label: 'Work Email', type: 'email', icon: 'mail', placeholder: 'name@company.com' },
              { id: 'password', label: 'Password', type: 'password', icon: 'lock', placeholder: '••••••••' },
              { id: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: 'lock', placeholder: '••••••••' }
            ].map(field => (
              <div key={field.id}>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1" htmlFor={field.id}>{field.label}</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-secondary transition-colors">{field.icon}</span>
                  <input id={field.id} name={field.id} type={field.type} required value={form[field.id]} onChange={handleChange} placeholder={field.placeholder}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg transition-all font-body-md text-body-md" />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full bg-secondary hover:brightness-110 text-on-secondary font-label-md text-label-md py-3.5 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <span className="w-5 h-5 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">Already have an account? <Link to="/login" className="text-secondary font-bold hover:underline">Login</Link></p>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
