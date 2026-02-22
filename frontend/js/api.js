// Módulo central de comunicación con la API del backend

// URL base de la API
const API_BASE = '/api';

/**
 * Función base para realizar peticiones HTTP al backend.
 * Maneja los encabezados, serialización del cuerpo y errores HTTP.
 */
async function request(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  // Serializar el cuerpo a JSON si se proporcionó un objeto
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  // Lanzar error si la respuesta no fue exitosa
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error HTTP ${response.status}`);
  }

  // Devolver null en respuestas vacías (ej: DELETE exitoso)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// Exportar todas las funciones de la API agrupadas por recurso
export const api = {
  // ------ Empleados ------
  employees: {
    getAll:    ()         => request('/employees'),
    getById:   (id)       => request(`/employees/${id}`),
    create:    (data)     => request('/employees', { method: 'POST', body: data }),
    update:    (id, data) => request(`/employees/${id}`, { method: 'PUT', body: data }),
    delete:    (id)       => request(`/employees/${id}`, { method: 'DELETE' }),
    getReport: (id)       => request(`/employees/${id}/report`),
  },

  // ------ Entrenamientos ------
  trainings: {
    getAll:   ()         => request('/trainings'),
    getById:  (id)       => request(`/trainings/${id}`),
    create:   (data)     => request('/trainings', { method: 'POST', body: data }),
    update:   (id, data) => request(`/trainings/${id}`, { method: 'PUT', body: data }),
    delete:   (id)       => request(`/trainings/${id}`, { method: 'DELETE' }),
    getStats: (id)       => request(`/trainings/${id}/stats`),
  },

  // ------ Sesiones ------
  sessions: {
    getAll:      ()             => request('/sessions'),
    create:      (data)         => request('/sessions', { method: 'POST', body: data }),
    getBetween:  (start, end)   => request(`/sessions/between?start=${start}&end=${end}`),
  },

  // ------ Inscripciones ------
  enrollments: {
    getAll:  ()     => request('/enrollments'),
    create:  (data) => request('/enrollments', { method: 'POST', body: data }),
  },

  // ------ Calificaciones ------
  grades: {
    getAll:  ()     => request('/grades'),
    create:  (data) => request('/grades', { method: 'POST', body: data }),
  },

  // ------ Reportes SQL ------
  reports: {
    topEmployees:      ()             => request('/reports/top-employees'),
    popularTrainings:  ()             => request('/reports/popular-trainings'),
    noGrades:          ()             => request('/reports/no-grades'),
    trainingAverages:  ()             => request('/reports/training-averages'),
    sessionsBetween:   (start, end)   => request(`/reports/sessions-between?start=${start}&end=${end}`),
    activeEmployees:   ()             => request('/reports/active-employees'),
    emptyTrainings:    ()             => request('/reports/empty-trainings'),
    ranking:           ()             => request('/reports/ranking'),
    lastSessions:      ()             => request('/reports/last-sessions'),
    worstEmployee:     ()             => request('/reports/worst-employee'),
  },

  // ------ Vistas ------
  views: {
    employeePerformance: () => request('/views/employee-performance'),
    trainingStats:       () => request('/views/training-stats'),
  },

  // ------ Feedback ------
  feedback: {
    getAll:        ()     => request('/feedback'),
    create:        (data) => request('/feedback', { method: 'POST', body: data }),
    getByEmployee: (id)   => request(`/feedback/${id}`),
  },

  // ------ Logs del sistema ------
  logs: {
    getAll:  ()     => request('/logs'),
    create:  (data) => request('/logs', { method: 'POST', body: data }),
  },
};
