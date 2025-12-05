package com.huertohogar.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "boletas")
public class Boleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamos la boleta con el usuario (solo guardamos el ID para simplificar)
    @Column(nullable = false)
    private Long userId; 
    
    // Almacenamos el total final
    @Column(nullable = false)
    private Integer total; 

    // Guardamos los productos del carrito como un JSON string (para simplificar)
    @Column(length = 5000) 
    private String detalleProductos;

    @Column(nullable = false)
    private String estado = "Pendiente"; // Estado inicial de la orden
    
    @Column(nullable = false)
    private LocalDateTime fechaCompra = LocalDateTime.now(); // Fecha y hora de la compra

    // Constructor vacío (JPA)
    public Boleta() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
    public String getDetalleProductos() { return detalleProductos; }
    public void setDetalleProductos(String detalleProductos) { this.detalleProductos = detalleProductos; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getFechaCompra() { return fechaCompra; }
    public void setFechaCompra(LocalDateTime fechaCompra) { this.fechaCompra = fechaCompra; }
}