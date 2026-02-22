// Rutas de capacitaciones: mapea los endpoints HTTP a las funciones del controlador
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/trainingsController');

// Obtener todas las capacitaciones activas
router.get('/',          ctrl.getAll);

// Crear una nueva capacitación
router.post('/',         ctrl.create);

// Obtener estadísticas de una capacitación (debe ir antes de /:id)
router.get('/:id/stats', ctrl.getStats);

// Obtener una capacitación por ID
router.get('/:id',       ctrl.getById);

// Actualizar una capacitación por ID
router.put('/:id',       ctrl.update);

// Desactivar una capacitación por ID
router.delete('/:id',    ctrl.remove);

module.exports = router;
