import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: "", search: "" });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users", { params: filter });
      setUsers(data.users);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const handleBan = async (id) => {
    try {
      await api.patch(`/admin/users/${id}/ban`);
      fetchUsers();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search email..." 
            className="px-4 py-2 border rounded-xl text-sm"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          <select 
            className="px-4 py-2 border rounded-xl text-sm"
            value={filter.role}
            onChange={(e) => setFilter({ ...filter, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="CREATOR">Creator</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    user.role === "CREATOR" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {user.isBanned ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600" /> Banned
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" /> Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleBan(user.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors mr-2 ${
                      user.isBanned ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    {user.isBanned ? "Unban" : "Ban User"}
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
