// Controlador de sesiones: gestiona las operaciones sobre la tabla sessions
const pool = require('../config/db');

// Obtiene todas las sesiones con el título de la capacitación asociada
const getAll = async (req, res) => {
  try {
    // Realiza JOIN con trainings para incluir el título de la capacitación
    const [rows] = await pool.query(
      `SELECT s.*, t.title AS training_title
       FROM sessions s
       INNER JOIN trainings t ON s.training_id = t.id
       ORDER BY s.session_date DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sesiones', detail: error.message });
  }
};

// Crea una nueva sesión para una capacitación
const create = async (req, res) => {
  try {
    const { training_id, title, session_date, duration_minutes, location } = req.body;

    // Inserta la nueva sesión con todos los campos requeridos por el esquema
    const [result] = await pool.query(
      'INSERT INTO sessions (training_id, title, session_date, duration_minutes, location) VALUES (?, ?, ?, ?, ?)',
      [training_id, title, session_date, duration_minutes, location]
    );
    res.status(201).json({ id: result.insertId, message: 'Sesión creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear sesión', detail: error.message });
  }
};

// Obtiene sesiones cuya fecha se encuentra entre dos valores (parámetros de consulta start y end)
const getBetweenDates = async (req, res) => {
  try {
    const { start, end } = req.query;

    // Valida que ambos parámetros estén presentes
    if (!start || !end) {
      return res.status(400).json({ error: 'Se requieren los parámetros start y end' });
    }

    // Filtra las sesiones dentro del rango de fechas indicado
    const [rows] = await pool.query(
      `SELECT s.*, t.title AS training_title
       FROM sessions s
       INNER JOIN trainings t ON s.training_id = t.id
       WHERE s.session_date BETWEEN ? AND ?
       ORDER BY s.session_date ASC`,
      [start, end]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sesiones por fechas', detail: error.message });
  }
};

module.exports = { getAll, create, getBetweenDates };
