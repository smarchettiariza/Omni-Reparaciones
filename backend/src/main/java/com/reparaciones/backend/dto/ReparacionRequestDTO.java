package com.reparaciones.backend.dto;

import com.reparaciones.backend.model.MetodoPago;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ReparacionRequestDTO {

    // Si el cliente ya existe, mandar clienteId. Si es nuevo, mandar los datos
    // sueltos y el backend lo crea de una en el mismo paso (registro rapido).
    private Long clienteId;
    private String clienteNombre;
    private String clienteTelefono;
    private String clienteEmail;

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

    // Datos de pago: todos opcionales, por si todavia no se define el precio al ingresar el equipo.
    @DecimalMin(value = "0.0", message = "El importe no puede ser negativo")
    private BigDecimal importe;

    private MetodoPago metodoPago;

    @DecimalMin(value = "0.0", message = "El monto pagado no puede ser negativo")
    private BigDecimal montoPagado;
}