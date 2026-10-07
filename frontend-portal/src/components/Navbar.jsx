import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePrefs } from "../context/PrefContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, setLang, fs, setFs, contrast, setContrast } = usePrefs();
  const { pathname, hash } = useLocation();
  const go = useNavigate();

  const links = [["/", "n_home"]];
  if (user && user.role !== "rescue_team") links.push(["/#report", "n_report"]);
  if (user) links.push(["/dashboard", { reporter: "n_mine", admin: "Admin Dashboard", rescue_team: "My Jobs" }[user.role]]);
  links.push(["/#alerts", "n_alerts"], ["/#tips", "n_tips"], ["/#help", "n_help"]);
  const on = (to) => (to.includes("#") ? pathname + hash === to : pathname === to && !hash);

  return (
    <>
      <div className="util" id="top">
        <a href="#main">{t("skip")}</a>
        <button onClick={() => setFs(Math.max(15, fs - 2))} aria-label="Smaller text">A−</button>
        <button onClick={() => setFs(17)} aria-label="Normal text">A</button>
        <button onClick={() => setFs(Math.min(24, fs + 2))} aria-label="Larger text">A+</button>
        <button onClick={() => setContrast(!contrast)} aria-pressed={contrast}>{t("Contrast")}</button>
        <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
          <option value="en">English</option><option value="hi">हिन्दी</option><option value="pa">ਪੰਜਾਬੀ</option>
        </select>
      </div>
      <div className="flag" />
      <header className="hd">
        <img src="/favicon.svg" width="44" height="44" alt="" />
        <div><h1>RESQAI</h1><small>AI-Assisted Disaster Response System</small></div>
        <div className="acct">
          {user ? (<>
            <span>{user.name} ({user.role.replace("_", " ")})</span>
            <button className="btn alt sm" onClick={() => { logout(); go("/"); }}>{t("Log out")}</button>
          </>) : <Link className="btn sm" to="/login">{t("Log in")}</Link>}
        </div>
      </header>
      <nav className="nv" aria-label="Main">
        {links.map(([to, k]) => <Link key={to} to={to} className={on(to) ? "on" : ""}>{t(k)}</Link>)}
      </nav>
      <div className="tk"><b>{t("tick")}</b><div><span>{t("alertBody")} {t("src")}</span></div></div>
    </>
  );
}
