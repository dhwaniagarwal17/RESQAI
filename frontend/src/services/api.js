import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me')
};

// Incident endpoints (Reporter)
export const incidentAPI = {
  create: (data) => API.post('/incidents', data),
  getById: (id) => API.get(`/incidents/${id}`),
  getMy: () => API.get('/incidents/my'),
  update: (id, data) => API.patch(`/incidents/${id}`, data)
};

// Admin endpoints
export const adminAPI = {
  getIncidents: (params) => API.get('/admin/incidents', { params }),
  getStats: () => API.get('/admin/incidents/stats'),
  updateIncident: (id, data) => API.patch(`/admin/incidents/${id}`, data),
  assignIncident: (id, rescueTeamId) => 
    API.post(`/admin/incidents/${id}/assign`, { rescueTeamId }),
  getRescueTeams: () => API.get('/admin/rescue-teams')
};

// Rescue Team endpoints
export const rescueAPI = {
  getIncidents: (params) => API.get('/rescue/incidents', { params }),
  getIncidentById: (id) => API.get(`/rescue/incidents/${id}`),
  updateStatus: (id, status, notes) => 
    API.patch(`/rescue/incidents/${id}/status`, { status, notes }),
  addNotes: (id, notes) => 
    API.post(`/rescue/incidents/${id}/notes`, { notes })
};

export default API;
