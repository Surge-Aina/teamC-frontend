import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchUsers();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row gap-8 px-4 md:px-16 py-8">
        {/* left panel: admin info */}
        <section className="flex-1 bg-white/80 rounded-2xl shadow-lg p-8 mb-8 md:mb-0">
          <h2 className="text-xl font-bold mb-4 text-left">Admin Profile</h2>
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-lg mr-2">Name:</span>
              <span>{typeof user?.name === "string" ? user.name : "[Invalid name]"}</span>
            </div>
            <div>
              <span className="font-semibold text-lg mr-2">Role:</span>
              <span>{typeof user?.role === "string" ? user.role : "[Invalid role]"}</span>
            </div>
            <div>
              <span className="font-semibold text-lg mr-2">Email:</span>
              <span>{typeof user?.email === "string" ? user.email : "[Invalid email]"}</span>
            </div>
          </div>
        </section>
        {/* right panel: user list */}
        <section className="flex-1 bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-left">User List</h2>
          {loading ? (
            <div className="text-gray-500 text-center">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-gray-500 text-center">No users found.</div>
          ) : (
            <div className="space-y-4">
              {users.map(u => (
                <div
                  key={u._id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 shadow-sm"
                >
                  <div>
                    <span className="font-semibold text-lg mr-2">{u.name}</span>
                    <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800">
                      {u.role}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">{u.email}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;