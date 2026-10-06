import { useState } from "react";
import ReportTable from "../components/ReportTable";

const initial = [{
  id: 1, message: "Water is rising fast on our street. We need a boat for two elderly neighbours.",
  urgency: "HIGH", category: "requests or urgent needs", status: "assigned",
  address: "Gali 4, Model Town", team: "Team Alpha", eta: 12, t: "6 Oct, 9:12 am"
}];

const next = { assigned: ["accepted", "Accept job"], accepted: ["en_route", "On the way"], en_route: ["on_site", "Arrived"], on_site: ["resolved", "Mark resolved"] };

export default function RescueDashboard() {
  const [jobs, setJobs] = useState(initial);

  const advance = id => setJobs(xs => xs.map(i => i.id === id && next[i.status] ? { ...i, status: next[i.status][0] } : i));

  return (
    <div className="page">
      <section className="box">
        <h2>My Jobs</h2>
        {jobs.length ? <ReportTable incidents={jobs} action={i => (
          <button className="btn small" disabled={!next[i.status]} onClick={() => advance(i.id)}>
            {next[i.status]?.[1] || "Completed"}
          </button>
        )} /> : <div className="box-content">No jobs yet.</div>}
      </section>
    </div>
  );
}