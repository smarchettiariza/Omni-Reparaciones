package com.reparaciones.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardResponseDTO {
    private long totalEnLocal;
    private long enDiagnostico;
    private long enReparacion;
    private long reparados;
    private long listosParaRetirar;
}
