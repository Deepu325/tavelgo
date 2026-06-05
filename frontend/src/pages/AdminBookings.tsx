import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const statusOptions = ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'];

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Array<any>>([]);
  const [drivers, setDrivers] = useState<Array<any>>([]);
  const [selectedDriver, setSelectedDriver] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadBookings = async () => {
    try {
      const { data } = await api.get('/admin/bookings');
      setBookings(data);
      const driverSelection: Record<string, string> = {};
      data.forEach((booking: any) => {
        if (booking.driver?._id) {
          driverSelection[booking._id] = booking.driver._id;
        }
      });
      setSelectedDriver(driverSelection);
    } catch (error) {
      console.error('Failed to load bookings');
    }
  };

  const loadDrivers = async () => {
    try {
      const { data } = await api.get('/admin/drivers');
      setDrivers(data.filter((driver: any) => driver.isVerified && !driver.isBlocked));
    } catch (error) {
      console.error('Failed to load drivers');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadBookings(), loadDrivers()]);
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

  const assignDriver = async (bookingId: string, driverId: string) => {
    try {
      await api.patch(`/admin/bookings/${bookingId}/assign`, { driverId });
      await loadBookings();
    } catch (error) {
      console.error('Unable to assign driver');
    }
  };

  return (
    <AdminLayout title="Booking management">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">All bookings</h3>
          <p className="mt-1 text-sm text-slate-400">Review booking details and update ride status.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] divide-y divide-white/10 text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Fare</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    Loading bookings...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="transition hover:bg-white/5">
                    <td className="px-4 py-4 text-white">{booking.customer?.name || 'Unknown'}</td>
                    <td className="px-4 py-4">{booking.driver?.name || 'Unassigned'}</td>
                    <td className="px-4 py-4">{booking.vehicle?.type || 'N/A'}</td>
                    <td className="px-4 py-4">₹{booking.fare ?? 'N/A'}</td>
                    <td className="px-4 py-4 capitalize">{booking.status}</td>
                    <td className="px-4 py-4 space-y-3">
                      <select
                        value={selectedDriver[booking._id] || ''}
                        onChange={(event) => setSelectedDriver({ ...selectedDriver, [booking._id]: event.target.value })}
                        className="mb-2 rounded-3xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-200 outline-none focus:border-purple-500"
                      >
                        <option value="">Select driver</option>
                        {drivers.map((driver) => (
                          <option key={driver._id} value={driver._id}>
                            {driver.name} ({driver.vehicle?.number || driver.email})
                          </option>
                        ))}
                      </select>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => assignDriver(booking._id, selectedDriver[booking._id])}
                          disabled={!selectedDriver[booking._id]}
                          className="rounded-2xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Assign
                        </button>
                        <select
                          value={booking.status}
                          onChange={(event) => updateStatus(booking._id, event.target.value)}
                          className="rounded-3xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-200 outline-none focus:border-purple-500"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status} className="bg-slate-950 text-slate-100">
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
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
