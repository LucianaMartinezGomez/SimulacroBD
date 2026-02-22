// Configuración de la conexión a MongoDB usando Mongoose
const mongoose = require('mongoose');

// Función asíncrona que establece la conexión con MongoDB
async function connectMongo() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/datatrain_db';

  // Conecta usando la URI definida en las variables de entorno
  await mongoose.connect(uri);
}

module.exports = connectMongo;
