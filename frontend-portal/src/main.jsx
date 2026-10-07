import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PrefProvider } from "./context/PrefContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter><PrefProvider><AuthProvider><App /></AuthProvider></PrefProvider></BrowserRouter>
);
