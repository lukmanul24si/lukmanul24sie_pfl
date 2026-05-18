import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext"; // Mengarah ke src/context/AppContext
import App from "./App.jsx";                        // Mengarah ke src/App.jsx
import "./index.css";                               // Mengarah ke src/index.css

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>
);