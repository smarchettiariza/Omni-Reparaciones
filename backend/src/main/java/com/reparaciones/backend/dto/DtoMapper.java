package com.reparaciones.backend.dto;

import com.reparaciones.backend.model.Cliente;
import com.reparaciones.backend.model.EstadoPago;
import com.reparaciones.backend.model.HistorialEstado;
import com.reparaciones.backend.model.Reparacion;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class DtoMapper {

    private DtoMapper() {
    }

    public static ClienteResponseDTO toDTO(Cliente cliente) {
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getTelefono(),
                cliente.getEmail(),
                cliente.getCreatedAt());
    }

    public static ReparacionResponseDTO toDTO(Reparacion r) {
        List<HistorialEstadoDTO> historial = r.getHistorial().stream()
                .map(DtoMapper::toDTO)
                .collect(Collectors.toList());

        return new ReparacionResponseDTO(
                r.getId(),
                r.getNumeroOrden(),
                r.getCliente().getId(),
                r.getCliente().getNombre(),
                r.getCliente().getTelefono(),
                r.getMarca(),
                r.getModelo(),
                r.getImei(),
                r.getColor(),
                r.getFallaInformada(),
                r.getEstadoFisico(),
                r.getObservaciones(),
                r.getFechaIngreso(),
                r.getEstado(),
                historial,
                r.getImporte(),
                r.getMetodoPago(),
                r.getMontoPagado(),
                calcularEstadoPago(r.getImporte(), r.getMontoPagado()));
    }

    // Si todavia no se cargo un importe, no hay estado de pago (queda null).
    // Si se pago todo o mas -> PAGADO. Si se pago algo pero no todo -> PARCIAL.
    // Si no se pago nada -> PENDIENTE.
    private static EstadoPago calcularEstadoPago(BigDecimal importe, BigDecimal montoPagado) {
        if (importe == null) {
            return null;
        }
        BigDecimal pagado = montoPagado == null ? BigDecimal.ZERO : montoPagado;
        if (pagado.compareTo(importe) >= 0) {
            return EstadoPago.PAGADO;
        }
        if (pagado.compareTo(BigDecimal.ZERO) > 0) {
            return EstadoPago.PARCIAL;
        }
        return EstadoPago.PENDIENTE;
    }

    private static HistorialEstadoDTO toDTO(HistorialEstado h) {
        return new HistorialEstadoDTO(h.getEstado(), h.getFecha(), h.getComentario());
    }
}