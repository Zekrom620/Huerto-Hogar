import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../utils/Register.logic.js'; // Tu lógica pura

const REGIONES = [
    "Santiago", "Viña del Mar / Valparaíso", "Concepción / Nacimiento", "Puerto Montt / Villarica",
];

const COMUNAS_POR_REGION = {
    "Santiago": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "Ñuñoa", "Vitacura"],
    "Viña del Mar / Valparaíso": ["Viña del Mar", "Valparaíso", "Quilpué", "Villa Alemana"],
    "Concepción / Nacimiento": ["Concepción", "San Pedro de la Paz", "Talcahuano", "Nacimiento", "Los Ángeles"],
    "Puerto Montt / Villarica": ["Puerto Montt", "Puerto Varas", "Villarrica", "Pucón", "Osorno"]
};

const Register = () => {
    // Ya no necesitamos 'usuarios' aquí
    const { registerUser, showToast } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '', correo: '', contrasena: '', confirmar: '', telefono: '', region: '', comuna: '',
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [id]: value,
            comuna: id === 'region' ? '' : prev.comuna
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // PASO CRUCIAL: Pasamos un array vacío [] como segundo argumento.
        // ¿Por qué? Porque ya no tenemos la lista de todos los usuarios en el frontend.
        // Dejaremos que el Backend nos diga si el correo está repetido.
        var validationErrors = window.RegisterLogic.validateForm(formData, []); 
        
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Si pasa la validación local, intentamos registrar en Backend
        try {
            const newUser = {
                nombre: formData.nombre.trim(),
                correo: formData.correo.trim().toLowerCase(),
                contrasena: formData.contrasena,
                telefono: formData.telefono,
                region: formData.region,
                comuna: formData.comuna,
                // El rol lo decide el Backend, no lo mandamos aquí
            };

            await registerUser(newUser); // Llamada al Backend
            
            showToast('Registro exitoso. Ahora inicia sesión.');
            setTimeout(() => { navigate('/login'); }, 700);

        } catch (error) {
            // Si el backend falla (ej: correo duplicado), lo mostramos
            console.error(error);
            setErrors(["Error al registrar. Es posible que el correo ya esté en uso."]);
        }
    };

    return (
        <main className="form-container">
            <form id="form-registro" onSubmit={handleSubmit}>
                <img src="/img/Logo.png" alt="Logo HuertoHogar" style={{ display: 'block', margin: '0 auto 10px auto', width: '80px' }} />
                <h2>Únete a la Cosecha HuertoHogar</h2>
                <p style={{ textAlign: 'center', color: 'var(--color-texto-secundario)' }}>
                    Regístrate para llevar la frescura del campo directamente a tu hogar.
                </p>

                {errors.length > 0 && (
                    <div id="error-msg" className="error" style={{ marginBottom: '12px' }}>
                        {errors.map((error, index) => (
                            <div key={index}>{error}</div>
                        ))}
                    </div>
                )}

                <label htmlFor="nombre">Nombre completo *</label>
                <input type="text" id="nombre" placeholder="Ingrese su nombre completo" required value={formData.nombre} onChange={handleChange} />

                <label htmlFor="correo">Correo electrónico *</label>
                <input type="email" id="correo" placeholder="Ingrese su correo" value={formData.correo} onChange={handleChange} />

                <label htmlFor="contrasena">Contraseña *</label>
                <input type="password" id="contrasena" placeholder="Ingrese su contraseña" value={formData.contrasena} onChange={handleChange} />

                <label htmlFor="confirmar">Confirmar contraseña *</label>
                <input type="password" id="confirmar" placeholder="Confirme su contraseña" value={formData.confirmar} onChange={handleChange} />

                <label htmlFor="telefono">Teléfono (para seguimiento de envíos)</label>
                <input type="tel" id="telefono" placeholder="Ingrese su teléfono" value={formData.telefono} onChange={handleChange} />

                <label htmlFor="region">Región *</label>
                <select id="region" value={formData.region} onChange={handleChange}>
                    <option value="">Seleccione su región</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label htmlFor="comuna">Comuna *</label>
                <select id="comuna" value={formData.comuna} onChange={handleChange} disabled={!formData.region}>
                    <option value="">Seleccione su comuna</option>
                    {formData.region && COMUNAS_POR_REGION[formData.region] &&
                        COMUNAS_POR_REGION[formData.region].map(c => <option key={c} value={c}>{c}</option>)
                    }
                </select>

                <button type="submit">CREAR MI CUENTA HUERTOHOGAR</button>

                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </form>
        </main>
    );
};

export default Register;