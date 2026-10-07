import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "lucide-react";
import { adminApi, incidentApi, rescueApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { usePrefs } from "../context/PrefContext";
import IncidentTable from "../components/IncidentTable";
import { NEXT, STATUS, idOf, priorityRank, usePoll } from "../utils";

function ReporterView() {
  const { t } = usePrefs(); const [rows, setRows] = useState(null); const [err, setErr] = useState("");
  usePoll(() => incidentApi.mine().then((r) => { setRows(r); setErr(""); }).catch((x) => setErr(x.message)));
  return (
    <section className="box"><h2>{t("mine")}</h2>
      {err && <div><p role="alert" className="alert">{err}</p></div>}
      <IncidentTable rows={rows || []} empty={rows ? <>{t("You have not sent a report yet.")} <Link to="/#report">{t("n_report")}</Link></> : t("Loading…")} />
    </section>
  );
}

function AdminView() {
  const { t } = usePrefs();
  const [rows, setRows] = useState([]); const [page, setPage] = useState(1); const [pages, setPages] = useState(1);
  const [status, setStatus] = useState(""); const [stats, setStats] = useState(null); const [teams, setTeams] = useState([]);
  const [pick, setPick] = useState({}); const [err, setErr] = useState("");

  const load = () => Promise.all([adminApi.list({ page, limit: 20, ...(status && { status }) }), adminApi.stats()])
    .then(([l, s]) => { setRows([...l.incidents].sort((a, b) => priorityRank(a) - priorityRank(b))); setPages(l.totalPages || 1); setStats(s); setErr(""); })
    .catch((x) => setErr(x.message));
  usePoll(load, 30000, [page, status]);
  useEffect(() => { adminApi.teams().then(setTeams).catch((x) => setErr(x.message)); }, []);

  async function assign(i) {
    try { await adminApi.assign(idOf(i), pick[idOf(i)]); load(); } catch (x) { setErr(x.message); }
  }
  return (<>
    {stats && <div className="stats">{[["Total reports", stats.total], ["Waiting for a team", stats.pending], ["Team assigned", stats.assigned], ["Resolved", stats.resolved]].map(([a, b]) => <div className="st" key={a}><b>{b}</b><span>{t(a)}</span></div>)}</div>}
    <section className="box"><h2>{t("All Incidents")}</h2>
      <div className="act">
        <select aria-label={t("Filter by status")} value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">{t("All statuses")}</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      {err && <div><p role="alert" className="alert">{err}</p></div>}
      <IncidentTable rows={rows} empty={t("No reports found.")} action={(i) => i.status === "pending" ? (
        <div className="act">
          <select aria-label={t("Rescue team")} value={pick[idOf(i)] || ""} onChange={(e) => setPick({ ...pick, [idOf(i)]: e.target.value })}>
            <option value="">{t("Choose team")}</option>{teams.map((x) => <option key={idOf(x)} value={idOf(x)}>{x.name}{x.teamId ? ` (${x.teamId})` : ""}</option>)}
          </select>
          <button className="btn sm" disabled={!pick[idOf(i)]} onClick={() => assign(i)}>{t("Assign")}</button>
        </div>) : (i.assignedRescueTeam?.name || "—")} />
      <div className="act">
        <button className="btn alt sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t("Previous")}</button>
        <span>{t("Page")} {page} / {pages}</span>
        <button className="btn alt sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>{t("Next")}</button>
      </div>
    </section>
  </>);
}

function RescueView() {
  const { t } = usePrefs(); const [rows, setRows] = useState(null); const [err, setErr] = useState("");
  const load = () => rescueApi.list().then((r) => { setRows(r); setErr(""); }).catch((x) => setErr(x.message));
  usePoll(load);
  async function step(i, s) { try { await rescueApi.setStatus(idOf(i), s); load(); } catch (x) { setErr(x.message); } }
  return (
    <section className="box"><h2>{t("My Jobs")}</h2>
      {err && <div><p role="alert" className="alert">{err}</p></div>}
      <IncidentTable rows={rows || []} empty={rows ? t("No jobs yet. When an admin assigns you one, it shows up here.") : t("Loading…")} action={(i) => (
        <div className="act">
          {i.location?.latitude != null && <a className="btn alt sm" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${i.location.latitude},${i.location.longitude}`}><Navigation size={16} />{t("Directions")}</a>}
          {NEXT[i.status] && <button className="btn sm" onClick={() => step(i, NEXT[i.status][0])}>{t(NEXT[i.status][1])}</button>}
        </div>)} />
    </section>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const View = { reporter: ReporterView, admin: AdminView, rescue_team: RescueView }[user.role] || ReporterView;
  return <div className="pg"><div><View /></div></div>;
}
