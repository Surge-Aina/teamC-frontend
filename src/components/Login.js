import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import API_BASE_URL from "../api";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let endpoint, payload;
      if (isSignup) {
        endpoint = `${API_BASE_URL}/auth/signup`;
        payload = { ...form }; // includes role
        } else {
        endpoint = `${API_BASE_URL}/auth/login`;
        payload = { email: form.email, password: form.password }; // do NOT send role
        }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      // save user and token in context/localStorage
      login({ ...data.user, token: data.token });

      // redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 tracking-tight">
          {isSignup ? "Create Account" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition duration-200"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          {isSignup ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                className="text-indigo-600 hover:underline font-medium"
                onClick={() => setIsSignup(false)}
              >
                Login
              </button>
            </span>
          ) : (
            <span>
              New user?{" "}
              <button
                type="button"
                className="text-indigo-600 hover:underline font-medium"
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;