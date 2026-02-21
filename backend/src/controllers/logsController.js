// Controlador de logs: gestiona el registro de acciones del sistema en MongoDB
const Log = require('../models/Log');

// Obtiene los últimos 50 registros de auditoría ordenados por timestamp descendente
const getAll = async (req, res) => {
  try {
    // Limita a 50 registros para evitar respuestas muy grandes
    const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener logs', detail: error.message });
  }
};

// Crea un nuevo registro de auditoría en MongoDB
const create = async (req, res) => {
  try {
    const { action, user, details } = req.body;

    // Inserta el nuevo documento de log con la acción y el usuario
    const log = await Log.create({ action, user, details });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear log', detail: error.message });
  }
};

module.exports = { getAll, create };
