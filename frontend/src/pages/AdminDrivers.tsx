import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = async () => {
    try {
      const { data } = await api.get('/admin/drivers');
      setDrivers(data);
    } catch (error) {
      console.error('Unable to load drivers');
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchDrivers();
      setLoading(false);
    };
    load();
  }, []);

  const handleAction = async (driverId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      if (action === 'delete') {
        await api.delete(`/admin/drivers/${driverId}`);
      } else {
        await api.patch(`/admin/drivers/${driverId}/${action}`);
      }
      fetchDrivers();
    } catch (error) {
      console.error('Driver action failed');
    }
  };

  return (
    <AdminLayout title="Driver management">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">Driver accounts</h3>
            <p className="mt-1 text-sm text-slate-400">Approve or reject drivers, and remove invalid accounts.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] divide-y divide-white/10 text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Online</th>
                <th className="px-4 py-3">Busy</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    Loading drivers...
                  </td>
                </tr>
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    No drivers found.
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver._id} className="transition hover:bg-white/5">
                    <td className="px-4 py-4 text-white">{driver.name}</td>
                    <td className="px-4 py-4">{driver.email}</td>
                    <td className="px-4 py-4">{driver.isVerified ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4">{driver.isOnline ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4">{driver.isBusy ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4 space-x-2">
                      {!driver.isVerified && (
                        <button
                          onClick={() => handleAction(driver._id, 'approve')}
                          className="rounded-2xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300 hover:bg-emerald-500/15"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleAction(driver._id, 'reject')}
                        className="rounded-2xl bg-yellow-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-300 hover:bg-yellow-500/15"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction(driver._id, 'delete')}
                        className="rounded-2xl bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-300 hover:bg-red-500/15"
                      >
                        Delete
                      </button>
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

export default AdminDrivers;
