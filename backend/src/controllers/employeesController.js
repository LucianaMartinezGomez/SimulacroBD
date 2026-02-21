// Controlador de empleados: gestiona las operaciones CRUD sobre la tabla employees
const pool = require('../config/db');

// Obtiene todos los empleados activos
const getAll = async (req, res) => {
  try {
    // Consulta solo los registros con is_active = 1
    const [rows] = await pool.query('SELECT * FROM employees WHERE is_active = 1');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleados', detail: error.message });
  }
};

// Obtiene un empleado por su identificador
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);

    // Retorna 404 si no se encuentra el empleado
    if (rows.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleado', detail: error.message });
  }
};

// Crea un nuevo empleado en la base de datos
const create = async (req, res) => {
  try {
    const { first_name, last_name, email, department, hire_date } = req.body;

    // Inserta el nuevo registro en la tabla employees con first_name y last_name separados
    const [result] = await pool.query(
      'INSERT INTO employees (first_name, last_name, email, department, hire_date) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, department, hire_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Empleado creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear empleado', detail: error.message });
  }
};

// Actualiza los datos de un empleado existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, department, hire_date } = req.body;

    // Actualiza el registro correspondiente al id proporcionado
    const [result] = await pool.query(
      'UPDATE employees SET first_name = ?, last_name = ?, email = ?, department = ?, hire_date = ? WHERE id = ?',
      [first_name, last_name, email, department, hire_date, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ message: 'Empleado actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar empleado', detail: error.message });
  }
};

// Desactiva un empleado marcando is_active = 0 (borrado lógico)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Se realiza borrado lógico para conservar el historial
    const [result] = await pool.query('UPDATE employees SET is_active = 0 WHERE id = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ message: 'Empleado desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar empleado', detail: error.message });
  }
};

// Obtiene el reporte de un empleado con sus inscripciones y calificaciones
const getReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Consulta el empleado junto con sus inscripciones y calificaciones mediante JOINs
    const [rows] = await pool.query(
      `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name,
              e.email, e.department,
              en.id AS enrollment_id, t.title AS training_title,
              en.enrollment_date, g.score, g.evaluation_date
       FROM employees e
       LEFT JOIN enrollments en ON e.id = en.employee_id
       LEFT JOIN trainings t    ON en.training_id = t.id
       LEFT JOIN grades g       ON en.id = g.enrollment_id
       WHERE e.id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reporte del empleado', detail: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove, getReport };
