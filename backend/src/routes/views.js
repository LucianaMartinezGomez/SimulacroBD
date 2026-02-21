// Rutas de vistas: mapea los endpoints de consulta de vistas MySQL al controlador
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/viewsController');

// Consultar la vista de rendimiento por empleado
router.get('/employee-performance', ctrl.employeePerformance);

// Consultar la vista de estadísticas por capacitación
router.get('/training-stats',       ctrl.trainingStats);

module.exports = router;
