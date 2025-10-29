import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateAdminForm } from '../../utils/adminValidators'; 
import { useCart } from '../../context/CartContext'; 

// Data de Regiones y Comunas (Reutilizada de AdminUserNew)
const REGIONES = [
    "Metropolitana", "Valparaíso", "Antofagasta", "Arica y Parinacota", "Ñuble", 
    "Coquimbo", "Los Ríos", "La Araucanía", "Los Lagos", "Magallanes", 
    "Aysén", "Atacama", "Tarapacá", "Maule", "O'Higgins"
];
const COMUNAS = [
    "Santiago", "Providencia", "Las Condes", "Lo Barnechea", "Pudahuel", "Maipú", 
    "Recoleta", "Lo Prado", "Cerrillos", "Cerro Navia", "Renca", "La Dehesa", 
    "Colina", "Lampa", "Conchalí", "El Bosque", "Estación Central", 
    "Puente Alto", "Huechuraba", "Lo Espejo", "Quinta Normal", "Talagante", 
    "Peñaflor", "Ñuñoa", "San Miguel", "San Joaquín"
];
const ROLES = ["administrador", "cliente", "repartidor"];

const AdminUserEdit = () => {
    const navigate = useNavigate();
    // El ID en la URL es el correo del usuario, ya que es el identificador único en tu sistema
    const { id: userEmail } = useParams(); 
    const { showToast, usuarios } = useCart();
    
    const [formData, setFormData] = useState({
        run: '', nombre: '', apellidos: '', correo: '', fechaNacimiento: '', 
        tipoUsuario: '', region: '', comuna: '', direccion: '',
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. useEffect para cargar los datos del usuario a editar
    useEffect(() => {
        const userToEdit = usuarios.find(u => u.correo === userEmail);

        if (!userToEdit) {
            showToast(`Usuario ${userEmail} no encontrado.`);
            navigate('/admin/usuarios');
            return;
        }

        // 2. Rellenar el estado con los datos existentes
        setFormData({
            run: userToEdit.run || '', // Asumimos que RUN fue agregado en la admin-new
            nombre: userToEdit.nombre || '',
            apellidos: userToEdit.apellidos || '',
            correo: userToEdit.correo || '',
            fechaNacimiento: userToEdit.fechaNacimiento || '',
            tipoUsuario: userToEdit.rol || 'cliente', // Asumimos que el rol se guarda como 'rol'
            region: userToEdit.region || '',
            comuna: userToEdit.comuna || '',
            direccion: userToEdit.direccion || '',
        });
        setLoading(false);
    }, [userEmail, navigate, showToast, usuarios]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 3. Validaciones
        const formValidationErrors = [];

        // Validaciones de Requeridos
        if (!formData.run) formValidationErrors.push("El RUN es requerido.");
        if (!formData.nombre) formValidationErrors.push("El Nombre es requerido.");
        if (!formData.apellidos) formValidationErrors.push("Los Apellidos son requeridos.");
        // ... (otras validaciones de campos requeridos) ...
        
        // Validaciones generales (RUN, Correo, etc.)
        const generalErrors = validateAdminForm({ 
            run: formData.run, 
            correo: formData.correo 
        });
        
        const allErrors = [...formValidationErrors, ...generalErrors];

        setErrors(allErrors);

        if (allErrors.length > 0) {
            showToast(`Error al actualizar: ${allErrors.length} campo(s) inválido(s).`);
            return;
        }

        // 4. Simulación de Actualización
        // Aquí iría la lógica real para encontrar y actualizar el usuario en el Contexto/localStorage
        const usuarioActualizado = { ...formData, id: userEmail, rol: formData.tipoUsuario };
        console.log('Simulando actualización de usuario:', usuarioActualizado);

        // 5. Éxito y Redirección
        showToast(`Usuario ${usuarioActualizado.nombre} actualizado con éxito.`);
        
        setTimeout(() => {
            navigate('/admin/usuarios');
        }, 800);
    };

    if (loading) {
        return <main className="main" style={{ padding: '50px' }}>Cargando datos del usuario...</main>;
    }

    return (
        <>
            <header className="header">
                <h1>Editar Usuario y Datos de Entrega: {formData.nombre}</h1>
            </header>

            <form id="formUsuarioEditar" className="formulario" onSubmit={handleSubmit}>
                
                {/* Mostrar Errores */}
                {errors.length > 0 && (
                    <div className="error" style={{ marginBottom: '15px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>⚠️ Errores de Validación:</strong></p>
                        <ul>
                            {errors.map((err, index) => <li key={index}>{err}</li>)}
                        </ul>
                    </div>
                )}

                <label>RUN:</label>
                <input type="text" name="run" required minLength="7" maxLength="9" value={formData.run} onChange={handleChange} />

                <label>Nombre:</label>
                <input type="text" name="nombre" required maxLength="50" value={formData.nombre} onChange={handleChange} />

                <label>Apellidos:</label>
                <input type="text" name="apellidos" required maxLength="100" value={formData.apellidos} onChange={handleChange} />

                <label>Correo:</label>
                {/* El correo es el ID, debería ser de solo lectura o con una validación compleja si cambia */}
                <input type="email" name="correo" required maxLength="100" value={formData.correo} readOnly disabled style={{ backgroundColor: '#f0f0f0' }} />

                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />

                <label>Tipo de Usuario:</label>
                <select name="tipoUsuario" required value={formData.tipoUsuario} onChange={handleChange}>
                    {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>

                <label>Región:</label>
                <select id="region" name="region" required value={formData.region} onChange={handleChange}>
                    <option value="">Seleccione su región</option>
                    {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label>Comuna:</label>
                <select id="comuna" name="comuna" required value={formData.comuna} onChange={handleChange}>
                    <option value="">Seleccione su comuna</option>
                    {COMUNAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <label>Dirección de Entrega:</label>
                <input type="text" name="direccion" required maxLength="300" value={formData.direccion} onChange={handleChange} />

                <button type="submit" className="btn">Actualizar Datos de Cliente</button>
            </form>
        </>
    );
};

export default AdminUserEdit;