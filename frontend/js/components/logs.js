// Componente Logs — tabla de registros de actividad del sistema

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
 * Formatea una fecha ISO a formato legible con hora.
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

/**
 * Determina la clase CSS de la insignia de acción según el tipo de operación.
 */
function badgeClass(action) {
  const a = (action || '').toUpperCase();
  if (a.includes('CREATE') || a.includes('INSERT')) return 'create';
  if (a.includes('UPDATE') || a.includes('EDIT'))   return 'update';
  if (a.includes('DELETE') || a.includes('REMOVE')) return 'delete';
  return 'default';
}

/**
 * Construye las filas de la tabla de logs.
 */
function buildRows(logs) {
  if (!logs.length) {
    return `<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No hay registros de actividad.</td></tr>`;
  }

  // Mostrar los logs más recientes primero
  return [...logs].reverse().map(l => {
    const action  = l.action  || l.accion   || 'LOG';
    const user    = l.user    || l.usuario   || l.performed_by || '—';
    const details = l.details || l.detalle  || l.description  || '—';
    const ts      = l.timestamp || l.created_at || l.fecha;

    return `
      <tr>
        <td><span class="action-badge ${badgeClass(action)}">${action}</span></td>
        <td>${user}</td>
        <td>${formatDate(ts)}</td>
        <td style="max-width:300px;word-break:break-word">${details}</td>
      </tr>
    `;
  }).join('');
}

/**
 * Renderiza el componente de Logs del sistema en el contenedor dado.
 * Muestra todos los registros de actividad con insignias de color por tipo.
 */
export async function renderLogs(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>📋 Logs del Sistema</h1>
      <p>Registro de todas las operaciones realizadas en DataTrain Corp</p>
    </div>
    ${spinnerHTML()}
  `;

  let logs = [];
  try {
    logs = await api.logs.getAll();
  } catch (err) {
    container.innerHTML = `
      <div class="page-header"><h1>📋 Logs del Sistema</h1></div>
      ${errorHTML(`No se pudieron cargar los logs: ${err.message}`)}
    `;
    return;
  }

  container.innerHTML = `
    <div class="page-header">
      <h1>📋 Logs del Sistema</h1>
      <p>Registro de todas las operaciones realizadas en DataTrain Corp</p>
    </div>

    <!-- Leyenda de colores de las insignias -->
    <div style="display:flex;gap:.6rem;margin-bottom:1rem;flex-wrap:wrap;align-items:center">
      <span style="font-size:.82rem;color:var(--text-muted)">Tipos de acción:</span>
      <span class="action-badge create">CREATE</span>
      <span class="action-badge update">UPDATE</span>
      <span class="action-badge delete">DELETE</span>
    </div>

    <!-- Tabla de logs -->
    <div class="table-card">
      <div class="table-card-header">
        🕐 Actividad del Sistema
        <span style="font-size:.8rem;color:var(--text-muted);margin-left:auto">
          ${logs.length} registro${logs.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Acción</th>
              <th>Usuario</th>
              <th>Timestamp</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody id="logs-tbody">
            ${buildRows(logs)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
