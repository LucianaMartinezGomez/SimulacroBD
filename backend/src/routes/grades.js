// Rutas de calificaciones: mapea los endpoints HTTP a las funciones del controlador
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/gradesController');

// Obtener todas las calificaciones con información de inscripción
router.get('/',  ctrl.getAll);

// Registrar una nueva calificación
router.post('/', ctrl.create);

module.exports = router;
