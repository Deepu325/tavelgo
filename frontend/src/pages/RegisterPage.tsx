import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Eye, EyeOff, Loader2, Sparkles, ShieldCheck, MapPin, User, Truck } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: '',
    licenseNumber: '',
    experience: '',
    vehicleNumber: '',
    vehicleType: '5-Seater',
    vehicleModel: '',
    vehicleCapacity: '4',
  });
  const [files, setFiles] = useState({ driverPhoto: null as File | null, vehiclePhoto: null as File | null });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setFiles({ ...files, [e.target.name]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;

      if (form.role === 'driver') {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('email', form.email);
        formData.append('password', form.password);
        formData.append('role', form.role);
        formData.append('phone', form.phone);
        formData.append('licenseNumber', form.licenseNumber);
        formData.append('experience', form.experience);
        formData.append('vehicleNumber', form.vehicleNumber);
        formData.append('vehicleType', form.vehicleType);
        formData.append('vehicleModel', form.vehicleModel);
        formData.append('vehicleCapacity', form.vehicleCapacity);
        if (files.driverPhoto) {
          formData.append('driverPhoto', files.driverPhoto);
        }
        if (files.vehiclePhoto) {
          formData.append('vehiclePhoto', files.vehiclePhoto);
        }
        response = await api.post('/auth/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/auth/register', form);
      }

      const { data } = response;
      setAuth(data.user, data.token);
      navigate(data.user.role === 'driver' ? '/driver/dashboard' : '/customer/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_18%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="card p-10 lg:p-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-purple-600/20 text-purple-300 mb-6">
                <Car className="w-7 h-7" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Create your CabBook account</h1>
              <p className="mt-4 max-w-xl text-slate-400 leading-8">
                Join drivers and riders on an elevated booking platform. Reliable rides, clear pricing, and smarter trip management from day one.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <Sparkles className="text-fuchsia-400 mb-4" size={22} />
                  <p className="text-sm text-slate-300 font-semibold">Fast setup</p>
                  <p className="mt-2 text-slate-500 text-sm">Create your driver or customer profile in seconds.</p>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <ShieldCheck className="text-emerald-400 mb-4" size={22} />
                  <p className="text-sm text-slate-300 font-semibold">Trusted booking</p>
                  <p className="mt-2 text-slate-500 text-sm">Secure authentication and safe ride workflows.</p>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <MapPin className="text-sky-400 mb-4" size={22} />
                  <p className="text-sm text-slate-300 font-semibold">Smart navigation</p>
                  <p className="mt-2 text-slate-500 text-sm">Accurate pickup and dropoff experience for every trip.</p>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                  <Car className="text-purple-400 mb-4" size={22} />
                  <p className="text-sm text-slate-300 font-semibold">Driver ready</p>
                  <p className="mt-2 text-slate-500 text-sm">Driver dashboard supports active rides and trip decisions.</p>
                </div>
              </div>
            </div>

            <div className="card p-8 sm:p-10">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.24em] text-purple-300 font-semibold">Register</p>
                <h2 className="mt-3 text-3xl font-bold text-white">Start your journey</h2>
                <p className="mt-3 text-slate-400">Sign up as a customer or driver and get access to the CabBook platform.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-secondary">Full Name</label>
                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="input-field"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-300">Email</label>
                  <input
                    id="register-email"
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
                    <span className="text-xs">Minimum 6 characters</span>
                  </div>
                  <div className="relative">
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
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
                <div>
                  <label className="block text-sm font-medium text-secondary mb-3">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      id="role-customer"
                      onClick={() => setForm({ ...form, role: 'customer' })}
                      className={`flex items-center justify-center gap-2 rounded-3xl border px-4 py-3 text-sm font-medium transition ${
                        form.role === 'customer'
                          ? 'border-purple-500 bg-purple-600/20 text-white'
                          : 'border-white/10 bg-slate-950/70 text-slate-300 hover:border-purple-500 hover:bg-slate-900'
                      }`}
                    >
                      <User size={16} /> Customer
                    </button>
                    <button
                      type="button"
                      id="role-driver"
                      onClick={() => setForm({ ...form, role: 'driver' })}
                      className={`flex items-center justify-center gap-2 rounded-3xl border px-4 py-3 text-sm font-medium transition ${
                        form.role === 'driver'
                          ? 'border-purple-500 bg-purple-600/20 text-white'
                          : 'border-white/10 bg-slate-950/70 text-slate-300 hover:border-purple-500 hover:bg-slate-900'
                      }`}
                    >
                      <Truck size={16} /> Driver
                    </button>
                  </div>
                </div>
                {form.role === 'driver' && (
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                    <div className="grid gap-4">
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-300">Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required={form.role === 'driver'}
                          placeholder="+91 98765 43210"
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-300">License number</label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={form.licenseNumber}
                          onChange={handleChange}
                          required={form.role === 'driver'}
                          placeholder="DL-01-2023-123456"
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-300">Years of experience</label>
                        <input
                          type="text"
                          name="experience"
                          value={form.experience}
                          onChange={handleChange}
                          required={form.role === 'driver'}
                          placeholder="5 years"
                          className="input-field"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-sm text-slate-400">Vehicle number</span>
                          <input
                            type="text"
                            name="vehicleNumber"
                            value={form.vehicleNumber}
                            onChange={handleChange}
                            required={form.role === 'driver'}
                            placeholder="MH12AB1234"
                            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm text-slate-400">Vehicle type</span>
                          <select
                            name="vehicleType"
                            value={form.vehicleType}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                          >
                            <option value="5-Seater">5-Seater</option>
                            <option value="Innova Crysta">Innova Crysta</option>
                            <option value="Tempo Traveller">Tempo Traveller</option>
                            <option value="Bike">Bike</option>
                            <option value="Mini">Mini</option>
                          </select>
                        </label>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-sm text-slate-400">Vehicle model</span>
                          <input
                            type="text"
                            name="vehicleModel"
                            value={form.vehicleModel}
                            onChange={handleChange}
                            required={form.role === 'driver'}
                            placeholder="Toyota Innova Crysta"
                            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm text-slate-400">Capacity</span>
                          <input
                            type="number"
                            name="vehicleCapacity"
                            value={form.vehicleCapacity}
                            onChange={handleChange}
                            required={form.role === 'driver'}
                            placeholder="4"
                            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                          />
                        </label>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
                          <span className="text-sm text-slate-400">Your photo</span>
                          <input
                            type="file"
                            name="driverPhoto"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none file:text-slate-300"
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm text-slate-400">Vehicle photo</span>
                          <input
                            type="file"
                            name="vehiclePhoto"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none file:text-slate-300"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-white hover:text-purple-300">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
