import React from "react";
import { createRoot } from "react-dom/client";
import Glassmorphism from "./Glassmorphism";
import "./Stylization.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Glassmorphism />
  </React.StrictMode>
);
