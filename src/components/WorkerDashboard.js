import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL, { deleteUser } from "../api";

const WorkerDashboard = () => {
  const { user, logout, login } = useAuth(); 
  const [name, setName] = useState(user?.name || "");
  const [description, setDescription] = useState(user?.description || "");
  const [descCreated, setDescCreated] = useState(!!user?.description);
  const [editingDesc, setEditingDesc] = useState(false);

  // save description to backend
  const handleDescriptionSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error("Failed to save description");
      setDescCreated(true);
      setEditingDesc(false);
      login({ ...user, description, hasDescription: true });
    } catch (err) {
      alert("Error saving description: " + err.message);
    }
  };

  // save name to backend
  const handleNameSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to save name");
      const data = await res.json();
      alert("Name updated!");
      // update user context with new name
      login({ ...user, name });
    } catch (err) {
      alert("Error saving name: " + err.message);
    }
  };

  // delete profile
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
        {/* left panel */}
        <section className="flex-1 bg-white/80 rounded-2xl shadow-lg p-8 mb-8 md:mb-0 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">
              Welcome, <span className="text-indigo-700">{name}</span>!
            </h2>
            <p className="text-gray-600">
              Role: <span className="font-semibold capitalize">{user?.role}</span>
            </p>
          </div>
          {/* WORKER VIEW */}
          {user?.role === "worker" && (
            <>
              <div className="mb-6">
                <label className="block font-medium mb-2">
                  Change your name:
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg ml-2"
                  onClick={handleNameSave}
                  disabled={!name.trim()}
                >
                  Save Name
                </button>
              </div>
              {!descCreated ? (
                <div className="mb-6">
                  <label className="block font-medium mb-2">
                    Create your description:
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    onClick={handleDescriptionSave}
                    disabled={!description.trim()}
                  >
                    Save Description
                  </button>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block font-medium mb-2">
                    Your description:
                  </label>
                  {!editingDesc ? (
                    <div>
                      <p className="mb-2">{description}</p>
                      <button
                        className="text-indigo-600 hover:underline mr-2"
                        onClick={() => setEditingDesc(true)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          setDescription("");
                          setDescCreated(false);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mr-2"
                        onClick={handleDescriptionSave}
                        disabled={!description.trim()}
                      >
                        Save
                      </button>
                      <button
                        className="text-gray-600 hover:underline"
                        onClick={() => setEditingDesc(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          <button
            onClick={handleDeleteProfile}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200 mt-6"
          >
            Delete Profile
          </button>
        </section>
        {/* right panel */}
        <section className="flex-1 bg-white/80 rounded-2xl shadow-lg p-8 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <p className="mb-2">Your manager:</p>
            <p className="text-xs">[Manager info will appear here]</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WorkerDashboard;