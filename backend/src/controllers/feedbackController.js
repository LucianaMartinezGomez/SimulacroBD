// Controlador de feedback: gestiona los comentarios y valoraciones en MongoDB
const Feedback = require('../models/Feedback');

// Crea un nuevo registro de feedback en MongoDB
const create = async (req, res) => {
  try {
    const { employeeId, trainingId, comment, rating } = req.body;

    // Guarda el nuevo documento en la colección feedback
    const feedback = await Feedback.create({ employeeId, trainingId, comment, rating });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear feedback', detail: error.message });
  }
};

// Obtiene todos los registros de feedback ordenados del más reciente al más antiguo
const getAll = async (req, res) => {
  try {
    // Ordena por createdAt descendente para mostrar primero el feedback más reciente
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener feedback', detail: error.message });
  }
};

// Obtiene todos los feedbacks de un empleado específico por su ID
const getByEmployee = async (req, res) => {
  try {
    // Obtiene el identificador de empleado desde los parámetros de la ruta
    const empId = Number(req.params.empId);

    // Filtra los documentos por el campo employeeId
    const feedbacks = await Feedback.find({ employeeId: empId }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener feedback del empleado', detail: error.message });
  }
};

module.exports = { create, getAll, getByEmployee };
