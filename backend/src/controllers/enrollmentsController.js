// Controlador de inscripciones: gestiona las operaciones sobre la tabla enrollments
const pool = require('../config/db');

// Obtiene todas las inscripciones con el nombre del empleado y el título de la capacitación
const getAll = async (req, res) => {
  try {
    // Consulta con JOINs para obtener información descriptiva en lugar de solo IDs
    const [rows] = await pool.query(
      `SELECT en.*, CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
              t.title AS training_title
       FROM enrollments en
       INNER JOIN employees e  ON en.employee_id  = e.id
       INNER JOIN trainings t  ON en.training_id  = t.id
       ORDER BY en.enrollment_date DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inscripciones', detail: error.message });
  }
};

// Crea una nueva inscripción de un empleado en una capacitación
const create = async (req, res) => {
  try {
    const { employee_id, training_id, enrollment_date } = req.body;

    // Inserta el nuevo registro de inscripción
    const [result] = await pool.query(
      'INSERT INTO enrollments (employee_id, training_id, enrollment_date) VALUES (?, ?, ?)',
      [employee_id, training_id, enrollment_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Inscripción creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear inscripción', detail: error.message });
  }
};

module.exports = { getAll, create };
