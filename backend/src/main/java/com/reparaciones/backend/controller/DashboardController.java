package com.reparaciones.backend.controller;

import com.reparaciones.backend.dto.DashboardResponseDTO;
import com.reparaciones.backend.service.ReparacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ReparacionService reparacionService;

    @GetMapping
    public DashboardResponseDTO obtener() {
        return reparacionService.dashboard();
    }
}
