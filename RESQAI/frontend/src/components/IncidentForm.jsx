import { MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { createIncident } from "../services/api";

export default function IncidentForm({ onCreated }) {
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [locationAdded, setLocationAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      const response = await createIncident({ message: message.trim(), address });
      onCreated(response.data);
      setMessage("");
      setAddress("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="box emergency">
      <h2>Report an Incident</h2>
      <form className="form" onSubmit={submit}>
        <small>Say where you are and what help you need. A rescue coordinator sees it straight away.</small>
        <label>Tell us what is happening <span className="required">*</span>
          <textarea rows="4" required value={message} onChange={e => setMessage(e.target.value)}
            placeholder="For example: the building next to the market has collapsed and two people are trapped." />
        </label>
        <label>Street, area or landmark (optional)
          <input value={address} onChange={e => setAddress(e.target.value)} />
        </label>
        <button type="button" className="btn alt" onClick={() => setLocationAdded(true)}>
          <MapPin size={18} /> {locationAdded ? "Location added" : "Add my location"}
        </button>
        <button className="btn sos" disabled={loading}><Send size={18} /> {loading ? "Sending..." : "Send for help"}</button>
      </form>
      <p className="call"><Phone size={18} /> If someone's life is in danger, call <a href="tel:112">112</a> first.</p>
    </section>
  );
}