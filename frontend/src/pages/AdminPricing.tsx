import { useEffect, useState } from 'react';
import { Car, CreditCard } from 'lucide-react';
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
      <div className="card p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-text">Vehicle pricing</h3>
          <p className="mt-2 text-secondary">Adjust fares and local package pricing for each vehicle type.</p>
        </div>

        <div className="space-y-8">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-12 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-secondary">Loading pricing data...</span>
              </div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-12 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <CreditCard className="text-slate-600" size={24} />
              </div>
              <p className="text-secondary font-medium">No vehicle pricing entries found.</p>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <div key={vehicle._id} className="rounded-2xl border border-white/10 bg-slate-950/80 p-8 group hover:border-purple-500/30 transition-colors">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
                      <Car className="text-purple-400" size={24} />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-1">Vehicle type</p>
                      <h4 className="text-2xl font-bold text-white">{vehicle.type}</h4>
                    </div>
                  </div>
                  <button
                    onClick={() => saveVehicle(vehicle)}
                    disabled={savingId === vehicle._id}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg bg-purple-600 hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-purple-600"
                  >
                    {savingId === vehicle._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        Save pricing
                      </>
                    )}
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-sm text-slate-400 font-medium">Base fare</span>
                      <div className="mt-2 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          value={vehicle.baseFare}
                          onChange={(event) => updateField(vehicle._id, 'baseFare', event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-8 py-4 text-white outline-none focus:border-purple-500 transition-colors text-lg font-bold"
                          placeholder="0"
                        />
                      </div>
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-sm text-slate-400 font-medium">Per km rate</span>
                      <div className="mt-2 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          value={vehicle.ratePerKm}
                          onChange={(event) => updateField(vehicle._id, 'ratePerKm', event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-8 py-4 text-white outline-none focus:border-purple-500 transition-colors text-lg font-bold"
                          placeholder="0"
                        />
                      </div>
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-sm text-slate-400 font-medium">Local package fare</span>
                      <div className="mt-2 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                        <input
                          type="number"
                          value={vehicle.localPackageFare}
                          onChange={(event) => updateField(vehicle._id, 'localPackageFare', event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-8 py-4 text-white outline-none focus:border-purple-500 transition-colors text-lg font-bold"
                          placeholder="0"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Package Configuration */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-lg font-bold text-white mb-4">Package Configuration</h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <label className="block">
                        <span className="text-sm text-slate-400 font-medium">Time limit (hours)</span>
                        <input
                          type="number"
                          value={vehicle.packageTimeLimit || 8}
                          onChange={(event) => updateField(vehicle._id, 'packageTimeLimit', event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors text-lg font-bold"
                          placeholder="8"
                        />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="block">
                        <span className="text-sm text-slate-400 font-medium">Distance limit (km)</span>
                        <input
                          type="number"
                          value={vehicle.packageDistanceLimit || 80}
                          onChange={(event) => updateField(vehicle._id, 'packageDistanceLimit', event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors text-lg font-bold"
                          placeholder="80"
                        />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="block">
                        <span className="text-sm text-slate-400 font-medium">Extra km rate (₹)</span>
                        <input
                          type="number"
                          value={vehicle.extraKmRate || 12}
                          onChange={(event) => updateField(vehicle._id, 'extraKmRate', event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors text-lg font-bold"
                          placeholder="12"
                        />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="block">
                        <span className="text-sm text-slate-400 font-medium">Extra hour rate (₹)</span>
                        <input
                          type="number"
                          value={vehicle.extraHourRate || 200}
                          onChange={(event) => updateField(vehicle._id, 'extraHourRate', event.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors text-lg font-bold"
                          placeholder="200"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="grid gap-4 md:grid-cols-3 text-center">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sample 5km trip</p>
                      <p className="text-2xl font-black text-green-400">
                        ₹{(vehicle.baseFare + vehicle.ratePerKm * 5).toFixed(0)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Sample 10km trip</p>
                      <p className="text-2xl font-black text-green-400">
                        ₹{(vehicle.baseFare + vehicle.ratePerKm * 10).toFixed(0)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Local package</p>
                      <p className="text-2xl font-black text-green-400">
                        ₹{vehicle.localPackageFare}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {(vehicle.packageTimeLimit || 8)}h / {(vehicle.packageDistanceLimit || 80)}km
                      </p>
                    </div>
                  </div>
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
