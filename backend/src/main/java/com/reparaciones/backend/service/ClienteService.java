package com.reparaciones.backend.service;

import com.reparaciones.backend.dto.ClienteRequestDTO;
import com.reparaciones.backend.dto.EditarClienteRequestDTO;
import com.reparaciones.backend.exception.ResourceNotFoundException;
import com.reparaciones.backend.model.Cliente;
import com.reparaciones.backend.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public Cliente crear(ClienteRequestDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNombre(dto.getNombre());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        return clienteRepository.save(cliente);
    }

    public List<Cliente> listar(String busqueda) {
        if (busqueda == null || busqueda.isBlank()) {
            return clienteRepository.findAll();
        }
        List<Cliente> porNombre = clienteRepository.findByNombreContainingIgnoreCase(busqueda);
        if (!porNombre.isEmpty()) {
            return porNombre;
        }
        return clienteRepository.findByTelefonoContaining(busqueda);
    }

    public Cliente obtenerPorId(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado: " + id));
    }

    public Cliente editar(Long id, EditarClienteRequestDTO dto) {
        Cliente cliente = obtenerPorId(id);
        cliente.setNombre(dto.getNombre());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        return clienteRepository.save(cliente);
    }

    // Usado al registrar un equipo: reutiliza un cliente existente por id,
    // o crea uno nuevo si llegan datos sueltos desde el formulario de alta rapida.
    public Cliente resolverOCrear(Long clienteId, String nombre, String telefono, String email) {
        if (clienteId != null) {
            return obtenerPorId(clienteId);
        }
        Cliente cliente = new Cliente();
        cliente.setNombre(nombre);
        cliente.setTelefono(telefono);
        cliente.setEmail(email);
        return clienteRepository.save(cliente);
    }
}