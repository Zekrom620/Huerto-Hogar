package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    // Hereda los métodos CRUD básicos (save, findAll, etc.)
}