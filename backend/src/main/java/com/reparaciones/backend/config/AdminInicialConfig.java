package com.reparaciones.backend.config;

import com.reparaciones.backend.model.Usuario;
import com.reparaciones.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Se ejecuta una vez cada vez que arranca el backend. Si la tabla usuarios
// esta vacia (base de datos nueva, recien instalada para un cliente), crea
// un admin por defecto para que exista al menos un usuario con el que entrar.
@Component
@RequiredArgsConstructor
public class AdminInicialConfig implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInicialConfig.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() > 0) {
            return;
        }

        Usuario admin = new Usuario();
        admin.setUsername("admin");
        admin.setPasswordHash(passwordEncoder.encode("omni1234"));
        usuarioRepository.save(admin);

        log.warn("=========================================================");
        log.warn(" Usuario admin creado automaticamente:");
        log.warn("   usuario:    admin");
        log.warn("   contrasena: omni1234");
        log.warn(" Cambiala apenas puedas.");
        log.warn("=========================================================");
    }
}