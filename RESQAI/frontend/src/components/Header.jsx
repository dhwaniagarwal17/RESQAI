import { LogOut, Minus, Plus, SunMoon } from "lucide-react";

export default function Header({ user, onLogout, fontSize, setFontSize, onContrast }) {
  return (
    <>
      <div className="utility-bar">
        <a href="#main">Skip to main content</a>
        <button onClick={() => setFontSize(Math.max(15, fontSize - 2))}><Minus size={14} /> A−</button>
        <button onClick={() => setFontSize(17)}>A</button>
        <button onClick={() => setFontSize(Math.min(24, fontSize + 2))}><Plus size={14} /> A+</button>
        <button onClick={onContrast}><SunMoon size={14} /> Contrast</button>
      </div>
      <div className="flag" />
      <header className="site-header">
        <div className="logo-mark" aria-hidden="true"><span /></div>
        <div>
          <h1>RESQAI</h1>
          <small>AI-Assisted Disaster Response System</small>
        </div>
        {user && (
          <div className="account">
            <span>{user.name}</span>
            <button className="btn alt small" onClick={onLogout}><LogOut size={15} /> Log out</button>
          </div>
        )}
      </header>
    </>
  );
}