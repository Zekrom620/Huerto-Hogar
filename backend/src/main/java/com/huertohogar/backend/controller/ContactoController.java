package com.huertohogar.backend.controller;

import com.huertohogar.backend.model.Contacto;
import com.huertohogar.backend.service.ContactoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/contact") 
public class ContactoController {

    @Autowired
    private ContactoService service;

    // Endpoint público para recibir el formulario de contacto (no requiere JWT)
    @PostMapping
    public ResponseEntity<Contacto> submitForm(@RequestBody Contacto contacto) {
        try {
            Contacto savedContacto = service.save(contacto);
            // Retorna 201 Created con el objeto guardado
            return new ResponseEntity<>(savedContacto, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error al guardar el formulario de contacto: " + e.getMessage());
            // Retorna 500
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}