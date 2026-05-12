import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const AdminPricing = () => {
  const [vehicles, setVehicles] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadVehicles = async () => {
    try {
      const { data } = await api.get('/admin/vehicles');
      setVehicles(data);
    } catch (error) {
      console.error('Failed to load vehicles');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadVehicles();
      setLoading(false);
    };
    fetchData();
  }, []);

  const updateField = (id: string, field: string, value: string) => {
    setVehicles((current) =>
      current.map((vehicle) =>
        vehicle._id === id ? { ...vehicle, [field]: value } : vehicle
      )
    );
  };

  const saveVehicle = async (vehicle: any) => {
    setSavingId(vehicle._id);
    try {
      await api.patch(`/admin/vehicles/${vehicle._id}`, {
        baseFare: Number(vehicle.baseFare),
        ratePerKm: Number(vehicle.ratePerKm),
        localPackageFare: Number(vehicle.localPackageFare),
      });
      await loadVehicles();
    } catch (error) {
      console.error('Failed to update vehicle pricing');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminLayout title="Pricing management">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">Vehicle pricing</h3>
          <p className="mt-1 text-sm text-slate-400">Adjust fares and local package pricing for each vehicle type.</p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center text-slate-400">
              Loading pricing data...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center text-slate-400">
              No vehicle pricing entries found.
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle._id} className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Vehicle type</p>
                    <h4 className="mt-2 text-xl font-semibold text-white">{vehicle.type}</h4>
                  </div>
                  <button
                    onClick={() => saveVehicle(vehicle)}
                    disabled={savingId === vehicle._id}
                    className="rounded-2xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingId === vehicle._id ? 'Saving...' : 'Save pricing'}
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block">
                    <span className="text-sm text-slate-400">Base fare</span>
                    <input
                      type="number"
                      value={vehicle.baseFare}
                      onChange={(event) => updateField(vehicle._id, 'baseFare', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-400">Per km rate</span>
                    <input
                      type="number"
                      value={vehicle.ratePerKm}
                      onChange={(event) => updateField(vehicle._id, 'ratePerKm', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-400">Local package fare</span>
                    <input
                      type="number"
                      value={vehicle.localPackageFare}
                      onChange={(event) => updateField(vehicle._id, 'localPackageFare', event.target.value)}
                      className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                    />
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPricing;
