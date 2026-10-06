import { useState } from "react";
import AlertBanner from "../components/AlertBanner";
import EmergencyNumbers from "../components/EmergencyNumbers";
import IncidentForm from "../components/IncidentForm";
import ReportTable from "../components/ReportTable";

export default function ReporterDashboard() {
  const [mine, setMine] = useState([{
    id: 1, message: "Water is rising fast on our street. We need a boat for two elderly neighbours.",
    urgency: "HIGH", category: "requests or urgent needs", status: "en_route",
    address: "Gali 4, Model Town", team: "Team Alpha", eta: 12, t: "6 Oct, 9:12 am"
  }]);
  const [sent, setSent] = useState(null);

  function addIncident(incident) {
    setMine(prev => [incident, ...prev]);
    setSent(incident);
  }

  return (
    <div className="page two">
      <div>
        <AlertBanner />
        <IncidentForm onCreated={addIncident} />
        {sent && <p className="success">Report submitted. Your reference number is <strong>RQ-{String(sent.id).padStart(4, "0")}</strong>.</p>}
        <section className="box" id="mine">
          <h2>Your reports</h2>
          <ReportTable incidents={mine} />
        </section>
      </div>
      <EmergencyNumbers />
    </div>
  );
}