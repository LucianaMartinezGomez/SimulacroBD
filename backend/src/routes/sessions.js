// Rutas de sesiones: mapea los endpoints HTTP a las funciones del controlador
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/sessionsController');

// Obtener todas las sesiones (debe ir antes de rutas dinámicas)
router.get('/between', ctrl.getBetweenDates);

// Obtener todas las sesiones con el título de la capacitación
router.get('/',        ctrl.getAll);

// Crear una nueva sesión
router.post('/',       ctrl.create);

module.exports = router;
