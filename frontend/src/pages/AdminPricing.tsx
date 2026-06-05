import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const AdminPricing = () => {
  const [vehicles, setVehicles] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: '5-Seater',
    baseFare: '',
    ratePerKm: '',
    localPackageFare: '',
    capacity: '',
    description: '',
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

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

  const handleNewVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
    setCreateError('');
  };

  const createVehicle = async () => {
    setCreating(true);
    setCreateError('');
    try {
      await api.post('/admin/vehicles', {
        ...newVehicle,
        baseFare: Number(newVehicle.baseFare),
        ratePerKm: Number(newVehicle.ratePerKm),
        localPackageFare: Number(newVehicle.localPackageFare || 0),
        capacity: Number(newVehicle.capacity),
      });
      setNewVehicle({
        name: '',
        type: '5-Seater',
        baseFare: '',
        ratePerKm: '',
        localPackageFare: '',
        capacity: '',
        description: '',
      });
      await loadVehicles();
    } catch (error: any) {
      setCreateError(error.response?.data?.message || 'Failed to add new vehicle.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout title="Pricing management">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">Vehicle pricing</h3>
          <p className="mt-1 text-sm text-slate-400">Adjust fares and local package pricing for each vehicle type.</p>
        </div>
        <div className="mb-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Add new vehicle</p>
              <h4 className="mt-2 text-lg font-semibold text-white">Add a new pricing entry</h4>
            </div>
            <button
              onClick={createVehicle}
              disabled={creating}
              className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Adding...' : 'Add vehicle'}
            </button>
          </div>
          {createError && (
            <div className="rounded-3xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
              {createError}
            </div>
          )}
          <div className="grid gap-4 lg:grid-cols-3">
            <label className="block">
              <span className="text-sm text-slate-400">Vehicle name</span>
              <input
                name="name"
                value={newVehicle.name}
                onChange={handleNewVehicleChange}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                placeholder="City Sedan"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-400">Vehicle type</span>
              <select
                name="type"
                value={newVehicle.type}
                onChange={handleNewVehicleChange}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
              >
                <option value="5-Seater">5-Seater</option>
                <option value="Innova Crysta">Innova Crysta</option>
                <option value="Tempo Traveller">Tempo Traveller</option>
                <option value="Mini">Mini</option>
                <option value="Bike">Bike</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm text-slate-400">Capacity</span>
              <input
                name="capacity"
                type="number"
                value={newVehicle.capacity}
                onChange={handleNewVehicleChange}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                placeholder="4"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-400">Base fare</span>
              <input
                name="baseFare"
                type="number"
                value={newVehicle.baseFare}
                onChange={handleNewVehicleChange}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                placeholder="200"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-400">Per km rate</span>
              <input
                name="ratePerKm"
                type="number"
                value={newVehicle.ratePerKm}
                onChange={handleNewVehicleChange}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                placeholder="15"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-400">Local package fare</span>
              <input
                name="localPackageFare"
                type="number"
                value={newVehicle.localPackageFare}
                onChange={handleNewVehicleChange}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                placeholder="1200"
              />
            </label>
            <label className="block lg:col-span-3">
              <span className="text-sm text-slate-400">Description</span>
              <input
                name="description"
                value={newVehicle.description}
                onChange={handleNewVehicleChange}
                className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-purple-500"
                placeholder="Add a short description for this vehicle"
              />
            </label>
          </div>
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
