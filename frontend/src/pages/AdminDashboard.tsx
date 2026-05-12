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
        console.error('Failed to load admin summary');
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="card p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Total users</p>
          <h3 className="mt-4 text-4xl font-bold text-text">{loading ? '...' : summary?.totalUsers}</h3>
          <p className="mt-2 text-secondary">Customers and admins combined.</p>
        </div>
        <div className="card p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Total drivers</p>
          <h3 className="mt-4 text-4xl font-bold text-text">{loading ? '...' : summary?.totalDrivers}</h3>
          <p className="mt-2 text-secondary">Verified drivers currently in system.</p>
        </div>
        <div className="card p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">Revenue</p>
          <h3 className="mt-4 text-4xl font-bold text-text">₹{loading ? '...' : summary?.totalRevenue}</h3>
          <p className="mt-2 text-secondary">Completed ride revenue.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="card p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-secondary">Bookings</p>
              <h3 className="mt-3 text-3xl font-bold text-text">{loading ? '...' : summary?.totalBookings}</h3>
            </div>
            <ClipboardList className="text-primary" size={28} />
          </div>
          <p className="mt-4 text-secondary">Manage bookings, cancel rides, and review booking history.</p>
          <Link to="/admin/bookings" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
            Manage bookings
          </Link>
        </div>
        <div className="card p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-secondary">Pending rides</p>
              <h3 className="mt-3 text-3xl font-bold text-text">{loading ? '...' : summary?.pendingRides}</h3>
            </div>
            <Eye className="text-primary" size={28} />
          </div>
          <p className="mt-4 text-secondary">Review active pending rides and driver assignments.</p>
          <Link to="/admin/bookings" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
            View bookings
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <Link
          to="/admin/users"
          className="card p-8 hover:shadow-soft transition"
        >
          <div className="flex items-center gap-3 text-secondary">
            <Users size={20} /> User management
          </div>
          <p className="mt-4 text-secondary">Review users and block or unblock suspicious accounts.</p>
        </Link>
        <Link
          to="/admin/drivers"
          className="card p-8 hover:shadow-soft transition"
        >
          <div className="flex items-center gap-3 text-secondary">
            <Truck size={20} /> Driver management
          </div>
          <p className="mt-4 text-secondary">Approve drivers and monitor availability.</p>
        </Link>
        <Link
          to="/admin/pricing"
          className="card p-8 hover:shadow-soft transition"
        >
          <div className="flex items-center gap-3 text-secondary">
            <CreditCard size={20} /> Pricing control
          </div>
          <p className="mt-4 text-secondary">Update base fares and per-km pricing for each vehicle.</p>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
