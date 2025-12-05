import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// importamos solo la lógica de validación, aunque simplificaremos el uso aquí
import '../utils/Register.logic.js'; 

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
    const { registerUser, showToast } = useCart();
    const navigate = useNavigate();

    // CRÍTICO: Añadimos RUT y DIRECCIÓN al estado inicial
    const [formData, setFormData] = useState({
        nombre: '', correo: '', contrasena: '', confirmar: '', telefono: '', region: '', comuna: '',
        rut: '', direccion: ''
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        
        setFormData(prev => {
            let newState = { 
                ...prev, 
                [id]: value,
            };
            
            // Si la región cambia, resetea la comuna a vacío
            if (id === 'region') {
                newState.comuna = '';
            }

            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Limpiamos errores anteriores
        setErrors([]);
        
        // 1. Validaciones Críticas para la BD
        const formValidationErrors = [];
        if (!formData.nombre) formValidationErrors.push("El Nombre es requerido.");
        if (!formData.correo) formValidationErrors.push("El Correo es requerido.");
        if (!formData.contrasena) formValidationErrors.push("La Contraseña es requerida.");
        if (formData.contrasena !== formData.confirmar) formValidationErrors.push("Las Contraseñas no coinciden.");
        if (!formData.rut) formValidationErrors.push("El RUT es requerido (Nuevo campo).");
        if (!formData.region) formValidationErrors.push("La Región es requerida.");
        if (!formData.comuna) formValidationErrors.push("La Comuna es requerida.");

        // Si fallan las validaciones locales, detenemos el envío
        if (formValidationErrors.length > 0) {
            setErrors(formValidationErrors);
            return;
        }

        // Si pasa la validación local, intentamos registrar en Backend
        try {
            // CRÍTICO: Incluimos RUT y DIRECCIÓN en el objeto que se envía a Java
            const newUser = {
                nombre: formData.nombre.trim(),
                correo: formData.correo.trim().toLowerCase(),
                contrasena: formData.contrasena,
                region: formData.region,
                comuna: formData.comuna,
                rut: formData.rut, // Nuevo
                direccion: formData.direccion // Nuevo
            };

            await registerUser(newUser); // Llamada al Backend
            
            showToast('Registro exitoso. Ahora inicia sesión.');
            setTimeout(() => { navigate('/login'); }, 700);

        } catch (error) {
            // Ahora capturamos el mensaje de error específico
            const errorMessage = error.message.includes("El correo ya está registrado") 
                ? error.message 
                : "Error al registrar. Inténtelo de nuevo.";
            
            setErrors([errorMessage]);
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
                
                {/* Nuevos campos */}
                <label htmlFor="rut">RUT *</label>
                <input type="text" id="rut" placeholder="Ej: 19011022-K" required value={formData.rut} onChange={handleChange} />

                <label htmlFor="nombre">Nombre completo *</label>
                <input type="text" id="nombre" placeholder="Ingrese su nombre completo" required value={formData.nombre} onChange={handleChange} />

                <label htmlFor="correo">Correo electrónico *</label>
                <input type="email" id="correo" placeholder="Ingrese su correo" required value={formData.correo} onChange={handleChange} />

                <label htmlFor="contrasena">Contraseña *</label>
                <input type="password" id="contrasena" placeholder="Ingrese su contraseña" required value={formData.contrasena} onChange={handleChange} />

                <label htmlFor="confirmar">Confirmar contraseña *</label>
                <input type="password" id="confirmar" placeholder="Confirme su contraseña" required value={formData.confirmar} onChange={handleChange} />

                <label htmlFor="region">Región *</label>
                <select id="region" required value={formData.region} onChange={handleChange}>
                    <option value="">Seleccione su región</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label htmlFor="comuna">Comuna *</label>
                <select id="comuna" required value={formData.comuna} onChange={handleChange} disabled={!formData.region}>
                    <option value="">Seleccione su comuna</option>
                    {formData.region && COMUNAS_POR_REGION[formData.region] &&
                        COMUNAS_POR_REGION[formData.region].map(c => <option key={c} value={c}>{c}</option>)
                    }
                </select>
                
                <label htmlFor="direccion">Dirección *</label>
                <input type="text" id="direccion" placeholder="Calle, número, depto..." required value={formData.direccion} onChange={handleChange} />


                {/* El campo teléfono ya no está en la BD, lo mantenemos como visual pero no se envía */}
                <label htmlFor="telefono">Teléfono (para seguimiento de envíos - Opcional)</label>
                <input type="tel" id="telefono" placeholder="Ingrese su teléfono" value={formData.telefono} onChange={handleChange} />

                <button type="submit">CREAR MI CUENTA HUERTOHOGAR</button>

                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </form>
        </main>
    );
};

export default Register;