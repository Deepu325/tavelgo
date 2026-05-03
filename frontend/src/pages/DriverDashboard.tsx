import { useNavigate } from 'react-router-dom';
import { Car, CheckCircle, XCircle, Clock, LogOut, User, ToggleLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DriverDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Car size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">CabBook <span className="text-blue-400 text-sm font-normal">Driver</span></span>
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
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white">
            Driver Console, <span className="text-blue-400">{user?.name?.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-400 mt-1">Manage your rides and availability.</p>
        </div>

        {/* Availability toggle placeholder */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8 shadow-xl flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Availability Status</h3>
            <p className="text-slate-400 text-sm mt-1">Toggle to go online or offline</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition">
            <ToggleLeft size={20} /> Go Online
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: CheckCircle, label: 'Completed Rides', value: '—', color: 'text-green-400' },
            { icon: Clock, label: 'Pending Requests', value: '—', color: 'text-yellow-400' },
            { icon: XCircle, label: 'Rejected', value: '—', color: 'text-red-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <Icon size={24} className={`${color} mb-3`} />
              <p className="text-slate-400 text-sm">{label}</p>
              <p className="text-white text-2xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Ride requests placeholder */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
          <Car size={40} className="text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300 font-medium">No pending ride requests</p>
          <p className="text-slate-500 text-sm mt-1">🚧 Real-time dispatch coming in Phase 3</p>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
