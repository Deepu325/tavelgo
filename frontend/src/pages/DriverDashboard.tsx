import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Clock, LogOut, User, Phone, Loader2, CheckCircle2, Navigation as NavigationIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { socketService } from '../services/socketService';
import { startDriverLocation, stopDriverLocation } from '../services/driverLocationService';

const DriverDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(true);
  const [watcherActive, setWatcherActive] = useState(false);
  const [pendingRides, setPendingRides] = useState<any[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [locationLogs, setLocationLogs] = useState<Array<{lat:number;lng:number;timestamp:number}>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      socketService.connect(user.id);
      
      socketService.on('new-ride-available', (ride) => {
        console.log('New ride available:', ride);
        setPendingRides(prev => [ride, ...prev]);
      });

      socketService.on('ride-status-updated', (data) => {
        if (data.status === 'cancelled') {
          setActiveRide(null);
          fetchData();
        }
      });
    }

    fetchData();

    return () => {
      socketService.off('new-ride-available');
      socketService.off('ride-status-updated');
    };
  }, [user?.id, isOnline]);

  // start/stop real geolocation watcher
  useEffect(() => {
    if (!user?.id) return;

    if (isOnline) {
      // auto-start watcher and collect updates for UI
      startDriverLocation(user.id, {}, (coords) => {
        setWatcherActive(true);
        setLocationLogs((l) => [ { ...coords }, ...l ].slice(0, 50));
      });
      setWatcherActive(true);
    } else {
      stopDriverLocation();
      setWatcherActive(false);
    }

    return () => {
      stopDriverLocation();
      setWatcherActive(false);
    };
  }, [user?.id, isOnline]);

  const handleManualStart = () => {
    if (!user?.id) return;
    startDriverLocation(user.id, {}, (coords) => {
      setWatcherActive(true);
      setLocationLogs((l) => [ { ...coords }, ...l ].slice(0, 50));
    });
    setWatcherActive(true);
  };

  const handleManualStop = () => {
    stopDriverLocation();
    setWatcherActive(false);
  };

  const fetchData = async () => {
    if (!isOnline) return;
    try {
      // Get active ride if any
      const activeRes = await api.get('/bookings/active');
      setActiveRide(activeRes.data);

      // Get pending rides if no active ride
      if (!activeRes.data) {
        const pendingRes = await api.get('/bookings/pending');
        setPendingRides(pendingRes.data);
      } else {
        setPendingRides([]);
      }
    } catch (err) {
      console.error('Failed to fetch data');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const acceptRide = async (rideId: string) => {
    setLoading(true);
    try {
      const { data } = await api.patch(`/bookings/${rideId}/accept`);
      setActiveRide(data.ride);
      setPendingRides([]);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to accept ride');
      fetchData();
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    if (!activeRide) return;
    setLoading(true);
    try {
      const { data } = await api.patch(`/bookings/${activeRide._id}/status`, { status });
      if (status === 'completed' || status === 'cancelled') {
        setActiveRide(null);
      } else {
        setActiveRide(data.ride);
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Car size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">CabBook <span className="text-blue-400 text-sm font-normal">Driver</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-300">
              <User size={16} />
              <span className="text-sm">{user?.name}</span>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 text-slate-300 hover:text-white text-sm transition-colors p-2 rounded-lg hover:bg-white/5"
            >
              <Clock size={16} /> History
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors p-2 rounded-lg hover:bg-white/5"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">
              Driver Console, <span className="text-blue-400">{user?.name?.split(' ')[0]}</span>
            </h2>
            <p className="text-secondary text-lg">Manage your rides and availability.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
              isOnline 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                : 'bg-slate-500/10 border border-slate-500/20 text-slate-400'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <div className="px-3 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white/3 border border-white/6 text-white">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${watcherActive ? 'bg-green-400' : 'bg-red-400'}`} />
                <span>{watcherActive ? 'Watcher Active' : 'Watcher Stopped'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleManualStart}
                disabled={watcherActive || !isOnline}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm disabled:opacity-50"
              >
                Start Watcher
              </button>
              <button
                onClick={handleManualStop}
                disabled={!watcherActive}
                className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm disabled:opacity-50"
              >
                Stop Watcher
              </button>
            </div>
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                isOnline 
                  ? 'bg-red-600 hover:bg-red-500 text-white' 
                  : 'bg-green-600 hover:bg-green-500 text-white'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-white'}`} />
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        {activeRide && (
          <div className="card p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className={`inline-flex px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                activeRide.status === 'accepted'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : activeRide.status === 'ongoing'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {activeRide.status}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <NavigationIcon size={24} className="text-blue-400" /> Current Assignment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-4 h-4 rounded-full border-2 border-green-400 bg-green-400/20" />
                    <div className="w-0.5 h-16 bg-white/10" />
                    <div className="w-4 h-4 rounded-full border-2 border-red-400 bg-red-400/20" />
                  </div>
                  <div className="space-y-6 flex-1">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-black tracking-wider mb-1">Pickup From</p>
                      <p className="text-white text-lg font-bold">{activeRide.pickupLocation.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-black tracking-wider mb-1">Drop To</p>
                      <p className="text-white text-lg font-bold">{activeRide.destination.address}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                      <User className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase">Customer</p>
                      <p className="text-white font-bold">{activeRide.customer.name}</p>
                    </div>
                  </div>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors">
                    <Phone size={16} />
                    <span className="font-medium">Call Customer</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="card p-6 text-center">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Earnings</p>
                    <p className="text-green-400 text-3xl font-black">
                      ₹{activeRide.finalFare || activeRide.fare}
                    </p>
                    {activeRide.isPackageBooking && activeRide.finalFare && activeRide.finalFare > activeRide.fare && (
                      <div className="text-xs text-slate-500 mt-2 space-y-1">
                        <p>Base: ₹{activeRide.fare}</p>
                        {activeRide.extraKmCharge > 0 && <p>Extra km: ₹{activeRide.extraKmCharge}</p>}
                        {activeRide.extraTimeCharge > 0 && <p>Extra time: ₹{activeRide.extraTimeCharge}</p>}
                      </div>
                    )}
                  </div>
                  <div className="card p-6 text-center">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Distance</p>
                    <p className="text-white text-3xl font-black">
                      {activeRide.actualDistance || activeRide.distance} km
                    </p>
                    {activeRide.isPackageBooking && activeRide.actualDistance && (
                      <p className="text-xs text-slate-500 mt-1">
                        Limit: {activeRide.packageDetails?.distanceLimit} km
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {activeRide.status === 'accepted' && (
                    <button 
                      onClick={() => updateStatus('ongoing')}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <NavigationIcon size={20} />}
                      Start Trip
                    </button>
                  )}
                  {activeRide.status === 'ongoing' && (
                    <button 
                      onClick={() => updateStatus('completed')}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                      Mark Completed
                    </button>
                  )}
                  <button 
                    onClick={() => updateStatus('cancelled')}
                    disabled={loading}
                    className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/30 transition-all"
                  >
                    Cancel Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location logs panel */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-white">Location Logs</h4>
            <div className="text-xs text-slate-400">Showing last {locationLogs.length}</div>
          </div>
          <div className="bg-card p-4 rounded-xl max-h-40 overflow-auto border border-white/6">
            {locationLogs.length === 0 ? (
              <div className="text-slate-500 text-sm">No location updates yet.</div>
            ) : (
              <ul className="space-y-2 text-sm text-white">
                {locationLogs.map((l, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div className="text-slate-200">{new Date(l.timestamp).toLocaleTimeString()}</div>
                    <div className="text-slate-400">{l.lat.toFixed(5)}, {l.lng.toFixed(5)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {!activeRide && isOnline && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/10">
                <Clock size={24} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Pending Ride Requests</h3>
                <p className="text-secondary">New rides will appear here as soon as they are booked.</p>
              </div>
            </div>
            {pendingRides.length === 0 ? (
              <div className="card text-center py-20">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                  <Car className="text-slate-600" size={32} />
                </div>
                <p className="text-secondary font-medium text-lg">Searching for requests...</p>
                <p className="text-slate-600 text-sm mt-2">New rides will appear here as soon as they are booked.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRides.map((ride) => (
                  <div key={ride._id} className="card p-6 hover:scale-[1.01] transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
                          <Car size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="font-bold text-text text-lg">{ride.vehicleType}</p>
                          <p className="text-secondary text-sm">{new Date(ride.createdAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-success font-black text-3xl mb-1">₹{ride.fare}</p>
                        <p className="text-slate-500 text-sm">{ride.distance} km</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-3 h-3 rounded-full border-2 border-green-400 bg-green-400/20" />
                          <div className="w-0.5 h-8 bg-white/10" />
                          <div className="w-3 h-3 rounded-full border-2 border-red-400 bg-red-400/20" />
                        </div>
                        <div className="space-y-4 flex-1">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pickup Location</p>
                            <p className="text-white font-medium">{ride.pickupLocation.address}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Drop Location</p>
                            <p className="text-white font-medium">{ride.destination.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button 
                        onClick={() => acceptRide(ride._id)}
                        disabled={loading}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
                      >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                        Accept Ride
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!isOnline && (
          <div className="card text-center py-20">
            <div className="w-20 h-20 bg-slate-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-500/20">
              <Car className="text-slate-500" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-2">You are currently Offline</h3>
            <p className="text-secondary mb-8">Go online to start receiving ride requests from customers.</p>
            <button 
               onClick={() => setIsOnline(true)}
               className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg"
            >
              Start Earning
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
