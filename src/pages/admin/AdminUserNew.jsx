import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateAdminForm } from '../../utils/adminValidators'; 
import { useCart } from '../../context/CartContext'; 

// Data de Regiones y Comunas (ACTUALIZADA con tus requerimientos)
const REGIONES = [
    "Santiago",
    "Viña del Mar / Valparaíso", 
    "Concepción / Nacimiento", 
    "Puerto Montt / Villarica",
];

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

const AdminUserNew = () => {
    const navigate = useNavigate();
    // Obtenemos el usuario activo (para saber qué puede crear) y el listado de usuarios (para validación única)
    const { showToast, usuarios, usuarioActivo } = useCart();
    
    // Obtenemos el rol del usuario que está creando el nuevo usuario (Admin/Repartidor, etc.)
    const userRole = usuarioActivo?.rol; 
    
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        run: '',
        nombre: '',
        apellidos: '',
        correo: '',
        fechaNacimiento: '',
        tipoUsuario: '',
        region: '',
        comuna: '',
        direccion: '',
        password: 'password_defecto_123' 
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            
            // Lógica para limpiar la Comuna si se cambia la Región
            if (name === 'region') {
                 newState.comuna = ''; 
            }
            
            return newState;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Validaciones de Requeridos
        const formValidationErrors = [];

        if (!formData.run) formValidationErrors.push("El RUN es requerido.");
        if (!formData.nombre) formValidationErrors.push("El Nombre es requerido.");
        if (!formData.apellidos) formValidationErrors.push("Los Apellidos son requeridos.");
        if (!formData.correo) formValidationErrors.push("El Correo es requerido.");
        if (!formData.tipoUsuario) formValidationErrors.push("El Tipo de Usuario (Rol) es requerido.");
        if (!formData.region) formValidationErrors.push("La Región es requerida.");
        if (!formData.comuna) formValidationErrors.push("La Comuna es requerida.");
        if (!formData.direccion) formValidationErrors.push("La Dirección es requerida.");
        
        // 2. Validaciones generales (RUN, Correo, Password)
        const generalErrors = validateAdminForm({ 
            run: formData.run, 
            correo: formData.correo,
            password: formData.password 
        });
        
        // 3. Validación de Correo Único
        if (usuarios.find(u => u.correo.toLowerCase() === formData.correo.toLowerCase())) {
             generalErrors.push("Ya existe un usuario registrado con ese correo.");
        }

        const allErrors = [...formValidationErrors, ...generalErrors];

        setErrors(allErrors);

        if (allErrors.length > 0) {
            showToast(`Error al guardar: ${allErrors.length} campo(s) inválido(s).`);
            return;
        }

        // 4. Simulación de Guardado (En un proyecto real, aquí se llamaría a una función API)
        const nuevoUsuario = { 
            ...formData, 
            id: formData.run, 
            rol: formData.tipoUsuario,
            // Borramos el campo password por defecto para no guardarlo directamente en el log
            // En una app real, se encripta.
            password: undefined 
        };
        console.log('Simulando guardado de nuevo usuario:', nuevoUsuario);

        // 5. Éxito y Redirección
        showToast(`Usuario ${nuevoUsuario.nombre} (${nuevoUsuario.rol}) guardado con éxito.`);
        
        setTimeout(() => {
            navigate('/admin/usuarios');
        }, 800);
    };

    // Función auxiliar para determinar si un rol está deshabilitado para el usuario activo
    const isRoleDisabled = (role) => {
        // Regla: Solo el 'administrador' puede crear 'administrador'
        if (role === 'administrador' && userRole !== 'administrador') return true;
        
        // Regla: Asumimos que el "vendedor" es el "repartidor" y puede crear Repartidor y Cliente
        // Si el usuario no es Admin, no puede crear roles que no sean Cliente o Repartidor
        if (userRole === 'repartidor' && role === 'administrador') return true;
        
        // Por defecto, se permite (Admin puede crear todo, Repartidor puede crear Cliente/Repartidor)
        return false;
    };


    return (
        <>
            <header className="header">
                <h1>Registrar Nuevo Cliente o Personal</h1>
            </header>

            <form id="formUsuarioNuevo" className="formulario" onSubmit={handleSubmit}>
                
                {/* Mostrar Errores */}
                {errors.length > 0 && (
                    <div className="error" style={{ marginBottom: '15px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>⚠️ Errores en la Gestión de HuertoHogar:</strong></p>
                        <ul>
                            {errors.map((err, index) => <li key={index}>{err}</li>)}
                        </ul>
                    </div>
                )}

                <label>RUN:</label>
                <input type="text" name="run" required minLength="7" maxLength="9" placeholder="Ej: 19011022-K" value={formData.run} onChange={handleChange} />

                <label>Nombre:</label>
                <input type="text" name="nombre" required maxLength="50" value={formData.nombre} onChange={handleChange} />

                <label>Apellidos:</label>
                <input type="text" name="apellidos" required maxLength="100" value={formData.apellidos} onChange={handleChange} />

                <label>Correo:</label>
                <input type="email" name="correo" required maxLength="100" value={formData.correo} onChange={handleChange} />

                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />

                <label>Tipo de Usuario:</label>
                <select name="tipoUsuario" required value={formData.tipoUsuario} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    
                    <option 
                        value="administrador" 
                        disabled={isRoleDisabled('administrador')}
                        // Agregamos un estilo si está deshabilitado
                        style={isRoleDisabled('administrador') ? { backgroundColor: '#ddd', color: '#666' } : {}}
                    >
                        Administrador
                    </option>
                    
                    <option value="cliente">Cliente</option>
                    
                    <option value="repartidor">Repartidor</option>
                </select>

                <label>Región:</label>
                <select id="region" name="region" required value={formData.region} onChange={handleChange}>
                    <option value="">Seleccione su región</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label>Comuna:</label>
                <select id="comuna" name="comuna" required value={formData.comuna} onChange={handleChange} disabled={!formData.region}>
                    <option value="">Seleccione su comuna</option>
                    {formData.region && COMUNAS_POR_REGION[formData.region] && 
                        COMUNAS_POR_REGION[formData.region].map(c => <option key={c} value={c}>{c}</option>)
                    }
                </select>

                <label>Dirección de Entrega:</label>
                <input type="text" name="direccion" required maxLength="300" placeholder="Calle, número, depto/casa, referencia." value={formData.direccion} onChange={handleChange} />

                <button type="submit" className="btn">Guardar Usuario</button>
            </form>
        </>
    );
};

export default AdminUserNew;