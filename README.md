<div align="center">

# 📱 Omni

**Sistema de gestión de reparaciones de celulares**

Registro de equipos, seguimiento de estados, historial de clientes, pagos y comprobantes — todo en un solo lugar.

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=flat&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

</div>

---

##  Funcionalidades

-  **Login con JWT** — acceso protegido, contraseña propia por instalación
-  **Registro de equipos** — alta rápida con datos del cliente y del dispositivo
-  **Seguimiento de estados** — de "Recibido" a "Entregado", con historial completo
-  **Búsqueda y filtros** — por orden, cliente, teléfono, IMEI, marca/modelo o estado
-  **Gestión de clientes** — ficha con historial completo de equipos traídos
-  **Control de pagos** — importe, método de pago, pagos parciales y saldo pendiente
-  **Comprobantes** — recibo imprimible y envío directo por WhatsApp
-  **Cancelación de órdenes** — con motivo registrado en el historial
-  **Dashboard** — estado general del taller de un vistazo

## 🛠️ Stack técnico

| | |
|---|---|
| **Backend** | Java 21 · Spring Boot 3.5 · Spring Security (JWT) · Hibernate · PostgreSQL |
| **Frontend** | React 19 · TypeScript · Vite · Tailwind CSS 3 · React Router · Axios |

## 📂 Estructura del proyecto

```
reparaciones/
├── backend/      → API REST (Spring Boot)
├── frontend/     → Interfaz web (React + Vite)
└── database/     → schema.sql — script de creación de la base de datos
```

## 🚀 Instalación

### Requisitos

- [Java 21](https://adoptium.net/)
- [Maven](https://maven.apache.org/)
- [PostgreSQL](https://www.postgresql.org/download/) 14+
- [Node.js](https://nodejs.org/) 18+

### 1. Base de datos

```sql
CREATE DATABASE reparaciones_db;
```

Corré `database/schema.sql` completo contra esa base.

### 2. Backend

Editá `backend/src/main/resources/application.properties` con tus credenciales de PostgreSQL y una clave `app.jwt.secret` propia:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/reparaciones_db
spring.datasource.username=postgres
spring.datasource.password=tu_password

app.jwt.secret=una-frase-larga-y-unica-de-al-menos-32-caracteres
```

Levantalo:

```bash
cd backend
mvn spring-boot:run
```

En el primer arranque contra una base vacía se crea un usuario admin automático:

```
usuario:    admin
contraseña: omni1234
```

Cambiala desde la app apenas ingreses (**Cambiar contraseña** en el menú).

### 3. Datos del local

Completá `frontend/src/config/local.ts` con el nombre, dirección, teléfono y condiciones de garantía reales — aparecen en el recibo y en los mensajes de WhatsApp.

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## 📌 Notas

- Cada instalación es **independiente**: base de datos propia, sin datos compartidos entre distintas instancias del sistema.
- El valor de `app.jwt.secret` debe ser único por instalación — nunca reutilizar el mismo entre distintos despliegues.


<div align="center">

Hecho con 🔧 para talleres de reparación de celulares.

</div>
