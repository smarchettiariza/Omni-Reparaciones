package com.reparaciones.backend.repository;

import com.reparaciones.backend.model.EstadoReparacion;
import com.reparaciones.backend.model.Reparacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReparacionRepository extends JpaRepository<Reparacion, Long> {

    Optional<Reparacion> findByNumeroOrden(Long numeroOrden);

    List<Reparacion> findByImeiContaining(String imei);

    List<Reparacion> findByMarcaContainingIgnoreCaseOrModeloContainingIgnoreCase(String marca, String modelo);

    List<Reparacion> findByEstado(EstadoReparacion estado);

    List<Reparacion> findByClienteIdOrderByFechaIngresoDesc(Long clienteId);

    // Para las tarjetas del dashboard (en diagnóstico, en reparación, etc.)
    long countByEstado(EstadoReparacion estado);
}
