# DataTrain Corp - Plataforma de Gestión de Entrenamientos

Plataforma Fullstack para gestionar entrenamientos técnicos corporativos. Permite administrar empleados, capacitaciones, sesiones, inscripciones, calificaciones, feedback y auditoría de actividades.

## Tecnologías

- **Frontend:** Vite + JavaScript (SPA)
- **Backend:** Node.js + Express
- **Base de datos relacional:** MySQL con mysql2
- **Base de datos documental:** MongoDB con mongoose

## Estructura del Proyecto

```
SimulacroBD/
├── frontend/          → SPA con Vite + JavaScript
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── api.js
│       └── components/
│           ├── dashboard.js
│           ├── employees.js
│           ├── trainings.js
│           ├── sessions.js
│           ├── reports.js
│           ├── feedback.js
│           └── logs.js
├── backend/           → API REST con Express
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/
│       │   ├── db.js
│       │   └── mongo.js
│       ├── controllers/
│       ├── routes/
│       └── models/
├── sql/
│   └── database.sql   → Esquema, datos y consultas
├── mongo/
│   └── collections.json → Datos de ejemplo MongoDB
└── docs/
    └── DER.md         → Instrucciones para generar DER
```

## Prerrequisitos

- Node.js >= 18
- MySQL >= 8.0
- MongoDB >= 6.0

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd SimulacroBD
   ```

2. Configurar la base de datos MySQL:
   ```bash
   mysql -u root -p < sql/database.sql
   ```

3. Configurar el backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con las credenciales de la base de datos
   ```

4. Configurar el frontend:
   ```bash
   cd frontend
   npm install
   ```

## Variables de Entorno (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=datatrain_db
DB_PORT=3306
MONGO_URI=mongodb://localhost:27017/datatrain_db
PORT=3000
```

## Cómo Ejecutar

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```

El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:3000`.

## Endpoints Disponibles

### Empleados (`/api/employees`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/employees` | Obtener todos los empleados activos |
| POST | `/api/employees` | Crear un nuevo empleado |
| GET | `/api/employees/:id` | Obtener un empleado por ID |
| PUT | `/api/employees/:id` | Actualizar un empleado por ID |
| DELETE | `/api/employees/:id` | Desactivar un empleado por ID |
| GET | `/api/employees/:id/report` | Obtener reporte de desempeño de un empleado |

### Capacitaciones (`/api/trainings`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/trainings` | Obtener todas las capacitaciones activas |
| POST | `/api/trainings` | Crear una nueva capacitación |
| GET | `/api/trainings/:id` | Obtener una capacitación por ID |
| PUT | `/api/trainings/:id` | Actualizar una capacitación por ID |
| DELETE | `/api/trainings/:id` | Desactivar una capacitación por ID |
| GET | `/api/trainings/:id/stats` | Obtener estadísticas de una capacitación |

### Sesiones (`/api/sessions`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/sessions` | Obtener todas las sesiones con título de capacitación |
| POST | `/api/sessions` | Crear una nueva sesión |
| GET | `/api/sessions/between` | Obtener sesiones entre dos fechas |

### Inscripciones (`/api/enrollments`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/enrollments` | Obtener todas las inscripciones con nombres de empleado y capacitación |
| POST | `/api/enrollments` | Crear una nueva inscripción |

### Calificaciones (`/api/grades`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/grades` | Obtener todas las calificaciones con información de inscripción |
| POST | `/api/grades` | Registrar una nueva calificación |

### Feedback - MongoDB (`/api/feedback`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/feedback` | Obtener todos los feedbacks ordenados por fecha descendente |
| POST | `/api/feedback` | Crear un nuevo registro de feedback |
| GET | `/api/feedback/:employeeId` | Obtener los feedbacks de un empleado específico |

### Logs de Auditoría - MongoDB (`/api/logs`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/logs` | Obtener los últimos 50 registros de auditoría |
| POST | `/api/logs` | Crear un nuevo registro de auditoría |

### Reportes Analíticos (`/api/reports`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/reports/top-employees` | Top 5 empleados con mejor promedio de calificaciones |
| GET | `/api/reports/popular-trainings` | Capacitaciones con mayor número de inscritos |
| GET | `/api/reports/no-grades` | Empleados que no tienen calificaciones registradas |
| GET | `/api/reports/training-averages` | Promedio de calificaciones por capacitación |
| GET | `/api/reports/sessions-between` | Sesiones realizadas entre dos fechas |
| GET | `/api/reports/active-employees` | Empleados con más de 3 capacitaciones inscritas |
| GET | `/api/reports/empty-trainings` | Capacitaciones sin ninguna inscripción |
| GET | `/api/reports/ranking` | Ranking general de desempeño con función de ventana |
| GET | `/api/reports/last-sessions` | Última sesión de cada capacitación |
| GET | `/api/reports/worst-employee` | Empleado con el peor promedio de calificaciones |

### Vistas SQL (`/api/views`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/views/employee-performance` | Consultar la vista de rendimiento por empleado |
| GET | `/api/views/training-stats` | Consultar la vista de estadísticas por capacitación |

## Las 10 Consultas SQL

Las siguientes consultas analíticas están incluidas en `sql/database.sql` y expuestas como endpoints en `/api/reports`:

1. **Top empleados** (`/top-employees`): Obtiene los 5 empleados con mejor promedio de calificaciones usando `INNER JOIN` entre `employees`, `enrollments` y `grades`, ordenados de mayor a menor.

2. **Capacitaciones populares** (`/popular-trainings`): Lista las capacitaciones ordenadas por número total de inscritos mediante `INNER JOIN` y `GROUP BY`.

3. **Participantes activos por capacitación**: Filtra inscripciones con estado `inscrito` o `completado`, usando `INNER JOIN`, `WHERE IN` y `GROUP BY` con `SUM CASE` para contar completados y en curso.

4. **Promedio de calificaciones por capacitación** (`/training-averages`): Calcula promedio, mínimo y máximo de notas por capacitación con `INNER JOIN`, `GROUP BY` y funciones de agregación.

5. **Sesiones entre fechas** (`/sessions-between`): Obtiene sesiones programadas en un rango de fechas usando `INNER JOIN` y `WHERE BETWEEN`.

6. **Empleados activos** (`/active-employees`): Muestra empleados inscritos en más de 3 capacitaciones usando `INNER JOIN`, `GROUP BY` y `HAVING COUNT > 3`.

7. **Capacitaciones vacías** (`/empty-trainings`): Detecta capacitaciones sin inscripciones usando `LEFT JOIN` con filtro `WHERE en.id IS NULL` y variante con subconsulta `NOT EXISTS`.

8. **Ranking de desempeño** (`/ranking`): Genera un ranking ordenado con posición numérica usando la función de ventana `RANK() OVER (ORDER BY ...)`.

9. **Última sesión por capacitación** (`/last-sessions`): Obtiene la sesión más reciente de cada capacitación mediante subconsulta correlacionada con `SELECT MAX(session_date)`.

10. **Empleado con peor desempeño** (`/worst-employee`): Encuentra el empleado con el menor promedio de notas usando `HAVING AVG() =` con subconsulta anidada `SELECT MIN(avg_score) FROM (SELECT AVG(...))`.

## Vistas SQL

### `v_employee_performance`
Muestra el rendimiento individual de cada empleado: nombre, departamento, promedio de calificaciones, total de inscripciones y total de evaluaciones. Utiliza `INNER JOIN` entre `employees`, `enrollments` y `grades` con `GROUP BY` por empleado.

### `v_training_stats`
Muestra estadísticas por capacitación: título, categoría, número de inscritos, número de completados y promedio de calificaciones. Utiliza `LEFT JOIN` para incluir capacitaciones sin inscripciones ni calificaciones.

## Criterios de Evaluación Cubiertos

- INNER JOIN ✓
- LEFT JOIN ✓
- GROUP BY ✓
- HAVING ✓
- Subconsultas ✓
- Vistas SQL ✓
- Datos de ejemplo en español ✓
- Backend Express con mysql2 ✓
- MongoDB con Mongoose ✓
- Frontend SPA con Vite ✓