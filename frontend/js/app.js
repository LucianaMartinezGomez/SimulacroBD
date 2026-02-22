// Enrutador principal de la SPA (Single Page Application)
// Escucha cambios en el hash de la URL y renderiza el componente correspondiente

import { renderDashboard }    from './components/dashboard.js';
import { renderEmployees }    from './components/employees.js';
import { renderTrainings }    from './components/trainings.js';
import { renderSessions }     from './components/sessions.js';
import { renderReports }      from './components/reports.js';
import { renderFeedback }     from './components/feedback.js';
import { renderLogs }         from './components/logs.js';

// Referencia al contenedor principal del contenido
const mainContent = document.getElementById('main-content');

// Mapa de rutas hash a funciones de renderizado
const routes = {
  '/':              renderDashboard,
  '/empleados':     renderEmployees,
  '/entrenamientos':renderTrainings,
  '/sesiones':      renderSessions,
  '/reportes':      renderReports,
  '/feedback':      renderFeedback,
  '/logs':          renderLogs,
};

/**
 * Obtiene la ruta actual a partir del hash de la URL.
 * Si no hay hash definido, devuelve '/' (inicio).
 */
function getCurrentRoute() {
  const hash = window.location.hash;
  if (!hash || hash === '#' || hash === '#/') return '/';
  return hash.replace('#', '');
}

/**
 * Actualiza el estilo activo de los enlaces en la barra lateral
 * según la ruta actual.
 */
function updateActiveLink(route) {
  document.querySelectorAll('#sidebar a[data-route]').forEach((link) => {
    if (link.getAttribute('data-route') === route) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Navega a la ruta indicada por el hash actual.
 * Limpia el contenido previo, busca el componente y lo renderiza.
 */
async function navigate() {
  const route  = getCurrentRoute();
  const render = routes[route] || renderDashboard;

  // Limpiar contenido anterior
  mainContent.innerHTML = '';

  // Resaltar enlace activo en el sidebar
  updateActiveLink(route);

  // Cerrar sidebar en móvil al navegar
  document.getElementById('sidebar').classList.remove('open');

  try {
    await render(mainContent);
  } catch (err) {
    // Mostrar mensaje de error si el componente falla al cargar
    mainContent.innerHTML = `
      <div class="error-box">
        ⚠️ Error al cargar la sección: ${err.message}
      </div>`;
  }
}

// Escuchar cambios de hash para navegar entre secciones
window.addEventListener('hashchange', navigate);

// Navegar a la ruta inicial al cargar la aplicación
navigate();

// ------ Lógica del botón hamburguesa para móvil ------
const hamburger = document.getElementById('hamburger');
const sidebar   = document.getElementById('sidebar');

/**
 * Alterna la visibilidad de la barra lateral en pantallas pequeñas.
 */
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
