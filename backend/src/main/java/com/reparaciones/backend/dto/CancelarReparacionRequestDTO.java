package com.reparaciones.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CancelarReparacionRequestDTO {

    @NotBlank(message = "El motivo de la cancelación es obligatorio")
    private String motivo;
}