// src/context/CartContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { leerLS, guardarLS, formatCLP } from '../utils/helpers';
import { PRODUCTOS, CUPONES } from '../data/ProductsData';

// 1. Crea el Contexto
const CartContext = createContext();

// 2. Crea el Hook personalizado para usar el contexto fácilmente
export const useCart = () => useContext(CartContext);

// Función auxiliar para determinar el rol al iniciar sesión
const getRoleByEmail = (email) => {
    // Si el correo es de profesor, asignamos el rol de administrador
    if (email.endsWith('@profesor.duoc.cl')) {
        return 'administrador';
    }
    // Para todos los demás correos permitidos (duoc.cl, gmail.com, etc.), son clientes
    return 'cliente';
}


// 3. Crea el Proveedor de Contexto (Componente que envuelve la app)
export const CartProvider = ({ children }) => {
    // Estado inicial obtenido desde localStorage
    const [carrito, setCarrito] = useState(() => leerLS('carrito', []));
    const [cuponAplicado, setCuponAplicado] = useState(() => leerLS('cuponAplicado', null));
    const [usuarioActivo, setUsuarioActivo] = useState(() => leerLS('usuarioActivo', null));
    // NOTA: Inicializamos 'usuarios' con una lista vacía por si es la primera carga
    const [usuarios, setUsuarios] = useState(() => leerLS('usuarios', [])); 
    const [toastMessage, setToastMessage] = useState(null); // Para el toast

    // Efecto para sincronizar el carrito con localStorage cada vez que cambia
    useEffect(() => {
        guardarLS('carrito', carrito);
    }, [carrito]);

    // Efecto para sincronizar cupón con localStorage
    useEffect(() => {
        guardarLS('cuponAplicado', cuponAplicado);
    }, [cuponAplicado]);

    // Efecto para sincronizar usuario activo con localStorage
    useEffect(() => {
        guardarLS('usuarioActivo', usuarioActivo);
    }, [usuarioActivo]);
    
    // Efecto para sincronizar lista de usuarios con localStorage
    useEffect(() => {
        guardarLS('usuarios', usuarios);
    }, [usuarios]);

    // Efecto para mostrar el toast
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 1200);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // --------------------------------------------------
    // Lógica de Carrito (Migración de script.js)
    // --------------------------------------------------

    const calcTotalWithCoupon = (subtotal) => {
        if (!cuponAplicado) return subtotal;
        const c = CUPONES[cuponAplicado.codigo];
        if (c) {
            const val = c.valor;
            return Math.round(subtotal * (1 - val / 100));
        }
        return subtotal;
    };

    const subtotal = carrito.reduce((s, it) => s + it.precio * it.qty, 0);
    const total = calcTotalWithCoupon(subtotal);
    const totalItems = carrito.reduce((s, it) => s + it.qty, 0);

    const showToast = (msg) => setToastMessage(msg);

    const addToCart = (id, cantidad = 1) => {
        const prod = PRODUCTOS.find(p => p.id === id);
        if (!prod) { console.warn('Producto no encontrado', id); return; }

        setCarrito(currentCart => {
            const idx = currentCart.findIndex(it => it.id === id);
            const newCart = [...currentCart];

            if (idx >= 0) {
                newCart[idx].qty += cantidad;
                if (newCart[idx].qty > prod.stock) newCart[idx].qty = prod.stock;
            } else {
                newCart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, imagen: prod.imagen, qty: cantidad });
            }
            showToast(`${prod.nombre} agregado al carrito`);
            return newCart;
        });
    };

    const changeQty = (id, delta) => {
        setCarrito(currentCart => {
            let newCart = currentCart.map(item =>
                item.id === id ? { ...item, qty: item.qty + delta } : item
            ).filter(item => item.qty > 0);
            
            return newCart;
        });
    };

    const removeItem = (id) => {
        setCarrito(currentCart => currentCart.filter(it => it.id !== id));
    };

    const applyCoupon = (code) => {
        const normalizedCode = code.trim().toUpperCase();
        const c = CUPONES[normalizedCode];
        if (!c) {
            setToastMessage('Cupón no válido.');
            setCuponAplicado(null);
            guardarLS('cuponAplicado', null);
            return false;
        }
        const newCoupon = { codigo: normalizedCode, descuento: c.valor };
        setCuponAplicado(newCoupon);
        guardarLS('cuponAplicado', newCoupon);
        showToast(`Cupón ${normalizedCode} aplicado (${c.valor}% off)`);
        return true;
    };
    
    const clearCoupon = () => {
        setCuponAplicado(null);
        guardarLS('cuponAplicado', null);
    };
    
    const doCheckout = () => {
        if (!carrito.length) { showToast('Carrito vacío.'); return; }
        if (!usuarioActivo) {
            alert('Debes iniciar sesión para finalizar la compra. Implementarás la redirección con React Router.');
            return;
        }
        
        alert(`¡Gracias por tu compra, ${usuarioActivo.nombre}! Tu pedido de ${formatCLP(total)} está siendo procesado.`);
        setCarrito([]);
        setCuponAplicado(null);
        guardarLS('carrito', []);
        guardarLS('cuponAplicado', null);
    };

    // --------------------------------------------------
    // Lógica de Usuario (Migración de script.js)
    // --------------------------------------------------

    const loginUser = (user) => {
        // ASIGNACIÓN DE ROL: Si el usuario no tiene rol (por ser antiguo), lo asignamos por correo.
        const userWithRole = { ...user, rol: user.rol || getRoleByEmail(user.correo) };
        
        setUsuarioActivo(userWithRole);
        showToast(`Bienvenido(a) ${userWithRole.nombre}`);
    };
    
    const logoutUser = () => {
        setUsuarioActivo(null);
        showToast('Sesión cerrada correctamente');
    };
    
    const registerUser = (newUser) => {
        setUsuarios(currentUsers => {
            // El rol por defecto 'cliente' ya debe estar asignado en Register.jsx, pero lo aseguramos
            const userWithDefaultRole = { ...newUser, rol: newUser.rol || 'cliente' }; 
            
            const updatedUsers = [...currentUsers, userWithDefaultRole];
            guardarLS('usuarios', updatedUsers);
            return updatedUsers;
        });
    };

    // --------------------------------------------------
    // Valor del Contexto
    // --------------------------------------------------

    const contextValue = {
        carrito,
        subtotal,
        total,
        totalItems,
        cuponAplicado,
        usuarioActivo,
        usuarios, 
        addToCart,
        changeQty,
        removeItem,
        applyCoupon,
        clearCoupon,
        doCheckout,
        loginUser,
        logoutUser,
        registerUser,
        showToast, 
        formatCLP, 
    };

    // 4. Retorna el Proveedor con el valor del contexto
    return (
        <CartContext.Provider value={contextValue}>
            {children}
            {/* Componente Toast */}
            {toastMessage && (
                <div id="mini-toast" style={{ position: 'fixed', right: '20px', bottom: '90px', background: 'rgba(46, 139, 87, 0.9)', color: '#fff', padding: '8px 12px', borderRadius: '6px', zIndex: 99999, fontSize: '0.95rem' }}>
                    {toastMessage}
                </div>
            )}
        </CartContext.Provider>
    );
};