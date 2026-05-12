import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ArrowLeft, Calendar, MapPin, CreditCard, ChevronRight } from 'lucide-react';
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
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-lg font-bold">Ride History</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-secondary">Loading your journey history...</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="card text-center py-20">
            <Car size={48} className="text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text">No rides yet</h2>
            <p className="text-secondary mt-2">Your completed trips will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride._id} className="card p-6 hover:shadow-soft transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-text">{new Date(ride.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      <p className="text-secondary text-xs">{new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-success font-black text-xl">₹{ride.fare}</p>
                    <span className="text-[10px] uppercase tracking-widest font-black text-secondary bg-slate-100 px-2 py-0.5 rounded border border-border">{ride.status}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex gap-3">
                    <MapPin size={16} className="text-green-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-300 line-clamp-1">{ride.pickupLocation.address}</p>
                  </div>
                  <div className="flex gap-3">
                    <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-300 line-clamp-1">{ride.destination.address}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-tighter text-slate-500">
                   <div className="flex items-center gap-4">
                     <span className="flex items-center gap-1.5"><Car size={14} /> {ride.vehicleType}</span>
                     <span className="flex items-center gap-1.5"><CreditCard size={14} /> Cash</span>
                   </div>
                   <div className="flex items-center gap-1 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                     Details <ChevronRight size={14} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
