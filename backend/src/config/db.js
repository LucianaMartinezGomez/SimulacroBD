// Configuración del pool de conexiones a MySQL usando mysql2/promise
const mysql = require('mysql2/promise');

// Crea un pool de conexiones con los parámetros definidos en las variables de entorno
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'datatrain_db',
  port:     process.env.DB_PORT     || 3306,
  // Mantiene hasta 10 conexiones simultáneas en el pool
  connectionLimit: 10,
});

module.exports = pool;
