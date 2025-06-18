import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import Login from "./components/Login.js";
import Dashboard from "./components/UserDashboard.js";
import Navbar from "./components/Navbar.js";
import { useAuth } from "./context/AuthContext.js";
import AdminDashboard from "./components/AdminDashboard.js"; 
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

// Move useAuth() usage here:
function AppLayout() {
  const { logout, user } = useAuth();
  return (
    <>
      <Navbar onLogout={user ? logout : undefined} />
      <Routes>
  <Route path="/" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
</Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;