import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL, { deleteUser } from "../api";

const AdminDashboard = () => {
  const { user, logout } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

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

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditedName(name);
  };

  const handleSave = async (id) => {
    // send update to backend
    setUsers(users.map(u => u._id === id ? { ...u, name: editedName } : u));
    setEditingId(null);
    setEditedName("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedName("");
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id, user.token);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  // admin profile deletion
  const handleDeleteProfile = async () => {
    try {
      await deleteUser(user._id, user.token);
      logout();
    } catch (err) {
      alert("Error deleting profile: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row gap-8 px-4 md:px-16 py-8">
        {/* left panel: admin info */}
        <section className="flex-1 bg-white/80 rounded-2xl shadow-lg p-8 mb-8 md:mb-0 flex flex-col justify-between">
          <div>
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
          </div>
          <button
            onClick={handleDeleteProfile}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200 mt-6"
          >
            Delete Profile
          </button>
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
                    {editingId === u._id ? (
                      <>
                        <input
                          className="border-b border-gray-300 bg-transparent px-1 text-lg font-semibold mr-2"
                          value={editedName}
                          onChange={e => setEditedName(e.target.value)}
                          autoFocus
                        />
                        <button
                          className="text-green-600 hover:underline mr-2"
                          onClick={() => handleSave(u._id)}
                          disabled={!editedName.trim()}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-600 hover:underline"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-lg mr-2">{u.name}</span>
                      </>
                    )}
                    <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800">
                      {u.role}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm">{u.email}</span>
                    {editingId !== u._id && (
                      <button
                        className="text-indigo-600 hover:underline ml-4"
                        onClick={() => handleEdit(u._id, u.name)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:underline ml-2"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </div>
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