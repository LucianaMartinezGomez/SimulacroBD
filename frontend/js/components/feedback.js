// Componente Feedback — formulario de envío y listado de feedback

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
 * Convierte una calificación numérica en estrellas Unicode.
 */
function starsHTML(rating) {
  const full  = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  const empty = 5 - full;
  return '⭐'.repeat(full) + '☆'.repeat(empty);
}

/**
 * Formatea una fecha ISO a formato legible en español.
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/**
 * Construye el HTML de la lista de feedback.
 */
function buildFeedbackList(feedbackItems) {
  if (!feedbackItems.length) {
    return '<p style="color:var(--text-muted);font-size:.88rem">No hay feedback registrado.</p>';
  }

  return feedbackItems.map(f => {
    const rating  = f.rating || f.calificacion || 0;
    const comment = f.comment || f.comentario || f.comments || 'Sin comentario.';
    const date    = formatDate(f.created_at || f.fecha);
    const empName = f.employee_name || f.nombre_empleado || `Empleado #${f.employee_id}`;
    const trainTitle = f.training_title || f.titulo_entrenamiento || `Entrenamiento #${f.training_id}`;

    return `
      <div class="feedback-item">
        <div class="stars">${starsHTML(rating)} <strong>${rating}/5</strong></div>
        <div class="comment">${comment}</div>
        <div class="meta">
          👤 ${empName} &nbsp;|&nbsp; 📚 ${trainTitle} &nbsp;|&nbsp; 🕐 ${date}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Renderiza el componente de Feedback en el contenedor dado.
 * Incluye formulario para enviar nuevo feedback y lista de feedback existente.
 */
export async function renderFeedback(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>💬 Feedback</h1>
      <p>Opiniones y calificaciones de los empleados sobre los entrenamientos</p>
    </div>
    ${spinnerHTML()}
  `;

  // Obtener datos necesarios para el formulario y la lista
  let feedbackList = [];
  let employees    = [];
  let trainings    = [];

  try {
    [feedbackList, employees, trainings] = await Promise.all([
      api.feedback.getAll(),
      api.employees.getAll(),
      api.trainings.getAll(),
    ]);
  } catch (err) {
    container.innerHTML = `
      <div class="page-header"><h1>💬 Feedback</h1></div>
      ${errorHTML(`No se pudo cargar el feedback: ${err.message}`)}
    `;
    return;
  }

  // Opciones de empleados y entrenamientos para el formulario
  const empOptions = employees.map(e =>
    `<option value="${e.id || e.employee_id}">${e.first_name || ''} ${e.last_name || ''}</option>`
  ).join('');

  const trainOptions = trainings.map(t =>
    `<option value="${t.id || t.training_id}">${t.title || t.titulo || t.id}</option>`
  ).join('');

  container.innerHTML = `
    <div class="page-header">
      <h1>💬 Feedback</h1>
      <p>Opiniones y calificaciones de los empleados sobre los entrenamientos</p>
    </div>

    <!-- Formulario para enviar nuevo feedback -->
    <div class="form-card">
      <h2>➕ Enviar Feedback</h2>
      <div id="feedback-form-error"></div>
      <form id="feedback-form">
        <div class="form-grid">
          <div class="form-group">
            <label for="fb-emp">Empleado</label>
            <select id="fb-emp" name="employee_id" required>
              <option value="">— Seleccionar empleado —</option>
              ${empOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="fb-train">Entrenamiento</label>
            <select id="fb-train" name="training_id" required>
              <option value="">— Seleccionar entrenamiento —</option>
              ${trainOptions}
            </select>
          </div>
          <div class="form-group">
            <label for="fb-rating">Calificación (1–5)</label>
            <input id="fb-rating" name="rating" type="number" min="1" max="5" placeholder="5" required />
          </div>
          <div class="form-group" style="grid-column: 1 / -1">
            <label for="fb-comment">Comentario</label>
            <textarea id="fb-comment" name="comment" placeholder="Escribe tu opinión sobre el entrenamiento..."></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">📤 Enviar Feedback</button>
        </div>
      </form>
    </div>

    <!-- Lista de feedback recibido -->
    <div class="table-card">
      <div class="table-card-header">📋 Feedback Registrado (${feedbackList.length})</div>
      <div style="padding: 1rem" id="feedback-list">
        <div class="feedback-list">
          ${buildFeedbackList(feedbackList)}
        </div>
      </div>
    </div>
  `;

  const form      = container.querySelector('#feedback-form');
  const formError = container.querySelector('#feedback-form-error');
  const listDiv   = container.querySelector('#feedback-list');

  /**
   * Actualiza la lista de feedback con los datos más recientes.
   */
  async function refreshList() {
    try {
      const fresh = await api.feedback.getAll();
      listDiv.innerHTML = `<div class="feedback-list">${buildFeedbackList(fresh)}</div>`;
      // Actualizar contador en el encabezado
      container.querySelector('.table-card-header').textContent =
        `📋 Feedback Registrado (${fresh.length})`;
    } catch {
      listDiv.innerHTML = errorHTML('No se pudo actualizar la lista.');
    }
  }

  // Envío del formulario de feedback
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.innerHTML = '';

    const data = {
      employee_id: Number(form.employee_id.value),
      training_id: Number(form.training_id.value),
      rating:      Number(form.rating.value),
      comment:     form.comment.value.trim(),
    };

    try {
      await api.feedback.create(data);
      form.reset();
      await refreshList();
    } catch (err) {
      formError.innerHTML = errorHTML(err.message);
    }
  });
}
