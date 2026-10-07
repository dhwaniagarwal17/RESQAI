import axios from "axios";

export const TOKEN = "resqai_token";
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api" });

api.interceptors.request.use((c) => {
  const t = localStorage.getItem(TOKEN);
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401 && !e.config?.url?.includes("/auth/")) {
      localStorage.removeItem(TOKEN);
      if (location.pathname !== "/login") location.assign("/login");
    }
    const d = e.response?.data;
    const detail = Array.isArray(d?.errors) ? d.errors.map((x) => x.msg).join(". ") : "";
    const err = new Error(detail || d?.message ||
      (e.response ? "Something went wrong. Please try again." : "Cannot reach the server. Check your connection and try again."));
    err.status = e.response?.status;
    return Promise.reject(err);
  }
);

// Backend wraps every success as { success, message?, data: {...} }
const data = (r) => r.data.data;

export const authApi = {
  login: (b) => api.post("/auth/login", b).then(data),        // -> { user, token }
  register: (b) => api.post("/auth/register", b).then(data),  // -> { user, token }
  me: () => api.get("/auth/me").then(data).then((d) => d.user),
};
export const incidentApi = {
  create: (b) => api.post("/incidents", b).then(data).then((d) => d.incident),
  mine: () => api.get("/incidents/my").then(data).then((d) => d.incidents),
  get: (id) => api.get(`/incidents/${id}`).then(data).then((d) => d.incident),
};
export const adminApi = {
  list: (params) => api.get("/admin/incidents", { params }).then((r) => ({
    incidents: r.data.data.incidents, total: r.data.total, page: r.data.page, totalPages: r.data.totalPages,
  })),
  stats: () => api.get("/admin/incidents/stats").then(data).then((d) => d.overview),
  teams: () => api.get("/admin/rescue-teams").then(data).then((d) => d.rescueTeams),
  assign: (id, rescueTeamId) => api.post(`/admin/incidents/${id}/assign`, { rescueTeamId }).then(data),
};
export const rescueApi = {
  list: () => api.get("/rescue/incidents").then(data).then((d) => d.incidents),
  setStatus: (id, status, notes) => api.patch(`/rescue/incidents/${id}/status`, { status, notes }).then(data),
};
