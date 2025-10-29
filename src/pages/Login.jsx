import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Para acceder a usuarios, toast y loginUser

const Login = () => {
    // Obtenemos funciones y estado global necesario
    const { loginUser, usuarios, showToast } = useCart();
    const navigate = useNavigate();

    // 1. Estado para manejar los campos del formulario
    const [formData, setFormData] = useState({
        correo: '',
        contrasena: '',
    });

    // 2. Estado para manejar los mensajes de error/éxito
    const [error, setError] = useState('');

    // Manejador genérico para inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // 3. Función de Validación y Autenticación (Migración de setupLogin)
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Limpiamos errores anteriores

        const { correo, contrasena } = formData;
        const correoL = correo.trim().toLowerCase();
        const errores = [];

        // Validaciones (basadas en tu script.js)
        if (!correoL) errores.push('Correo requerido.');
        else if (correoL.length > 100) errores.push('Correo máximo 100 caracteres.');
        else if (!/^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correoL)) 
            errores.push('Correo inválido (dominios permitidos).');

        if (!contrasena) errores.push('Contraseña requerida.');
        else if (contrasena.length < 4 || contrasena.length > 10) 
            errores.push('Contraseña entre 4 y 10 caracteres.');

        if (errores.length) {
            // Si hay errores de formato, los mostramos
            setError(errores.join(' ')); 
            return;
        }

        // Buscar usuario (la lista 'usuarios' se obtiene del Contexto/LocalStorage)
        const user = usuarios.find(u => 
            u.correo.toLowerCase() === correoL && u.contrasena === contrasena
        );

        if (!user) { 
            setError('Correo o contraseña incorrectos.'); 
            return; 
        }

        // 4. Éxito: Llamamos a la función del Contexto para establecer el usuario activo
        loginUser(user); 

        // 5. Redirección (reemplazo de window.location.href = 'index.html')
        setTimeout(() => { 
            navigate('/'); // Redireccionar a la Home page
        }, 700);
    };

    // 6. Renderizado del Formulario
    return (
        <main className="form-container">
            <form id="login-form" onSubmit={handleSubmit}>
                <img src="/img/Logo.png" alt="Logo HuertoHogar" style={{ display: 'block', margin: '0 auto 10px auto', width: '80px' }} />
                <h2>Accede a Tu Cuenta HuertoHogar</h2>

                {/* Visualización de Errores */}
                {error && (
                    <div id="mensaje-login" className="error" style={{ marginBottom: '12px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <label htmlFor="correo">Correo</label>
                <input 
                    type="email" 
                    id="correo" 
                    placeholder="Ingrese su correo" 
                    required 
                    value={formData.correo} 
                    onChange={handleChange} 
                />

                <label htmlFor="contrasena">Contraseña</label>
                <input 
                    type="password" 
                    id="contrasena" 
                    placeholder="Ingrese su contraseña" 
                    required 
                    value={formData.contrasena} 
                    onChange={handleChange} 
                />

                <div className="btn-container">
                    <button type="submit">ACCEDER AL HUERTO</button>
                </div>

                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    ¿Aún no eres parte de la comunidad? <Link to="/registro">Regístrate aquí</Link>
                </p>
            </form>
        </main>
    );
};

export default Login;