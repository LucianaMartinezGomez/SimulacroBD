// Componente Dashboard — muestra métricas generales y resumen de actividad

import { api } from '../api.js';

/**
 * Genera el HTML del spinner de carga centralizado.
 */
function spinnerHTML() {
  return `<div class="spinner-wrapper"><div class="spinner"></div></div>`;
}

/**
 * Genera el HTML de una caja de error con el mensaje proporcionado.
 */
function errorHTML(msg) {
  return `<div class="error-box">⚠️ ${msg}</div>`;
}

/**
 * Convierte una puntuación numérica en estrellas Unicode.
 */
function starsHTML(rating) {
  const full  = Math.round(Number(rating) || 0);
  const empty = 5 - full;
  return '⭐'.repeat(Math.max(0, full)) + '☆'.repeat(Math.max(0, empty));
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
 * Devuelve el emoji de medalla según la posición del ranking.
 */
function medalEmoji(index) {
  if (index === 0) return '🥇';
  if (index === 1) return '🥈';
  if (index === 2) return '🥉';
  return index + 1;
}

/**
 * Renderiza el Dashboard en el contenedor dado.
 * Muestra métricas clave, tablas de rendimiento y actividad reciente.
 */
export async function renderDashboard(container) {
  // Mostrar encabezado y spinner mientras se cargan los datos
  container.innerHTML = `
    <div class="page-header">
      <h1>📊 Dashboard</h1>
      <p>Resumen general del sistema DataTrain Corp</p>
    </div>
    ${spinnerHTML()}
  `;

  try {
    // Obtener todos los datos en paralelo para optimizar el tiempo de carga
    const [employees, trainings, enrollments, rankingData, perfData, trainingStats, feedbackData, logsData] =
      await Promise.allSettled([
        api.employees.getAll(),
        api.trainings.getAll(),
        api.enrollments.getAll(),
        api.reports.ranking(),
        api.views.employeePerformance(),
        api.views.trainingStats(),
        api.feedback.getAll(),
        api.logs.getAll(),
      ]);

    // Extraer valores o arrays vacíos en caso de error
    const empList      = employees.status      === 'fulfilled' ? employees.value      : [];
    const trainList    = trainings.status       === 'fulfilled' ? trainings.value      : [];
    const enrollList   = enrollments.status     === 'fulfilled' ? enrollments.value    : [];
    const ranking      = rankingData.status     === 'fulfilled' ? rankingData.value    : [];
    const perfList     = perfData.status        === 'fulfilled' ? perfData.value       : [];
    const tStatsList   = trainingStats.status   === 'fulfilled' ? trainingStats.value  : [];
    const feedList     = feedbackData.status    === 'fulfilled' ? feedbackData.value   : [];
    const logList      = logsData.status        === 'fulfilled' ? logsData.value       : [];

    // Calcular promedio general a partir del ranking
    const scores = ranking.map(r => parseFloat(r.promedio || r.average || r.score || 0)).filter(Boolean);
    const avgGeneral = scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
      : '—';

    // Construir tarjetas de métricas
    const metricsHTML = `
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">👥</div>
          <div class="metric-info">
            <h3>${empList.length}</h3>
            <p>Total Empleados</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">📚</div>
          <div class="metric-info">
            <h3>${trainList.length}</h3>
            <p>Total Entrenamientos</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">📝</div>
          <div class="metric-info">
            <h3>${enrollList.length}</h3>
            <p>Total Inscripciones</p>
          </div>
        </div>
        <div class="metric-card">
          <div class="metric-icon">⭐</div>
          <div class="metric-info">
            <h3>${avgGeneral}</h3>
            <p>Promedio General</p>
          </div>
        </div>
      </div>
    `;

    // Tabla Top 5 Empleados con medallas
    const top5Rows = perfList.slice(0, 5).map((emp, i) => `
      <tr>
        <td>${medalEmoji(i)}</td>
        <td>${emp.nombre || emp.name || emp.full_name || '—'}</td>
        <td>${emp.departamento || emp.department || '—'}</td>
        <td>${parseFloat(emp.promedio || emp.average || 0).toFixed(2)}</td>
      </tr>
    `).join('') || `<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Sin datos</td></tr>`;

    // Tabla Entrenamientos Populares
    const tStatsRows = tStatsList.slice(0, 5).map(t => `
      <tr>
        <td>${t.titulo || t.title || t.nombre || '—'}</td>
        <td>${t.inscritos || t.enrolled || t.total || 0}</td>
        <td>${parseFloat(t.promedio || t.average || 0).toFixed(2)}</td>
      </tr>
    `).join('') || `<tr><td colspan="3" style="text-align:center;color:var(--text-muted)">Sin datos</td></tr>`;

    // Feedback reciente (últimos 5)
    const recentFeedback = feedList.slice(-5).reverse().map(f => `
      <div class="feedback-item">
        <div class="stars">${starsHTML(f.rating || f.calificacion || 0)}</div>
        <div class="comment">${f.comment || f.comentario || f.comments || 'Sin comentario'}</div>
        <div class="meta">${formatDate(f.created_at || f.fecha)}</div>
      </div>
    `).join('') || '<p style="color:var(--text-muted);font-size:.88rem">Sin feedback registrado.</p>';

    // Actividad reciente de logs (últimos 5)
    const recentLogs = logList.slice(-5).reverse().map(l => {
      const action = (l.action || l.accion || '').toUpperCase();
      const badgeClass = action.includes('CREATE') || action.includes('INSERT') ? 'create'
        : action.includes('UPDATE') ? 'update'
        : action.includes('DELETE') ? 'delete'
        : 'default';
      return `
        <div class="log-item">
          <span class="action-badge ${badgeClass}">${action || 'LOG'}</span>
          <span>${l.description || l.detalle || l.details || l.user || '—'}</span>
          <span class="log-timestamp">${formatDate(l.timestamp || l.created_at || l.fecha)}</span>
        </div>
      `;
    }).join('') || '<p style="color:var(--text-muted);font-size:.88rem">Sin actividad reciente.</p>';

    // Renderizar todo el contenido del dashboard
    container.innerHTML = `
      <div class="page-header">
        <h1>📊 Dashboard</h1>
        <p>Resumen general del sistema DataTrain Corp</p>
      </div>

      ${metricsHTML}

      <div class="two-col-grid">
        <div class="table-card">
          <div class="table-card-header">🏆 Top 5 Empleados</div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Nombre</th><th>Depto.</th><th>Prom.</th>
                </tr>
              </thead>
              <tbody>${top5Rows}</tbody>
            </table>
          </div>
        </div>

        <div class="table-card">
          <div class="table-card-header">🔥 Entrenamientos Populares</div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Entrenamiento</th><th>Inscritos</th><th>Prom.</th>
                </tr>
              </thead>
              <tbody>${tStatsRows}</tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="two-col-grid">
        <div class="table-card">
          <div class="table-card-header">💬 Feedback Reciente</div>
          <div style="padding:1rem">
            <div class="feedback-list">${recentFeedback}</div>
          </div>
        </div>

        <div class="table-card">
          <div class="table-card-header">🕐 Actividad Reciente</div>
          <div style="padding:1rem">
            <div class="log-list">${recentLogs}</div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    // Mostrar error si alguna petición crítica falla
    container.innerHTML = `
      <div class="page-header"><h1>📊 Dashboard</h1></div>
      ${errorHTML(`No se pudo cargar el dashboard: ${err.message}`)}
    `;
  }
}
