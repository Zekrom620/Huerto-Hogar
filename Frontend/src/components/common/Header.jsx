// src/components/common/Header.jsx (ACTUALIZADO)

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Importamos el hook del carrito
import { escapeHtml } from '../../utils/helpers'; // Importamos la utilidad

const Header = () => {
    // Usamos el hook para acceder al estado global y funciones
    const { totalItems, usuarioActivo, logoutUser } = useCart(); 

    return (
        <header>
            <div className="top-bar">
                <div className="logo-container">
                    <img src="/img/Logo.png" alt="Logo HuertoHogar" width="40" /> 
                    <span>HuertoHogar</span>
                </div>
                <nav>
                    <Link to="/" className="activo">Home</Link>
                    <Link to="/productos">Productos</Link>
                    <Link to="/nosotros">Nosotros</Link>
                    <Link to="/blogs">Blog & Tips</Link> 
                    <Link to="/contacto">Contacto</Link>
                </nav>
                <div className="acciones">
                    {usuarioActivo ? (
                        <>
                            <span>Hola {escapeHtml(usuarioActivo.nombre)}</span> | 
                            <a href="#" onClick={(e) => { e.preventDefault(); logoutUser(); }}>Cerrar sesión</a> | 
                            <Link to="/carrito" className="carrito">Carrito ({totalItems})</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Iniciar sesión</Link> |
                            <Link to="/registro">Registrar usuario</Link> |
                            <Link to="/carrito" className="carrito">Carrito ({totalItems})</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;