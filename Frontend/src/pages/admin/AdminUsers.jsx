import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
// Importamos funciones del contexto
import { useCart } from '../../context/CartContext'; 

const AdminUsers = () => {
    // Extraemos usuarios, el toast, y las nuevas funciones
    const { usuarios, showToast, cargarUsuariosBD, eliminarUsuarioBD } = useCart(); 

    // 1. Cargar usuarios reales al entrar a la página
    useEffect(() => {
        cargarUsuariosBD();
    }, []);

    // 2. Función de eliminación conectada al Backend (usaremos un modal simulado en consola)
    const handleDelete = async (userId, userEmail) => {
        // CORRECCIÓN: Evitamos usar window.confirm. Simulamos la confirmación.
        console.warn(`[Admin Action] Confirmando eliminación de: ${userEmail}.`);

        // Si la confirmación fuera exitosa (en un modal real)
        const success = await eliminarUsuarioBD(userId);
        
        // Si el usuario borrado es el administrador activo, esto se maneja mejor en el componente de logout/sesion
        if(success) {
            // El showToast ya está en eliminarUsuarioBD
        }
    };

    return (
        <>
            <header className="header">
                <h1>Gestión de Clientes y Personal</h1>
                {/* Opcional: El registro de admin se suele hacer manual, pero dejamos el botón */}
                <Link to="/admin/usuarios/nuevo" className="btn">+ Agregar Usuario</Link>
            </header>

            <section className="tabla-contenido">
                {usuarios.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>
                        Cargando usuarios o no hay registros...
                    </p>
                ) : (
                    <table className="tabla-admin">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Región</th>
                                <th>Comuna</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(u => (
                                <tr key={u.id}> 
                                    <td>{u.id}</td>
                                    <td>{u.nombre}</td>
                                    <td>{u.correo}</td>
                                    <td>{u.region}</td>
                                    <td>{u.comuna}</td>
                                    <td>{u.rol ? u.rol.toUpperCase() : 'CLIENTE'}</td>
                                    {/* Mostramos el rol real de la BD con estilo */}
                                    <td style={{ fontWeight: u.rol === 'administrador' ? 'bold' : 'normal', color: u.rol === 'administrador' ? 'red' : 'black' }}>
                                        {u.rol ? u.rol.toUpperCase() : 'CLIENTE'}
                                    </td>
                                    <td>
                                        {/* CRÍTICO: Agregamos el botón EDITAR para todos los roles */}
                                        <Link 
                                            to={`/admin/usuarios/editar/${u.id}`}
                                            className="btn-small btn-edit"
                                            style={{ marginRight: '10px' }}
                                        >
                                            Editar
                                        </Link>
                                        
                                        <button 
                                            onClick={() => handleDelete(u.id, u.correo)} 
                                            className="btn-small btn-delete" 
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