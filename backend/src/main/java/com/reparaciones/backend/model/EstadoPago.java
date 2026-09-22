package com.reparaciones.backend.model;

// A diferencia de EstadoReparacion, este NO se persiste en la base.
// Se calcula al vuelo comparando importe vs. montoPagado (ver DtoMapper).
public enum EstadoPago {
    PENDIENTE,
    PARCIAL,
    PAGADO
}