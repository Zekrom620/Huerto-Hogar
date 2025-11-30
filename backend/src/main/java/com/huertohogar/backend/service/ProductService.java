package com.huertohogar.backend.service;

import com.huertohogar.backend.model.Product;
import com.huertohogar.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repo;

    public List<Product> getAll() {
        return repo.findAll();
    }

    public Product getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Product create(Product product) {
        return repo.save(product);
    }

    public Product update(Long id, Product product) {
        Product existing = getById(id);
        if (existing == null) return null;

        // Actualizamos con los nombres en español y el nuevo campo origen
        existing.setCodigo(product.getCodigo());
        existing.setNombre(product.getNombre());
        existing.setPrecio(product.getPrecio());
        existing.setImagen(product.getImagen());
        existing.setDescripcion(product.getDescripcion());
        existing.setCategoria(product.getCategoria());
        existing.setStock(product.getStock());
        existing.setOrigen(product.getOrigen());

        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}