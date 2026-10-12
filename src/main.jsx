import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PedidoProvider } from "./context/PedidoContext";
import "./estilos.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PedidoProvider>
        <App />
      </PedidoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
