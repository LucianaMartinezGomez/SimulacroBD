// Controlador de reportes: agrupa 10 consultas analíticas avanzadas sobre el rendimiento de empleados y capacitaciones
const pool = require('../config/db');

// 1. Top 5 empleados con mejor promedio de calificaciones
const topEmployees = async (req, res) => {
  try {
    // Agrupa por empleado y ordena de mayor a menor promedio, limitando a 5 resultados
    const [rows] = await pool.query(
      `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, e.department,
              ROUND(AVG(g.score), 2) AS average_score,
              COUNT(g.id) AS total_grades
       FROM employees e
       INNER JOIN enrollments en ON e.id = en.employee_id
       INNER JOIN grades g       ON en.id = g.enrollment_id
       GROUP BY e.id, e.first_name, e.last_name, e.department
       ORDER BY average_score DESC
       LIMIT 5`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en reporte top empleados', detail: error.message });
  }
};

// 2. Capacitaciones con mayor cantidad de inscritos
const popularTrainings = async (req, res) => {
  try {
    // Agrupa por capacitación y ordena de mayor a menor número de inscripciones
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.category,
              COUNT(en.id) AS total_enrolled
       FROM trainings t
       INNER JOIN enrollments en ON t.id = en.training_id
       GROUP BY t.id, t.title, t.category
       ORDER BY total_enrolled DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en reporte capacitaciones populares', detail: error.message });
  }
};

// 3. Empleados sin calificaciones registradas (LEFT JOIN + IS NULL)
const noGrades = async (req, res) => {
  try {
    // Empleados inscritos que nunca recibieron una calificación
    const [rows] = await pool.query(
      `SELECT DISTINCT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name,
              e.email, e.department
       FROM employees e
       INNER JOIN enrollments en ON e.id = en.employee_id
       LEFT JOIN grades g        ON en.id = g.enrollment_id
       WHERE g.id IS NULL
       ORDER BY name ASC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en reporte sin calificaciones', detail: error.message });
  }
};

// 4. Promedio de calificación por capacitación
const trainingAverages = async (req, res) => {
  try {
    // Agrupa por capacitación para calcular el promedio de puntajes
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.category,
              ROUND(AVG(g.score), 2) AS average_score,
              COUNT(g.id) AS total_grades
       FROM trainings t
       INNER JOIN enrollments en ON t.id = en.training_id
       INNER JOIN grades g       ON en.id = g.enrollment_id
       GROUP BY t.id, t.title, t.category
       ORDER BY average_score DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en reporte promedios por capacitación', detail: error.message });
  }
};

// 5. Sesiones realizadas entre dos fechas (parámetros de consulta start y end)
const sessionsBetween = async (req, res) => {
  try {
    const { start, end } = req.query;

    // Valida que se proporcionen ambos parámetros de fecha
    if (!start || !end) {
      return res.status(400).json({ error: 'Se requieren los parámetros start y end' });
    }

    // Filtra sesiones dentro del rango de fechas con JOIN a trainings
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
    res.status(500).json({ error: 'Error en reporte sesiones por fechas', detail: error.message });
  }
};

// 6. Empleados con más de 3 capacitaciones completadas (HAVING COUNT > 3)
const activeEmployees = async (req, res) => {
  try {
    // Usa HAVING para filtrar empleados con más de 3 inscripciones
    const [rows] = await pool.query(
      `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, e.department,
              COUNT(en.id) AS total_trainings
       FROM employees e
       INNER JOIN enrollments en ON e.id = en.employee_id
       GROUP BY e.id, e.first_name, e.last_name, e.department
       HAVING COUNT(en.id) > 3
       ORDER BY total_trainings DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en reporte empleados activos', detail: error.message });
  }
};

// 7. Capacitaciones sin ninguna inscripción (LEFT JOIN + IS NULL)
const emptyTrainings = async (req, res) => {
  try {
    // LEFT JOIN con enrollments para detectar capacitaciones sin inscripciones
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.category, t.duration_hours
       FROM trainings t
       LEFT JOIN enrollments en ON t.id = en.training_id
       WHERE en.id IS NULL
       ORDER BY t.title ASC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en reporte capacitaciones sin inscritos', detail: error.message });
  }
};

// 8. Ranking general de desempeño usando la función de ventana RANK()
const ranking = async (req, res) => {
  try {
    // Calcula el ranking ordenado por promedio usando RANK() como función de ventana
    const [rows] = await pool.query(
      `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, e.department,
              ROUND(AVG(g.score), 2) AS average_score,
              RANK() OVER (ORDER BY AVG(g.score) DESC) AS performance_rank
       FROM employees e
       INNER JOIN enrollments en ON e.id = en.employee_id
       INNER JOIN grades g       ON en.id = g.enrollment_id
       GROUP BY e.id, e.first_name, e.last_name, e.department
       ORDER BY performance_rank ASC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en reporte de ranking', detail: error.message });
  }
};

// 9. Última sesión de cada capacitación (subconsulta para obtener la fecha máxima)
const lastSessions = async (req, res) => {
  try {
    // Subconsulta que obtiene la sesión más reciente por cada capacitación
    const [rows] = await pool.query(
      `SELECT s.*, t.title AS training_title
       FROM sessions s
       INNER JOIN trainings t ON s.training_id = t.id
       WHERE s.session_date = (
         SELECT MAX(s2.session_date)
         FROM sessions s2
         WHERE s2.training_id = s.training_id
       )
       ORDER BY t.title ASC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en reporte últimas sesiones', detail: error.message });
  }
};

// 10. Empleado con el peor promedio de calificaciones
const worstEmployee = async (req, res) => {
  try {
    // Subconsulta para encontrar el promedio mínimo y luego recuperar el empleado correspondiente
    const [rows] = await pool.query(
      `SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS name, e.department,
              ROUND(AVG(g.score), 2) AS average_score
       FROM employees e
       INNER JOIN enrollments en ON e.id = en.employee_id
       INNER JOIN grades g       ON en.id = g.enrollment_id
       GROUP BY e.id, e.first_name, e.last_name, e.department
       HAVING AVG(g.score) = (
         SELECT MIN(avg_scores.avg)
         FROM (
           SELECT AVG(g2.score) AS avg
           FROM grades g2
           INNER JOIN enrollments en2 ON g2.enrollment_id = en2.id
           GROUP BY en2.employee_id
         ) AS avg_scores
       )`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error en reporte peor empleado', detail: error.message });
  }
};

module.exports = {
  topEmployees,
  popularTrainings,
  noGrades,
  trainingAverages,
  sessionsBetween,
  activeEmployees,
  emptyTrainings,
  ranking,
  lastSessions,
  worstEmployee,
};
