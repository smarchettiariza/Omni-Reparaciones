package com.reparaciones.backend.controller;

import com.reparaciones.backend.dto.ClienteRequestDTO;
import com.reparaciones.backend.dto.ClienteResponseDTO;
import com.reparaciones.backend.dto.DtoMapper;
import com.reparaciones.backend.dto.EditarClienteRequestDTO;
import com.reparaciones.backend.dto.ReparacionResponseDTO;
import com.reparaciones.backend.model.Cliente;
import com.reparaciones.backend.service.ClienteService;
import com.reparaciones.backend.service.ReparacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;
    private final ReparacionService reparacionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteResponseDTO crear(@Valid @RequestBody ClienteRequestDTO dto) {
        Cliente cliente = clienteService.crear(dto);
        return DtoMapper.toDTO(cliente);
    }

    @GetMapping
    public List<ClienteResponseDTO> listar(@RequestParam(required = false) String busqueda) {
        return clienteService.listar(busqueda).stream()
                .map(DtoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ClienteResponseDTO obtener(@PathVariable Long id) {
        return DtoMapper.toDTO(clienteService.obtenerPorId(id));
    }

    @PutMapping("/{id}")
    public ClienteResponseDTO editar(@PathVariable Long id, @Valid @RequestBody EditarClienteRequestDTO dto) {
        Cliente cliente = clienteService.editar(id, dto);
        return DtoMapper.toDTO(cliente);
    }

    // Historial de equipos del cliente (punto 4 del brief)
    @GetMapping("/{id}/reparaciones")
    public List<ReparacionResponseDTO> historialReparaciones(@PathVariable Long id) {
        return reparacionService.listarPorCliente(id);
    }
}