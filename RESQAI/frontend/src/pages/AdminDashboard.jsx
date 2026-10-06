import { useState } from "react";
import ReportTable from "../components/ReportTable";

const initial = [
  { id: 1, message: "Water is rising fast on our street. We need a boat for two elderly neighbours.", urgency: "HIGH", category: "requests or urgent needs", status: "en_route", address: "Gali 4, Model Town", team: "Team Alpha", eta: 12, t: "6 Oct, 9:12 am" },
  { id: 2, message: "Building collapsed near the main market. Two people are trapped.", urgency: "HIGH", category: "injured or dead people", status: "pending", address: "Hall Bazaar", t: "6 Oct, 9:40 am" },
  { id: 3, message: "Fallen trees are blocking the road near the bus stand.", urgency: "MEDIUM", category: "infrastructure damage", status: "pending", address: "Bus stand road", t: "6 Oct, 9:31 am" },
  { id: 4, message: "Community kitchen is open at the school ground for families who left their homes.", urgency: "LOW", category: "volunteering and donations", status: "pending", address: "Govt. school ground", t: "6 Oct, 8:55 am" }
];

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState(initial);

  const assign = (id, team) => {
    if (!team) return;
    setIncidents(xs => xs.map(i => i.id === id ? { ...i, team, status: "assigned" } : i));
  };

  const waiting = incidents.filter(i => i.status === "pending").length;
  const progress = incidents.filter(i => !["pending", "resolved"].includes(i.status)).length;
  const resolved = incidents.filter(i => i.status === "resolved").length;

  return (
    <div className="page">
      <div className="stats">
        <div className="stat"><b>{incidents.length}</b><span>Total reports</span></div>
        <div className="stat"><b>{waiting}</b><span>Waiting for a team</span></div>
        <div className="stat"><b>{progress}</b><span>In progress</span></div>
        <div className="stat"><b>{resolved}</b><span>Resolved</span></div>
      </div>
      <section className="box">
        <h2>All Incidents (most urgent first)</h2>
        <ReportTable incidents={incidents} action={i => i.status === "pending" ? (
          <div className="actions">
            <select defaultValue="" onChange={e => assign(i.id, e.target.value)} aria-label="Rescue team">
              <option value="">Choose team</option><option>Team Alpha</option><option>Team Bravo</option>
            </select>
          </div>
        ) : (i.team || "—")} />
      </section>
    </div>
  );
}