package com.huertohogar.backend.service;

import com.huertohogar.backend.model.User;
import com.huertohogar.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    // Obtener todos los usuarios (Para tu panel de AdminUsers.jsx)
    public List<User> getAll() {
        return repo.findAll();
    }

    // --- LÓGICA DE REGISTRO (Adaptada de tu CartContext.js y Register.logic.js) ---
    public User register(User user) {
        // 1. Validar si el correo ya existe (Regla de tu Register.logic.js)
        if (repo.findByCorreo(user.getCorreo()) != null) {
            return null; // El usuario ya existe, no lo guardamos
        }

        // 2. Asignar ROL automáticamente (Lógica calcada de tu getRoleByEmail)
        if (user.getCorreo().endsWith("@profesor.duoc.cl")) {
            user.setRol("administrador");
        } else {
            user.setRol("cliente");
        }

        return repo.save(user);
    }

    // --- LÓGICA DE LOGIN ---
    public User login(String correo, String contrasena) {
        // Buscamos al usuario por su correo
        User user = repo.findByCorreo(correo);
        
        // Si existe Y la contraseña coincide, es un login exitoso
        if (user != null && user.getContrasena().equals(contrasena)) {
            return user;
        }
        return null; // Login fallido
    }

    public void delete(Long id) {
    repo.deleteById(id);
}
public User update(Long id, User userDetails) {
    User user = repo.findById(id).orElse(null);
    if (user == null) return null;

    // Actualizamos solo los campos permitidos
    user.setNombre(userDetails.getNombre());
    user.setRegion(userDetails.getRegion());
    user.setComuna(userDetails.getComuna());
    user.setRol(userDetails.getRol());
    // No actualizamos contraseña ni correo aquí por seguridad

    return repo.save(user);
}
}

