package com.reparaciones.backend.dto;

import com.reparaciones.backend.model.EstadoPago;
import com.reparaciones.backend.model.EstadoReparacion;
import com.reparaciones.backend.model.MetodoPago;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ReparacionResponseDTO {
    private Long id;
    private Long numeroOrden;
    private Long clienteId;
    private String clienteNombre;
    private String clienteTelefono;
    private String marca;
    private String modelo;
    private String imei;
    private String color;
    private String fallaInformada;
    private String estadoFisico;
    private String observaciones;
    private LocalDateTime fechaIngreso;
    private EstadoReparacion estado;
    private List<HistorialEstadoDTO> historial;
    private BigDecimal importe;
    private MetodoPago metodoPago;
    private BigDecimal montoPagado;
    private EstadoPago estadoPago;
}