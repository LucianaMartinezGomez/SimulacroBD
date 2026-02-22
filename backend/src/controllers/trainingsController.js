// Controlador de capacitaciones: gestiona las operaciones CRUD sobre la tabla trainings
const pool = require('../config/db');

// Obtiene todas las capacitaciones activas
const getAll = async (req, res) => {
  try {
    // Consulta solo las capacitaciones con is_active = 1
    const [rows] = await pool.query('SELECT * FROM trainings WHERE is_active = 1');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener capacitaciones', detail: error.message });
  }
};

// Obtiene una capacitación por su identificador
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM trainings WHERE id = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ error: 'Capacitación no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener capacitación', detail: error.message });
  }
};

// Crea una nueva capacitación
const create = async (req, res) => {
  try {
    const { title, description, duration_hours, category, start_date, end_date } = req.body;

    // Inserta el nuevo registro en la tabla trainings incluyendo fechas de inicio y fin
    const [result] = await pool.query(
      'INSERT INTO trainings (title, description, duration_hours, category, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, duration_hours, category, start_date, end_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Capacitación creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear capacitación', detail: error.message });
  }
};

// Actualiza los datos de una capacitación existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration_hours, category, start_date, end_date } = req.body;

    const [result] = await pool.query(
      'UPDATE trainings SET title = ?, description = ?, duration_hours = ?, category = ?, start_date = ?, end_date = ? WHERE id = ?',
      [title, description, duration_hours, category, start_date, end_date, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Capacitación no encontrada' });
    res.json({ message: 'Capacitación actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar capacitación', detail: error.message });
  }
};

// Desactiva una capacitación marcando is_active = 0 (borrado lógico)
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Borrado lógico para conservar el historial de inscripciones
    const [result] = await pool.query('UPDATE trainings SET is_active = 0 WHERE id = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Capacitación no encontrada' });
    res.json({ message: 'Capacitación desactivada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar capacitación', detail: error.message });
  }
};

// Obtiene estadísticas de una capacitación: total inscritos y promedio de calificaciones
const getStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Consulta estadísticas combinando inscripciones y calificaciones mediante JOINs
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.category,
              COUNT(DISTINCT en.id) AS total_enrolled,
              ROUND(AVG(g.score), 2) AS average_score,
              MAX(g.score) AS max_score,
              MIN(g.score) AS min_score
       FROM trainings t
       LEFT JOIN enrollments en ON t.id = en.training_id
       LEFT JOIN grades g       ON en.id = g.enrollment_id
       WHERE t.id = ?
       GROUP BY t.id, t.title, t.category`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Capacitación no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas', detail: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove, getStats };
