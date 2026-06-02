import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const statusOptions = ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'];

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const { data } = await api.get('/admin/bookings');
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadBookings();
      setLoading(false);
    };
    fetchData();
  }, []);

  const updateStatus = async (bookingId: string, status: string) => {
    try {
      await api.patch(`/admin/bookings/${bookingId}/status`, { status });
      loadBookings();
    } catch (error) {
      console.error('Unable to update booking status');
    }
  };

  return (
    <AdminLayout title="Booking management">
      <div className="card p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-text">All bookings</h3>
            <p className="mt-2 text-secondary">Review booking details and update ride status.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                {bookings.filter(b => b.status === 'pending').length} Pending
              </span>
            </div>
            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {bookings.filter(b => b.status === 'accepted').length} Active
              </span>
            </div>
            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                {bookings.filter(b => b.status === 'completed').length} Completed
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] divide-y divide-white/10 text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Driver</th>
                <th className="px-6 py-4 font-semibold">Vehicle</th>
                <th className="px-6 py-4 font-semibold">Fare</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-secondary">Loading bookings...</span>
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                      <ClipboardList className="text-slate-600" size={24} />
                    </div>
                    <p className="text-secondary font-medium">No bookings found.</p>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="transition hover:bg-white/5 group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-white/10">
                          <span className="text-white font-bold text-sm">
                            {booking.customer?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{booking.customer?.name || 'Unknown'}</p>
                          <p className="text-slate-500 text-xs">ID: {booking._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                          <span className="text-white font-bold text-sm">
                            {booking.driver?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{booking.driver?.name || 'Unassigned'}</p>
                          <p className="text-slate-500 text-xs">{booking.driver ? 'Assigned' : 'Pending'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-500/20 text-slate-400 border border-slate-500/30">
                        {booking.vehicle?.type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-white font-bold text-lg">₹{booking.fare ?? 'N/A'}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : booking.status === 'accepted'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : booking.status === 'ongoing'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : booking.status === 'completed'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={booking.status}
                        onChange={(event) => updateStatus(booking._id, event.target.value)}
                        className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-slate-200 outline-none focus:border-purple-500 transition-colors"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status} className="bg-slate-950 text-slate-100">
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
