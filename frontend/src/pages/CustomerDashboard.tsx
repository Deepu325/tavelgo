import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Clock, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { socketService } from '../services/socketService';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import MapComponent from '../components/MapComponent';

const libraries: ("places")[] = ['places'];

interface Estimate {
  vehicleId: string;
  name: string;
  type: string;
  capacity: number;
  description: string;
  distance: number;
  fare: number;
}

const CustomerDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [pickupRef, setPickupRef] = useState<google.maps.places.Autocomplete | null>(null);
  const [destinationRef, setDestinationRef] = useState<google.maps.places.Autocomplete | null>(null);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const onPickupPlaceChanged = () => {
    if (pickupRef !== null) {
      const place = pickupRef.getPlace();
      setPickup(place.formatted_address || place.name || '');
      if (place.geometry?.location) {
        setPickupCoords({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  const onDestinationPlaceChanged = () => {
    if (destinationRef !== null) {
      const place = destinationRef.getPlace();
      setDestination(place.formatted_address || place.name || '');
    }
  };

  useEffect(() => {
    if (user?.id) {
      socketService.connect(user.id);
      socketService.on('ride-accepted', () => {
        fetchActiveRide();
      });

      socketService.on('ride-status-updated', (data) => {
        if (data.status === 'completed' || data.status === 'cancelled') {
          setActiveRide(null);
        } else {
          fetchActiveRide();
        }
      });
    }

    fetchActiveRide();

    return () => {
      socketService.off('ride-accepted');
      socketService.off('ride-status-updated');
    };
  }, [user?.id]);

  const fetchActiveRide = async () => {
    try {
      const { data } = await api.get('/bookings/active');
      setActiveRide(data);
    } catch (err) {
      console.error('Failed to fetch active ride');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getEstimates = async () => {
    if (!pickup || !destination) return;
    setLoading(true);
    setEstimates([]);
    setSelectedEstimate(null);
    try {
      const { data } = await api.post('/bookings/estimate', { pickup, destination });
      setEstimates(data.estimates);
    } catch (err) {
      alert('Failed to get estimates');
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async () => {
    if (!selectedEstimate) return;
    setBookingLoading(true);
    try {
      const { data } = await api.post('/bookings', {
        pickupLocation: pickup,
        destination,
        vehicleType: selectedEstimate.type,
        fare: selectedEstimate.fare,
        distance: selectedEstimate.distance,
        pickupCoordinates: pickupCoords,
      });
      setActiveRide(data.ride);
      setEstimates([]);
      setPickup('');
      setDestination('');
      setBookingMessage(
        data.notifiedDrivers === 0
          ? 'Booking created, but no nearby drivers are currently available. We will notify you when one becomes available.'
          : 'Booking created successfully. Drivers have been notified.'
      );
    } catch (err) {
      alert('Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const cancelRide = async () => {
    if (!activeRide) return;
    try {
      await api.patch(`/bookings/${activeRide._id}/status`, { status: 'cancelled' });
      setActiveRide(null);
      setBookingMessage('Your booking was cancelled.');
    } catch (err) {
      alert('Failed to cancel ride');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center">
              <Car size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">CabBook</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <User size={16} />
              <span className="text-sm">{user?.name}</span>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 text-slate-300 hover:text-white text-sm transition"
            >
              <Clock size={16} /> History
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {!activeRide && (
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-purple-400">{user?.name?.split(' ')[0]}</span> 👋
            </h2>
            <p className="text-slate-400 mt-1">Where would you like to go today?</p>
          </div>
        )}

        {activeRide && (
          <div className="bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                activeRide.status === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : activeRide.status === 'accepted'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {activeRide.status}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6">Current Trip</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 lg:h-full min-h-[300px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-inner relative">
                <MapComponent pickup={activeRide.pickupLocation.address} destination={activeRide.destination.address} />
              </div>
              <div className="space-y-8">
                <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-4">Ride details</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-400 text-sm">Pickup</p>
                      <p className="text-white font-semibold">{activeRide.pickupLocation.address}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Destination</p>
                      <p className="text-white font-semibold">{activeRide.destination.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="rounded-3xl bg-slate-900/70 p-4 text-center">
                        <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Distance</p>
                        <p className="text-white text-xl font-bold mt-2">{activeRide.distance} km</p>
                      </div>
                      <div className="rounded-3xl bg-slate-900/70 p-4 text-center">
                        <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Fare</p>
                        <p className="text-white text-xl font-bold mt-2">₹{activeRide.fare}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl bg-slate-950/70 border border-white/10 p-6">
                  <p className="text-slate-400 text-sm uppercase tracking-[0.18em] mb-4">Driver partner</p>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-3xl bg-purple-600/20 flex items-center justify-center text-purple-300">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{activeRide.driver?.name || 'Assigned Driver'}</p>
                      <p className="text-slate-400 text-sm">{activeRide.driver?.vehicle || 'Vehicle details pending'}</p>
                    </div>
                  </div>
                  <button
                    onClick={cancelRide}
                    className="mt-8 w-full rounded-3xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/15 transition"
                  >
                    Cancel trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl bg-white/5 border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Quick Ride</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Estimate your fare</h2>
                <p className="mt-2 text-slate-400">Enter pickup and destination to compare vehicle options.</p>
              </div>
              <button
                onClick={() => navigate('/history')}
                className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-purple-500/50 hover:bg-slate-900"
              >
                <Clock size={16} /> View history
              </button>
            </div>

            <div className="mt-8 grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Pickup location</label>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3">
                    {isLoaded ? (
                      <Autocomplete onLoad={(ref) => setPickupRef(ref)} onPlaceChanged={onPickupPlaceChanged}>
                        <input
                          type="text"
                          name="pickup"
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          placeholder="Enter pickup point"
                          className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        type="text"
                        name="pickup"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="Loading map…"
                        className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
                        disabled
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Destination</label>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3">
                    {isLoaded ? (
                      <Autocomplete onLoad={(ref) => setDestinationRef(ref)} onPlaceChanged={onDestinationPlaceChanged}>
                        <input
                          type="text"
                          name="destination"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="Enter dropoff point"
                          className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        type="text"
                        name="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Loading map…"
                        className="w-full bg-transparent text-white placeholder:text-slate-500 outline-none"
                        disabled
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row items-stretch">
                <button
                  onClick={getEstimates}
                  disabled={loading || !pickup || !destination}
                  className="flex-1 rounded-3xl bg-purple-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Searching options…' : 'Compare rides'}
                </button>
                <button
                  onClick={bookRide}
                  disabled={bookingLoading || !selectedEstimate}
                  className="flex-1 rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-sm font-semibold text-white transition hover:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bookingLoading ? 'Booking…' : selectedEstimate ? `Book ${selectedEstimate.type}` : 'Select a ride'}
                </button>
              </div>
              {bookingMessage && (
                <p className="mt-3 text-sm text-emerald-300">{bookingMessage}</p>
              )}

              {estimates.length > 0 && (
                <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-5 space-y-4">
                  <p className="text-sm font-semibold text-slate-300">Available ride options</p>
                  <div className="grid gap-3">
                    {estimates.map((estimate) => (
                      <button
                        key={estimate.vehicleId}
                        onClick={() => setSelectedEstimate(estimate)}
                        className={`w-full rounded-3xl border p-5 text-left transition ${
                          selectedEstimate?.vehicleId === estimate.vehicleId
                            ? 'border-purple-500/60 bg-purple-500/10'
                            : 'border-white/10 bg-slate-950/70 hover:border-purple-500/30 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-white font-semibold">{estimate.name}</p>
                            <p className="text-slate-400 text-sm">{estimate.type} • {estimate.capacity} seats</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">₹{estimate.fare}</p>
                            <p className="text-slate-500 text-xs">{estimate.distance} km</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-3xl bg-white/5 border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Ride snapshot</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Route preview</h3>
              </div>
              <span className="inline-flex rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
                Live map
              </span>
            </div>

            <div className="mt-8 h-[420px] rounded-3xl border border-white/10 overflow-hidden bg-slate-950/70">
              <MapComponent pickup={pickup || 'Bangalore'} destination={destination || 'Bengaluru'} />
            </div>

            <div className="mt-6 grid gap-4 text-sm text-slate-400">
              <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
                <p className="font-semibold text-slate-200">Travel insights</p>
                <p className="mt-2">Estimated fares are based on current demand and available drivers.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 border border-white/10 p-4">
                <p className="font-semibold text-slate-200">Flexible pickup</p>
                <p className="mt-2">You can update pickup location before booking if plans change.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
