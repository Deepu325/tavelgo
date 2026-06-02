import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ArrowLeft, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import api from '../services/api';

const HistoryPage = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/bookings/history');
        setRides(data);
      } catch (err) {
        console.error('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-xl font-bold">Ride History</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-secondary text-lg">Loading your journey history...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="card text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Car size={32} className="text-slate-600" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">No rides yet</h2>
            <p className="text-secondary text-lg">Your completed trips will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Rides</h2>
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="text-sm font-bold text-green-400">{rides.length} Total Rides</span>
              </div>
            </div>

            <div className="space-y-4">
              {rides.map((ride) => (
                <div key={ride._id} className="card p-6 hover:scale-[1.01] transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
                        <Calendar size={20} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="font-bold text-text text-lg">{new Date(ride.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-secondary text-sm">{new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-success font-black text-3xl mb-1">
                        ₹{ride.finalFare || ride.fare}
                      </p>
                      {ride.isPackageBooking && ride.finalFare && ride.finalFare > ride.fare && (
                        <div className="text-xs text-slate-500 space-y-1">
                          <p>Base: ₹{ride.fare}</p>
                          {ride.extraKmCharge > 0 && <p>Extra km: ₹{ride.extraKmCharge}</p>}
                          {ride.extraTimeCharge > 0 && <p>Extra time: ₹{ride.extraTimeCharge}</p>}
                        </div>
                      )}
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        ride.status === 'completed'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : ride.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {ride.status}
                      </span>
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

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-slate-400" />
                        <span className="text-slate-300 font-medium">{ride.vehicleType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-slate-400" />
                        <span className="text-slate-300 font-medium">Cash Payment</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">View Details</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
