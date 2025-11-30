package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // MAGIA DE SPRING DATA:
    // Solo con escribir esto, Spring crea automáticamente el SQL para buscar por correo.
    // Esto es OBLIGATORIO para poder hacer el Login.
    User findByCorreo(String correo);
}