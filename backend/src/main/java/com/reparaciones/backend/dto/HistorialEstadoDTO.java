package com.reparaciones.backend.dto;

import com.reparaciones.backend.model.EstadoReparacion;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class HistorialEstadoDTO {
    private EstadoReparacion estado;
    private LocalDateTime fecha;
    private String comentario;
}
