import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePrefs } from "../context/PrefContext";
import MessageForm from "../components/MessageForm";
import Sidebar from "../components/Sidebar";
import { idOf } from "../utils";

export default function Home() {
  const { t } = usePrefs(); const { user } = useAuth(); const go = useNavigate(); const { hash } = useLocation();
  useEffect(() => { if (hash) document.querySelector(hash)?.scrollIntoView(); }, [hash]);
  return (
    <div className="pg two">
      <div>
        <section className="box" id="alerts"><h2>{t("alert")}</h2>
          <div><div className="al" role="alert"><span className="chip">{t("lvl")}</span><p>{t("alertBody")}</p><small>{t("src")}</small></div></div>
        </section>
        <section className="box emg" id="report"><h2>{t("n_report")}</h2>
          {!user && <div><p>{t("Log in to report an incident.")}</p><Link className="btn" to="/login">{t("Log in")}</Link></div>}
          {user?.role === "rescue_team" && <div>{t("Rescue team accounts do not file reports. Open your jobs from the dashboard.")}</div>}
          {user && user.role !== "rescue_team" && <MessageForm onDone={(i) => go(`/results/${idOf(i)}`, { state: { sent: true } })} />}
          <p className="call"><Phone size={18} /><span>{t("call")} <a href="tel:112">112</a> {t("first")}</span></p>
        </section>
      </div>
      <Sidebar />
    </div>
  );
}
