import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL, { deleteUser } from "../api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [description, setDescription] = useState(user?.description || "");
  const [descCreated, setDescCreated] = useState(!!user?.description);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [showDescInput, setShowDescInput] = useState(false);

  // ping backend to update activity
  useEffect(() => {
    const ping = async () => {
      if (user?.token) {
        await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }
    };
    ping();
  }, [user]);

  // user: save description
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
      setShowDescInput(false);
    } catch (err) {
      const text = await err?.response?.text?.();
      alert("Error saving description: " + (err.message || text));
    }
  };

  // user: save name
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
      alert("Name updated!");
    } catch (err) {
      alert("Error saving name: " + err.message);
    }
  };

  // user: delete profile
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
        <section className="relative flex-1 bg-white border border-gray-200 rounded-xl shadow-md p-6 mb-8 md:mb-0 flex flex-col justify-between">
          {/* edit name */}
          {!editingName && (
            <button
              className="absolute top-6 right-6 text-indigo-600 hover:underline text-sm"
              onClick={() => setEditingName(true)}
            >
              Edit Username
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold mb-2">
              Welcome, <span className="text-indigo-700">{name}</span>!
            </h2>
            <p className="text-gray-600 mb-4">
              Role: <span className="font-semibold capitalize">{user?.role}</span>
            </p>
            {/* name edit */}
            {editingName && (
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    className="px-3 py-2 border border-gray-300 rounded-lg mr-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg mr-2 text-sm"
                    onClick={async () => {
                      await handleNameSave();
                      setEditingName(false);
                    }}
                    disabled={!name.trim()}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-600 hover:underline text-sm"
                    onClick={() => setEditingName(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {/* description */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Description:</label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                {!descCreated && !showDescInput ? (
                  <p className="text-gray-500 text-sm">
                    You have not added a description yet. Click below to add one!
                  </p>
                ) : !descCreated && showDescInput ? (
                  <>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mr-2"
                      onClick={handleDescriptionSave}
                      disabled={!description.trim()}
                    >
                      Save Description
                    </button>
                    <button
                      className="text-gray-600 hover:underline text-sm"
                      onClick={() => setShowDescInput(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : !editingDesc ? (
                  <div>
                    <p className="mb-2">{description}</p>
                    <button
                      className="text-indigo-600 hover:underline mr-2 text-sm"
                      onClick={() => setEditingDesc(true)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline text-sm"
                      onClick={() => {
                        setDescription("");
                        setDescCreated(false);
                        setShowDescInput(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
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
                      className="text-gray-600 hover:underline text-sm"
                      onClick={() => setEditingDesc(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              {!descCreated && !showDescInput && (
                <button
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                  onClick={() => setShowDescInput(true)}
                >
                  Add Description
                </button>
              )}
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
        <section className="flex-1 bg-white border border-gray-200 rounded-xl shadow-md p-6 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <p className="mb-2">Keep your profile up to date!</p>
            <p className="text-xs">
              You can edit your name and description at any time.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;