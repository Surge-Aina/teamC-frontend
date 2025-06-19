import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.js";
import Login from "./components/Login.js";
import Dashboard from "./components/CustomerDashboard.js";
import Navbar from "./components/Navbar.js";
import AdminDashboard from "./components/AdminDashboard.js"; 
import WorkerDashboard from "./components/WorkerDashboard.js"; 
import ManagerDashboard from "./components/ManagerDashboard.js";

// function: ProtectedRoute
// parameters:
//   children (jsx.element)
// returns: jsx.element
// description:
// renders children if user is authenticated, redirects to logincif not
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

// function: AppLayout
// parameters: none
// returns: jsx.element
// description:
// layout component that renders navbar and app routes
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
        <Route
          path="/worker"
          element={
            <ProtectedRoute>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

// function: App
// parameters: none
// returns: jsx.element
// description:
// root app component, provides authentication context and routing
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