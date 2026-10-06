const ORDER = ["pending", "assigned", "accepted", "en_route", "on_site", "resolved"];
const LABELS = {
  pending: "Waiting for a rescue team",
  assigned: "Team assigned",
  accepted: "Team accepted the job",
  en_route: "Help is on the way",
  on_site: "Team is at the location",
  resolved: "Resolved"
};

export default function StatusProgress({ incident }) {
  const index = ORDER.indexOf(incident.status);
  return (
    <div>
      <div className="progress" aria-label={LABELS[incident.status]}>
        {ORDER.map((status, i) => <i key={status} className={i <= index ? "on" : ""} />)}
      </div>
      <span>{LABELS[incident.status]}</span>
      {incident.eta && incident.status === "en_route" && (
        <small className="block">Arriving in about {incident.eta} minutes</small>
      )}
    </div>
  );
}