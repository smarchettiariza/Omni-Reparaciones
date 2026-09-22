package com.reparaciones.backend.service;

import com.reparaciones.backend.dto.CambiarEstadoRequestDTO;
import com.reparaciones.backend.dto.CancelarReparacionRequestDTO;
import com.reparaciones.backend.dto.DashboardResponseDTO;
import com.reparaciones.backend.dto.DtoMapper;
import com.reparaciones.backend.dto.EditarReparacionRequestDTO;
import com.reparaciones.backend.dto.ReparacionRequestDTO;
import com.reparaciones.backend.dto.ReparacionResponseDTO;
import com.reparaciones.backend.exception.ResourceNotFoundException;
import com.reparaciones.backend.model.Cliente;
import com.reparaciones.backend.model.EstadoReparacion;
import com.reparaciones.backend.model.HistorialEstado;
import com.reparaciones.backend.model.Reparacion;
import com.reparaciones.backend.repository.HistorialEstadoRepository;
import com.reparaciones.backend.repository.ReparacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReparacionService {

    private final ReparacionRepository reparacionRepository;
    private final HistorialEstadoRepository historialEstadoRepository;
    private final ClienteService clienteService;

    // Todos los metodos publicos son @Transactional: el mapeo a DTO (que
    // accede a cliente e historial, ambos "lazy") pasa a ocurrir DENTRO
    // de la transaccion, antes de que se cierre la sesion de Hibernate.
    // Si el mapeo se hiciera en el Controller, ya seria tarde ->
    // LazyInitializationException.

    @Transactional
    public ReparacionResponseDTO crear(ReparacionRequestDTO dto) {
        Cliente cliente = clienteService.resolverOCrear(
                dto.getClienteId(), dto.getClienteNombre(), dto.getClienteTelefono(), dto.getClienteEmail());

        validarPago(dto.getImporte(), dto.getMontoPagado());

        Reparacion reparacion = new Reparacion();
        reparacion.setCliente(cliente);
        reparacion.setMarca(dto.getMarca());
        reparacion.setModelo(dto.getModelo());
        reparacion.setImei(dto.getImei());
        reparacion.setColor(dto.getColor());
        reparacion.setFallaInformada(dto.getFallaInformada());
        reparacion.setEstadoFisico(dto.getEstadoFisico());
        reparacion.setObservaciones(dto.getObservaciones());
        reparacion.setEstado(EstadoReparacion.RECIBIDO);
        reparacion.setImporte(dto.getImporte());
        reparacion.setMetodoPago(dto.getMetodoPago());
        reparacion.setMontoPagado(dto.getMontoPagado() != null ? dto.getMontoPagado() : BigDecimal.ZERO);

        Reparacion guardada = reparacionRepository.save(reparacion);
        registrarHistorial(guardada, EstadoReparacion.RECIBIDO, "Equipo recibido");

        return DtoMapper.toDTO(guardada);
    }

    @Transactional(readOnly = true)
    public List<ReparacionResponseDTO> listar(String numeroOrden, String cliente, String telefono,
            String imei, String marcaModelo, EstadoReparacion estado) {
        List<Reparacion> resultado = reparacionRepository.findAll();

        if (StringUtils.hasText(numeroOrden)) {
            resultado = resultado.stream()
                    .filter(r -> r.getNumeroOrden() != null && r.getNumeroOrden().toString().contains(numeroOrden))
                    .collect(Collectors.toList());
        }
        if (StringUtils.hasText(cliente)) {
            resultado = resultado.stream()
                    .filter(r -> r.getCliente().getNombre().toLowerCase().contains(cliente.toLowerCase()))
                    .collect(Collectors.toList());
        }
        if (StringUtils.hasText(telefono)) {
            resultado = resultado.stream()
                    .filter(r -> r.getCliente().getTelefono().contains(telefono))
                    .collect(Collectors.toList());
        }
        if (StringUtils.hasText(imei)) {
            resultado = resultado.stream()
                    .filter(r -> r.getImei() != null && r.getImei().contains(imei))
                    .collect(Collectors.toList());
        }
        if (StringUtils.hasText(marcaModelo)) {
            String q = marcaModelo.toLowerCase();
            resultado = resultado.stream()
                    .filter(r -> r.getMarca().toLowerCase().contains(q) || r.getModelo().toLowerCase().contains(q))
                    .collect(Collectors.toList());
        }
        if (estado != null) {
            resultado = resultado.stream()
                    .filter(r -> r.getEstado() == estado)
                    .collect(Collectors.toList());
        }

        return resultado.stream().map(DtoMapper::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReparacionResponseDTO> listarPorCliente(Long clienteId) {
        clienteService.obtenerPorId(clienteId); // valida que exista, si no tira 404
        return reparacionRepository.findByClienteIdOrderByFechaIngresoDesc(clienteId).stream()
                .map(DtoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReparacionResponseDTO obtenerPorId(Long id) {
        return DtoMapper.toDTO(buscarEntidad(id));
    }

    @Transactional
    public ReparacionResponseDTO cambiarEstado(Long id, CambiarEstadoRequestDTO dto) {
        Reparacion reparacion = buscarEntidad(id);
        reparacion.setEstado(dto.getNuevoEstado());
        Reparacion actualizada = reparacionRepository.save(reparacion);
        registrarHistorial(actualizada, dto.getNuevoEstado(), dto.getComentario());
        return DtoMapper.toDTO(actualizada);
    }

    @Transactional
    public ReparacionResponseDTO editar(Long id, EditarReparacionRequestDTO dto) {
        Reparacion reparacion = buscarEntidad(id);

        validarPago(dto.getImporte(), dto.getMontoPagado());

        reparacion.setMarca(dto.getMarca());
        reparacion.setModelo(dto.getModelo());
        reparacion.setImei(dto.getImei());
        reparacion.setColor(dto.getColor());
        reparacion.setFallaInformada(dto.getFallaInformada());
        reparacion.setEstadoFisico(dto.getEstadoFisico());
        reparacion.setObservaciones(dto.getObservaciones());
        reparacion.setImporte(dto.getImporte());
        reparacion.setMetodoPago(dto.getMetodoPago());
        reparacion.setMontoPagado(dto.getMontoPagado() != null ? dto.getMontoPagado() : BigDecimal.ZERO);
        return DtoMapper.toDTO(reparacionRepository.save(reparacion));
    }

    @Transactional
    public ReparacionResponseDTO cancelar(Long id, CancelarReparacionRequestDTO dto) {
        Reparacion reparacion = buscarEntidad(id);

        if (reparacion.getEstado() == EstadoReparacion.CANCELADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La reparación ya está cancelada");
        }
        if (reparacion.getEstado() == EstadoReparacion.ENTREGADO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede cancelar una reparación que ya fue entregada");
        }

        reparacion.setEstado(EstadoReparacion.CANCELADO);
        Reparacion actualizada = reparacionRepository.save(reparacion);
        registrarHistorial(actualizada, EstadoReparacion.CANCELADO,
                "Cancelada: " + dto.getMotivo());

        return DtoMapper.toDTO(actualizada);
    }

    @Transactional(readOnly = true)
    public DashboardResponseDTO dashboard() {
        long recibidos = reparacionRepository.countByEstado(EstadoReparacion.RECIBIDO);
        long enDiagnostico = reparacionRepository.countByEstado(EstadoReparacion.DIAGNOSTICO);
        long enReparacion = reparacionRepository.countByEstado(EstadoReparacion.REPARACION);
        long reparados = reparacionRepository.countByEstado(EstadoReparacion.REPARADO);
        long listos = reparacionRepository.countByEstado(EstadoReparacion.LISTO_PARA_RETIRAR);

        // "En el local" = todo lo que todavia no fue entregado, cancelado o no reparado
        long totalEnLocal = recibidos + enDiagnostico + enReparacion + reparados + listos;

        return new DashboardResponseDTO(totalEnLocal, enDiagnostico, enReparacion, reparados, listos);
    }

    private Reparacion buscarEntidad(Long id) {
        return reparacionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reparacion no encontrada: " + id));
    }

    private void registrarHistorial(Reparacion reparacion, EstadoReparacion estado, String comentario) {
        HistorialEstado historial = new HistorialEstado();
        historial.setReparacion(reparacion);
        historial.setEstado(estado);
        historial.setComentario(comentario);
        historialEstadoRepository.save(historial);
    }

    // Regla de negocio: no se puede registrar como pagado mas de lo que vale la
    // reparacion.
    private void validarPago(BigDecimal importe, BigDecimal montoPagado) {
        if (importe != null && montoPagado != null && montoPagado.compareTo(importe) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El monto pagado no puede ser mayor al importe total");
        }
    }
}