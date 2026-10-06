import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== "false";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

export async function createIncident(payload) {
  if (USE_MOCK_API) {
    return {
      data: {
        id: Date.now(),
        message: payload.message,
        address: payload.address || "",
        urgency: /trapped|collapse|injur|fire|drown|bleed/i.test(payload.message)
          ? "HIGH"
          : "MEDIUM",
        category: /trapped|collapse|injur|fire|drown|bleed/i.test(payload.message)
          ? "injured or dead people"
          : "requests or urgent needs",
        status: "pending",
        t: "Just now"
      }
    };
  }

  return api.post("/incidents", payload);
}

export async function getIncidents() {
  if (USE_MOCK_API) return { data: [] };
  return api.get("/incidents");
}

export async function updateIncident(id, payload) {
  if (USE_MOCK_API) return { data: { id, ...payload } };
  return api.patch(`/incidents/${id}`, payload);
}

export async function loginUser(payload) {
  if (USE_MOCK_API) return { data: { ...payload, token: "local-demo-token" } };
  return api.post("/auth/login", payload);
}

export default api;