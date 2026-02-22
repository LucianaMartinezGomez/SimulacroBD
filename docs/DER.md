# Diagrama Entidad-Relación - DataTrain Corp

## Instrucciones para Generar el DER

1. Ingresar a [https://dbdiagram.io](https://dbdiagram.io)
2. Crear un nuevo diagrama
3. Copiar y pegar el código DBML de la sección siguiente
4. Exportar el diagrama como imagen PNG
5. Guardar el archivo como `docs/DER.png` en la raíz del proyecto

---

## Descripción de Entidades

### `employees` — Empleados
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| department | VARCHAR(100) | |
| hire_date | DATE | |
| is_active | TINYINT(1) | DEFAULT 1 |

### `trainings` — Capacitaciones
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| category | VARCHAR(100) | |
| duration_hours | INT | |
| start_date | DATE | |
| end_date | DATE | |
| is_active | TINYINT(1) | DEFAULT 1 |

### `sessions` — Sesiones
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| training_id | INT | FK → trainings.id |
| title | VARCHAR(200) | NOT NULL |
| session_date | DATE | |
| duration_minutes | INT | |
| location | VARCHAR(200) | |

### `enrollments` — Inscripciones
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| employee_id | INT | FK → employees.id |
| training_id | INT | FK → trainings.id |
| enrollment_date | DATE | |
| status | ENUM('inscrito','completado','cancelado') | DEFAULT 'inscrito' |

### `grades` — Calificaciones
| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| enrollment_id | INT | FK → enrollments.id |
| score | DECIMAL(3,1) | |
| evaluation_date | DATE | |
| comments | TEXT | |

---

## Relaciones

| Entidad origen | Cardinalidad | Entidad destino | Descripción |
|----------------|--------------|-----------------|-------------|
| employees | 1 → N | enrollments | Un empleado puede tener muchas inscripciones |
| trainings | 1 → N | sessions | Una capacitación puede tener muchas sesiones |
| trainings | 1 → N | enrollments | Una capacitación puede tener muchos inscritos |
| enrollments | 1 → 1 | grades | Una inscripción tiene como máximo una calificación |

---

## Código DBML para dbdiagram.io

```dbml
Table employees {
  id int [pk, increment]
  first_name varchar(100) [not null]
  last_name varchar(100) [not null]
  email varchar(150) [unique, not null]
  department varchar(100)
  hire_date date
  is_active tinyint [default: 1]
}

Table trainings {
  id int [pk, increment]
  title varchar(200) [not null]
  description text
  category varchar(100)
  duration_hours int
  start_date date
  end_date date
  is_active tinyint [default: 1]
}

Table sessions {
  id int [pk, increment]
  training_id int [not null]
  title varchar(200) [not null]
  session_date date
  duration_minutes int
  location varchar(200)
}

Table enrollments {
  id int [pk, increment]
  employee_id int [not null]
  training_id int [not null]
  enrollment_date date
  status varchar(20) [default: 'inscrito', note: 'inscrito | completado | cancelado']
}

Table grades {
  id int [pk, increment]
  enrollment_id int [not null]
  score decimal(3,1)
  evaluation_date date
  comments text
}

Ref: enrollments.employee_id > employees.id
Ref: enrollments.training_id > trainings.id
Ref: sessions.training_id > trainings.id
Ref: grades.enrollment_id - enrollments.id
```

---

> ⚠️ Nota: Generar DER.png desde dbdiagram.io y guardarlo en `/docs/DER.png`
