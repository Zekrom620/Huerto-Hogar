package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Aquí no necesitamos escribir nada más.
    // Al extender de JpaRepository, Spring ya sabe cómo hacer un CRUD completo.
}