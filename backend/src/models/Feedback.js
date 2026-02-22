// Modelo Mongoose para los comentarios y valoraciones de los empleados sobre capacitaciones
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  // Identificador del empleado que envía el feedback
  employeeId: { type: Number, required: true },

  // Identificador de la capacitación evaluada
  trainingId: { type: Number, required: true },

  // Comentario textual del empleado
  comment: { type: String, required: true },

  // Calificación del 1 al 5 otorgada por el empleado
  rating: { type: Number, required: true, min: 1, max: 5 },

  // Fecha de creación del registro, por defecto la fecha actual
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
