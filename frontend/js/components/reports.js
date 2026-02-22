// Componente Reportes — muestra los 10 reportes SQL como secciones expandibles

import { api } from '../api.js';

/**
 * Genera el HTML de una caja de error.
 */
function errorHTML(msg) {
  return `<div class="error-box">⚠️ ${msg}</div>`;
}

/**
 * Genera el HTML del spinner de carga pequeño para dentro de cada reporte.
 */
function miniSpinner() {
  return `<div class="spinner-wrapper" style="padding:1.2rem"><div class="spinner"></div></div>`;
}

/**
 * Convierte un array de objetos en una tabla HTML dinámica.
 * Las columnas se generan a partir de las claves del primer objeto.
 */
function tableFromData(data) {
  if (!data || !data.length) {
    return '<p style="color:var(--text-muted);font-size:.88rem">Sin resultados.</p>';
  }

  const headers = Object.keys(data[0]);
  const thead = `<thead><tr>${headers.map(h =>
    `<th>${h.replace(/_/g, ' ').toUpperCase()}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${data.map(row =>
    `<tr>${headers.map(h => `<td>${row[h] ?? '—'}</td>`).join('')}</tr>`
  ).join('')}</tbody>`;

  return `<div class="table-wrapper"><table>${thead}${tbody}</table></div>`;
}

/**
 * Crea una sección de reporte expandible con título, descripción y botón de ejecución.
 * Retorna el elemento DOM y registra los eventos de clic.
 */
function createReportSection({ id, title, description, fetchFn, extraHTML = '' }) {
  const section = document.createElement('div');
  section.className = 'report-section';
  section.innerHTML = `
    <div class="report-header" data-id="${id}">
      <div>
        <div class="report-title">${title}</div>
        <div class="report-desc">${description}</div>
      </div>
      <span class="toggle-icon">▶</span>
    </div>
    <div class="report-body" id="body-${id}">
      ${extraHTML}
      <button class="btn btn-primary btn-sm btn-run" style="margin-bottom:.8rem">
        ▶ Ejecutar
      </button>
      <div class="report-result"></div>
    </div>
  `;

  const header     = section.querySelector('.report-header');
  const body       = section.querySelector('.report-body');
  const toggleIcon = section.querySelector('.toggle-icon');
  const btnRun     = section.querySelector('.btn-run');
  const resultDiv  = section.querySelector('.report-result');

  // Expandir/colapsar la sección al hacer clic en el encabezado
  header.addEventListener('click', () => {
    const isOpen = body.classList.toggle('open');
    header.classList.toggle('open', isOpen);
    toggleIcon.textContent = isOpen ? '▼' : '▶';
  });

  // Ejecutar el reporte y mostrar los resultados
  btnRun.addEventListener('click', async (e) => {
    e.stopPropagation();
    resultDiv.innerHTML = miniSpinner();
    try {
      const data = await fetchFn(section);
      resultDiv.innerHTML = tableFromData(Array.isArray(data) ? data : [data]);
    } catch (err) {
      resultDiv.innerHTML = errorHTML(err.message);
    }
  });

  return section;
}

/**
 * Renderiza el componente de Reportes SQL en el contenedor dado.
 * Presenta 10 reportes como secciones expandibles.
 */
export async function renderReports(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>📊 Reportes SQL</h1>
      <p>Consultas analíticas sobre la base de datos de DataTrain Corp</p>
    </div>
    <div id="reports-container"></div>
  `;

  const reportsContainer = container.querySelector('#reports-container');

  // Definición de los 10 reportes disponibles
  const reportDefs = [
    {
      id: 'r1',
      title: '1. Top 5 Empleados con Mejor Promedio',
      description: 'Los cinco empleados con mayor promedio de calificaciones en entrenamientos.',
      fetchFn: () => api.reports.topEmployees(),
    },
    {
      id: 'r2',
      title: '2. Entrenamientos con Más Inscritos',
      description: 'Ranking de entrenamientos ordenados por número de inscripciones.',
      fetchFn: () => api.reports.popularTrainings(),
    },
    {
      id: 'r3',
      title: '3. Empleados sin Calificaciones',
      description: 'Empleados que están inscritos pero aún no tienen ninguna calificación registrada.',
      fetchFn: () => api.reports.noGrades(),
    },
    {
      id: 'r4',
      title: '4. Promedio de Calificación por Entrenamiento',
      description: 'Calificación promedio obtenida por los participantes en cada entrenamiento.',
      fetchFn: () => api.reports.trainingAverages(),
    },
    {
      id: 'r5',
      title: '5. Sesiones entre Fechas',
      description: 'Lista de sesiones programadas dentro de un rango de fechas específico.',
      // Este reporte requiere entradas de fecha adicionales
      extraHTML: `
        <div class="date-range" style="margin-bottom:.5rem">
          <div class="form-group">
            <label>Fecha inicio</label>
            <input type="date" class="r5-start" />
          </div>
          <div class="form-group">
            <label>Fecha fin</label>
            <input type="date" class="r5-end" />
          </div>
        </div>
      `,
      fetchFn: (section) => {
        const start = section.querySelector('.r5-start').value;
        const end   = section.querySelector('.r5-end').value;
        if (!start || !end) throw new Error('Selecciona ambas fechas.');
        return api.reports.sessionsBetween(start, end);
      },
    },
    {
      id: 'r6',
      title: '6. Empleados con Más de 3 Entrenamientos',
      description: 'Empleados que tienen inscripciones en más de tres entrenamientos distintos.',
      fetchFn: () => api.reports.activeEmployees(),
    },
    {
      id: 'r7',
      title: '7. Entrenamientos sin Inscritos',
      description: 'Entrenamientos que no tienen ningún empleado inscrito.',
      fetchFn: () => api.reports.emptyTrainings(),
    },
    {
      id: 'r8',
      title: '8. Ranking General de Desempeño',
      description: 'Clasificación global de todos los empleados según sus calificaciones promedio.',
      fetchFn: () => api.reports.ranking(),
    },
    {
      id: 'r9',
      title: '9. Última Sesión de Cada Entrenamiento',
      description: 'Fecha y datos de la sesión más reciente registrada por cada entrenamiento.',
      fetchFn: () => api.reports.lastSessions(),
    },
    {
      id: 'r10',
      title: '10. Empleado con Peor Desempeño',
      description: 'El empleado con el promedio de calificaciones más bajo del sistema.',
      fetchFn: () => api.reports.worstEmployee(),
    },
  ];

  // Crear y agregar cada sección de reporte al contenedor
  reportDefs.forEach(def => {
    const section = createReportSection(def);
    reportsContainer.appendChild(section);
  });
}
