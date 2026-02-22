// Componente Entrenamientos — CRUD completo de entrenamientos

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
 * Construye las filas de la tabla de entrenamientos.
 */
function buildRows(trainings) {
  if (!trainings.length) {
    return `<tr><td colspan="7" style="text-align:center;color:var(--text-muted)">No hay entrenamientos registrados.</td></tr>`;
  }
  return trainings.map(t => `
    <tr>
      <td>${t.id || t.training_id}</td>
      <td>${t.title || t.titulo || '—'}</td>
      <td>${t.category || t.categoria || '—'}</td>
      <td>${t.duration_hours || t.duracion_horas || '—'} h</td>
      <td>${formatDate(t.start_date || t.fecha_inicio)}</td>
      <td>${formatDate(t.end_date || t.fecha_fin)}</td>
      <td>
        <button class="btn btn-secondary btn-sm btn-edit"
          data-id="${t.id || t.training_id}"
          data-title="${(t.title || t.titulo || '').replace(/"/g, '&quot;')}"
          data-desc="${(t.description || t.descripcion || '').replace(/"/g, '&quot;')}"
          data-cat="${t.category || t.categoria || ''}"
          data-dur="${t.duration_hours || t.duracion_horas || ''}"
          data-start="${(t.start_date || t.fecha_inicio || '').slice(0, 10)}"
          data-end="${(t.end_date || t.fecha_fin || '').slice(0, 10)}">
          ✏️ Editar
        </button>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${t.id || t.training_id}">
          🗑️ Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Renderiza el componente de Entrenamientos en el contenedor dado.
 * Incluye formulario de creación/edición y tabla con acciones.
 */
export async function renderTrainings(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>📚 Entrenamientos</h1>
      <p>Gestión del catálogo de entrenamientos</p>
    </div>
    ${spinnerHTML()}
  `;

  let trainings = [];
  try {
    trainings = await api.trainings.getAll();
  } catch (err) {
    container.innerHTML = `
      <div class="page-header"><h1>📚 Entrenamientos</h1></div>
      ${errorHTML(`No se pudieron cargar los entrenamientos: ${err.message}`)}
    `;
    return;
  }

  container.innerHTML = `
    <div class="page-header">
      <h1>📚 Entrenamientos</h1>
      <p>Gestión del catálogo de entrenamientos</p>
    </div>

    <!-- Formulario para crear o editar un entrenamiento -->
    <div class="form-card">
      <h2 id="form-title">➕ Nuevo Entrenamiento</h2>
      <div id="form-error"></div>
      <form id="training-form">
        <input type="hidden" id="train-id" />
        <div class="form-grid">
          <div class="form-group">
            <label for="train-title">Título</label>
            <input id="train-title" name="title" type="text" placeholder="Título del entrenamiento" required />
          </div>
          <div class="form-group">
            <label for="train-cat">Categoría</label>
            <input id="train-cat" name="category" type="text" placeholder="Ej: Técnico, Soft Skills" />
          </div>
          <div class="form-group">
            <label for="train-dur">Duración (horas)</label>
            <input id="train-dur" name="duration_hours" type="number" min="1" placeholder="8" />
          </div>
          <div class="form-group">
            <label for="train-start">Fecha inicio</label>
            <input id="train-start" name="start_date" type="date" />
          </div>
          <div class="form-group">
            <label for="train-end">Fecha fin</label>
            <input id="train-end" name="end_date" type="date" />
          </div>
          <div class="form-group" style="grid-column: 1 / -1">
            <label for="train-desc">Descripción</label>
            <textarea id="train-desc" name="description" placeholder="Descripción del entrenamiento"></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">💾 Guardar</button>
          <button type="button" class="btn btn-secondary" id="btn-cancel" style="display:none">✖ Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Tabla de entrenamientos -->
    <div class="table-card">
      <div class="table-card-header">📋 Lista de Entrenamientos</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Título</th><th>Categoría</th>
              <th>Duración</th><th>Inicio</th><th>Fin</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody id="trainings-tbody">
            ${buildRows(trainings)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Referencias a elementos del DOM
  const form        = container.querySelector('#training-form');
  const formTitle   = container.querySelector('#form-title');
  const formError   = container.querySelector('#form-error');
  const tbody       = container.querySelector('#trainings-tbody');
  const btnCancel   = container.querySelector('#btn-cancel');
  const trainIdInput = container.querySelector('#train-id');

  /**
   * Actualiza la tabla con los datos más recientes del servidor.
   */
  async function refreshTable() {
    try {
      const fresh = await api.trainings.getAll();
      tbody.innerHTML = buildRows(fresh);
    } catch {
      tbody.innerHTML = `<tr><td colspan="7">${errorHTML('Error al actualizar.')}</td></tr>`;
    }
  }

  /**
   * Limpia el formulario y vuelve al modo de creación.
   */
  function resetForm() {
    form.reset();
    trainIdInput.value      = '';
    formTitle.textContent   = '➕ Nuevo Entrenamiento';
    btnCancel.style.display = 'none';
    formError.innerHTML     = '';
  }

  // Envío del formulario — crea o actualiza un entrenamiento
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.innerHTML = '';

    const data = {
      title:          form.title.value.trim(),
      description:    form.description.value.trim(),
      category:       form.category.value.trim(),
      duration_hours: Number(form.duration_hours.value) || null,
      start_date:     form.start_date.value || null,
      end_date:       form.end_date.value   || null,
    };

    try {
      const id = trainIdInput.value;
      if (id) {
        await api.trainings.update(id, data);
      } else {
        await api.trainings.create(data);
      }
      resetForm();
      await refreshTable();
    } catch (err) {
      formError.innerHTML = errorHTML(err.message);
    }
  });

  // Cancelar modo edición
  btnCancel.addEventListener('click', resetForm);

  // Delegación de eventos para editar y eliminar
  tbody.addEventListener('click', async (e) => {
    const btnEdit   = e.target.closest('.btn-edit');
    const btnDelete = e.target.closest('.btn-delete');

    if (btnEdit) {
      // Cargar datos del entrenamiento en el formulario
      const { id, title, desc, cat, dur, start, end } = btnEdit.dataset;
      trainIdInput.value            = id;
      form.title.value              = title;
      form.description.value        = desc;
      form.category.value           = cat;
      form.duration_hours.value     = dur;
      form.start_date.value         = start;
      form.end_date.value           = end;
      formTitle.textContent         = `✏️ Editando entrenamiento #${id}`;
      btnCancel.style.display       = 'inline-flex';
      formError.innerHTML           = '';
      form.scrollIntoView({ behavior: 'smooth' });
    }

    if (btnDelete) {
      const { id } = btnDelete.dataset;
      if (!confirm(`¿Eliminar el entrenamiento #${id}?`)) return;
      try {
        await api.trainings.delete(id);
        await refreshTable();
      } catch (err) {
        alert(`Error al eliminar: ${err.message}`);
      }
    }
  });
}
