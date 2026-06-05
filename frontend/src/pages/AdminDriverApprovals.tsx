import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Truck, Users } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const AdminDriverApprovals = () => {
  const [drivers, setDrivers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadPendingDrivers = async () => {
    try {
      const { data } = await api.get('/admin/drivers');
      setDrivers(data.filter((driver: any) => !driver.isVerified));
    } catch (error) {
      console.error('Failed to load drivers');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadPendingDrivers();
      setLoading(false);
    };
    fetchData();
  }, []);

  const approveDriver = async (driverId: string) => {
    setActioningId(driverId);
    try {
      await api.patch(`/admin/drivers/${driverId}/approve`);
      await loadPendingDrivers();
    } catch (error) {
      console.error('Failed to approve driver');
    } finally {
      setActioningId(null);
    }
  };

  const rejectDriver = async (driverId: string) => {
    setActioningId(driverId);
    try {
      await api.patch(`/admin/drivers/${driverId}/reject`);
      await loadPendingDrivers();
    } catch (error) {
      console.error('Failed to reject driver');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <AdminLayout title="Driver approvals">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">Pending driver registrations</h3>
          <p className="mt-1 text-sm text-slate-400">Review new driver applications and approve or reject based on document verification.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center text-slate-400">
            Loading drivers...
          </div>
        ) : drivers.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center">
            <Users size={32} className="mx-auto mb-4 text-slate-500" />
            <p className="text-slate-400">No pending driver registrations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drivers.map((driver) => (
              <div key={driver._id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Driver Info */}
                  <div>
                    <div className="mb-4">
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Driver information</p>
                      <h4 className="mt-2 text-lg font-semibold text-white">{driver.name}</h4>
                    </div>
                    <div className="space-y-3 text-sm text-slate-300">
                      <div>
                        <p className="text-slate-500">Email</p>
                        <p>{driver.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Phone</p>
                        <p>{driver.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">License number</p>
                        <p>{driver.licenseNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Experience</p>
                        <p>{driver.experience || 'N/A'}</p>
                      </div>
                      {driver.driverPhoto && (
                        <div>
                          <p className="text-slate-500 mb-2">Photo</p>
                          <img
                            src={driver.driverPhoto}
                            alt="Driver"
                            className="h-32 w-32 rounded-2xl object-cover border border-white/10"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div>
                    <div className="mb-4">
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Vehicle information</p>
                      <h4 className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                        <Truck size={20} />
                        {driver.vehicle?.type || 'N/A'}
                      </h4>
                    </div>
                    <div className="space-y-3 text-sm text-slate-300">
                      <div>
                        <p className="text-slate-500">Vehicle number</p>
                        <p className="font-mono text-base text-emerald-400">{driver.vehicle?.number || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Model</p>
                        <p>{driver.vehicle?.model || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Capacity</p>
                        <p>{driver.vehicle?.capacity || 'N/A'} seats</p>
                      </div>
                      {driver.vehicle?.photo && (
                        <div>
                          <p className="text-slate-500 mb-2">Vehicle photo</p>
                          <img
                            src={driver.vehicle.photo}
                            alt="Vehicle"
                            className="h-32 w-full rounded-2xl object-cover border border-white/10"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row">
                  <button
                    onClick={() => approveDriver(driver._id)}
                    disabled={actioningId === driver._id}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 size={18} />
                    {actioningId === driver._id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => rejectDriver(driver._id)}
                    disabled={actioningId === driver._id}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <XCircle size={18} />
                    {actioningId === driver._id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDriverApprovals;
