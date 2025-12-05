import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { validateAdminForm } from '../../utils/adminValidators'; 
import { useCart } from '../../context/CartContext'; 

// Data de Regiones y Comunas
const REGIONES = [
    "Santiago", "Viña del Mar / Valparaíso", "Concepción / Nacimiento", "Puerto Montt / Villarica",
];
const COMUNAS_POR_REGION = {
    "Santiago": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "Ñuñoa", "Vitacura"],
    "Viña del Mar / Valparaíso": ["Viña del Mar", "Valparaíso", "Quilpué", "Villa Alemana"],
    "Concepción / Nacimiento": ["Concepción", "San Pedro de la Paz", "Talcahuano", "Nacimiento", "Los Ángeles"],
    "Puerto Montt / Villarica": ["Puerto Montt", "Puerto Varas", "Villarrica", "Pucón", "Osorno"]
};
// Roles disponibles para edición
const ROLES = ["administrador", "cliente"]; 

const AdminUserEdit = () => {
    const navigate = useNavigate();
    const { id: userIdString } = useParams(); 
    
    const { showToast, usuarios, actualizarUsuarioBD } = useCart();
    
    const userId = parseInt(userIdString, 10);

    const [numericId, setNumericId] = useState(null);

    // Estado inicial incluye los nuevos campos
    const [formData, setFormData] = useState({
        rut: '', 
        nombre: '',
        apellidos: '',
        correo: '',
        fechaNacimiento: '', 
        tipoUsuario: '',
        region: '',
        comuna: '',
        direccion: '', 
    });
    
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Cargar datos del usuario
    useEffect(() => {
        // Esperar a que carguen los usuarios
        if (usuarios.length === 0 && loading) return;

        // Buscamos el usuario por su ID NUMÉRICO
        const userToEdit = usuarios.find(u => u.id === userId);

        if (!userToEdit) {
            showToast(`Usuario con ID ${userId} no encontrado.`);
            navigate('/admin/usuarios');
            return;
        }

        setNumericId(userToEdit.id);

        // Separar "Juan Perez" en Nombre y Apellido visualmente
        const nombreCompleto = userToEdit.nombre || "";
        const partesNombre = nombreCompleto.split(" ");
        const nombreVisual = partesNombre[0] || "";
        const apellidosVisual = partesNombre.slice(1).join(" ") || "";

        setFormData({
            // CRÍTICO: Cargar los nuevos campos del Backend
            rut: userToEdit.rut || '', 
            nombre: nombreVisual,
            apellidos: apellidosVisual,
            correo: userToEdit.correo || '',
            fechaNacimiento: '', 
            tipoUsuario: userToEdit.rol || 'cliente',
            region: userToEdit.region || '',
            comuna: userToEdit.comuna || '',
            direccion: userToEdit.direccion || '', // CRÍTICO: Cargar dirección
        });
        setLoading(false);
    }, [userId, navigate, showToast, usuarios, loading]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'region') newState.comuna = ''; 
            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        const formValidationErrors = [];
        if (!formData.rut) formValidationErrors.push("El RUT es requerido."); // CRÍTICO: RUT obligatorio
        if (!formData.nombre) formValidationErrors.push("El Nombre es requerido.");
        if (!formData.apellidos) formValidationErrors.push("Los Apellidos son requeridos.");
        if (!formData.tipoUsuario) formValidationErrors.push("El Rol es requerido.");
        if (!formData.region) formValidationErrors.push("La Región es requerida.");

        if (formValidationErrors.length > 0) {
            setErrors(formValidationErrors);
            return;
        }

        // Preparar objeto para Backend
        const usuarioActualizado = {
            nombre: `${formData.nombre} ${formData.apellidos}`,
            region: formData.region,
            comuna: formData.comuna,
            rol: formData.tipoUsuario,
            
            // CRÍTICO: Nuevos campos
            rut: formData.rut,
            direccion: formData.direccion 
            // Correo y Password no se actualizan aquí 
        };

        // Llamar al Contexto -> Backend
        const exito = await actualizarUsuarioBD(numericId, usuarioActualizado);

        if (exito) {
            setTimeout(() => {
                navigate('/admin/usuarios');
            }, 800);
        }
    };

    // Si la página se está cargando o no se encuentra el usuario, muestra el mensaje
    if (loading) {
        return <main className="main" style={{ padding: '50px', textAlign:'center' }}>Cargando datos del usuario...</main>;
    }

    return (
        <>
            <header className="header">
                <h1>Editar Usuario: {formData.nombre} {formData.apellidos}</h1>
            </header>

            <form id="formUsuarioEditar" className="formulario" onSubmit={handleSubmit}>
                
                {errors.length > 0 && (
                    <div className="error" style={{ marginBottom: '15px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>⚠️ Errores:</strong></p>
                        <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
                    </div>
                )}

                <label>RUT *:</label>
                <input type="text" name="rut" value={formData.rut} onChange={handleChange} required />

                <label>Nombre:</label>
                <input type="text" name="nombre" required maxLength="50" value={formData.nombre} onChange={handleChange} />

                <label>Apellidos:</label>
                <input type="text" name="apellidos" required maxLength="100" value={formData.apellidos} onChange={handleChange} />

                <label>Correo (No editable):</label>
                <input type="email" name="correo" value={formData.correo} readOnly disabled style={{ backgroundColor: '#f0f0f0' }} />

                <label>Tipo de Usuario:</label>
                <select name="tipoUsuario" required value={formData.tipoUsuario} onChange={handleChange}>
                    {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>

                <label>Región:</label>
                <select name="region" required value={formData.region} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label>Comuna:</label>
                <select name="comuna" required value={formData.comuna} onChange={handleChange} disabled={!formData.region}>
                    <option value="">Seleccione...</option>
                    {formData.region && COMUNAS_POR_REGION[formData.region] && 
                        COMUNAS_POR_REGION[formData.region].map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <label>Dirección:</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Calle, número..." />

                <button type="submit" className="btn">Actualizar Datos</button>
            </form>
        </>
    );
};

export default AdminUserEdit;