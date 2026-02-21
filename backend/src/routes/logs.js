// Rutas de logs: mapea los endpoints de auditoría al controlador
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/logsController');

// Obtener los últimos 50 registros de auditoría
router.get('/',  ctrl.getAll);

// Crear un nuevo registro de auditoría
router.post('/', ctrl.create);

module.exports = router;
