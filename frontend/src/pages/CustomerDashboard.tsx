import { Link, useNavigate } from 'react-router-dom';
import { Car, MapPin, Clock, CreditCard, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const CustomerDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
              <Car size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">CabBook</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <User size={16} />
              <span className="text-sm">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white">
            Welcome back, <span className="text-purple-400">{user?.name?.split(' ')[0]}</span> 👋
          </h2>
          <p className="text-slate-400 mt-1">Where would you like to go today?</p>
        </div>

        {/* Quick Action Card — Book a Ride */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Car size={20} className="text-purple-400" /> Book a Ride
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Pickup Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                <input
                  id="pickup-input"
                  type="text"
                  placeholder="Enter pickup point"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-lg pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Drop Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                <input
                  id="drop-input"
                  type="text"
                  placeholder="Enter destination"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-500 rounded-lg pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
              </div>
            </div>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center text-slate-300 text-sm">
            🚧 Fare estimation & vehicle selection coming in Phase 2
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Car, label: 'Total Rides', value: '—', color: 'text-purple-400' },
            { icon: Clock, label: 'Pending', value: '—', color: 'text-yellow-400' },
            { icon: CreditCard, label: 'Total Spent', value: '—', color: 'text-green-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <Icon size={24} className={`${color} mb-3`} />
              <p className="text-slate-400 text-sm">{label}</p>
              <p className="text-white text-2xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
