package com.reparaciones.backend.controller;

import com.reparaciones.backend.dto.CambiarEstadoRequestDTO;
import com.reparaciones.backend.dto.CancelarReparacionRequestDTO;
import com.reparaciones.backend.dto.EditarReparacionRequestDTO;
import com.reparaciones.backend.dto.ReparacionRequestDTO;
import com.reparaciones.backend.dto.ReparacionResponseDTO;
import com.reparaciones.backend.model.EstadoReparacion;
import com.reparaciones.backend.service.ReparacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reparaciones")
@RequiredArgsConstructor
public class ReparacionController {

    private final ReparacionService reparacionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReparacionResponseDTO crear(@Valid @RequestBody ReparacionRequestDTO dto) {
        return reparacionService.crear(dto);
    }

    // Listado + busqueda (punto 5 del brief)
    // Ej: /api/reparaciones?estado=DIAGNOSTICO&cliente=juan
    @GetMapping
    public List<ReparacionResponseDTO> listar(
            @RequestParam(required = false) String numeroOrden,
            @RequestParam(required = false) String cliente,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String imei,
            @RequestParam(required = false) String marcaModelo,
            @RequestParam(required = false) EstadoReparacion estado) {

        return reparacionService.listar(numeroOrden, cliente, telefono, imei, marcaModelo, estado);
    }

    // Ficha de reparacion con historial completo (punto 6 del brief)
    @GetMapping("/{id}")
    public ReparacionResponseDTO obtener(@PathVariable Long id) {
        return reparacionService.obtenerPorId(id);
    }

    @PatchMapping("/{id}/estado")
    public ReparacionResponseDTO cambiarEstado(@PathVariable Long id,
                                                @Valid @RequestBody CambiarEstadoRequestDTO dto) {
        return reparacionService.cambiarEstado(id, dto);
    }

    // Edicion de los datos del equipo (no toca cliente ni estado)
    @PutMapping("/{id}")
    public ReparacionResponseDTO editar(@PathVariable Long id,
                                         @Valid @RequestBody EditarReparacionRequestDTO dto) {
        return reparacionService.editar(id, dto);
    }

    // Cancelacion de una reparacion (soft delete: cambia estado a CANCELADO)
    @PatchMapping("/{id}/cancelar")
    public ReparacionResponseDTO cancelar(@PathVariable Long id,
                                           @Valid @RequestBody CancelarReparacionRequestDTO dto) {
        return reparacionService.cancelar(id, dto);
    }
}