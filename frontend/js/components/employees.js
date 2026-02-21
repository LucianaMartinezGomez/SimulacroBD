// Componente Empleados — CRUD completo de empleados

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
 * Formatea una fecha ISO a formato corto legible.
 */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

/**
 * Construye las filas de la tabla de empleados.
 * Cada fila incluye botones de editar y eliminar.
 */
function buildRows(employees) {
  if (!employees.length) {
    return `<tr><td colspan="7" style="text-align:center;color:var(--text-muted)">No hay empleados registrados.</td></tr>`;
  }
  return employees.map(emp => `
    <tr data-id="${emp.id || emp.employee_id}">
      <td>${emp.id || emp.employee_id}</td>
      <td>${emp.first_name || ''} ${emp.last_name || ''}</td>
      <td>${emp.email || '—'}</td>
      <td>${emp.department || emp.departamento || '—'}</td>
      <td>${formatDate(emp.hire_date || emp.fecha_contratacion)}</td>
      <td>
        <button class="btn btn-secondary btn-sm btn-edit"
          data-id="${emp.id || emp.employee_id}"
          data-first="${emp.first_name || ''}"
          data-last="${emp.last_name || ''}"
          data-email="${emp.email || ''}"
          data-dept="${emp.department || emp.departamento || ''}"
          data-hire="${(emp.hire_date || emp.fecha_contratacion || '').slice(0, 10)}">
          ✏️ Editar
        </button>
        <button class="btn btn-danger btn-sm btn-delete" data-id="${emp.id || emp.employee_id}">
          🗑️ Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Renderiza el componente de Empleados en el contenedor dado.
 * Incluye formulario de creación/edición y tabla con acciones.
 */
export async function renderEmployees(container) {
  container.innerHTML = `
    <div class="page-header">
      <h1>👥 Empleados</h1>
      <p>Gestión de empleados de DataTrain Corp</p>
    </div>
    ${spinnerHTML()}
  `;

  let employees = [];
  try {
    employees = await api.employees.getAll();
  } catch (err) {
    container.innerHTML = `
      <div class="page-header"><h1>👥 Empleados</h1></div>
      ${errorHTML(`No se pudieron cargar los empleados: ${err.message}`)}
    `;
    return;
  }

  // Renderizar la interfaz completa
  container.innerHTML = `
    <div class="page-header">
      <h1>👥 Empleados</h1>
      <p>Gestión de empleados de DataTrain Corp</p>
    </div>

    <!-- Formulario para crear o editar un empleado -->
    <div class="form-card">
      <h2 id="form-title">➕ Nuevo Empleado</h2>
      <div id="form-error"></div>
      <form id="employee-form">
        <input type="hidden" id="emp-id" />
        <div class="form-grid">
          <div class="form-group">
            <label for="emp-first">Nombre</label>
            <input id="emp-first" name="first_name" type="text" placeholder="Nombre" required />
          </div>
          <div class="form-group">
            <label for="emp-last">Apellido</label>
            <input id="emp-last" name="last_name" type="text" placeholder="Apellido" required />
          </div>
          <div class="form-group">
            <label for="emp-email">Email</label>
            <input id="emp-email" name="email" type="email" placeholder="correo@ejemplo.com" required />
          </div>
          <div class="form-group">
            <label for="emp-dept">Departamento</label>
            <input id="emp-dept" name="department" type="text" placeholder="Departamento" />
          </div>
          <div class="form-group">
            <label for="emp-hire">Fecha de contratación</label>
            <input id="emp-hire" name="hire_date" type="date" />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" id="btn-submit">💾 Guardar</button>
          <button type="button" class="btn btn-secondary" id="btn-cancel" style="display:none">✖ Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Tabla de empleados -->
    <div class="table-card">
      <div class="table-card-header">📋 Lista de Empleados</div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Email</th>
              <th>Departamento</th><th>Contratación</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody id="employees-tbody">
            ${buildRows(employees)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Referencias a elementos del DOM
  const form       = container.querySelector('#employee-form');
  const formTitle  = container.querySelector('#form-title');
  const formError  = container.querySelector('#form-error');
  const tbody      = container.querySelector('#employees-tbody');
  const btnCancel  = container.querySelector('#btn-cancel');
  const empIdInput = container.querySelector('#emp-id');

  /**
   * Actualiza la tabla de empleados con los datos más recientes.
   */
  async function refreshTable() {
    try {
      const fresh = await api.employees.getAll();
      tbody.innerHTML = buildRows(fresh);
    } catch {
      tbody.innerHTML = `<tr><td colspan="7">${errorHTML('Error al actualizar la tabla.')}</td></tr>`;
    }
  }

  /**
   * Muestra un mensaje de error dentro del formulario.
   */
  function showError(msg) {
    formError.innerHTML = errorHTML(msg);
  }

  /**
   * Limpia el formulario y restablece el modo de creación.
   */
  function resetForm() {
    form.reset();
    empIdInput.value  = '';
    formTitle.textContent = '➕ Nuevo Empleado';
    btnCancel.style.display = 'none';
    formError.innerHTML = '';
  }

  // Envío del formulario — crea o actualiza un empleado
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.innerHTML = '';

    const data = {
      first_name:  form.first_name.value.trim(),
      last_name:   form.last_name.value.trim(),
      email:       form.email.value.trim(),
      department:  form.department.value.trim(),
      hire_date:   form.hire_date.value || null,
    };

    try {
      const id = empIdInput.value;
      if (id) {
        // Modo edición — actualizar empleado existente
        await api.employees.update(id, data);
      } else {
        // Modo creación — registrar nuevo empleado
        await api.employees.create(data);
      }
      resetForm();
      await refreshTable();
    } catch (err) {
      showError(err.message);
    }
  });

  // Cancelar edición y volver al modo de creación
  btnCancel.addEventListener('click', resetForm);

  // Delegación de eventos para botones de editar y eliminar
  tbody.addEventListener('click', async (e) => {
    const btnEdit   = e.target.closest('.btn-edit');
    const btnDelete = e.target.closest('.btn-delete');

    if (btnEdit) {
      // Rellenar el formulario con los datos del empleado seleccionado
      const { id, first, last, email, dept, hire } = btnEdit.dataset;
      empIdInput.value              = id;
      form.first_name.value         = first;
      form.last_name.value          = last;
      form.email.value              = email;
      form.department.value         = dept;
      form.hire_date.value          = hire;
      formTitle.textContent         = `✏️ Editando empleado #${id}`;
      btnCancel.style.display       = 'inline-flex';
      formError.innerHTML           = '';
      // Desplazar al formulario
      form.scrollIntoView({ behavior: 'smooth' });
    }

    if (btnDelete) {
      const { id } = btnDelete.dataset;
      if (!confirm(`¿Eliminar al empleado #${id}? Esta acción no se puede deshacer.`)) return;
      try {
        await api.employees.delete(id);
        await refreshTable();
      } catch (err) {
        alert(`Error al eliminar: ${err.message}`);
      }
    }
  });
}
