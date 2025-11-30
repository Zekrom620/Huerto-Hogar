package com.huertohogar.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ID interno numérico de la BD (1, 2, 3...)

    @Column(unique = true)
    private String codigo; // Aquí guardaremos tus IDs: "FR001", "VR001"

    private String nombre;
    private Integer precio; // En tu JS usas números enteros (1200), no decimales
    private String imagen;  // "img/Manzanas Fuji.jpg"
    
    @Column(length = 500) // Damos más espacio para descripciones largas
    private String descripcion; 
    
    private String categoria; // "frutas-frescas"
    private Integer stock;
    private String origen;    // "Valle del Maule"

    public Product() {}

    public Product(String codigo, String nombre, Integer precio, String imagen, String descripcion, String categoria, Integer stock, String origen) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.stock = stock;
        this.origen = origen;
    }

    // Getters y Setters en Español
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getPrecio() { return precio; }
    public void setPrecio(Integer precio) { this.precio = precio; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getOrigen() { return origen; }
    public void setOrigen(String origen) { this.origen = origen; }
}