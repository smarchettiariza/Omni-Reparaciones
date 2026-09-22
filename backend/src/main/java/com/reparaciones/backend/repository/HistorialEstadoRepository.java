package com.reparaciones.backend.repository;

import com.reparaciones.backend.model.HistorialEstado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialEstadoRepository extends JpaRepository<HistorialEstado, Long> {
    List<HistorialEstado> findByReparacionIdOrderByFechaAsc(Long reparacionId);
}
