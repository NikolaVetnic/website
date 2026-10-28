import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/jost/500.css";
import "@fontsource/jost/700.css";
import "@fontsource/inter/400.css";
import "./App.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
