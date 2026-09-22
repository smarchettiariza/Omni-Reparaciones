-- =========================================================
-- Sistema de gestión de reparaciones de celulares - Omni
-- Schema PostgreSQL
-- =========================================================

-- =========================
-- CLIENTES
-- =========================
CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_clientes_telefono ON clientes(telefono);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);

-- =========================
-- REPARACIONES
-- =========================
CREATE TABLE reparaciones (
    id BIGSERIAL PRIMARY KEY,
    numero_orden BIGSERIAL UNIQUE,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
    marca VARCHAR(60) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    imei VARCHAR(20),
    color VARCHAR(40),
    falla_informada TEXT NOT NULL,
    estado_fisico TEXT,
    observaciones TEXT,
    fecha_ingreso TIMESTAMP NOT NULL DEFAULT now(),
    estado VARCHAR(30) NOT NULL DEFAULT 'RECIBIDO'
        CHECK (estado IN ('RECIBIDO','DIAGNOSTICO','REPARACION','REPARADO',
                           'LISTO_PARA_RETIRAR','ENTREGADO','NO_REPARADO','CANCELADO')),
    -- Datos de pago: opcionales, se completan cuando se define el precio.
    importe NUMERIC(10,2),
    metodo_pago VARCHAR(20)
        CHECK (metodo_pago IN ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA')),
    monto_pagado NUMERIC(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_reparaciones_cliente ON reparaciones(cliente_id);
CREATE INDEX idx_reparaciones_imei ON reparaciones(imei);
CREATE INDEX idx_reparaciones_marca_modelo ON reparaciones(marca, modelo);
CREATE INDEX idx_reparaciones_estado ON reparaciones(estado);
CREATE INDEX idx_reparaciones_numero_orden ON reparaciones(numero_orden);

-- =========================
-- HISTORIAL DE ESTADOS
-- =========================
CREATE TABLE historial_estados (
    id BIGSERIAL PRIMARY KEY,
    reparacion_id BIGINT NOT NULL REFERENCES reparaciones(id) ON DELETE CASCADE,
    estado VARCHAR(30) NOT NULL
        CHECK (estado IN ('RECIBIDO','DIAGNOSTICO','REPARACION','REPARADO',
                           'LISTO_PARA_RETIRAR','ENTREGADO','NO_REPARADO','CANCELADO')),
    fecha TIMESTAMP NOT NULL DEFAULT now(),
    comentario TEXT
);

CREATE INDEX idx_historial_reparacion ON historial_estados(reparacion_id);

-- =========================
-- USUARIOS (login del sistema)
-- =========================
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- No se inserta ningun usuario aca: el backend crea automaticamente un
-- admin por defecto (usuario "admin", contrasena "omni1234") la primera
-- vez que arranca contra una base de datos con la tabla usuarios vacia.
-- Ver AdminInicialConfig.java. Cambiar esa contrasena desde la app
-- apenas se instale una copia nueva (pantalla "Cambiar contraseña").

-- =========================
-- Trigger: actualizar updated_at automáticamente
-- =========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_clientes_updated_at
BEFORE UPDATE ON clientes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_reparaciones_updated_at
BEFORE UPDATE ON reparaciones
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =========================
-- Datos de ejemplo (opcional, útil para probar con Postman)
-- =========================
-- INSERT INTO clientes (nombre, telefono, email) VALUES ('Juan Pérez', '3511234567', 'juan@mail.com');
-- INSERT INTO reparaciones (cliente_id, marca, modelo, imei, color, falla_informada, estado)
--   VALUES (1, 'Samsung', 'A54', '123456789012345', 'Negro', 'No enciende', 'RECIBIDO');