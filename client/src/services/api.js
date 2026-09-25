import axios from 'axios';

// Resolve base URL dynamically for production deployment and local development
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    const trimmed = envUrl.replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  // If deployed in production (e.g., Vercel) and VITE_API_URL is unset, default to the live Render backend
  if (import.meta.env.PROD) {
    return 'https://full-stack-48mb.onrender.com/api';
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token from localStorage for seamless cross-domain auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('designspace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error catching & session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      // If 401 unauthorized & not already on login/register/landing page, trigger session expiration event
      if (status === 401 && !['/login', '/register', '/'].includes(window.location.pathname)) {
        localStorage.removeItem('designspace_token');
        window.dispatchEvent(new CustomEvent('auth:expired', { detail: error.response.data }));
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
};

// Users Service APIs
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getProfessionals: (params) => api.get('/users/professionals', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  toggleStatus: (id) => api.patch(`/users/${id}/toggle-status`),
  verifyUser: (id) => api.patch(`/users/${id}/verify`),
};

// Projects Service APIs
export const projectsAPI = {
  getProjects: (params) => api.get('/projects', { params }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  assignProfessional: (id, data) => api.patch(`/projects/${id}/assign`, data),
  updateStatus: (id, data) => api.patch(`/projects/${id}/status`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  addRoom: (id, data) => api.post(`/projects/${id}/rooms`, data),
  updateRoom: (id, roomId, data) => api.patch(`/projects/${id}/rooms/${roomId}`, data),
  deleteRoom: (id, roomId) => api.delete(`/projects/${id}/rooms/${roomId}`),
  reviewRoomDesign: (id, roomId, data) => api.post(`/projects/${id}/rooms/${roomId}/review`, data),
  addHousePhoto: (id, data) => api.post(`/projects/${id}/photos`, data),
  // AI & Moodboard
  generateAIProposal: (id, roomId, data) => api.post(`/projects/${id}/rooms/${roomId}/ai-proposal`, data),
  convertAIToProjectData: (id, roomId) => api.post(`/projects/${id}/rooms/${roomId}/convert-ai`),
  addMoodboardItem: (id, roomId, data) => api.post(`/projects/${id}/rooms/${roomId}/moodboard`, data),
  // Quotations, Approvals & Quality
  createQuotation: (id, data) => api.post(`/projects/${id}/quotations`, data),
  reviewQuotation: (id, quoteId, data) => api.post(`/projects/${id}/quotations/${quoteId}/review`, data),
  recordApproval: (id, data) => api.post(`/projects/${id}/approvals`, data),
  addSiteVisit: (id, data) => api.post(`/projects/${id}/site-visits`, data),
  addIssue: (id, data) => api.post(`/projects/${id}/issues`, data),
  updateIssue: (id, issueId, data) => api.patch(`/projects/${id}/issues/${issueId}`, data),
  addSnag: (id, data) => api.post(`/projects/${id}/snags`, data),
  updateSnag: (id, snagId, data) => api.patch(`/projects/${id}/snags/${snagId}`, data),
  addProcurement: (id, data) => api.post(`/projects/${id}/procurement`, data),
  completeHandover: (id, data) => api.post(`/projects/${id}/handover`, data),
};

// Proposals Service APIs
export const proposalsAPI = {
  getProposals: (params) => api.get('/proposals', { params }),
  getProposalById: (id) => api.get(`/proposals/${id}`),
  createProposal: (data) => api.post('/proposals', data),
  updateProposal: (id, data) => api.put(`/proposals/${id}`, data),
  sendProposal: (id) => api.patch(`/proposals/${id}/send`),
  approveProposal: (id) => api.patch(`/proposals/${id}/approve`),
  rejectProposal: (id, data) => api.patch(`/proposals/${id}/reject`, data),
  requestRevision: (id, data) => api.post(`/proposals/${id}/revisions`, data),
};

// Revisions Service APIs
export const revisionsAPI = {
  getRevisions: (params) => api.get('/revisions', { params }),
  updateStatus: (id, data) => api.patch(`/revisions/${id}/status`, data),
};

// Tasks Service APIs
export const tasksAPI = {
  getTasks: (params) => api.get('/tasks', { params }),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  addComment: (id, data) => api.post(`/tasks/${id}/comments`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Materials Service APIs
export const materialsAPI = {
  getMaterials: (params) => api.get('/materials', { params }),
  createMaterial: (data) => api.post('/materials', data),
  updateMaterial: (id, data) => api.put(`/materials/${id}`, data),
  deleteMaterial: (id) => api.delete(`/materials/${id}`),
};

// Expenses & Budget Service APIs
export const expensesAPI = {
  getExpenses: (params) => api.get('/expenses', { params }),
  addExpense: (data) => api.post('/expenses', data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

// Milestones Service APIs
export const milestonesAPI = {
  getMilestones: (params) => api.get('/milestones', { params }),
  createMilestone: (data) => api.post('/milestones', data),
  updateMilestone: (id, data) => api.put(`/milestones/${id}`, data),
  deleteMilestone: (id) => api.delete(`/milestones/${id}`),
};

// Files Service APIs
export const filesAPI = {
  getFiles: (params) => api.get('/files', { params }),
  uploadFile: (formData) =>
    api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteFile: (id) => api.delete(`/files/${id}`),
};

// Notifications Service APIs
export const notificationsAPI = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Audit Logs Service APIs
export const auditLogsAPI = {
  getAuditLogs: (params) => api.get('/audit-logs', { params }),
};

// Analytics Service APIs
export const analyticsAPI = {
  getAdmin: () => api.get('/analytics/admin'),
  getClient: () => api.get('/analytics/client'),
  getDesigner: () => api.get('/analytics/designer'),
  getContractor: () => api.get('/analytics/contractor'),
};

export default api;
