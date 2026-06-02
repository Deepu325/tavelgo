import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
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
      <div className="card p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-text">Driver accounts</h3>
            <p className="mt-2 text-secondary">Approve or reject drivers, and remove invalid accounts.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                {drivers.filter(d => d.isVerified).length} Verified
              </span>
            </div>
            <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                {drivers.filter(d => !d.isVerified).length} Pending
              </span>
            </div>
            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {drivers.filter(d => d.isOnline).length} Online
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] divide-y divide-white/10 text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Driver</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Availability</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-secondary">Loading drivers...</span>
                    </div>
                  </td>
                </tr>
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                      <Truck className="text-slate-600" size={24} />
                    </div>
                    <p className="text-secondary font-medium">No drivers found.</p>
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver._id} className="transition hover:bg-white/5 group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                          <span className="text-white font-bold text-sm">
                            {driver.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{driver.name}</p>
                          <p className="text-slate-500 text-xs">ID: {driver._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-white">{driver.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        driver.isVerified 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {driver.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          driver.isOnline 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                        }`}>
                          {driver.isOnline ? 'Online' : 'Offline'}
                        </span>
                        {driver.isBusy && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            Busy
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {!driver.isVerified && (
                          <button
                            onClick={() => handleAction(driver._id, 'approve')}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(driver._id, 'reject')}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(driver._id, 'delete')}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
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

export default AdminDrivers;
