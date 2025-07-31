import axios from 'axios'

// Configurazione base API - Auto-detection supporto
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (() => {
  // Fallback IP detection per ambienti senza .env configurato
  const hostname = window.location.hostname
  const port = '3000'
  return `http://${hostname}:${port}/api/v1`
})()

// Crea istanza axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: true // ✅ Importante per inviare cookie httpOnly
})

// Interceptor per aggiungere token di autenticazione
apiClient.interceptors.request.use(
  async (config) => {
    // Aggiungi token di autenticazione (fallback per header Authorization)
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor per gestire risposte e errori
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    
    return Promise.reject({
      message: error.response?.data?.error || error.message,
      status: error.response?.status,
      data: error.response?.data,
      code: error.response?.data?.code
    })
  }
)

// API Services
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  refreshToken: () => apiClient.post('/auth/refresh-token'),
  getProfile: () => apiClient.get('/auth/profile')
}

export const healthAPI = {
  check: () => apiClient.get('/health'),
  system: () => apiClient.get('/health/system')
}

export const hrmsAPI = {
  // Employee Management
  getEmployees: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/employees${queryString ? `?${queryString}` : ''}`);
  },
  getEmployee: (id) => apiClient.get(`/employees/${id}`),
  createEmployee: (data) => apiClient.post('/employees', data),
  updateEmployee: (id, data) => apiClient.put(`/employees/${id}`, data),
  deleteEmployee: (id, reason = '') => apiClient.delete(`/employees/${id}`, { data: { reason } }),
  
  // Employee Operations
  getEmployeesByDepartment: (department) => apiClient.get(`/employees/department/${department}`),
  getDirectReports: (managerId) => apiClient.get(`/employees/${managerId}/direct-reports`),
  searchEmployees: (searchTerm) => apiClient.get(`/employees/search?q=${encodeURIComponent(searchTerm)}`),
  
  // Performance Management
  addPerformanceReview: (employeeId, reviewData) => 
    apiClient.post(`/employees/${employeeId}/performance-review`, reviewData),
  
  // Statistics and Analytics
  getEmployeeStats: () => apiClient.get('/employees/stats'),
  
  // Additional HR Features
  getEmployeeTimeline: (id) => apiClient.get(`/employees/${id}/timeline`),
  getEmployeeDocuments: (id) => apiClient.get(`/employees/${id}/documents`),
  getEmployeeTimeOff: (id) => apiClient.get(`/employees/${id}/time-off`),
  getEmployeePayroll: (id) => apiClient.get(`/employees/${id}/payroll`),
  getOrgChart: () => apiClient.get('/employees/org-chart/data')
}

export const noseAPI = {
  getDashboard: () => apiClient.get('/nose/dashboard'),
  getProjects: () => apiClient.get('/nose/projects'),
  createProject: (data) => apiClient.post('/nose/projects', data),
  updateProject: (id, data) => apiClient.put(`/nose/projects/${id}`, data),
  deleteProject: (id) => apiClient.delete(`/nose/projects/${id}`)
}

export const webHunterAPI = {
  getDashboard: () => apiClient.get('/web-hunter/dashboard'),
  getJobs: () => apiClient.get('/web-hunter/jobs'),
  createJob: (data) => apiClient.post('/web-hunter/jobs', data),
  getModels: () => apiClient.get('/web-hunter/models'),
  createModel: (data) => apiClient.post('/web-hunter/models', data)
}

export const monitoringAPI = {
  getDashboard: () => apiClient.get('/monitoring/dashboard'),
  getSession: () => apiClient.get('/monitoring/session'),
  getBackups: () => apiClient.get('/monitoring/backups'),
  getSnapshots: () => apiClient.get('/monitoring/snapshots')
}

// Utility functions
export const handleApiError = (error) => {
  console.error('API Error:', error)
  
  if (error.status === 401) {
    return 'Sessione scaduta. Effettua nuovamente il login.'
  }
  
  if (error.status === 403) {
    return 'Non hai i permessi per questa operazione.'
  }
  
  if (error.status === 404) {
    return 'Risorsa non trovata.'
  }
  
  if (error.status >= 500) {
    return 'Errore del server. Riprova più tardi.'
  }
  
  return error.message || 'Si è verificato un errore imprevisto.'
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken')
}

export const logout = () => {
  localStorage.removeItem('authToken')
  window.location.href = '/login'
}

export { apiClient }
export default apiClient