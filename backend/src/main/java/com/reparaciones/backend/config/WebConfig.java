package com.reparaciones.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// El CORS se movio a SecurityConfig (necesario porque Spring Security intercepta
// los pedidos antes que el resto de Spring MVC). Esta clase queda como lugar
// para futuras configuraciones de Spring MVC que no tengan que ver con seguridad.
@Configuration
public class WebConfig implements WebMvcConfigurer {
}