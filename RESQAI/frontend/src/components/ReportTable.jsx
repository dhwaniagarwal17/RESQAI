import StatusProgress from "./StatusProgress";

const rank = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export default function ReportTable({ incidents, action }) {
  const sorted = [...incidents].sort((a, b) => rank[a.urgency] - rank[b.urgency]);
  return (
    <div className="table-scroll">
      <table className="report-table">
        <thead><tr><th>Ref. no.</th><th>Submitted</th><th>Details</th><th>Urgency</th><th>Status</th>{action && <th>Action</th>}</tr></thead>
        <tbody>
          {sorted.map((i) => (
            <tr key={i.id}>
              <td data-label="Ref. no.">RQ-{String(i.id).padStart(4, "0")}</td>
              <td data-label="Submitted">{i.t}</td>
              <td data-label="Details">{i.message}<br /><small>{i.address ? `${i.address}, ` : ""}{i.category}</small></td>
              <td data-label="Urgency"><span className={`pill ${i.urgency.toLowerCase()}`}>{i.urgency}</span></td>
              <td data-label="Status"><StatusProgress incident={i} /></td>
              {action && <td data-label="Action">{action(i)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}