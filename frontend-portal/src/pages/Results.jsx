import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { incidentApi } from "../services/api";
import { usePrefs } from "../context/PrefContext";
import Loading from "../components/Loading";
import ResultCard from "../components/ResultCard";
import Sidebar from "../components/Sidebar";
import { STATUS, ref, when } from "../utils";

export default function Results() {
  const { id } = useParams(); const { state } = useLocation(); const { t } = usePrefs();
  const [i, setI] = useState(null); const [err, setErr] = useState("");
  useEffect(() => { incidentApi.get(id).then(setI).catch((x) => setErr(x.message)); }, [id]);
  if (err) return <div className="pg"><p role="alert" className="alert">{err}</p></div>;
  if (!i) return <Loading />;
  return (
    <div className="pg two">
      <div>
        {state?.sent && <p className="ok" role="status">{t("Report submitted. Your reference number is")} <strong>{ref(i)}</strong>.</p>}
        <ResultCard incident={i} />
        {i.assignedRescueTeam && <p className="ok">{t("Assigned team")}: <strong>{i.assignedRescueTeam.name}</strong>{i.assignedRescueTeam.phone && <> ({i.assignedRescueTeam.phone})</>}</p>}
        {i.statusHistory?.length > 0 && (
          <section className="box"><h2>{t("Status history")}</h2>
            <div className="scroll"><table className="tbl"><thead><tr><th>{t("When")}</th><th>{t("Status")}</th><th>{t("Notes")}</th></tr></thead>
              <tbody>{i.statusHistory.map((h, n) => <tr key={n}><td data-l={t("When")}>{when(h.updatedAt)}</td><td data-l={t("Status")}>{STATUS[h.status] || h.status}</td><td data-l={t("Notes")}>{h.notes}</td></tr>)}</tbody></table></div>
          </section>
        )}
        <Link className="btn alt" to="/dashboard">{t("Back to dashboard")}</Link>
      </div>
      <Sidebar />
    </div>
  );
}
