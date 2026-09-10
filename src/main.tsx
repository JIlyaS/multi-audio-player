import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./app/App.tsx";

const rootElement = document.getElementById("multi-audio-player")!;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
