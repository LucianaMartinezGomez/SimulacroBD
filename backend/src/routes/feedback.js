// Rutas de feedback: mapea los endpoints de comentarios y valoraciones al controlador
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/feedbackController');

// Crear un nuevo registro de feedback
router.post('/',              ctrl.create);

// Obtener todos los feedbacks ordenados por fecha descendente
router.get('/',               ctrl.getAll);

// Obtener los feedbacks de un empleado específico
router.get('/:employeeId',    ctrl.getByEmployee);

module.exports = router;
