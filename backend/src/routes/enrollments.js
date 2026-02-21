// Rutas de inscripciones: mapea los endpoints HTTP a las funciones del controlador
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/enrollmentsController');

// Obtener todas las inscripciones con nombres de empleado y capacitación
router.get('/',  ctrl.getAll);

// Crear una nueva inscripción
router.post('/', ctrl.create);

module.exports = router;
