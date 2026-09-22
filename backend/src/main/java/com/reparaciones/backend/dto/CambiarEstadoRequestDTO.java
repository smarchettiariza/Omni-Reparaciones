package com.reparaciones.backend.dto;

import com.reparaciones.backend.model.EstadoReparacion;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CambiarEstadoRequestDTO {

    @NotNull(message = "El nuevo estado es obligatorio")
    private EstadoReparacion nuevoEstado;

    // Opcional: se guarda junto con el cambio en el historial
    private String comentario;
}
