import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    // 1. Hook para saber la ruta actual y aplicar la clase 'active'
    const location = useLocation();

    // Función para verificar si la ruta está activa
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="barra">
            <div className="nombre">HuertoHogar - Administración</div>
            <nav>
                {/* Usamos Link para navegar en React y isActive para aplicar la clase 'active' */}
                <Link 
                    to="/admin" 
                    className={isActive('/admin') ? 'active' : ''}
                >
                    Panel Principal
                </Link>
                <Link 
                    to="/admin/productos" 
                    className={isActive('/admin/productos') ? 'active' : ''}
                >
                    Productos (Cosecha)
                </Link>
                <Link 
                    to="/admin/usuarios" 
                    className={isActive('/admin/usuarios') ? 'active' : ''}
                >
                    Usuarios
                </Link>
                {/* En el futuro podrías añadir un botón de "Cerrar sesión Admin" aquí */}
            </nav>
        </aside>
    );
};

export default AdminSidebar;