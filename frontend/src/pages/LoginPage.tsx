import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Eye, EyeOff, Loader2, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_EMAIL = 'admin@cabbook.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      setAuth({ id: 'admin-000', name: 'Admin', email: ADMIN_EMAIL, role: 'admin' }, 'admin-token');
      navigate('/admin');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.user, data.token);
      navigate(data.user.role === 'driver' ? '/driver/dashboard' : '/customer/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),_transparent_35%),radial-gradient(circle_at_20%_70%,_rgba(16,185,129,0.12),_transparent_24%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="card p-10 lg:p-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-purple-600/20 text-purple-300 mb-6">
                <Car className="w-7 h-7" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">CabBook</h1>
              <p className="mt-4 max-w-xl text-slate-400 leading-8">
                Seamless ride booking for customers and drivers. Modern travel, clearer pricing, and fast pickup coordination.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <Sparkles className="text-purple-400 mb-4" size={22} />
                  <p className="text-sm text-slate-300 font-semibold">Fast booking</p>
                  <p className="mt-2 text-slate-500 text-sm">Book a ride in seconds with smart pickup and dropoff handling.</p>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <ShieldCheck className="text-emerald-400 mb-4" size={22} />
                  <p className="text-sm text-slate-300 font-semibold">Secure trips</p>
                  <p className="mt-2 text-slate-500 text-sm">Encrypted login and reliable booking flow for every journey.</p>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <MapPin className="text-sky-400 mb-4" size={22} />
                  <p className="text-sm text-slate-300 font-semibold">Smart navigation</p>
                  <p className="mt-2 text-slate-500 text-sm">Accurate pickup and destination handling for every route.</p>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <Car className="text-pink-400 mb-4" size={22} />
                  <p className="text-sm text-slate-300 font-semibold">Driver-ready</p>
                  <p className="mt-2 text-slate-500 text-sm">A clean dashboard for drivers to manage rides and earnings.</p>
                </div>
              </div>
            </div>

            <div className="card p-8 sm:p-10">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.24em] text-purple-300 font-semibold">Welcome back</p>
                <h2 className="mt-3 text-3xl font-bold text-white">Sign in to continue</h2>
                <p className="mt-3 text-slate-400">Use your email and password to access your CabBook workspace.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-100">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-300">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="input-field"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <label className="font-medium text-slate-300">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="input-field pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-text"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  id="login-submit"
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-400">
                New to CabBook?{' '}
                <Link to="/register" className="font-semibold text-white hover:text-purple-300">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
