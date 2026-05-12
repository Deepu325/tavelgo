import { useEffect, useState } from 'react';
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
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">All registered users</h3>
            <p className="mt-1 text-sm text-slate-400">View and manage users from the platform.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] divide-y divide-white/10 text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Blocked</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="transition hover:bg-white/5">
                    <td className="px-4 py-4 text-white">{user.name}</td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4 capitalize">{user.role}</td>
                    <td className="px-4 py-4">{user.isVerified ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4">{user.isBlocked ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleBlock(user._id, user.isBlocked)}
                        className="rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:bg-slate-700"
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
