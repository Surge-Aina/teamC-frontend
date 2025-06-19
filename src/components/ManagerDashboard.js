import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL, { deleteUser } from "../api";

// function: managerDashboard
// parameters: none
// returns: jsx.element
// description:
// main manager dashboard component. displays manager profile, allows adding/deleting workers, and viewing workers/managers
const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWorker, setNewWorker] = useState({ name: "", email: "", password: "" });
  const [view, setView] = useState("all");
  const [showAddWorker, setShowAddWorker] = useState(false); 

  useEffect(() => {
    // function: fetchUsers
    // parameters: none
    // returns: promise<void>
    // description:
    // fetches workers and managers from backend and updates state
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/users/workers-managers`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setWorkers(data.filter(u => u.role === "worker"));
        setManagers(data.filter(u => u.role === "manager"));
      } catch (err) {
        setWorkers([]);
        setManagers([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchUsers();
  }, [user]);

  // function: handleAddWorker
  // parameters:
  //   e (object): form submit event
  // returns: promise<void>
  // description:
  // adds a new worker via backend and refreshes the list
  const handleAddWorker = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/managers/add-worker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newWorker),
      });
      if (!res.ok) throw new Error("Failed to add worker");
      setNewWorker({ name: "", email: "", password: "" });
      setShowAddWorker(false); // hide form after adding
      // refresh list
      const updated = await fetch(`${API_BASE_URL}/users/workers-managers`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await updated.json();
      setWorkers(data.filter(u => u.role === "worker"));
      setManagers(data.filter(u => u.role === "manager"));
    } catch (err) {
      alert("Error adding worker: " + err.message);
    }
  };

  // function: handleDeleteWorker
  // parameters:
  //   id (string)
  // returns: promise<void>
  // description:
  // deletes a worker by id and updates the workers list
  const handleDeleteWorker = async (id) => {
    try {
      await deleteUser(id, user.token); 
      setWorkers(workers.filter(w => w._id !== id));
    } catch (err) {
      alert("Error deleting worker: " + err.message);
    }
  };

  // function: handleDeleteProfile
  // parameters: none
  // returns: promise<void>
  // description:
  // deletes the manager's own profile and logs out
  const handleDeleteProfile = async () => {
    try {
      await deleteUser(user._id, user.token);
      logout();
    } catch (err) {
      alert("Error deleting profile: " + err.message);
    }
  };

  // allUsers: array of all workers and managers for "all" view
  const allUsers = [...workers, ...managers];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
      <main className="flex-1 flex flex-col md:flex-row gap-8 px-4 md:px-16 py-8">
        {/* left panel: manager info and delete profile */}
        <section className="flex-[1] bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-8 md:mb-0 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 text-left">Manager Profile</h2>
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-lg mr-2">Name:</span>
                <span>{user?.name}</span>
              </div>
              <div>
                <span className="font-semibold text-lg mr-2">Role:</span>
                <span>{user?.role}</span>
              </div>
              <div>
                <span className="font-semibold text-lg mr-2">Email:</span>
                <span>{user?.email}</span>
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
        {/* right panel: dropdown for workers/managers/all and add worker */}
        <section className="flex-[1.5] bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col">
          <div className="mb-6 flex items-center">
            <label className="font-semibold mr-2" htmlFor="view-select">
              Show:
            </label>
            <select
              id="view-select"
              value={view}
              onChange={e => setView(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300"
            >
              <option value="all">All</option>
              <option value="workers">Workers</option>
              <option value="managers">Managers</option>
            </select>
            <button
              className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg shadow-lg transition duration-200"
              onClick={() => setShowAddWorker((v) => !v)}
            >
              {showAddWorker ? "Cancel" : "Add Worker"}
            </button>
          </div>
          {showAddWorker && (
            <form className="mb-6 space-y-4" onSubmit={handleAddWorker}>
              <input
                type="text"
                placeholder="Name"
                value={newWorker.name}
                onChange={e => setNewWorker({ ...newWorker, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={newWorker.email}
                onChange={e => setNewWorker({ ...newWorker, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="password"
                placeholder="Password"
                value={newWorker.password}
                onChange={e => setNewWorker({ ...newWorker, password: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-200"
              >
                Create Worker
              </button>
            </form>
          )}
          {view === "all" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-left">All Users</h2>
              {loading ? (
                <div className="text-gray-500 text-center">Loading...</div>
              ) : allUsers.length === 0 ? (
                <div className="text-gray-500 text-center">No users found.</div>
              ) : (
                <div className="space-y-4 max-h-[28rem] overflow-y-auto pr-2">
                  {allUsers.map(u => (
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
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm">{u.email}</span>
                        {u.role === "worker" && (
                          <button
                            className="text-red-600 hover:underline ml-4"
                            onClick={() => handleDeleteWorker(u._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {view === "workers" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-left">Workers</h2>
              {loading ? (
                <div className="text-gray-500 text-center">Loading...</div>
              ) : workers.length === 0 ? (
                <div className="text-gray-500 text-center">No workers found.</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {workers.map(w => (
                    <div
                      key={w._id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 shadow-sm"
                    >
                      <div>
                        <span className="font-semibold text-lg mr-2">{w.name}</span>
                        <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800">
                          {w.role}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 text-sm">{w.email}</span>
                        <button
                          className="text-red-600 hover:underline ml-4"
                          onClick={() => handleDeleteWorker(w._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {view === "managers" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-left">Managers</h2>
              {loading ? (
                <div className="text-gray-500 text-center">Loading...</div>
              ) : managers.length === 0 ? (
                <div className="text-gray-500 text-center">No managers found.</div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {managers.map(m => (
                    <div
                      key={m._id}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 shadow-sm"
                    >
                      <div>
                        <span className="font-semibold text-lg mr-2">{m.name}</span>
                        <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800">
                          {m.role}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm">{m.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default ManagerDashboard;