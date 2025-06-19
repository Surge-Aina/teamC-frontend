import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL, { deleteUser } from "../api";

// function: isUserActive
// parameters:
//   user (object)
// returns:
//   boolean
// description:
// checks if a user is currently active based on lastActive timestamp and isActive flag
const isUserActive = (user) => {
  if (!user.lastActive) return false;
  const lastActive = new Date(user.lastActive);
  const now = new Date();
  // 10 mins
  return user.isActive && (now - lastActive < 600000);
};

// function: adminDashboard
// parameters: none
// returns:
//   jsx.element
// description:
// main admin dashboard component. displays admin profile and user management panel
const AdminDashboard = () => {
  const { user, logout } = useAuth(); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [view, setView] = useState("all"); 

  // function: fetchUsers
  // parameters: none
  // returns: void (async)
  // description:
  // fetches all users from the backend and updates state
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

  // effect: fetch users on mount or when user changes
  useEffect(() => {
    if (user?.token) fetchUsers();
  }, [user]);

  // function: handleEdit
  // parameters:
  //   id (string)
  //   name (string)
  // returns: void
  // description:
  // sets the editing state for a user to allow name editing
  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditedName(name);
  };

  // function: handleSave
  // parameters:
  //   id (string)
  // returns: void (async)
  // description:
  // saves the edited user name and refreshes the user list
  const handleSave = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name: editedName }),
      });
      if (!res.ok) throw new Error("Failed to save name");
      await fetchUsers();
      setEditingId(null);
      setEditedName("");
    } catch (err) {
      alert("Error saving name: " + err.message);
    }
  };

  // function: handleCancel
  // parameters: none
  // returns: void
  // description:
  // cancels editing state for user name
  const handleCancel = () => {
    setEditingId(null);
    setEditedName("");
  };

  // function: handleDelete
  // parameters:
  //   id (string)
  // returns: void (async)
  // description:
  // deletes a user by id and updates the user list
  const handleDelete = async (id) => {
    try {
      await deleteUser(id, user.token);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  // function: handleDeleteProfile
  // parameters: none
  // returns: void (async)
  // description:
  // deletes the admin's own profile and logs out
  const handleDeleteProfile = async () => {
    try {
      await deleteUser(user._id, user.token);
      logout();
    } catch (err) {
      alert("Error deleting profile: " + err.message);
    }
  };

  // filteredUsers: array of users filtered by selected view
  const filteredUsers =
    view === "all"
      ? users
      : users.filter(u => u.role === view);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row gap-8 px-4 md:px-16 py-8">
        {/* left panel */}
        <section className="flex-[1] bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-8 md:mb-0 flex flex-col justify-between">
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
        {/* right panel */}
        <section className="flex-[1.5] bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col">
          <div className="mb-4 flex items-center gap-x-2">
            <label className="font-semibold mr-2" htmlFor="admin-view-select">
              Show:
            </label>
            <select
              id="admin-view-select"
              value={view}
              onChange={e => setView(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300"
            >
              <option value="all">All</option>
              <option value="worker">Workers</option>
              <option value="manager">Managers</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-2 text-left">User List</h2>
          {loading ? (
            <div className="text-gray-500 text-center">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-gray-500 text-center">No users found.</div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-2 bg-white rounded-lg">
              {filteredUsers.map(u => (
                <div
                  key={u._id}
                  className="flex items-center justify-between px-2 py-3 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center">
                    <span
                      title={isUserActive(u) ? "Recently active" : "Away"}
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        isUserActive(u) ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    {editingId === u._id ? (
                      <>
                        <input
                          className="border-b border-gray-300 bg-transparent px-1 text-base font-semibold mr-2"
                          value={editedName}
                          onChange={e => setEditedName(e.target.value)}
                          autoFocus
                        />
                        <button
                          className="text-green-600 hover:underline mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          onClick={() => handleSave(u._id)}
                          disabled={!editedName.trim()}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-600 hover:underline rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <span className="font-semibold text-base mr-2">{u.name}</span>
                    )}
                    <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-gray-100 text-gray-800">
                      {u.role}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-sm">{u.email}</span>
                    {editingId !== u._id && (
                      <button
                        className="text-indigo-600 hover:underline ml-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        onClick={() => handleEdit(u._id, u.name)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:underline ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
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