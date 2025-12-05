package com.huertohogar.backend.controller;

import com.huertohogar.backend.model.Product;
import com.huertohogar.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products") // Esta será la dirección web de tus productos
// @CrossOrigin(origins = "http://localhost:3000") <-- LÍNEA ELIMINADA
public class ProductController {

    @Autowired
    private ProductService service;

    // 1. Listar todos (GET)
    @GetMapping
    public List<Product> list() {
        return service.getAll();
    }

    // 2. Buscar uno solo por ID (GET /{id})
    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) {
        return service.getById(id);
    }

    // 3. Guardar nuevo (POST)
    @PostMapping
    public Product create(@RequestBody Product product) {
        return service.create(product);
    }

    // 4. Actualizar (PUT /{id})
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return service.update(id, product);
    }

    // 5. Eliminar (DELETE /{id})
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}