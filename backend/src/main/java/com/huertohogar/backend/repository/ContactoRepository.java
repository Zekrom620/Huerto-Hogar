package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {
}