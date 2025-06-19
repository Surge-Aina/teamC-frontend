import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// function: navbar
// parameters:
//   onLogout (function): callback to handle logout
// returns: jsx.element
// description:
// navbar component, displays app title and logout button if user is logged in and not on login page
const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const { user } = useAuth();
  const isLoginPage = location.pathname === "/";

  return (
    <header className="w-full bg-indigo-700 text-white py-4 px-8 flex justify-between items-center shadow">
      <h1 className="text-2xl font-bold tracking-wide">Temp</h1>
      {!isLoginPage && user && onLogout && (
        <button
          onClick={onLogout}
          className="bg-white text-indigo-700 font-semibold px-4 py-2 rounded shadow hover:bg-indigo-100 transition"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Navbar;