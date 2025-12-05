package com.huertohogar.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys; 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key; 
import java.util.Date;
import java.nio.charset.StandardCharsets;
// ELIMINAMOS import io.jsonwebtoken.io.Decoders;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private final Key signingKey; 

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.secret = secret;
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private final long expirationTime = 36000000;

    // Generar un Token JWT
    public String generateToken(String correo, String rol) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setSubject(correo) 
                .claim("rol", rol)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(signingKey) 
                .compact();
    }
    
    // --- MÉTODOS DE VALIDACIÓN Y EXTRACCIÓN ---

    // 1. Obtener todos los 'claims' (datos) del token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 2. Obtener el 'subject' (correo) del token
    public String getSubject(String token) {
        return extractAllClaims(token).getSubject();
    }
    
    // 3. Validar si el token es válido
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            System.err.println("JWT INVÁLIDO O EXPIRADO: " + e.getMessage());
            return false;
        }
    }
}