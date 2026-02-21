// Controlador de vistas: consulta las vistas precreadas en MySQL para reportes consolidados
const pool = require('../config/db');

// Obtiene datos de la vista v_employee_performance con el rendimiento de cada empleado
const employeePerformance = async (req, res) => {
  try {
    // La vista agrega inscripciones y calificaciones por empleado
    const [rows] = await pool.query('SELECT * FROM v_employee_performance');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar vista de rendimiento de empleados', detail: error.message });
  }
};

// Obtiene datos de la vista v_training_stats con estadísticas por capacitación
const trainingStats = async (req, res) => {
  try {
    // La vista agrupa inscripciones y promedios de calificación por capacitación
    const [rows] = await pool.query('SELECT * FROM v_training_stats');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar vista de estadísticas de capacitaciones', detail: error.message });
  }
};

module.exports = { employeePerformance, trainingStats };
