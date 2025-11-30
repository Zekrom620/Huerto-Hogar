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
const ROLES = ["administrador", "cliente", "repartidor"];

const AdminUserEdit = () => {
    const navigate = useNavigate();
    // El ID en la URL es el correo, lo usamos para buscar al usuario
    const { id: userEmail } = useParams(); 
    
    // Extraemos la función de actualizar del contexto
    const { showToast, usuarios, actualizarUsuarioBD } = useCart();
    
    // Guardamos el ID numérico real una vez lo encontramos
    const [numericId, setNumericId] = useState(null);

    const [formData, setFormData] = useState({
        run: '', // Visual
        nombre: '',
        apellidos: '',
        correo: '',
        fechaNacimiento: '', // Visual
        tipoUsuario: '',
        region: '',
        comuna: '',
        direccion: '', // Visual
    });
    
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Cargar datos del usuario
    useEffect(() => {
        // Esperar a que carguen los usuarios
        if (usuarios.length === 0) return;

        const userToEdit = usuarios.find(u => u.correo === userEmail);

        if (!userToEdit) {
            showToast(`Usuario con correo ${userEmail} no encontrado.`);
            navigate('/admin/usuarios');
            return;
        }

        // Guardamos el ID numérico para usarlo al guardar
        setNumericId(userToEdit.id);

        // Separar "Juan Perez" en Nombre y Apellido visualmente
        const nombreCompleto = userToEdit.nombre || "";
        const partesNombre = nombreCompleto.split(" ");
        const nombreVisual = partesNombre[0] || "";
        const apellidosVisual = partesNombre.slice(1).join(" ") || "";

        setFormData({
            run: '', 
            nombre: nombreVisual,
            apellidos: apellidosVisual,
            correo: userToEdit.correo || '',
            fechaNacimiento: '', 
            tipoUsuario: userToEdit.rol || 'cliente',
            region: userToEdit.region || '',
            comuna: userToEdit.comuna || '',
            direccion: '', 
        });
        setLoading(false);
    }, [userEmail, navigate, showToast, usuarios]);

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
            // Unimos de nuevo el nombre
            nombre: `${formData.nombre} ${formData.apellidos}`,
            region: formData.region,
            comuna: formData.comuna,
            rol: formData.tipoUsuario,
            // Nota: Correo y Password no se actualizan aquí por seguridad/simplicidad
        };

        // Llamar al Contexto -> Backend
        const exito = await actualizarUsuarioBD(numericId, usuarioActualizado);

        if (exito) {
            setTimeout(() => {
                navigate('/admin/usuarios');
            }, 800);
        }
    };

    if (loading) {
        return <main className="main" style={{ padding: '50px', textAlign:'center' }}>Cargando datos del usuario...</main>;
    }

    return (
        <>
            <header className="header">
                <h1>Editar Usuario: {formData.nombre}</h1>
            </header>

            <form id="formUsuarioEditar" className="formulario" onSubmit={handleSubmit}>
                
                {errors.length > 0 && (
                    <div className="error" style={{ marginBottom: '15px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>⚠️ Errores:</strong></p>
                        <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
                    </div>
                )}

                <label>RUN (Solo visual):</label>
                <input type="text" name="run" value={formData.run} onChange={handleChange} placeholder="No editable en Backend" />

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

                <label>Dirección (Solo visual):</label>
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="No editable en Backend" />

                <button type="submit" className="btn">Actualizar Datos</button>
            </form>
        </>
    );
};

export default AdminUserEdit;