import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import AlertBanner from "./components/AlertBanner";
import Login from "./pages/Login";
import ReporterDashboard from "./pages/ReporterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RescueDashboard from "./pages/RescueDashboard";
import { useAuth } from "./context/AuthContext";

function Shell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [fontSize, setFontSize] = useState(17);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [fontSize, dark]);

  const publicLogin = location.pathname === "/login";
  if (!user && !publicLogin) return <Navigate to="/login" replace />;

  return (
    <>
      <Header user={user} onLogout={logout} fontSize={fontSize} setFontSize={setFontSize} onContrast={() => setDark(v => !v)} />
      {user && <Navbar role={user.role} />}
      {user && <AlertBanner />}
      <main id="main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/reporter" element={<ReporterDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/rescue" element={<RescueDashboard />} />
          <Route path="*" element={<Navigate to={user ? `/${user.role === "admin" ? "admin" : user.role === "rescue" ? "rescue" : "reporter"}` : "/login"} replace />} />
        </Routes>
      </main>
      <footer>
        <a href="#top">Website policies</a>
        <a href="#top">Accessibility statement</a>
        <a href="#top">Contact us</a>
        <p>Last updated: 6 October 2026</p>
        <p>RESQAI is an academic prototype and is not an official government website. In an emergency, call 112.</p>
      </footer>
    </>
  );
}

export default function App() { return <Shell />; }