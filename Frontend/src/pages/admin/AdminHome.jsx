import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
    return (
        <>
            <header className="header">
                <h1>¡Bienvenido al Huerto, Administrador!</h1>
            </header>

            <section className="home">
                <div className="info">
                    <h2>Gestión de la Cosecha</h2>
                    <p>Administra todos los productos frescos de la tienda: agregar, editar o eliminar.</p>
                    {/* El enlace dirige a la nueva ruta de React Router */}
                    <Link to="/admin/productos" className="btn">Ver Productos</Link>
                </div>

                <div className="info">
                    <h2>Gestión de Clientes</h2>
                    <p>Gestiona los usuarios registrados: administradores y clientes. Verifica direcciones de entrega.</p>
                    {/* El enlace dirige a la nueva ruta de React Router */}
                    <Link to="/admin/usuarios" className="btn">Ver Usuarios</Link>
                </div>
            </section>
        </>
    );
};

export default AdminHome;