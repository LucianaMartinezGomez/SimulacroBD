// Componente Sesiones — listado con filtro por fechas y creación de sesiones

import { api } from '../api.js';

/**
 * Genera el HTML del spinner de carga.
 */
function spinnerHTML() {
  return `<div class="spinner-wrapper"><div class="spinner"></div></div>`;
}

/**
 * Genera el HTML de una caja de error.
 */
function errorHTML(msg) {
  return `<div class="error-box">⚠️ ${msg}</div>`;
}

/**
 * Formatea una fecha ISO a formato legible en español.
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

/**
 * Construye las filas de la tabla de sesiones.
 */
function buildRows(sessions) {
  if (!sessions.length) {
    return `<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">No se encontraron sesiones.</td></tr>`;
  }
  return sessions.map(s => `
    <tr>
      <td>${s.id || s.session_id}</td>
      <td>${s.title || s.titulo || '—'}</td>
      <td>${s.training_title || s.titulo_entrenamiento || s.training_id || '—'}</td>
      <td>${formatDate(s.session_date || s.fecha_sesion || s.date)}</td>
      <td>${s.duration_minutes || s.duracion_min || '—'} min</td>
      <td>${s.location || s.ubicacion || '—'}</td>
    </tr>
  `).join('');
}

/**
 * Renderiza el componente de Sesiones en el contenedor dado.
 * Incluye filtro por rango de fechas, tabla de resultados y formulario de creación.
 */
export async function renderSessions(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>🗓️ Sesiones</h1>
      <p>Consulta y registro de sesiones de entrenamiento</p>
    </div>
    ${spinnerHTML()}
  `;

  // Obtener la lista inicial de sesiones y entrenamientos para el formulario
  let sessions  = [];
  let trainings = [];
  try {
    [sessions, trainings] = await Promise.all([
      api.sessions.getAll(),
      api.trainings.getAll(),
    ]);
  } catch (err) {
    container.innerHTML = `
      <div class="page-header"><h1>🗓️ Sesiones</h1></div>
      ${errorHTML(`No se pudieron cargar las sesiones: ${err.message}`)}
    `;
    return;
  }

  // Construir opciones del selector de entrenamientos
  const trainingOptions = trainings.map(t =>
    `<option value="${t.id || t.training_id}">${t.title || t.titulo || t.id}</option>`
  ).join('');

  container.innerHTML = `
    <div class="page-header">
      <h1>🗓️ Sesiones</h1>
      <p>Consulta y registro de sesiones de entrenamiento</p>
    </div>

    <!-- Filtro de búsqueda por rango de fechas -->
    <div class="form-card">
      <h2>🔍 Filtrar por fechas</h2>
      <div class="date-range">
        <div class="form-group">
          <label for="filter-start">Fecha inicio</label>
          <input id="filter-start" type="date" />
        </div>
        <div class="form-group">
          <label for="filter-end">Fecha fin</label>
          <input id="filter-end" type="date" />
        </div>
        <button class="btn btn-primary" id="btn-filter">🔎 Buscar</button>
        <button class="btn btn-secondary" id="btn-clear-filter">✖ Limpiar</button>
      </div>
      <div id="filter-error"></div>
    </div>

    <!-- Tabla de sesiones -->
    <div class="table-card">
      <div class="table-card-header">📋 Lista de Sesiones</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Título</th><th>Entrenamiento</th><th>Fecha</th>
              <th>Duración</th><th>Ubicación</th>
            </tr>
          </thead>
          <tbody id="sessions-tbody">
            ${buildRows(sessions)}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Formulario para registrar una nueva sesión -->
    <div class="form-card">
      <h2>➕ Nueva Sesión</h2>
      <div id="session-form-error"></div>
      <form id="session-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="sess-title">Título de la sesión</label>
            <input id="sess-title" name="title" type="text" placeholder="Ej: Sesión 1 — Introducción" />
          </div>
          <div class="form-group">
            <label for="sess-training">Entrenamiento</label>
            <select id="sess-training" name="training_id" required>
              <option value="">— Seleccionar —</option>
              ${trainingOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="sess-date">Fecha de sesión</label>
            <input id="sess-date" name="session_date" type="date" required />
          </div>
          <div class="form-group">
            <label for="sess-dur">Duración (minutos)</label>
            <input id="sess-dur" name="duration_minutes" type="number" min="1" placeholder="60" />
          </div>
          <div class="form-group">
            <label for="sess-loc">Ubicación</label>
            <input id="sess-loc" name="location" type="text" placeholder="Sala A, Virtual, etc." />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">💾 Registrar Sesión</button>
        </div>
      </form>
    </div>
  `;

  // Referencias a elementos del DOM
  const tbody       = container.querySelector('#sessions-tbody');
  const filterError = container.querySelector('#filter-error');
  const formError   = container.querySelector('#session-form-error');
  const form        = container.querySelector('#session-form');

  /**
   * Actualiza la tabla con las sesiones proporcionadas.
   */
  function updateTable(data) {
    tbody.innerHTML = buildRows(data);
  }

  // Aplicar filtro por rango de fechas
  container.querySelector('#btn-filter').addEventListener('click', async () => {
    const start = container.querySelector('#filter-start').value;
    const end   = container.querySelector('#filter-end').value;
    filterError.innerHTML = '';

    if (!start || !end) {
      filterError.innerHTML = errorHTML('Selecciona ambas fechas para filtrar.');
      return;
    }

    try {
      const result = await api.sessions.getBetween(start, end);
      updateTable(result);
    } catch (err) {
      filterError.innerHTML = errorHTML(err.message);
    }
  });

  // Limpiar filtro y mostrar todas las sesiones
  container.querySelector('#btn-clear-filter').addEventListener('click', async () => {
    filterError.innerHTML = '';
    container.querySelector('#filter-start').value = '';
    container.querySelector('#filter-end').value   = '';
    try {
      const all = await api.sessions.getAll();
      updateTable(all);
    } catch (err) {
      filterError.innerHTML = errorHTML(err.message);
    }
  });

  // Envío del formulario para crear una nueva sesión
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.innerHTML = '';

    const data = {
      training_id:      Number(form.training_id.value),
      title:            form.title.value.trim(),
      session_date:     form.session_date.value,
      duration_minutes: Number(form.duration_minutes.value) || null,
      location:         form.location.value.trim(),
    };

    try {
      await api.sessions.create(data);
      form.reset();
      // Refrescar la tabla con todas las sesiones actualizadas
      const all = await api.sessions.getAll();
      updateTable(all);
    } catch (err) {
      formError.innerHTML = errorHTML(err.message);
    }
  });
}
