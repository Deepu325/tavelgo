import { useEffect, useState } from 'react';
import { Eye, Users, Truck, CreditCard, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const [summary, setSummary] = useState<{
    totalUsers: number;
    totalDrivers: number;
    totalBookings: number;
    pendingRides: number;
    totalRevenue: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const { data } = await api.get('/admin/summary');
        setSummary(data);
      } catch (error) {
        console.error('Failed to load admin summary', error);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card p-8 group hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <Users className="text-blue-400" size={24} />
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
              Total
            </span>
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-2">Total users</p>
          <h3 className="text-4xl font-bold text-text mb-2">{loading ? '...' : summary?.totalUsers}</h3>
          <p className="text-secondary text-sm">Customers and admins combined.</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-blue-500/20 to-blue-500/40 rounded-full" />
        </div>
        <div className="card p-8 group hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20">
              <Truck className="text-green-400" size={24} />
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
              Active
            </span>
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-2">Total drivers</p>
          <h3 className="text-4xl font-bold text-text mb-2">{loading ? '...' : summary?.totalDrivers}</h3>
          <p className="text-secondary text-sm">Verified drivers currently in system.</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-green-500/20 to-green-500/40 rounded-full" />
        </div>
        <div className="card p-8 group hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <CreditCard className="text-purple-400" size={24} />
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full uppercase tracking-wider">
              Revenue
            </span>
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-2">Revenue</p>
          <h3 className="text-4xl font-bold text-text mb-2">₹{loading ? '...' : summary?.totalRevenue}</h3>
          <p className="text-secondary text-sm">Completed ride revenue.</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-purple-500/20 to-purple-500/40 rounded-full" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="card p-8 group hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-2">Bookings</p>
              <h3 className="text-3xl font-bold text-text">{loading ? '...' : summary?.totalBookings}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20">
              <ClipboardList className="text-slate-400" size={28} />
            </div>
          </div>
          <p className="text-secondary text-sm mb-6">Manage bookings, cancel rides, and review booking history.</p>
          <Link to="/admin/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group">
            Manage bookings
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="card p-8 group hover:scale-[1.01] transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-secondary mb-2">Pending rides</p>
              <h3 className="text-3xl font-bold text-text">{loading ? '...' : summary?.pendingRides}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
              <Eye className="text-yellow-400" size={28} />
            </div>
          </div>
          <p className="text-secondary text-sm mb-6">Review active pending rides and driver assignments.</p>
          <Link to="/admin/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group">
            View bookings
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <Link
          to="/admin/users"
          className="card p-8 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-secondary">
              <Users size={20} />
              <span className="font-medium">User management</span>
            </div>
            <span className="transform group-hover:translate-x-1 transition-transform text-primary">→</span>
          </div>
          <p className="text-secondary text-sm">Review users and block or unblock suspicious accounts.</p>
        </Link>
        <Link
          to="/admin/drivers"
          className="card p-8 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-secondary">
              <Truck size={20} />
              <span className="font-medium">Driver management</span>
            </div>
            <span className="transform group-hover:translate-x-1 transition-transform text-primary">→</span>
          </div>
          <p className="text-secondary text-sm">Approve drivers and monitor availability.</p>
        </Link>
        <Link
          to="/admin/pricing"
          className="card p-8 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-secondary">
              <CreditCard size={20} />
              <span className="font-medium">Pricing control</span>
            </div>
            <span className="transform group-hover:translate-x-1 transition-transform text-primary">→</span>
          </div>
          <p className="text-secondary text-sm">Update base fares and per-km pricing for each vehicle.</p>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
