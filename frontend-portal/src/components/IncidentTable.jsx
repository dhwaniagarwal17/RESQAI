import { Link } from "react-router-dom";
import { usePrefs } from "../context/PrefContext";
import { STATUS, ORDER, PRIORITY, priorityOf, nice, ref, when, idOf } from "../utils";

export function Pill({ i }) {
  const { t } = usePrefs();
  const k = priorityOf(i);
  return <span className={`pill ${k}`}>{t(PRIORITY[k])}</span>;
}

export function Progress({ i }) {
  const cur = ORDER.indexOf(i.status);
  return (<>
    <div className="prog" role="img" aria-label={STATUS[i.status]}>{ORDER.map((_, n) => <i key={n} className={n <= cur ? "on" : ""} />)}</div>
    {STATUS[i.status] || i.status}
  </>);
}

export default function IncidentTable({ rows, action, empty }) {
  const { t } = usePrefs();
  if (!rows.length) return <div>{empty}</div>;
  return (
    <div className="scroll">
      <table className="tbl">
        <thead><tr><th>{t("Ref. no.")}</th><th>{t("Submitted")}</th><th>{t("Details")}</th><th>{t("Priority")}</th><th>{t("Status")}</th>{action && <th>{t("Action")}</th>}</tr></thead>
        <tbody>
          {rows.map((i) => (
            <tr key={idOf(i)}>
              <td data-l={t("Ref. no.")}><Link to={`/results/${idOf(i)}`}>{ref(i)}</Link></td>
              <td data-l={t("Submitted")}>{when(i.createdAt)}</td>
              <td data-l={t("Details")}>{i.message}<br /><small>{[i.location?.address, nice(i.category)].filter(Boolean).join(", ")}</small>
                {i.reporter?.name && <><br /><small>{t("Reported by")} {i.reporter.name}{i.reporter.phone && <>, <a href={`tel:${i.reporter.phone}`}>{i.reporter.phone}</a></>}</small></>}</td>
              <td data-l={t("Priority")}><Pill i={i} /></td>
              <td data-l={t("Status")}><Progress i={i} />{i.assignedRescueTeam?.name && <small>{i.assignedRescueTeam.name}</small>}</td>
              {action && <td data-l={t("Action")}>{action(i)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
