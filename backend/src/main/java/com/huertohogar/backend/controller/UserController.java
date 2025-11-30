package com.huertohogar.backend.controller;

import com.huertohogar.backend.model.User;
import com.huertohogar.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users") // La dirección base será /api/v1/users
@CrossOrigin(origins = "http://localhost:3000") // Permite conexión desde React
public class UserController {

    @Autowired
    private UserService service;

    // 1. Listar todos los usuarios (Para AdminUsers.jsx)
    @GetMapping
    public List<User> list() {
        return service.getAll();
    }

    // 2. Registrarse (Para Register.jsx)
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    // 3. Iniciar Sesión (Para Login.jsx)
    // React enviará un JSON con { "correo": "...", "contrasena": "..." }
    // Spring lo guarda temporalmente en 'credentials' para verificar
    @PostMapping("/login")
    public User login(@RequestBody User credentials) {
        return service.login(credentials.getCorreo(), credentials.getContrasena());
    }

    @DeleteMapping("/{id}")
public void delete(@PathVariable Long id) {
    service.delete(id);
}

@PutMapping("/{id}")
public User update(@PathVariable Long id, @RequestBody User user) {
    return service.update(id, user);
}
}