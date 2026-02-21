// Modelo Mongoose para el registro de acciones realizadas en el sistema
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  // Descripción de la acción realizada
  action: { type: String, required: true },

  // Usuario que ejecutó la acción
  user: { type: String, required: true },

  // Fecha y hora en que ocurrió el evento, por defecto la fecha actual
  timestamp: { type: Date, default: Date.now },

  // Detalles adicionales sobre la acción (opcional)
  details: { type: String },
});

module.exports = mongoose.model('Log', logSchema);
