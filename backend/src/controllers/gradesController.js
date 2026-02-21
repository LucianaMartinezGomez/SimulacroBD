// Controlador de calificaciones: gestiona las operaciones sobre la tabla grades
const pool = require('../config/db');

// Obtiene todas las calificaciones con información de la inscripción, empleado y capacitación
const getAll = async (req, res) => {
  try {
    // JOIN múltiple para obtener nombres descriptivos junto con las calificaciones
    const [rows] = await pool.query(
      `SELECT g.*, CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
              t.title AS training_title, en.enrollment_date
       FROM grades g
       INNER JOIN enrollments en ON g.enrollment_id = en.id
       INNER JOIN employees e   ON en.employee_id   = e.id
       INNER JOIN trainings t   ON en.training_id   = t.id
       ORDER BY g.evaluation_date DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener calificaciones', detail: error.message });
  }
};

// Registra una nueva calificación para una inscripción
const create = async (req, res) => {
  try {
    const { enrollment_id, score, evaluation_date } = req.body;

    // Inserta la calificación asociada al enrollment_id indicado
    const [result] = await pool.query(
      'INSERT INTO grades (enrollment_id, score, evaluation_date) VALUES (?, ?, ?)',
      [enrollment_id, score, evaluation_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Calificación registrada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar calificación', detail: error.message });
  }
};

module.exports = { getAll, create };
