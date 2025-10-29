import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { showToast } from '../../utils/helpers'; // Usamos la utilidad showToast del contexto si no funciona aquí directamente

// Roles de ejemplo para tu proyecto: 'admin', 'vendedor', 'repartidor', 'cliente'
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { usuarioActivo, showToast } = useCart();

    if (!usuarioActivo) {
        // 1. Si no hay usuario, redirigir al login
        showToast("Debes iniciar sesión para acceder a esta ruta.");
        return <Navigate to="/login" replace />;
    }

    const userRole = usuarioActivo.rol;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // 2. Si el rol no está permitido, redirigir a Home o mostrar error 403
        showToast("Acceso denegado. No tienes permisos suficientes.");
        return <Navigate to="/" replace />;
    }

    // 3. Permiso concedido
    return children;
};

export default ProtectedRoute;