import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Mapeo de Ciudades Clave a Regiones (para simplificar la lista del usuario)
const REGIONES = [
    // Representación de Santiago (Metropolitana)
    "Santiago",
    // Representación de Valparaíso y Viña del Mar (Valparaíso)
    "Viña del Mar / Valparaíso",
    // Representación de Concepción (Biobío)
    "Concepción / Nacimiento",
    // Representación de Puerto Montt y Villarica (Los Lagos/Araucanía)
    "Puerto Montt / Villarica",
];

// Comunas clave agrupadas por la región más cercana para simplificar la lista de selección
// NOTA: Esta es una lista representativa para el alcance de tu proyecto, no la lista completa de comunas de Chile.
const COMUNAS_POR_REGION = {
    "Santiago": [
        "Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "Ñuñoa", "Vitacura"
    ],
    "Viña del Mar / Valparaíso": [
        "Viña del Mar", "Valparaíso", "Quilpué", "Villa Alemana"
    ],
    "Concepción / Nacimiento": [
        "Concepción", "San Pedro de la Paz", "Talcahuano", "Nacimiento", "Los Ángeles"
    ],
    "Puerto Montt / Villarica": [
        "Puerto Montt", "Puerto Varas", "Villarrica", "Pucón", "Osorno"
    ]
};

const Register = () => {
    const { registerUser, usuarios, showToast } = useCart();
    const navigate = useNavigate();

    // 1. Estado para manejar todos los campos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmar: '', // <<-- ESTE ES EL CAMPO
        telefono: '',
        region: '',
        comuna: '',
    });

    // 2. Estado para manejar los errores de validación
    const [errors, setErrors] = useState([]);

    // Manejador genérico para todos los inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // 3. Función de Validación (Migración de la lógica setupRegistro de script.js)
    const validateForm = () => {
        const newErrors = [];
        const { nombre, correo, contrasena, confirmar, region, comuna } = formData;
        const correoL = correo.trim().toLowerCase();

        // Validaciones
        if (!nombre) newErrors.push('Nombre es requerido.');
        else if (nombre.length > 100) newErrors.push('Nombre máximo 100 caracteres.');

        if (!correoL) newErrors.push('Correo es requerido.');
        else if (correoL.length > 100) newErrors.push('Correo máximo 100 caracteres.');
        else if (!/^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correoL))
            newErrors.push('Correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
        else if (usuarios.find(u => u.correo.toLowerCase() === correoL))
            newErrors.push('Ya existe un usuario con ese correo.');

        if (!contrasena) newErrors.push('Contraseña requerida.');
        else if (contrasena.length < 4 || contrasena.length > 10)
            newErrors.push('Contraseña entre 4 y 10 caracteres.');

        if (contrasena !== confirmar) newErrors.push('Las contraseñas no coinciden.');

        if (!region) newErrors.push('Región es requerida.');
        if (!comuna) newErrors.push('Comuna es requerida.');

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    // 4. Manejador de Envío 
    const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
        const newUser = {
            nombre: formData.nombre.trim(),
            correo: formData.correo.trim().toLowerCase(),
            contrasena: formData.contrasena,
            telefono: formData.telefono,
            region: formData.region,
            comuna: formData.comuna, // <<-- ¡AÑADIR COMA AQUÍ!
            rol: 'cliente' // <<-- ROL ASIGNADO
        };

        registerUser(newUser);
        showToast('Registro exitoso. Ahora inicia sesión.');

        setTimeout(() => { navigate('/login'); }, 700);
    }
};

    // 6. Renderizado del Formulario
    return (
        <main className="form-container">
            <form id="form-registro" onSubmit={handleSubmit}>
                <img src="/img/Logo.png" alt="Logo HuertoHogar" style={{ display: 'block', margin: '0 auto 10px auto', width: '80px' }} />
                <h2>Únete a la Cosecha HuertoHogar</h2>
                <p style={{ textAlign: 'center', color: 'var(--color-texto-secundario)' }}>
                    Regístrate para llevar la frescura del campo directamente a tu hogar.
                </p>

                {/* Visualización de Errores */}
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

                <label htmlFor="confirmar-contrasena">Confirmar contraseña *</label>
                <input
                    type="password"
                    id="confirmar"
                    placeholder="Confirme su contraseña"
                    value={formData.confirmar} // <<-- Asegúrate de que apunte a 'confirmar'
                    onChange={handleChange}     // <<-- Asegúrate de que 'handleChange' esté presente
                />

                <label htmlFor="telefono">Teléfono (para seguimiento de envíos)</label>
                <input type="tel" id="telefono" placeholder="Ingrese su teléfono" value={formData.telefono} onChange={handleChange} />

                

                <label htmlFor="region">Región *</label>
                <select id="region" value={formData.region} onChange={handleChange}>
                    <option value="">Seleccione su región</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label htmlFor="comuna">Comuna *</label>
                {/* Usaremos la región seleccionada para filtrar las comunas */}
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