import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const Login = () => {
    const { loginUser } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        correo: '',
        contrasena: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        const { correo, contrasena } = formData;
        
        if (!correo) { setError('Correo requerido.'); return; }
        if (!contrasena) { setError('Contraseña requerida.'); return; }

        try {
            // 1. Esperamos a que el login nos devuelva al USUARIO
            const usuarioLogueado = await loginUser({ correo, contrasena });

            // 2. Verificamos el rol para decidir dónde mandarlo
            // Damos un pequeño delay para que se vea el Toast de bienvenida
            setTimeout(() => { 
                if (usuarioLogueado.rol === 'administrador') {
                    navigate('/admin'); // Redirige al panel Admin
                } else {
                    navigate('/');      // Redirige al Home
                }
            }, 700);

        } catch (err) {
            setError('Correo o contraseña incorrectos.');
        }
    };

    return (
        <main className="form-container">
            <form id="login-form" onSubmit={handleSubmit}>
                <img src="/img/Logo.png" alt="Logo HuertoHogar" style={{ display: 'block', margin: '0 auto 10px auto', width: '80px' }} />
                <h2>Accede a Tu Cuenta HuertoHogar</h2>

                {error && (
                    <div id="mensaje-login" className="error" style={{ marginBottom: '12px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <label htmlFor="correo">Correo</label>
                <input 
                    type="email" id="correo" placeholder="Ingrese su correo" required 
                    value={formData.correo} onChange={handleChange} 
                />

                <label htmlFor="contrasena">Contraseña</label>
                <input 
                    type="password" id="contrasena" placeholder="Ingrese su contraseña" required 
                    value={formData.contrasena} onChange={handleChange} 
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