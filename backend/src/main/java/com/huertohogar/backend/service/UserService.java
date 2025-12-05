package com.huertohogar.backend.service;

import com.huertohogar.backend.model.User;
import com.huertohogar.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- MÉTODO REQUERIDO POR UserDetailsService ---
    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        User user = repo.findByCorreo(correo);
        if (user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado con correo: " + correo);
        }
        return user;
    }

    public List<User> getAll() {
        return repo.findAll();
    }

    // --- LÓGICA DE REGISTRO (Sin cambios, ya acepta todos los campos nuevos) ---
    public User register(User user) {
        if (repo.findByCorreo(user.getCorreo()) != null) { return null; }
        try {
            String encodedPassword = passwordEncoder.encode(user.getContrasena());
            user.setContrasena(encodedPassword);
            user.setRol("cliente");
            // Nota: Los campos rut y direccion se guardan automáticamente aquí
            return repo.save(user);
        } catch (Exception e) {
            System.err.println("CRÍTICO: Error al intentar guardar el usuario en la BD: " + e.getMessage());
            e.printStackTrace(); 
            return null;
        }
    }

    // --- LÓGICA DE LOGIN (sin cambios) ---
    public User login(String correo, String contrasena) {
        User user = repo.findByCorreo(correo);
        if (user != null && passwordEncoder.matches(contrasena, user.getContrasena())) {
            return user;
        }
        return null;
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
    
    // --- LÓGICA DE ACTUALIZACIÓN (CRÍTICO: Añadimos RUT y DIRECCIÓN) ---
    public User update(Long id, User userDetails) {
        User user = repo.findById(id).orElse(null);
        if (user == null) return null;

        // Actualizamos los campos principales
        user.setNombre(userDetails.getNombre());
        user.setRegion(userDetails.getRegion());
        user.setComuna(userDetails.getComuna());
        user.setRol(userDetails.getRol()); 
        
        // AÑADIDO: Actualizamos los nuevos campos
        user.setRut(userDetails.getRut());
        user.setDireccion(userDetails.getDireccion());

        return repo.save(user);
    }
}