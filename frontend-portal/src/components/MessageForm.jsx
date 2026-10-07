import { useState } from "react";
import { MapPin } from "lucide-react";
import { incidentApi } from "../services/api";
import { usePrefs } from "../context/PrefContext";

export default function MessageForm({ onDone }) {
  const { t } = usePrefs();
  const [msg, setMsg] = useState(""); const [addr, setAddr] = useState(""); const [loc, setLoc] = useState(null);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");

  const locate = () => {
    const fail = () => setErr(t("We could not get your location. Type your address instead."));
    if (!navigator.geolocation) return fail();
    navigator.geolocation.getCurrentPosition(
      (p) => { setErr(""); setLoc({ latitude: p.coords.latitude, longitude: p.coords.longitude }); }, fail
    );
  };
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      const location = { ...(loc || {}), ...(addr.trim() ? { address: addr.trim() } : {}) };
      const incident = await incidentApi.create({ message: msg.trim(), ...(Object.keys(location).length ? { location } : {}) });
      onDone(incident);
    } catch (x) { setErr(x.status >= 500 ? t("Our analysis service is busy right now. Please try again in a moment. If it is urgent, call 112.") : x.message); setBusy(false); }
  }
  return (
    <form className="f" onSubmit={submit}>
      <small>{t("sub")}</small>
      <label>{t("title")} <span className="req">*</span>
        <textarea rows={4} required minLength={10} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t("ph")} />
        <small>{t("At least 10 characters.")}</small>
      </label>
      <label>{t("addr")}<input value={addr} onChange={(e) => setAddr(e.target.value)} /></label>
      <div><button type="button" className="btn alt" onClick={locate}><MapPin size={18} />{loc ? t("locDone") : t("loc")}</button></div>
      {err && <p role="alert" className="alert">{err}</p>}
      <button className="btn sos" disabled={busy || msg.trim().length < 10}>{busy ? t("Analysing your report…") : t("send")}</button>
    </form>
  );
}
