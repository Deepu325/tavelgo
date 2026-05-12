import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Truck, DollarSign, ClipboardList, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: Home },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/drivers', label: 'Drivers', icon: Truck },
  { to: '/admin/pricing', label: 'Pricing', icon: DollarSign },
  { to: '/admin/bookings', label: 'Bookings', icon: ClipboardList },
];

const AdminLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[280px_1fr]">
        <aside className="border-r border-border bg-card px-6 py-8">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin panel</p>
            <h1 className="mt-4 text-3xl font-bold text-white">CabBook Admin</h1>
          </div>
          <nav className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                    active ? 'bg-purple-600/15 text-white border border-purple-500/30' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/90 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Signed in as</p>
            <p className="mt-3 text-white font-semibold">{user?.name || 'Admin'}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-3xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
          >
            <LogOut size={18} /> Logout
          </button>
        </aside>

        <main className="px-6 py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin workspace</p>
              <h2 className="mt-3 text-3xl font-bold text-white">{title}</h2>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
