import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Unable to load users');
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    load();
  }, []);

  const toggleBlock = async (userId: string, blocked: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/${blocked ? 'unblock' : 'block'}`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to update block status');
    }
  };

  return (
    <AdminLayout title="User management">
      <div className="card p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-text">All registered users</h3>
            <p className="mt-2 text-secondary">View and manage users from the platform.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                {users.filter(u => u.isVerified).length} Verified
              </span>
            </div>
            <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                {users.filter(u => u.isBlocked).length} Blocked
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] divide-y divide-white/10 text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-secondary">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                      <Users className="text-slate-600" size={24} />
                    </div>
                    <p className="text-secondary font-medium">No users found.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="transition hover:bg-white/5 group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                          <span className="text-white font-bold text-sm">
                            {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-slate-500 text-xs">ID: {user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-white">{user.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : user.role === 'driver'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          user.isVerified 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                        {user.isBlocked && (
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                            Blocked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => toggleBlock(user._id, user.isBlocked)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                          user.isBlocked 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                        }`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
