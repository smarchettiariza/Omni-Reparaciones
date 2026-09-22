package com.reparaciones.backend.controller;

import com.reparaciones.backend.dto.CambiarPasswordRequestDTO;
import com.reparaciones.backend.dto.LoginRequestDTO;
import com.reparaciones.backend.dto.LoginResponseDTO;
import com.reparaciones.backend.security.JwtService;
import com.reparaciones.backend.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO dto) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));
        } catch (AuthenticationException ex) {
            throw new BadCredentialsException("Usuario o contraseña incorrectos");
        }

        String token = jwtService.generarToken(dto.getUsername());
        return new LoginResponseDTO(token, dto.getUsername());
    }
    
    @PatchMapping("/password")
    public ResponseEntity<Void> cambiarPassword(Authentication authentication,
                                                 @Valid @RequestBody CambiarPasswordRequestDTO dto) {
        usuarioService.cambiarPassword(authentication.getName(), dto);
        return ResponseEntity.noContent().build();
    }
}