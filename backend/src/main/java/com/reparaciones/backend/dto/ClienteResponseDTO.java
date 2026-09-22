package com.reparaciones.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ClienteResponseDTO {
    private Long id;
    private String nombre;
    private String telefono;
    private String email;
    private LocalDateTime createdAt;
}
