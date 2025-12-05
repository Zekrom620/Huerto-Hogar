package com.huertohogar.backend.controller;

import com.huertohogar.backend.model.User;
import com.huertohogar.backend.service.UserService;
import com.huertohogar.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/users") // La dirección base será /api/v1/users
// @CrossOrigin(origins = "http://localhost:3000") <-- ESTA LÍNEA SE ELIMINÓ
public class UserController {

    @Autowired
    private UserService service;
    
    @Autowired 
    private JwtUtil jwtUtil; 

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

    // 3. Iniciar Sesión (Para Login.jsx) - DEVUELVE TOKEN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User credentials) {
        User user = service.login(credentials.getCorreo(), credentials.getContrasena());
        
        Map<String, Object> response = new HashMap<>();

        if (user != null) {
            // Generamos el token JWT con el correo y el rol
            String token = jwtUtil.generateToken(user.getCorreo(), user.getRol());

            response.put("token", token);
            
            // Seguridad: Borramos la contraseña antes de devolver el objeto
            user.setContrasena(null); 
            response.put("user", user);

            return response; // Login exitoso con el token y los datos del usuario
        }
        
        // Si el login falla
        response.put("error", "Credenciales inválidas");
        return response; 
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