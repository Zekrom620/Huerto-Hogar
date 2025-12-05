package com.huertohogar.backend.filter;

import com.huertohogar.backend.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull; // CRÍTICO: Importar la anotación NonNull
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService; 

    // Constructor para inyectar dependencias (Rompe el ciclo)
    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, // CRÍTICO: Añadimos @NonNull
                                    @NonNull HttpServletResponse response, // CRÍTICO: Añadimos @NonNull
                                    @NonNull FilterChain filterChain) throws ServletException, IOException { // CRÍTICO: Añadimos @NonNull

        final String authorizationHeader = request.getHeader("Authorization");

        String correo = null;
        String jwt = null;

        // 1. Extraer el token JWT del encabezado "Authorization: Bearer <token>"
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Quitamos "Bearer "
            try {
                correo = jwtUtil.getSubject(jwt); // Extraemos el correo del token
            } catch (Exception e) {
                System.err.println("JWT INVÁLIDO O EXPIRADO al intentar extraer el correo: " + e.getMessage());
            }
        }

        // 2. Si hay correo y el usuario no está ya autenticado en el contexto de Spring
        if (correo != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 3. Cargar los detalles del usuario desde la BD (su rol, etc.)
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(correo);

            // 4. Si el token es válido
            if (jwtUtil.validateToken(jwt)) {
                
                // 5. Autenticar el usuario en el contexto de Spring Security
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }
        
        // Continuar con el siguiente filtro en la cadena
        filterChain.doFilter(request, response);
    }
}