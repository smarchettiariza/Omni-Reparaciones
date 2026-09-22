package com.reparaciones.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reparaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reparacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Autoincremental, generado por la base de datos (BIGSERIAL). No se setea desde Java.
    @Column(name = "numero_orden", insertable = false, updatable = false)
    private Long numeroOrden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(nullable = false, length = 60)
    private String marca;

    @Column(nullable = false, length = 100)
    private String modelo;

    @Column(length = 20)
    private String imei;

    @Column(length = 40)
    private String color;

    @Column(name = "falla_informada", nullable = false, columnDefinition = "TEXT")
    private String fallaInformada;

    @Column(name = "estado_fisico", columnDefinition = "TEXT")
    private String estadoFisico;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDateTime fechaIngreso;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoReparacion estado;

    @Column(precision = 10, scale = 2)
    private BigDecimal importe;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", length = 20)
    private MetodoPago metodoPago;

    @Column(name = "monto_pagado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoPagado;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Historial de cambios de estado de esta orden
    @OneToMany(mappedBy = "reparacion", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("fecha ASC")
    private List<HistorialEstado> historial = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (fechaIngreso == null) {
            fechaIngreso = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoReparacion.RECIBIDO;
        }
        if (montoPagado == null) {
            montoPagado = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}