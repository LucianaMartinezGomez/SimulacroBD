// Rutas de empleados: mapea los endpoints HTTP a las funciones del controlador
const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/employeesController');

// Obtener todos los empleados activos
router.get('/',           ctrl.getAll);

// Crear un nuevo empleado
router.post('/',          ctrl.create);

// Obtener reporte de un empleado (debe ir antes de /:id para no ser solapada)
router.get('/:id/report', ctrl.getReport);

// Obtener un empleado por ID
router.get('/:id',        ctrl.getById);

// Actualizar un empleado por ID
router.put('/:id',        ctrl.update);

// Desactivar un empleado por ID
router.delete('/:id',     ctrl.remove);

module.exports = router;
