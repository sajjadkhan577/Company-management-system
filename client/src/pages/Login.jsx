import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login, clearError } from '../store/slices/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (!result.error) navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-bright flex items-center justify-center p-4">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px]">
        {/* Branding */}
        <div className="text-center mb-stack-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-xl shadow-sm mb-stack-md">
            <span className="material-symbols-outlined text-[32px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-1">TeamForge</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Where Teams, Projects, and Growth Connect</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm p-8" style={{ backdropFilter: 'blur(12px)' }}>
          <h2 className="font-headline-sm text-headline-sm text-primary mb-1">Welcome Back</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Please enter your credentials to access your account.</p>

          {error && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 ml-1" htmlFor="email">Work Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-secondary transition-colors">mail</span>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg transition-all font-body-md text-body-md" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 ml-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="font-label-sm text-label-sm text-secondary hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] group-focus-within:text-secondary transition-colors">lock</span>
                <input id="password" name="password" type={showPass ? 'text' : 'password'} required value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant/30 focus:border-secondary focus:ring-1 focus:ring-secondary rounded-lg transition-all font-body-md text-body-md" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-secondary hover:brightness-110 text-on-secondary font-label-md text-label-md py-3.5 rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? <span className="w-5 h-5 border-2 border-on-secondary border-t-transparent rounded-full animate-spin" /> : <>Login to Dashboard <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/register" className="text-secondary font-bold hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </motion.main>

      {/* Side graphic */}
      <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 w-[360px] flex-col gap-4">
        <div className="bg-primary-container p-6 rounded-xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-[120px] text-white">analytics</span></div>
          <div className="relative z-10">
            <h3 className="font-headline-md text-headline-md text-white mb-2">Insights at a Glance</h3>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim leading-relaxed">Access real-time employee metrics, project timelines, and payroll distribution through our advanced executive dashboard.</p>
          </div>
          <div className="mt-4 relative z-10">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-secondary rounded-full" /></div>
            <div className="flex justify-between mt-2 font-label-sm text-label-sm text-white/60"><span>Active Projects</span><span>68% Efficiency</span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary-container/20 backdrop-blur-md p-4 rounded-xl border border-secondary-container/30">
            <span className="material-symbols-outlined text-secondary text-[24px]">verified_user</span>
            <p className="mt-2 font-label-md text-label-md text-on-secondary-container">ISO 27001 Certified</p>
          </div>
          <div className="bg-tertiary-container/20 backdrop-blur-md p-4 rounded-xl border border-tertiary-container/30">
            <span className="material-symbols-outlined text-tertiary-fixed text-[24px]">cloud_done</span>
            <p className="mt-2 font-label-md text-label-md text-on-tertiary-container">99.9% Uptime SLA</p>
          </div>
        </div>
      </div>
    </div>
  );
}
