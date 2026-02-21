// Carga las variables de entorno desde el archivo .env
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const rateLimit = require('express-rate-limit');

// Importa las conexiones a las bases de datos
const pool         = require('./src/config/db');
const connectMongo = require('./src/config/mongo');

// Importa todos los routers de la aplicación
const employeesRouter  = require('./src/routes/employees');
const trainingsRouter  = require('./src/routes/trainings');
const sessionsRouter   = require('./src/routes/sessions');
const enrollmentsRouter = require('./src/routes/enrollments');
const gradesRouter     = require('./src/routes/grades');
const reportsRouter    = require('./src/routes/reports');
const viewsRouter      = require('./src/routes/views');
const feedbackRouter   = require('./src/routes/feedback');
const logsRouter       = require('./src/routes/logs');

const app  = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS para permitir peticiones desde otros orígenes
app.use(cors());

// Aplica límite de velocidad global: máximo 100 peticiones por IP cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta de nuevo más tarde.' },
});
app.use('/api', limiter);

// Habilita el parseo de cuerpos JSON en las peticiones
app.use(express.json());

// Monta todos los routers bajo el prefijo /api
app.use('/api/employees',  employeesRouter);
app.use('/api/trainings',  trainingsRouter);
app.use('/api/sessions',   sessionsRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/grades',     gradesRouter);
app.use('/api/reports',    reportsRouter);
app.use('/api/views',      viewsRouter);
app.use('/api/feedback',   feedbackRouter);
app.use('/api/logs',       logsRouter);

// Función principal que inicia el servidor y conecta las bases de datos
async function startServer() {
  try {
    // Verifica la conexión con MySQL obteniendo una conexión del pool
    await pool.getConnection();
    console.log('Conexión a MySQL establecida correctamente');

    // Conecta con MongoDB mediante Mongoose
    await connectMongo();
    console.log('Conexión a MongoDB establecida correctamente');

    // Inicia el servidor HTTP en el puerto configurado
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();
