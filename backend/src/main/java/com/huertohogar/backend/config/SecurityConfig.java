package com.huertohogar.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; 
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; 
import com.huertohogar.backend.filter.JwtAuthenticationFilter; 
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.context.ApplicationContext; // CRÍTICO: Para obtener el Bean manualmente

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // ELIMINAMOS @Autowired private JwtAuthenticationFilter jwtAuthenticationFilter;
    // Ahora lo obtendremos del contexto (ApplicationContext)

    // CRÍTICO: Inyectamos el contexto de Spring (ApplicationContext)
    @Autowired
    private ApplicationContext applicationContext;


    // 1. BEAN DEL ENCRIPTADOR (BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. CONFIGURACIÓN CORS INTEGRADA (Sin cambios)
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); 
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*")); 
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    // 3. CADENA DE FILTROS DE SEGURIDAD
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        // CRÍTICO: Obtenemos el filtro JWT del contexto *antes* de usarlo
        JwtAuthenticationFilter jwtAuthenticationFilter = applicationContext.getBean(JwtAuthenticationFilter.class);
        
        http
            .httpBasic(AbstractHttpConfigurer::disable)
            .cors(Customizer.withDefaults()) 
            .csrf(AbstractHttpConfigurer::disable)
            // CRÍTICO: Configurar la aplicación como STATELESS para JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            .authorizeHttpRequests(auth -> auth
                
                // Permitir rutas públicas sin autenticación
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(antMatcher(HttpMethod.POST, "/api/v1/users/login")).permitAll()
                .requestMatchers(antMatcher(HttpMethod.POST, "/api/v1/users/register")).permitAll()
                .requestMatchers(antMatcher("/api/v1/products/**")).permitAll() 
                .requestMatchers(antMatcher("/swagger-ui/**"), antMatcher("/v3/api-docs/**")).permitAll()
                
                // TODAS las demás peticiones deben estar autenticadas
                .anyRequest().authenticated() 
            );

        // CRÍTICO: Agregamos el filtro JWT al final de la configuración
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}