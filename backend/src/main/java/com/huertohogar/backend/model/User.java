package com.huertohogar.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Campos extraídos EXACTAMENTE de tu Register.logic.js
    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, unique = true, length = 100)
    private String correo;

    @Column(nullable = false)
    private String contrasena;

    @Column(nullable = false)
    private String region;

    @Column(nullable = false)
    private String comuna;

    // Campo extraído de tu CartContext.js (getRoleByEmail)
    private String rol; 

    // Constructor vacío (Obligatorio JPA)
    public User() {}

    // Constructor completo
    public User(String nombre, String correo, String contrasena, String region, String comuna, String rol) {
        this.nombre = nombre;
        this.correo = correo;
        this.contrasena = contrasena;
        this.region = region;
        this.comuna = comuna;
        this.rol = rol;
    }

    // Getters y Setters (Necesarios para que Spring lea tus variables en español)

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}