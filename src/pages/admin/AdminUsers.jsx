import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Para acceder a la lista de usuarios

const AdminUsers = () => {
    // Obtenemos la lista global de usuarios y funciones (aunque solo necesitemos 'usuarios' por ahora)
    const { usuarios, showToast } = useCart(); 

    // Función de ejemplo para manejar la eliminación (simulada)
    const handleDelete = (userId) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario con correo: ${userId}? (Esta es una simulación)`)) {
            // Aquí iría la lógica real para eliminar al usuario del Contexto/localStorage
            showToast(`Usuario ${userId} eliminado (simulación).`);
        }
    };

    return (
        <>
            <header className="header">
                <h1>Gestión de Clientes y Personal</h1>
                {/* Enlace al formulario de creación de usuario */}
                <Link to="/admin/usuarios/nuevo" className="btn">+ Agregar Usuario</Link>
            </header>

            <section className="tabla-contenido">
                {/* Comprobación de si hay usuarios registrados */}
                {usuarios.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>No hay usuarios registrados en el sistema (solo tú, si iniciaste sesión).</p>
                ) : (
                    <table className="tabla-admin">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo (ID)</th>
                                <th>Región</th>
                                <th>Comuna</th>
                                <th>Rol (Fijo)</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mapeamos la lista global de usuarios para crear las filas */}
                            {usuarios.map(u => (
                                // Usamos el correo como clave única (ID en este contexto)
                                <tr key={u.correo}> 
                                    <td>{u.nombre}</td>
                                    <td>{u.correo}</td>
                                    <td>{u.region}</td>
                                    <td>{u.comuna}</td>
                                    {/* Nota: En tu script.js original no hay rol. Simulamos un rol simple. */}
                                    <td>{u.correo.includes('@profesor.duoc.cl') ? 'Administrador' : 'Cliente'}</td> 
                                    <td>
                                        {/* Enlace al formulario de edición con el correo (ID) del usuario */}
                                        <Link 
                                            to={`/admin/usuarios/editar/${u.correo}`} 
                                            className="btn-small"
                                        >
                                            Editar
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(u.correo)} 
                                            className="btn-small btn-delete" 
                                            style={{ marginLeft: '8px' }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </>
    );
};

export default AdminUsers;