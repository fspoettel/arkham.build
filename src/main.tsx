import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource-variable/noto-sans/standard.css";
import "@fontsource-variable/noto-sans/standard-italic.css";
import "@fontsource-variable/noto-serif/standard.css";
import "@fontsource-variable/noto-serif/standard-italic.css";
import "./styles/icons-encounters.css";
import "./styles/icons-icon.css";
import "./styles/main.css";

import "@/utils/i18n";

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
