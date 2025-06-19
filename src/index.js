// imports react, react-dom, app component, and global styles. renders the app to the root element
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);