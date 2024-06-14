import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/icons.css";
import "./styles/main.css";

import App from "./app";

const rootNode = document.getElementById("root");

if (!rootNode) {
  throw new Error("fatal: did not find root node in DOM.");
}

ReactDOM.createRoot(rootNode).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
