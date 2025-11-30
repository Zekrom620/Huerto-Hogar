import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { validateAdminForm } from '../../utils/adminValidators'; // Puedes descomentarlo si lo necesitas
import { useCart } from '../../context/CartContext'; 

// Data de Regiones y Comunas
const REGIONES = [
    "Santiago",
    "Viña del Mar / Valparaíso", 
    "Concepción / Nacimiento", 
    "Puerto Montt / Villarica",
];

const COMUNAS_POR_REGION = {
    "Santiago": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "Ñuñoa", "Vitacura"],
    "Viña del Mar / Valparaíso": ["Viña del Mar", "Valparaíso", "Quilpué", "Villa Alemana"],
    "Concepción / Nacimiento": ["Concepción", "San Pedro de la Paz", "Talcahuano", "Nacimiento", "Los Ángeles"],
    "Puerto Montt / Villarica": ["Puerto Montt", "Puerto Varas", "Villarrica", "Pucón", "Osorno"]
};

const AdminUserNew = () => {
    const navigate = useNavigate();
    // Extraemos registerUser (que conecta con el Backend) y datos de sesión
    const { showToast, usuarioActivo, registerUser } = useCart();
    
    const userRole = usuarioActivo?.rol; 
    
    // Estado del formulario
    const [formData, setFormData] = useState({
        run: '', // Visual (No se guarda en este Backend simplificado)
        nombre: '',
        apellidos: '',
        correo: '',
        fechaNacimiento: '', // Visual
        tipoUsuario: '',
        region: '',
        comuna: '',
        direccion: '', // Visual
        password: 'password_defecto_123' 
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            // Si cambia la región, limpiamos la comuna
            if (name === 'region') newState.comuna = ''; 
            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Validaciones Básicas del Frontend
        const formValidationErrors = [];
        if (!formData.nombre) formValidationErrors.push("El Nombre es requerido.");
        if (!formData.apellidos) formValidationErrors.push("Los Apellidos son requeridos.");
        if (!formData.correo) formValidationErrors.push("El Correo es requerido.");
        if (!formData.tipoUsuario) formValidationErrors.push("El Rol es requerido.");
        if (!formData.region) formValidationErrors.push("La Región es requerida.");
        
        if (formValidationErrors.length > 0) {
            setErrors(formValidationErrors);
            return;
        }

        // 2. Preparar datos para el Backend (User.java)
        // Adaptamos los campos para que coincidan con lo que Java espera
        const nuevoUsuario = {
            // Unimos nombre y apellido porque en BD es un solo campo "nombre"
            nombre: `${formData.nombre} ${formData.apellidos}`,
            correo: formData.correo.trim().toLowerCase(),
            contrasena: formData.password,
            region: formData.region,
            comuna: formData.comuna,
            rol: formData.tipoUsuario
        };

        // 3. Guardar en Base de Datos (MySQL)
        try {
            await registerUser(nuevoUsuario);
            showToast(`Usuario ${nuevoUsuario.nombre} creado con éxito.`);
            
            // Redirigir a la lista de usuarios
            setTimeout(() => {
                navigate('/admin/usuarios');
            }, 800);
        } catch (error) {
            console.error(error);
            // Si falla, suele ser porque el correo ya existe en la BD
            setErrors(["Error al guardar: Es posible que el correo ya esté registrado."]);
        }
    };

    // Lógica para deshabilitar roles según quien esté logueado
    const isRoleDisabled = (role) => {
        if (role === 'administrador' && userRole !== 'administrador') return true;
        return false;
    };

    return (
        <>
            <header className="header">
                <h1>Registrar Nuevo Cliente o Personal</h1>
            </header>

            <form id="formUsuarioNuevo" className="formulario" onSubmit={handleSubmit}>
                
                {errors.length > 0 && (
                    <div className="error" style={{ marginBottom: '15px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>⚠️ Errores:</strong></p>
                        <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
                    </div>
                )}

                <label>RUN (Solo visual):</label>
                <input type="text" name="run" placeholder="Ej: 19011022-K" value={formData.run} onChange={handleChange} />

                <label>Nombre:</label>
                <input type="text" name="nombre" required value={formData.nombre} onChange={handleChange} />

                <label>Apellidos:</label>
                <input type="text" name="apellidos" required value={formData.apellidos} onChange={handleChange} />

                <label>Correo:</label>
                <input type="email" name="correo" required value={formData.correo} onChange={handleChange} />

                <label>Contraseña:</label>
                <input type="text" name="password" required value={formData.password} onChange={handleChange} />

                <label>Tipo de Usuario:</label>
                <select name="tipoUsuario" required value={formData.tipoUsuario} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    <option value="administrador" disabled={isRoleDisabled('administrador')}>Administrador</option>
                    <option value="cliente">Cliente</option>
                    <option value="repartidor">Repartidor</option>
                </select>

                <label>Región:</label>
                <select name="region" required value={formData.region} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label>Comuna:</label>
                <select name="comuna" required value={formData.comuna} onChange={handleChange} disabled={!formData.region}>
                    <option value="">Seleccione...</option>
                    {formData.region && COMUNAS_POR_REGION[formData.region].map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <label>Dirección (Solo visual):</label>
                <input type="text" name="direccion" placeholder="Calle, número..." value={formData.direccion} onChange={handleChange} />

                <button type="submit" className="btn">Guardar Usuario</button>
            </form>
        </>
    );
};

export default AdminUserNew;