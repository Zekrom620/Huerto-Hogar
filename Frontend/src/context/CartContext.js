import React, { createContext, useContext, useState, useEffect } from 'react';
import { leerLS, guardarLS, formatCLP } from '../utils/helpers';

// --- SERVICIOS BACKEND (Movidos arriba para corregir el error) ---
import { 
    getAllProducts, 
    deleteProductAPI, 
    createProductAPI, 
    updateProductAPI 
} from '../services/ProductService';

import { 
    loginAPI, 
    registerAPI, 
    getAllUsersAPI, 
    deleteUserAPI,
    updateUserAPI 
} from '../services/UserService'; 

// --- CONSTANTES ---
// Definimos los Cupones aquí (después de los imports)
const CUPONES = {
    "CAMPO10": { valor: 10 },
    "VERANO20": { valor: 20 },
    "PROMO30": { valor: 30 }
};

// 1. Crea el Contexto
const CartContext = createContext();

// 2. Crea el Hook personalizado
export const useCart = () => useContext(CartContext);

// 3. Crea el Proveedor
export const CartProvider = ({ children }) => {
    // --- ESTADOS GLOBALES ---
    const [carrito, setCarrito] = useState(() => leerLS('carrito', []));
    const [cuponAplicado, setCuponAplicado] = useState(() => leerLS('cuponAplicado', null));
    const [usuarioActivo, setUsuarioActivo] = useState(() => leerLS('usuarioActivo', null));
    
    // CORRECCIÓN REGLA PROFESOR: 
    // Los usuarios NO deben persistir en localStorage. Inician vacíos.
    const [usuarios, setUsuarios] = useState([]); 
    
    const [toastMessage, setToastMessage] = useState(null);
    
    // Estado para guardar los productos que vienen de la Base de Datos
    const [dbProductos, setDbProductos] = useState([]);

    // --- EFECTOS (useEffect) ---

    // 1. Cargar productos desde el Backend al iniciar
    useEffect(() => {
        getAllProducts()
            .then(data => {
                console.log("Productos cargados del Backend:", data);
                if (Array.isArray(data)) {
                    setDbProductos(data);
                } else {
                    setDbProductos([]);
                }
            })
            .catch(err => console.error("Error cargando productos", err));
    }, []);

    // 2. Sincronizar con LocalStorage (SOLO lo permitido: Carrito y Sesión)
    useEffect(() => guardarLS('carrito', carrito), [carrito]);
    useEffect(() => guardarLS('cuponAplicado', cuponAplicado), [cuponAplicado]);
    useEffect(() => guardarLS('usuarioActivo', usuarioActivo), [usuarioActivo]);
    // ELIMINADO: guardarLS('usuarios', usuarios) -> Para cumplir la regla 3.

    // 3. Timer para el Toast (Mensajes emergentes)
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 1200);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // --- LÓGICA DEL CARRITO ---

    const calcTotalWithCoupon = (subtotal) => {
        if (!cuponAplicado) return subtotal;
        const c = CUPONES[cuponAplicado.codigo];
        if (c) {
            return Math.round(subtotal * (1 - c.valor / 100));
        }
        return subtotal;
    };

    const subtotal = carrito.reduce((s, it) => s + it.precio * it.qty, 0);
    const total = calcTotalWithCoupon(subtotal);
    const totalItems = carrito.reduce((s, it) => s + it.qty, 0);

    const showToast = (msg) => setToastMessage(msg);

    const addToCart = (id, cantidad = 1) => {
        const prod = dbProductos.find(p => p.id === id); 
        
        if (!prod) { console.warn('Producto no encontrado', id); return; }

        setCarrito(currentCart => {
            const idx = currentCart.findIndex(it => it.id === id);
            const newCart = [...currentCart];

            if (idx >= 0) {
                newCart[idx].qty += cantidad;
                if (newCart[idx].qty > prod.stock) newCart[idx].qty = prod.stock;
            } else {
                newCart.push({ 
                    id: prod.id, 
                    nombre: prod.nombre, 
                    precio: prod.precio, 
                    imagen: prod.imagen, 
                    qty: cantidad 
                });
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
        const c = CUPONES[normalizedCode]; // Usamos la constante local
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
            alert('Debes iniciar sesión para finalizar la compra.');
            return;
        }
        alert(`¡Gracias por tu compra, ${usuarioActivo.nombre}! Pedido procesado.`);
        setCarrito([]);
        setCuponAplicado(null);
        guardarLS('carrito', []);
        guardarLS('cuponAplicado', null);
    };

    // --- LÓGICA DE USUARIOS (AUTENTICACIÓN) ---

    const loginUser = async (credentials) => {
        try {
            const userFromDB = await loginAPI(credentials);
            if (!userFromDB) {
                throw new Error("Credenciales incorrectas");
            }
            setUsuarioActivo(userFromDB);
            showToast(`Bienvenido(a) ${userFromDB.nombre}`);
            
            // Si es admin, cargamos la lista de usuarios al momento del login
            if (userFromDB.rol === 'admin') {
                cargarUsuariosBD();
            }
            return userFromDB; 
        } catch (error) {
            console.error("Falló el login", error);
            throw new Error("Correo o contraseña incorrectos");
        }
    };
    
    const logoutUser = () => {
        setUsuarioActivo(null);
        setUsuarios([]); // Limpiamos la memoria por seguridad
        showToast('Sesión cerrada correctamente');
        guardarLS('usuarioActivo', null);
    };
    
    const registerUser = async (newUser) => {
        try {
            const createdUser = await registerAPI(newUser);
            if (!createdUser) throw new Error("No se pudo registrar");
            return true;
        } catch (error) {
            console.error("Falló el registro", error);
            throw error;
        }
    };

    // --- GESTIÓN DE USUARIOS (ADMIN) ---

    const cargarUsuariosBD = async () => {
        try {
            const data = await getAllUsersAPI();
            if (Array.isArray(data)) {
                setUsuarios(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const eliminarUsuarioBD = async (id) => {
        try {
            await deleteUserAPI(id);
            setUsuarios(prev => prev.filter(u => u.id !== id));
            showToast("Usuario eliminado correctamente");
            return true;
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar al usuario.");
            return false;
        }
    };

    const actualizarUsuarioBD = async (id, usuarioActualizado) => {
        try {
            const usuarioRetornado = await updateUserAPI(id, usuarioActualizado);
            // Actualizamos la lista local
            setUsuarios(prev => prev.map(u => u.id === id ? usuarioRetornado : u));
            showToast("Usuario actualizado correctamente");
            return true;
        } catch (error) {
            console.error(error);
            alert("No se pudo actualizar al usuario.");
            return false;
        }
    };

    // --- GESTIÓN DE PRODUCTOS (CRUD ADMIN) ---

    const eliminarProductoBD = async (id) => {
        try {
            await deleteProductAPI(id);
            setDbProductos(prev => prev.filter(p => p.id !== id));
            showToast("Producto eliminado correctamente");
            return true;
        } catch (error) {
            console.error("Error al eliminar", error);
            alert("No se pudo eliminar el producto.");
            return false;
        }
    };

    const crearProductoBD = async (nuevoProducto) => {
        try {
            const productoCreado = await createProductAPI(nuevoProducto);
            setDbProductos(prev => [...prev, productoCreado]);
            showToast("Producto creado exitosamente");
            return true;
        } catch (error) {
            console.error("Error al crear", error);
            return false;
        }
    };

    const actualizarProductoBD = async (id, productoActualizado) => {
        try {
            const productoRetornado = await updateProductAPI(id, productoActualizado);
            setDbProductos(prevLista => 
                prevLista.map(p => p.id === id ? productoRetornado : p)
            );
            showToast("Producto actualizado correctamente");
            return true;
        } catch (error) {
            console.error("Error al actualizar", error);
            alert("No se pudo actualizar el producto.");
            return false;
        }
    };

    // --- VALOR DEL CONTEXTO (EXPORTS) ---
    const contextValue = {
        // Estados
        carrito, subtotal, total, totalItems, 
        cuponAplicado, usuarioActivo, toastMessage,
        usuarios, 
        productos: dbProductos, 

        // Funciones Carrito
        addToCart, changeQty, removeItem, 
        applyCoupon, clearCoupon, doCheckout, showToast, formatCLP,

        // Funciones Auth
        loginUser, logoutUser, registerUser,

        // Funciones Admin Usuarios
        cargarUsuariosBD, eliminarUsuarioBD, actualizarUsuarioBD,

        // Funciones Admin Productos
        eliminarProductoBD, crearProductoBD, actualizarProductoBD
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
            {toastMessage && (
                <div id="mini-toast" style={{ position: 'fixed', right: '20px', bottom: '90px', background: 'rgba(46, 139, 87, 0.9)', color: '#fff', padding: '8px 12px', borderRadius: '6px', zIndex: 99999, fontSize: '0.95rem' }}>
                    {toastMessage}
                </div>
            )}
        </CartContext.Provider>
    );
};