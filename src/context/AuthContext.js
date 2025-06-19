import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// function: AuthProvider
// parameters:
//   children (jsx.element)
// returns: jsx.element
// description:
// provides authentication context to child components, manages user state and persistence
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // effect: load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // function: login
  // parameters:
  //   userData (object)
  // returns: void
  // description:
  // sets user state and saves user data to localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // function: logout
  // parameters: none
  // returns: void
  // description:
  // clears user state and removes user data from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// function: useAuth
// parameters: none
// returns: object
// description:
//  hook to access authentication context
export const useAuth = () => useContext(AuthContext);