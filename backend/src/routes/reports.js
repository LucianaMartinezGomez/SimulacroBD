// Rutas de reportes: mapea los 10 endpoints analíticos a las funciones del controlador
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/reportsController');

// Top 5 empleados con mejor promedio de calificaciones
router.get('/top-employees',     ctrl.topEmployees);

// Capacitaciones con mayor número de inscritos
router.get('/popular-trainings', ctrl.popularTrainings);

// Empleados que no tienen calificaciones registradas
router.get('/no-grades',         ctrl.noGrades);

// Promedio de calificaciones por capacitación
router.get('/training-averages', ctrl.trainingAverages);

// Sesiones realizadas entre dos fechas
router.get('/sessions-between',  ctrl.sessionsBetween);

// Empleados con más de 3 capacitaciones inscritas
router.get('/active-employees',  ctrl.activeEmployees);

// Capacitaciones sin ninguna inscripción
router.get('/empty-trainings',   ctrl.emptyTrainings);

// Ranking general de desempeño con función de ventana
router.get('/ranking',           ctrl.ranking);

// Última sesión de cada capacitación
router.get('/last-sessions',     ctrl.lastSessions);

// Empleado con el peor promedio de calificaciones
router.get('/worst-employee',    ctrl.worstEmployee);

module.exports = router;
