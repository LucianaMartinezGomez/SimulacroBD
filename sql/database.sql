-- =============================================================
-- DataTrain Corp - Plataforma de Gestión de Capacitaciones
-- Esquema completo de base de datos MySQL
-- =============================================================

CREATE DATABASE IF NOT EXISTS datatrain_db;
USE datatrain_db;

-- =============================================================
-- TABLA: employees (Empleados)
-- Almacena la información del personal de la empresa
-- =============================================================
CREATE TABLE IF NOT EXISTS employees (
    id          INT             NOT NULL AUTO_INCREMENT,
    first_name  VARCHAR(50)     NOT NULL,
    last_name   VARCHAR(80)     NOT NULL,
    email       VARCHAR(120)    NOT NULL UNIQUE,
    department  VARCHAR(60)     NOT NULL,
    hire_date   DATE            NOT NULL,
    is_active   TINYINT(1)      NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
);

-- =============================================================
-- TABLA: trainings (Capacitaciones)
-- Catálogo de cursos y capacitaciones disponibles
-- =============================================================
CREATE TABLE IF NOT EXISTS trainings (
    id              INT             NOT NULL AUTO_INCREMENT,
    title           VARCHAR(120)    NOT NULL,
    description     TEXT,
    category        VARCHAR(60)     NOT NULL,
    duration_hours  DECIMAL(5, 1)   NOT NULL,
    start_date      DATE            NOT NULL,
    end_date        DATE            NOT NULL,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
);

-- =============================================================
-- TABLA: sessions (Sesiones de capacitación)
-- Registra cada sesión individual dentro de una capacitación
-- =============================================================
CREATE TABLE IF NOT EXISTS sessions (
    id                  INT             NOT NULL AUTO_INCREMENT,
    training_id         INT             NOT NULL,
    title               VARCHAR(120)    NOT NULL,
    session_date        DATE            NOT NULL,
    duration_minutes    INT             NOT NULL,
    location            VARCHAR(100)    NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_sessions_training
        FOREIGN KEY (training_id) REFERENCES trainings(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================================================
-- TABLA: enrollments (Inscripciones)
-- Relaciona empleados con capacitaciones y registra su estado
-- =============================================================
CREATE TABLE IF NOT EXISTS enrollments (
    id                  INT         NOT NULL AUTO_INCREMENT,
    employee_id         INT         NOT NULL,
    training_id         INT         NOT NULL,
    enrollment_date     DATE        NOT NULL,
    status              ENUM('inscrito', 'completado', 'cancelado') NOT NULL DEFAULT 'inscrito',
    PRIMARY KEY (id),
    CONSTRAINT fk_enrollments_employee
        FOREIGN KEY (employee_id) REFERENCES employees(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_enrollments_training
        FOREIGN KEY (training_id) REFERENCES trainings(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================================================
-- TABLA: grades (Calificaciones)
-- Notas obtenidas por cada empleado en sus inscripciones
-- Escala de calificación: 1.0 (mínimo) a 5.0 (máximo)
-- =============================================================
CREATE TABLE IF NOT EXISTS grades (
    id              INT             NOT NULL AUTO_INCREMENT,
    enrollment_id   INT             NOT NULL,
    score           DECIMAL(3, 1)   NOT NULL CHECK (score BETWEEN 1.0 AND 5.0),
    evaluation_date DATE            NOT NULL,
    comments        TEXT,
    PRIMARY KEY (id),
    CONSTRAINT fk_grades_enrollment
        FOREIGN KEY (enrollment_id) REFERENCES enrollments(id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- =============================================================
-- DATOS DE EJEMPLO: employees
-- 15 empleados con nombres hispanos de distintos departamentos
-- =============================================================
INSERT INTO employees (first_name, last_name, email, department, hire_date, is_active) VALUES
('Valentina',  'Ríos Herrera',       'v.rios@datatrain.com',        'Tecnología',        '2019-03-12', 1),
('Andrés',     'Morales Quintero',   'a.morales@datatrain.com',     'Tecnología',        '2020-07-01', 1),
('Camila',     'Ospina Vargas',      'c.ospina@datatrain.com',      'Recursos Humanos',  '2018-11-20', 1),
('Santiago',   'Gómez Pedraza',      's.gomez@datatrain.com',       'Finanzas',          '2021-02-15', 1),
('Daniela',    'Castro Londoño',     'd.castro@datatrain.com',      'Marketing',         '2020-05-30', 1),
('Felipe',     'Martínez Cárdenas',  'f.martinez@datatrain.com',    'Operaciones',       '2017-08-09', 1),
('Isabella',   'Torres Salcedo',     'i.torres@datatrain.com',      'Tecnología',        '2022-01-17', 1),
('Sebastián',  'Ramírez Patiño',     's.ramirez@datatrain.com',     'Finanzas',          '2019-09-03', 1),
('Juliana',    'López Arango',       'j.lopez@datatrain.com',       'Recursos Humanos',  '2021-06-14', 1),
('Mateo',      'Suárez Benítez',     'm.suarez@datatrain.com',      'Marketing',         '2020-10-22', 1),
('Gabriela',   'Díaz Restrepo',      'g.diaz@datatrain.com',        'Operaciones',       '2018-04-05', 1),
('Alejandro',  'Vargas Mendoza',     'a.vargas@datatrain.com',      'Tecnología',        '2023-03-01', 1),
('Natalia',    'Pérez Sánchez',      'n.perez@datatrain.com',       'Marketing',         '2022-08-19', 1),
('Ricardo',    'Hernández Mejía',    'r.hernandez@datatrain.com',   'Recursos Humanos',  '2017-12-11', 1),
('Sofía',      'Aguilar Montes',     's.aguilar@datatrain.com',     'Finanzas',          '2023-05-07', 0);

-- =============================================================
-- DATOS DE EJEMPLO: trainings
-- 12 capacitaciones en diferentes categorías tecnológicas
-- y de desarrollo profesional
-- =============================================================
INSERT INTO trainings (title, description, category, duration_hours, start_date, end_date, is_active) VALUES
('Desarrollo Web con React',
    'Curso completo de React 18: componentes, hooks, estado global con Redux y pruebas unitarias.',
    'Tecnología', 40.0, '2024-01-08', '2024-02-16', 1),

('SQL Avanzado y Optimización',
    'Consultas complejas, índices, procedimientos almacenados, vistas y ajuste de rendimiento en MySQL.',
    'Tecnología', 24.0, '2024-01-15', '2024-02-09', 1),

('Python para Análisis de Datos',
    'Introducción a pandas, numpy, matplotlib y scikit-learn para análisis y visualización de datos.',
    'Tecnología', 32.0, '2024-02-05', '2024-03-15', 1),

('Liderazgo y Gestión de Equipos',
    'Habilidades blandas, comunicación efectiva, resolución de conflictos y motivación de equipos.',
    'Desarrollo Profesional', 16.0, '2024-01-22', '2024-02-02', 1),

('Finanzas para No Financieros',
    'Conceptos de contabilidad, análisis de estados financieros, presupuesto y control de costos.',
    'Finanzas', 20.0, '2024-02-12', '2024-03-01', 1),

('Marketing Digital y Redes Sociales',
    'Estrategias de contenido, SEO, SEM, email marketing y métricas de rendimiento digital.',
    'Marketing', 18.0, '2024-03-04', '2024-03-22', 1),

('DevOps y CI/CD con Docker',
    'Contenedores Docker, orquestación con Kubernetes, pipelines de integración y despliegue continuo.',
    'Tecnología', 30.0, '2024-03-11', '2024-04-19', 1),

('Gestión de Proyectos con Scrum',
    'Marco ágil Scrum: roles, ceremonias, artefactos y herramientas como Jira para equipos modernos.',
    'Gestión', 12.0, '2024-02-19', '2024-02-23', 1),

('Seguridad Informática Básica',
    'Conceptos de ciberseguridad, buenas prácticas, manejo de contraseñas, phishing y protección de datos.',
    'Tecnología', 10.0, '2024-04-01', '2024-04-05', 1),

('Excel Avanzado para Negocios',
    'Tablas dinámicas, macros con VBA, funciones avanzadas, gráficos y dashboards ejecutivos.',
    'Productividad', 14.0, '2024-01-29', '2024-02-09', 1),

('Comunicación Efectiva en el Trabajo',
    'Técnicas de presentación, escucha activa, negociación y manejo de conversaciones difíciles.',
    'Desarrollo Profesional', 8.0, '2024-04-08', '2024-04-10', 1),

('Inteligencia Artificial y Machine Learning',
    'Fundamentos de IA, aprendizaje supervisado y no supervisado, redes neuronales y casos de uso empresarial.',
    'Tecnología', 36.0, '2024-05-06', '2024-06-14', 0);

-- =============================================================
-- DATOS DE EJEMPLO: sessions
-- Sesiones correspondientes a cada capacitación
-- =============================================================
INSERT INTO sessions (training_id, title, session_date, duration_minutes, location) VALUES
-- Sesiones de React (training_id = 1)
(1, 'Introducción a React y JSX',               '2024-01-08', 120, 'Sala A - Piso 3'),
(1, 'Componentes funcionales y Props',           '2024-01-15', 120, 'Sala A - Piso 3'),
(1, 'useState y useEffect en profundidad',       '2024-01-22', 120, 'Sala A - Piso 3'),
(1, 'Manejo de estado global con Redux',         '2024-01-29', 120, 'Sala A - Piso 3'),
(1, 'Pruebas con Jest y React Testing Library',  '2024-02-05', 120, 'Sala A - Piso 3'),
(1, 'Proyecto final y presentación',             '2024-02-16', 120, 'Auditorio Principal'),

-- Sesiones de SQL Avanzado (training_id = 2)
(2, 'Consultas avanzadas y subconsultas',        '2024-01-15', 180, 'Laboratorio TI'),
(2, 'Índices, vistas y procedimientos',          '2024-01-22', 180, 'Laboratorio TI'),
(2, 'Transacciones y control de concurrencia',   '2024-01-29', 180, 'Laboratorio TI'),
(2, 'Optimización de rendimiento y EXPLAIN',     '2024-02-09', 180, 'Laboratorio TI'),

-- Sesiones de Python (training_id = 3)
(3, 'Python básico y entorno de trabajo',        '2024-02-05', 150, 'Laboratorio TI'),
(3, 'Manipulación de datos con pandas',          '2024-02-12', 150, 'Laboratorio TI'),
(3, 'Visualización con matplotlib y seaborn',    '2024-02-26', 150, 'Laboratorio TI'),
(3, 'Introducción a Machine Learning',           '2024-03-15', 150, 'Laboratorio TI'),

-- Sesiones de Liderazgo (training_id = 4)
(4, 'Estilos de liderazgo y autoconocimiento',   '2024-01-22', 240, 'Sala de Conferencias B'),
(4, 'Comunicación asertiva y feedback',          '2024-01-29', 240, 'Sala de Conferencias B'),
(4, 'Gestión de conflictos y toma de decisiones','2024-02-02', 240, 'Sala de Conferencias B'),

-- Sesiones de Finanzas (training_id = 5)
(5, 'Conceptos financieros fundamentales',       '2024-02-12', 180, 'Sala B - Piso 2'),
(5, 'Lectura de estados financieros',            '2024-02-19', 180, 'Sala B - Piso 2'),
(5, 'Presupuesto y control de gestión',          '2024-03-01', 180, 'Sala B - Piso 2'),

-- Sesiones de Marketing Digital (training_id = 6)
(6, 'Estrategia de contenidos y SEO',            '2024-03-04', 200, 'Sala Creativa'),
(6, 'Publicidad en redes sociales y SEM',        '2024-03-11', 200, 'Sala Creativa'),
(6, 'Métricas, analytics y optimización',        '2024-03-22', 200, 'Sala Creativa'),

-- Sesiones de DevOps (training_id = 7)
(7, 'Contenedores Docker desde cero',            '2024-03-11', 210, 'Laboratorio TI'),
(7, 'Docker Compose y redes',                    '2024-03-18', 210, 'Laboratorio TI'),
(7, 'Kubernetes: pods, servicios y deploys',     '2024-04-01', 210, 'Laboratorio TI'),
(7, 'Pipelines CI/CD con GitHub Actions',        '2024-04-19', 210, 'Laboratorio TI'),

-- Sesiones de Scrum (training_id = 8)
(8, 'Fundamentos ágiles y marco Scrum',          '2024-02-19', 480, 'Auditorio Principal'),
(8, 'Ceremonia y artefactos Scrum en Jira',      '2024-02-23', 480, 'Auditorio Principal'),

-- Sesiones de Seguridad (training_id = 9)
(9, 'Amenazas actuales y buenas prácticas',      '2024-04-01', 300, 'Sala A - Piso 3'),
(9, 'Phishing, ingeniería social y RGPD',        '2024-04-05', 300, 'Sala A - Piso 3'),

-- Sesiones de Excel (training_id = 10)
(10,'Tablas dinámicas y segmentaciones',         '2024-01-29', 210, 'Sala B - Piso 2'),
(10,'Macros y automatización con VBA',           '2024-02-05', 210, 'Sala B - Piso 2'),
(10,'Dashboards ejecutivos y KPIs',              '2024-02-09', 210, 'Sala B - Piso 2');

-- =============================================================
-- DATOS DE EJEMPLO: enrollments
-- Inscripciones de empleados en distintas capacitaciones
-- =============================================================
INSERT INTO enrollments (employee_id, training_id, enrollment_date, status) VALUES
-- Valentina Ríos (emp 1) - Tecnología
(1,  1, '2023-12-20', 'completado'),
(1,  2, '2024-01-05', 'completado'),
(1,  7, '2024-03-01', 'completado'),
(1,  9, '2024-03-25', 'completado'),

-- Andrés Morales (emp 2) - Tecnología
(2,  1, '2023-12-22', 'completado'),
(2,  3, '2024-01-28', 'completado'),
(2,  8, '2024-02-12', 'completado'),

-- Camila Ospina (emp 3) - RRHH
(3,  4, '2024-01-10', 'completado'),
(3,  8, '2024-02-12', 'completado'),
(3, 11, '2024-04-01', 'completado'),

-- Santiago Gómez (emp 4) - Finanzas
(4,  5, '2024-02-01', 'completado'),
(4, 10, '2024-01-20', 'completado'),
(4,  4, '2024-01-10', 'completado'),
(4,  2, '2024-01-05', 'completado'),

-- Daniela Castro (emp 5) - Marketing
(5,  6, '2024-02-22', 'completado'),
(5,  4, '2024-01-10', 'completado'),
(5, 10, '2024-01-20', 'completado'),

-- Felipe Martínez (emp 6) - Operaciones
(6,  8, '2024-02-12', 'completado'),
(6,  5, '2024-02-01', 'completado'),
(6, 11, '2024-04-01', 'inscrito'),

-- Isabella Torres (emp 7) - Tecnología
(7,  1, '2023-12-22', 'completado'),
(7,  9, '2024-03-25', 'completado'),
(7,  3, '2024-01-28', 'cancelado'),

-- Sebastián Ramírez (emp 8) - Finanzas
(8,  5, '2024-02-01', 'completado'),
(8, 10, '2024-01-20', 'completado'),
(8,  2, '2024-01-05', 'completado'),

-- Juliana López (emp 9) - RRHH
(9,  4, '2024-01-10', 'completado'),
(9, 11, '2024-04-01', 'completado'),

-- Mateo Suárez (emp 10) - Marketing
(10, 6, '2024-02-22', 'completado'),
(10,10, '2024-01-20', 'completado'),
(10, 4, '2024-01-10', 'completado'),
(10, 8, '2024-02-12', 'inscrito'),

-- Gabriela Díaz (emp 11) - Operaciones
(11, 8, '2024-02-12', 'completado'),
(11, 9, '2024-03-25', 'completado'),

-- Alejandro Vargas (emp 12) - Tecnología
(12, 1, '2023-12-22', 'completado'),
(12, 2, '2024-01-05', 'completado'),
(12, 3, '2024-01-28', 'completado'),
(12, 7, '2024-03-01', 'inscrito'),

-- Natalia Pérez (emp 13) - Marketing
(13, 6, '2024-02-22', 'completado'),
(13, 4, '2024-01-10', 'completado'),

-- Ricardo Hernández (emp 14) - RRHH
(14, 4, '2024-01-10', 'completado'),
(14, 8, '2024-02-12', 'completado'),
(14,11, '2024-04-01', 'completado'),
(14, 5, '2024-02-01', 'cancelado');

-- =============================================================
-- DATOS DE EJEMPLO: grades
-- Calificaciones para inscripciones con estado 'completado'
-- Escala 1.0 - 5.0
-- =============================================================
INSERT INTO grades (enrollment_id, score, evaluation_date, comments) VALUES
-- Valentina Ríos
(1,  4.8, '2024-02-16', 'Excelente dominio de React, proyecto final sobresaliente.'),
(2,  4.5, '2024-02-09', 'Muy buen desempeño en consultas avanzadas y optimización.'),
(3,  4.7, '2024-04-19', 'Implementó pipelines CI/CD de forma autónoma y correcta.'),
(4,  4.9, '2024-04-05', 'Comprensión excepcional de amenazas y controles de seguridad.'),

-- Andrés Morales
(5,  4.2, '2024-02-16', 'Buen manejo de React, algunos ajustes necesarios en Redux.'),
(6,  4.6, '2024-03-15', 'Análisis de datos sólido, destaca en visualización con pandas.'),
(7,  4.0, '2024-02-23', 'Participación activa, comprende bien el marco Scrum.'),

-- Camila Ospina
(8,  4.7, '2024-02-02', 'Liderazgo natural, destacó en el módulo de comunicación asertiva.'),
(9,  4.5, '2024-02-23', 'Aplicó bien los conceptos de Scrum a casos reales de RRHH.'),
(10, 4.8, '2024-04-10', 'Comunicación impecable, manejo excelente de situaciones difíciles.'),

-- Santiago Gómez
(11, 4.3, '2024-03-01', 'Sólida comprensión de presupuesto y estados financieros.'),
(12, 4.6, '2024-02-09', 'Excelente uso de tablas dinámicas y construcción de dashboards.'),
(13, 3.9, '2024-02-02', 'Buen desempeño, puede mejorar en manejo de conflictos.'),
(14, 4.1, '2024-02-09', 'Comprende subconsultas; optimización requiere más práctica.'),

-- Daniela Castro
(15, 4.8, '2024-03-22', 'Estrategia de contenidos ejemplar, métricas muy bien aplicadas.'),
(16, 4.4, '2024-02-02', 'Buenas habilidades de comunicación y presentación de ideas.'),
(17, 4.2, '2024-02-09', 'Domina Excel avanzado; explorar más las macros VBA.'),

-- Felipe Martínez
(18, 3.8, '2024-02-23', 'Conocimiento básico de Scrum, asistencia irregular.'),
(19, 4.0, '2024-03-01', 'Comprende el presupuesto operativo, mejorar en análisis de costos.'),

-- Isabella Torres
(20, 4.5, '2024-02-16', 'Muy buen proyecto final en React, domina hooks avanzados.'),
(21, 4.3, '2024-04-05', 'Buena comprensión de ciberseguridad aplicada al entorno de desarrollo.'),

-- Sebastián Ramírez
(23, 4.4, '2024-03-01', 'Análisis financiero correcto y bien fundamentado.'),
(24, 3.7, '2024-02-09', 'Buen uso de fórmulas, dashboards con oportunidades de mejora.'),
(25, 3.5, '2024-02-09', 'Manejo básico de SQL avanzado; necesita reforzar índices.'),

-- Juliana López
(26, 4.6, '2024-02-02', 'Excelente facilitadora, destacó en módulo de gestión de conflictos.'),
(27, 4.9, '2024-04-10', 'Presentación sobresaliente, comunicación clara y empática.'),

-- Mateo Suárez
(28, 4.1, '2024-03-22', 'Buen manejo de redes sociales, métricas en progreso.'),
(29, 3.8, '2024-02-09', 'Funciones básicas dominadas; tablas dinámicas a reforzar.'),
(30, 3.6, '2024-02-02', 'Participación tímida, conceptos de liderazgo por consolidar.'),

-- Gabriela Díaz
(32, 3.4, '2024-02-23', 'Comprensión básica de Scrum, aplicación en campo limitada.'),
(33, 3.9, '2024-04-05', 'Conocimiento de seguridad aceptable, reforzar prácticas de RGPD.'),

-- Alejandro Vargas
(34, 4.0, '2024-02-16', 'Buen dominio de React básico; hooks avanzados por mejorar.'),
(35, 4.3, '2024-02-09', 'Consultas complejas correctas, buen uso de índices.'),
(36, 4.5, '2024-03-15', 'Python sólido, visualizaciones creativas y bien documentadas.'),

-- Natalia Pérez
(38, 4.7, '2024-03-22', 'Estrategia digital muy creativa y bien ejecutada.'),
(39, 4.2, '2024-02-02', 'Liderazgo en desarrollo, buena actitud y participación.'),

-- Ricardo Hernández
(40, 4.9, '2024-02-02', 'Veterano en liderazgo, aportó perspectivas muy valiosas al grupo.'),
(41, 4.6, '2024-02-23', 'Excelente coordinador, Scrum aplicado al área de RRHH con éxito.'),
(42, 4.8, '2024-04-10', 'Comunicación institucional impecable, referente del equipo.');

-- =============================================================
-- VISTA: v_employee_performance
-- Muestra el nombre completo, departamento y promedio
-- de calificaciones de cada empleado
-- =============================================================
CREATE OR REPLACE VIEW v_employee_performance AS
SELECT
    e.id                                        AS employee_id,
    CONCAT(e.first_name, ' ', e.last_name)      AS employee_name,
    e.department,
    ROUND(AVG(g.score), 2)                      AS average_score,
    COUNT(DISTINCT en.id)                       AS total_enrollments,
    COUNT(g.id)                                 AS total_grades
FROM employees e
INNER JOIN enrollments en ON en.employee_id = e.id
INNER JOIN grades g       ON g.enrollment_id = en.id
GROUP BY e.id, e.first_name, e.last_name, e.department;

-- =============================================================
-- VISTA: v_training_stats
-- Muestra estadísticas por capacitación: inscritos y promedio
-- =============================================================
CREATE OR REPLACE VIEW v_training_stats AS
SELECT
    t.id                    AS training_id,
    t.title                 AS training_title,
    t.category,
    COUNT(DISTINCT en.id)   AS enrolled_count,
    COUNT(DISTINCT CASE WHEN en.status = 'completado' THEN en.id END) AS completed_count,
    ROUND(AVG(g.score), 2)  AS average_score
FROM trainings t
LEFT JOIN enrollments en ON en.training_id = t.id
LEFT JOIN grades g        ON g.enrollment_id = en.id
GROUP BY t.id, t.title, t.category;

-- =============================================================
-- CONSULTAS DE ANÁLISIS
-- =============================================================

-- Consulta 1: Top 5 empleados con mejor promedio de calificaciones
/*
SELECT
    CONCAT(e.first_name, ' ', e.last_name)  AS empleado,
    e.department                             AS departamento,
    ROUND(AVG(g.score), 2)                  AS promedio
FROM employees e
INNER JOIN enrollments en ON en.employee_id = e.id
INNER JOIN grades g       ON g.enrollment_id = en.id
GROUP BY e.id, e.first_name, e.last_name, e.department
ORDER BY promedio DESC
LIMIT 5;
*/

-- Consulta 2: Capacitaciones con mayor cantidad de inscritos
/*
SELECT
    t.title                 AS capacitacion,
    t.category              AS categoria,
    COUNT(en.id)            AS total_inscritos
FROM trainings t
INNER JOIN enrollments en ON en.training_id = t.id
GROUP BY t.id, t.title, t.category
ORDER BY total_inscritos DESC;
*/

-- Consulta 3: Capacitaciones con mayor cantidad de inscritos activos (solo 'inscrito' o 'completado')
/*
SELECT
    t.title                                                         AS capacitacion,
    COUNT(en.id)                                                    AS total_participantes,
    SUM(CASE WHEN en.status = 'completado' THEN 1 ELSE 0 END)      AS completados,
    SUM(CASE WHEN en.status = 'inscrito'   THEN 1 ELSE 0 END)      AS en_curso
FROM trainings t
INNER JOIN enrollments en ON en.training_id = t.id
WHERE en.status IN ('inscrito', 'completado')
GROUP BY t.id, t.title
ORDER BY total_participantes DESC;
*/

-- Consulta 4: Promedio de calificaciones por capacitación
/*
SELECT
    t.title                AS capacitacion,
    t.category             AS categoria,
    ROUND(AVG(g.score), 2) AS promedio_nota,
    MIN(g.score)           AS nota_minima,
    MAX(g.score)           AS nota_maxima
FROM trainings t
INNER JOIN enrollments en ON en.training_id = t.id
INNER JOIN grades g       ON g.enrollment_id = en.id
GROUP BY t.id, t.title, t.category
ORDER BY promedio_nota DESC;
*/

-- Consulta 5: Sesiones programadas entre dos fechas específicas
/*
SELECT
    s.session_date              AS fecha_sesion,
    t.title                     AS capacitacion,
    s.title                     AS sesion,
    s.duration_minutes          AS duracion_min,
    s.location                  AS ubicacion
FROM sessions s
INNER JOIN trainings t ON t.id = s.training_id
WHERE s.session_date BETWEEN '2024-02-01' AND '2024-03-31'
ORDER BY s.session_date ASC;
*/

-- Consulta 6: Empleados inscritos en más de 3 capacitaciones
/*
SELECT
    CONCAT(e.first_name, ' ', e.last_name)  AS empleado,
    e.department                             AS departamento,
    COUNT(en.id)                             AS total_capacitaciones
FROM employees e
INNER JOIN enrollments en ON en.employee_id = e.id
GROUP BY e.id, e.first_name, e.last_name, e.department
HAVING COUNT(en.id) > 3
ORDER BY total_capacitaciones DESC;
*/

-- Consulta 7: Capacitaciones sin ningún inscrito (usando LEFT JOIN y subquería)
/*
SELECT
    t.id            AS id_capacitacion,
    t.title         AS capacitacion,
    t.category      AS categoria,
    t.start_date    AS fecha_inicio
FROM trainings t
LEFT JOIN enrollments en ON en.training_id = t.id
WHERE en.id IS NULL
ORDER BY t.start_date;

-- Variante equivalente con subconsulta correlacionada
SELECT
    t.id, t.title, t.category
FROM trainings t
WHERE NOT EXISTS (
    SELECT 1 FROM enrollments en WHERE en.training_id = t.id
);
*/

-- Consulta 8: Ranking general de desempeño con posición ordenada
/*
SELECT
    RANK() OVER (ORDER BY AVG(g.score) DESC)    AS posicion,
    CONCAT(e.first_name, ' ', e.last_name)      AS empleado,
    e.department                                 AS departamento,
    COUNT(g.id)                                  AS evaluaciones,
    ROUND(AVG(g.score), 2)                       AS promedio
FROM employees e
INNER JOIN enrollments en ON en.employee_id = e.id
INNER JOIN grades g       ON g.enrollment_id = en.id
GROUP BY e.id, e.first_name, e.last_name, e.department
ORDER BY promedio DESC;
*/

-- Consulta 9: Última sesión registrada de cada capacitación
/*
SELECT
    t.title                     AS capacitacion,
    s.title                     AS ultima_sesion,
    s.session_date              AS fecha,
    s.location                  AS ubicacion
FROM sessions s
INNER JOIN trainings t ON t.id = s.training_id
WHERE s.session_date = (
    SELECT MAX(s2.session_date)
    FROM sessions s2
    WHERE s2.training_id = s.training_id
)
ORDER BY s.session_date DESC;
*/

-- Consulta 10: Empleado con el peor desempeño (menor promedio de notas)
/*
SELECT
    CONCAT(e.first_name, ' ', e.last_name)  AS empleado,
    e.department                             AS departamento,
    ROUND(AVG(g.score), 2)                  AS promedio_notas
FROM employees e
INNER JOIN enrollments en ON en.employee_id = e.id
INNER JOIN grades g       ON g.enrollment_id = en.id
GROUP BY e.id, e.first_name, e.last_name, e.department
HAVING AVG(g.score) = (
    SELECT MIN(avg_score)
    FROM (
        SELECT AVG(g2.score) AS avg_score
        FROM enrollments en2
        INNER JOIN grades g2 ON g2.enrollment_id = en2.id
        GROUP BY en2.employee_id
    ) AS subquery_promedios
);
*/
