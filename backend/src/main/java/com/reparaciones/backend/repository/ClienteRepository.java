package com.reparaciones.backend.repository;

import com.reparaciones.backend.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    List<Cliente> findByNombreContainingIgnoreCase(String nombre);
    List<Cliente> findByTelefonoContaining(String telefono);
}
