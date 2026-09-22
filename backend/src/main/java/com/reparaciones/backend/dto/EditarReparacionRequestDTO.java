package com.reparaciones.backend.dto;

import com.reparaciones.backend.model.MetodoPago;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

// Campos que se pueden editar despues de creada la orden.
// El cliente y el estado tienen sus propios flujos (no se tocan aca).
@Getter
@Setter
public class EditarReparacionRequestDTO {

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    private String imei;
    private String color;

    @NotBlank(message = "La falla informada es obligatoria")
    private String fallaInformada;

    private String estadoFisico;
    private String observaciones;

    @DecimalMin(value = "0.0", message = "El importe no puede ser negativo")
    private BigDecimal importe;

    private MetodoPago metodoPago;

    @DecimalMin(value = "0.0", message = "El monto pagado no puede ser negativo")
    private BigDecimal montoPagado;
}