# Sistema de Gestión de Reparaciones

Aplicación full stack para gestionar clientes, reparaciones de equipos, historial de estados, autenticación de usuarios y dashboard operativo de un taller de reparación de celulares.

## Descripción general

Este proyecto combina:

- Backend en Java 21 con Spring Boot 3.5
- Frontend en React + TypeScript + Vite
- Base de datos PostgreSQL
- Autenticación basada en JWT
- Arquitectura REST para administración de clientes y reparaciones

El sistema permite registrar clientes, crear órdenes de reparación, actualizar el estado de cada equipo, consultar fichas, ver historial, cambiar contraseña del usuario autenticado y consultar un dashboard resumido de la operación.

---

## Stack tecnológico

### Backend
- Java 21
- Spring Boot 3.5.16
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Security
- PostgreSQL Driver
- JWT (jjwt)
- Lombok

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS

### Base de datos
- PostgreSQL

---

## Estructura del proyecto

```text
reparaciones/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── com/reparaciones/backend/
│       │   │       ├── config/
│       │   │       ├── controller/
│       │   │       ├── dto/
│       │   │       ├── exception/
│       │   │       ├── model/
│       │   │       ├── repository/
│       │   │       ├── security/
│       │   │       └── service/
│       │   └── resources/
│       │       └── application.properties
│       └── test/
├── database/
│   └── schema.sql
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── api/
│       ├── auth/
│       ├── components/
│       ├── config/
│       ├── pages/
│       ├── types/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
├── package.json
├── README.md
└── .github/
```

---

## Requisitos previos

Antes de correr el proyecto, asegúrate de tener instalado:

- JDK 21
- Maven
- Node.js 18+ o superior
- npm
- PostgreSQL 14+ (o compatible)
- Git

---

## Configuración de la base de datos

1. Crear una base de datos PostgreSQL.
2. Ejecutar el archivo SQL que se encuentra en:

```text
database/schema.sql
```

Este script crea las tablas y reglas necesarias para:
- usuarios
- clientes
- reparaciones
- historial_estados
- índices de búsqueda
- restricciones para estados y métodos de pago
- triggers para actualizar `updated_at`

El esquema también contempla los datos económicos de cada reparación:

- `importe`
- `metodo_pago`
- `monto_pagado`

El estado de pago (`PENDIENTE`, `PARCIAL` o `PAGADO`) se calcula en el backend y no se guarda como una columna independiente.

> `schema.sql` está pensado para una base nueva. Si las tablas ya existen, no lo ejecutes nuevamente sin hacer una migración o respaldar la base.

### Variables de conexión

La configuración del backend está en:

```text
backend/src/main/resources/application.properties
```

Ejemplo por defecto:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/reparaciones_db
spring.datasource.username=postgres
spring.datasource.password=1234
server.port=8080
```

Ajusta los valores a tu entorno si tu PostgreSQL usa otro nombre de base de datos, usuario o contraseña.

También puedes crear y cargar la base desde la terminal:

```bash
psql -U postgres -c "CREATE DATABASE reparaciones_db;"
psql -U postgres -d reparaciones_db -f database/schema.sql
```

---

## Instalación y ejecución

### 1) Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd reparaciones
```

### 2) Instalar dependencias del frontend

```bash
cd frontend
npm install
cd ..
```

### 3) Compilar y ejecutar el backend

Desde la raíz del proyecto:

```bash
mvn -f backend/pom.xml clean package
mvn -f backend/pom.xml spring-boot:run
```

El backend quedará disponible en:

```text
http://localhost:8080
```

### 4) Ejecutar el frontend

En otra terminal, desde la carpeta `frontend`:

```bash
npm run dev
```

El frontend quedará disponible en:

```text
http://localhost:5173
```

El cliente Axios utiliza actualmente `http://localhost:8080/api` como URL base.

---

## Usuario administrador por defecto

Cuando el backend inicia y la tabla de usuarios está vacía, crea automáticamente un usuario administrador:

- Usuario: `admin`
- Contraseña: `omni1234`

Este valor se define en `AdminInicialConfig.java` y debería cambiarse en producción.

> Importante: una vez que inicies el proyecto por primera vez, cambia la contraseña desde la aplicación o desde el backend. No dejes la contraseña por defecto en un entorno real.

---

## Funcionalidades principales

### Autenticación
- Login con usuario y contraseña
- JWT para proteger endpoints
- Cambio de contraseña autenticado
- CORS habilitado solo para localhost en desarrollo

### Clientes
- Crear cliente
- Listar clientes con búsqueda
- Ver detalle de un cliente
- Editar datos del cliente
- Consultar historial de reparaciones del cliente

### Reparaciones
- Crear nueva reparación
- Listar reparaciones con filtros:
  - número de orden
  - nombre del cliente
  - teléfono
  - IMEI
  - marca/modelo
  - estado
- Ver ficha completa de una reparación
- Cambiar estado
- Editar datos del equipo
- Cancelar reparación

### Dashboard
- Totales generales de la operativa
- Conteo por estado operativo
- Visión rápida del flujo de trabajo del taller

---

## API REST

El backend expone los siguientes endpoints principales.

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Inicia sesión y devuelve JWT |
| PATCH | `/api/auth/password` | Cambia la contraseña del usuario autenticado |

### Clientes

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/clientes` | Crea un cliente |
| GET | `/api/clientes` | Lista clientes con búsqueda opcional |
| GET | `/api/clientes/{id}` | Obtiene un cliente |
| PUT | `/api/clientes/{id}` | Edita un cliente |
| GET | `/api/clientes/{id}/reparaciones` | Historial de reparaciones de un cliente |

Ejemplo de cliente:

```json
{
  "nombre": "Juan Perez",
  "telefono": "3511234567",
  "email": "juan@mail.com"
}
```

### Reparaciones

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/reparaciones` | Crea una reparación |
| GET | `/api/reparaciones` | Lista reparaciones con filtros |
| GET | `/api/reparaciones/{id}` | Obtiene una reparación por ID |
| PATCH | `/api/reparaciones/{id}/estado` | Cambia el estado |
| PUT | `/api/reparaciones/{id}` | Edita datos del equipo |
| PATCH | `/api/reparaciones/{id}/cancelar` | Cancela una reparación |

Ejemplo de alta de reparación:

```json
{
  "clienteId": 1,
  "marca": "Samsung",
  "modelo": "A54",
  "imei": "123456789012345",
  "color": "Negro",
  "fallaInformada": "No enciende",
  "estadoFisico": "Marcas de uso",
  "observaciones": "Se entrega sin cargador",
  "importe": 25000,
  "metodoPago": "EFECTIVO",
  "montoPagado": 10000
}
```

También se puede enviar `clienteNombre`, `clienteTelefono` y `clienteEmail` para crear el cliente durante el alta de la reparación.

### Dashboard

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/dashboard` | Obtiene resumen del dashboard |

### Estados de reparación

Los estados soportados son:

- `RECIBIDO`
- `DIAGNOSTICO`
- `REPARACION`
- `REPARADO`
- `LISTO_PARA_RETIRAR`
- `ENTREGADO`
- `NO_REPARADO`
- `CANCELADO`

Métodos de pago soportados:

- `EFECTIVO`
- `TARJETA`
- `TRANSFERENCIA`

Todos los endpoints, excepto el login, requieren:

```http
Authorization: Bearer <token>
```

---

## Flujo típico de uso

1. Iniciar sesión con `admin` / `omni1234`.
2. Crear o buscar un cliente.
3. Registrar una nueva reparación.
4. Actualizar el estado durante el diagnóstico y la reparación.
5. Finalizar la reparación cuando corresponda.
6. Ver el dashboard para tener una vista general del taller.

---

## Variables de entorno y seguridad

La seguridad del backend usa JWT y una clave configurable en:

```properties
app.jwt.secret=OmniSistemaDeReparaciones2026ClaveSecretaJWTCambiarEnProduccion
app.jwt.expiration-ms=86400000
```

Para un entorno real, se recomienda:
- cambiar la clave JWT por una secreta propia
- usar contraseñas fuertes
- no commitear credenciales reales
- no usar la base de datos local en producción sin ajustes de seguridad

---

## Modo de desarrollo

Durante desarrollo, se usa:

- PostgreSQL local
- Backend en localhost:8080
- Frontend Vite en localhost:5173
- CORS configurado para `http://localhost:*`

---

## Scripts útiles

### Backend

```bash
cd backend
mvn clean package
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

---

## Troubleshooting

### Error de conexión a PostgreSQL
Verifica que:
- PostgreSQL esté corriendo
- la base exista
- la credencial en `application.properties` coincida con tu entorno
- el usuario tenga permisos sobre esa base

### `mvn` no se reconoce

Instala Maven y agrega su carpeta `bin` al `PATH`. Comprueba también que tienes un JDK, no solamente un runtime:

```powershell
mvn -version
javac -version
```

### Error de validación de Hibernate

Con `spring.jpa.hibernate.ddl-auto=validate`, las tablas y columnas del esquema deben coincidir con las entidades Java. Usa una base nueva para probar `schema.sql` o aplica una migración controlada sobre una base existente.

### Error de autenticación
Asegúrate de:
- enviar el JWT en el header `Authorization: Bearer <token>`
- usar la ruta correcta de login
- no haber modificado la clave JWT sin reiniciar el backend

### Frontend no conecta con backend
Comprueba que:
- el backend esté levantado en el puerto 8080
- la URL base del cliente API en la configuración del frontend esté apuntando al backend correcto
- CORS no esté bloqueando la llamada

### Error `401` en el login

Comprueba que exista la tabla `usuarios` y recuerda que el administrador inicial solo se crea si la tabla estaba vacía al arrancar el backend.

---

## Notas del proyecto

- El schema SQL ya crea la estructura base de la aplicación.
- Los datos se pueden iniciar con un usuario administrador por defecto.
- El proyecto está diseñado para un taller o negocio que gestiona varias reparaciones de equipos.
- La aplicación es una base sólida para continuar extendiendo funciones como reportes, facturación, stock, historial financiero o notificaciones.

---

## Licencia

No se especifica una licencia explícita en el repositorio. Si el proyecto va a distribuirse o reutilizarse en producción, conviene definir una antes de su publicación.

---

## Conclusión

Este sistema ofrece una base funcional completa para la gestión de clientes y reparaciones, con un backend robusto y un frontend simple y operativo. Está listo para ser ejecutado localmente, extendido con nuevas funcionalidades y adaptado a un entorno real de producción con ajustes de seguridad y despliegue.
