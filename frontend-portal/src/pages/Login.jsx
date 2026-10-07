import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePrefs } from "../context/PrefContext";
import Sidebar from "../components/Sidebar";

export default function Login() {
  const { user, login, register } = useAuth(); const { t } = usePrefs();
  const [reg, setReg] = useState(false);
  const [f, setF] = useState({ name: "", email: "", password: "", phone: "", role: "reporter", teamId: "" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      if (reg) await register({ name: f.name, email: f.email, password: f.password, phone: f.phone, role: f.role, teamId: f.role === "rescue_team" ? f.teamId : undefined });
      else await login({ email: f.email, password: f.password });
    } catch (x) { setErr(x.message); setBusy(false); }
  }
  return (
    <div className="pg two">
      <section className="box"><h2>{reg ? t("Create an account") : t("User Login")}</h2>
        <form className="f" onSubmit={submit}>
          <small>{t("Fields marked * are mandatory.")}</small>
          {reg && (<>
            <label>{t("Full name")} <span className="req">*</span><input required minLength={2} value={f.name} onChange={set("name")} autoComplete="name" /></label>
            <label>{t("Phone number")}<input value={f.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" /></label>
            <label>{t("I am")} <span className="req">*</span>
              <select value={f.role} onChange={set("role")}><option value="reporter">{t("Reporting an emergency")}</option><option value="rescue_team">{t("A rescue team member")}</option></select>
            </label>
            {f.role === "rescue_team" && <label>{t("Team ID")}<input value={f.teamId} onChange={set("teamId")} /></label>}
          </>)}
          <label>{t("Email")} <span className="req">*</span><input type="email" required value={f.email} onChange={set("email")} autoComplete="email" /></label>
          <label>{t("Password")} <span className="req">*</span><input type="password" required minLength={6} value={f.password} onChange={set("password")} autoComplete={reg ? "new-password" : "current-password"} /></label>
          {err && <p role="alert" className="alert">{err}</p>}
          <button className="btn" disabled={busy}>{busy ? t("Please wait…") : reg ? t("Create account") : t("Log in")}</button>
          <button type="button" className="btn alt" onClick={() => { setErr(""); setReg(!reg); }}>{reg ? t("I already have an account") : t("Register as a new user")}</button>
        </form>
      </section>
      <Sidebar />
    </div>
  );
}
