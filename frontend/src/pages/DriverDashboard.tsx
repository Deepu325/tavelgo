import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Clock, LogOut, User, Phone, Loader2, CheckCircle2, Navigation as NavigationIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { socketService } from '../services/socketService';

const DriverDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(true);
  const [pendingRides, setPendingRides] = useState<any[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);
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

    // Simulate Location Updates (Phase 5)
    const locInterval = setInterval(() => {
      if (isOnline) {
        updateDriverLocation();
      }
    }, 30000); // Every 30s

    return () => {
      socketService.off('new-ride-available');
      socketService.off('ride-status-updated');
      clearInterval(locInterval);
    };
  }, [user?.id, isOnline]);

  const updateDriverLocation = async () => {
    try {
      // Mock random movement around a center point (e.g., Bangalore)
      const lat = 12.9716 + (Math.random() - 0.5) * 0.1;
      const lng = 77.5946 + (Math.random() - 0.5) * 0.1;
      await api.patch('/bookings/driver-status', { lat, lng, isOnline });
    } catch (err) {
      console.error('Failed to update location');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
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

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Driver Console, <span className="text-blue-400">{user?.name?.split(' ')[0]}</span>
            </h2>
            <p className="text-slate-400 mt-1">Manage your rides and availability.</p>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg ${
              isOnline ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-slate-500'}`} />
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>

        {/* Active Ride Section */}
        {activeRide && (
          <div className="bg-white/10 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4">
               <span className="px-4 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
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
                      <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Pickup From</p>
                      <p className="text-white text-lg font-bold">{activeRide.pickupLocation.address}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Drop To</p>
                      <p className="text-white text-lg font-bold">{activeRide.destination.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                      <User className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase">Customer</p>
                      <p className="text-white font-bold">{activeRide.customer.name}</p>
                    </div>
                  </div>
                  <button className="p-3 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <Phone size={20} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Earnings</p>
                    <p className="text-green-400 text-2xl font-black">₹{activeRide.fare}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Distance</p>
                    <p className="text-white text-2xl font-black">{activeRide.distance} km</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {activeRide.status === 'accepted' && (
                    <button 
                      onClick={() => updateStatus('ongoing')}
                      disabled={loading}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <NavigationIcon size={20} />}
                      Start Trip
                    </button>
                  )}
                  {activeRide.status === 'ongoing' && (
                    <button 
                      onClick={() => updateStatus('completed')}
                      disabled={loading}
                      className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                      Mark Completed
                    </button>
                  )}
                  <button 
                    onClick={() => updateStatus('cancelled')}
                    disabled={loading}
                    className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-2xl border border-red-500/30 transition-all"
                  >
                    Cancel Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Requests */}
        {!activeRide && isOnline && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 ml-2">
              <Clock size={20} className="text-yellow-400" /> Pending Ride Requests
            </h3>
            {pendingRides.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Car className="text-slate-600" />
                </div>
                <p className="text-slate-400 font-medium text-lg">Searching for requests...</p>
                <p className="text-slate-600 text-sm mt-2">New rides will appear here as soon as they are booked.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingRides.map((ride) => (
                  <div key={ride._id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-white/15 transition-all">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-bold uppercase">{ride.vehicleType}</span>
                        <span className="text-slate-500 text-xs font-bold">{new Date(ride.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <div className="w-0.5 h-6 bg-white/10" />
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-medium text-sm"><span className="text-slate-500 mr-2">From:</span> {ride.pickupLocation.address}</p>
                          <p className="text-white font-medium text-sm"><span className="text-slate-500 mr-2">To:</span> {ride.destination.address}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                      <div className="text-center md:text-right">
                        <p className="text-slate-500 text-xs font-bold uppercase">Fare</p>
                        <p className="text-green-400 text-2xl font-black">₹{ride.fare}</p>
                        <p className="text-slate-400 text-xs">{ride.distance} km</p>
                      </div>
                      <button 
                        onClick={() => acceptRide(ride._id)}
                        disabled={loading}
                        className="flex-1 md:flex-none px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Offline State */}
        {!isOnline && (
          <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-20 text-center">
            <h3 className="text-2xl font-bold text-slate-500">You are currently Offline</h3>
            <p className="text-slate-600 mt-2 mb-8">Go online to start receiving ride requests from customers.</p>
            <button 
               onClick={() => setIsOnline(true)}
               className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl"
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
