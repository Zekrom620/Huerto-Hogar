package com.huertohogar.backend.service;

import com.huertohogar.backend.model.Boleta;
import com.huertohogar.backend.repository.BoletaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BoletaService {

    @Autowired
    private BoletaRepository repo;

    // Método para guardar la boleta
    public Boleta save(Boleta boleta) {
        return repo.save(boleta);
    }
}