package com.huertohogar.backend.service;

import com.huertohogar.backend.model.Contacto;
import com.huertohogar.backend.repository.ContactoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactoService {

    @Autowired
    private ContactoRepository repo;

    public Contacto save(Contacto contacto) {
        return repo.save(contacto);
    }
}