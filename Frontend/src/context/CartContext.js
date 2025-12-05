import React, { createContext, useContext, useState, useEffect } from 'react';
import { leerLS, guardarLS, formatCLP } from '../utils/helpers';

// --- SERVICIOS BACKEND ---
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

// CRÍTICO: Importamos el nuevo servicio de Checkout (Boletas)
import { finalizePurchaseAPI } from '../services/CheckoutService'; 


// --- CONSTANTES ---
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
    // usuarioActivo ahora almacena { token, id, nombre, rol, ... }
    const [usuarioActivo, setUsuarioActivo] = useState(() => leerLS('usuarioActivo', null)); 
    
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
    // CRÍTICO: Guarda el objeto completo de sesión (incluyendo el token)
    useEffect(() => guardarLS('usuarioActivo', usuarioActivo), [usuarioActivo]);

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
        const c = CUPONES[cuponAplicado.codigo]; // Usamos la constante local
        if (c) {
            return Math.round(subtotal * (1 - c.valor / 100));
        }
        return subtotal;
    };

    const subtotal = carrito.reduce((s, it) => s + it.precio * it.qty, 0);
    const total = calcTotalWithCoupon(subtotal);
    const totalItems = carrito.reduce((s, it) => s + it.qty, 0);

    const showToast = (msg) => setToastMessage(msg);

    // CRÍTICO: FUNCIÓN addToCart CORREGIDA PARA GARANTIZAR INMUTABILIDAD
    const addToCart = (id, cantidad = 1) => {
        const prod = dbProductos.find(p => p.id === id); 
        
        if (!prod) { console.warn('Producto no encontrado', id); return; }

        setCarrito(currentCart => {
            let updated = false; 
            
            // 1. Crear el nuevo carrito usando map para actualizar el item inmutablemente
            const newCart = currentCart.map(item => {
                if (item.id === id) {
                    updated = true;
                    // Lógica de adición y stock
                    let newQty = item.qty + cantidad;
                    if (newQty > prod.stock) newQty = prod.stock;
                    
                    // Devolver un objeto COMPLETAMENTE nuevo para el item
                    return { ...item, qty: newQty };
                }
                return item;
            });
            
            // 2. Si no se actualizó (es un producto nuevo), añadirlo al final
            if (!updated) {
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
    
    // CRÍTICO: Modificamos doCheckout para guardar la boleta en la BD
    const doCheckout = async () => { 
        if (!carrito.length) { showToast('Carrito vacío.'); return; }
        if (!usuarioActivo) {
            alert('Debes iniciar sesión para finalizar la compra.');
            return;
        }

        // 1. Preparamos el objeto Boleta para enviar al Backend
        const checkoutData = {
            userId: usuarioActivo.id, // ID del usuario logueado
            total: total, // Total calculado con descuento
            // Serializamos el carrito (array de productos) a un string JSON
            detalleProductos: JSON.stringify(carrito) 
        };

        try {
            // 2. Llamamos al Backend para guardar la boleta
            const boletaGuardada = await finalizePurchaseAPI(checkoutData); 
            
            showToast(`¡Compra #${boletaGuardada.id} procesada con éxito!`);

            // 3. Limpieza del estado local después de guardar en BD
            setCarrito([]);
            setCuponAplicado(null);
            guardarLS('carrito', []);
            guardarLS('cuponAplicado', null);

        } catch (error) {
            showToast('Error al procesar la compra. Intente más tarde.');
            console.error("Error en checkout:", error);
        }
    };

    // --- LÓGICA DE USUARIOS (AUTENTICACIÓN) ---

    const loginUser = async (credentials) => {
        try {
            // authResponse ahora es { token: '...', user: {...} }
            const authResponse = await loginAPI(credentials); 
            
            // Verificamos si el backend devolvió el token (login exitoso) o un error
            if (!authResponse || !authResponse.token || authResponse.error) {
                throw new Error("Credenciales incorrectas");
            }

            // CRÍTICO: Creamos el objeto de sesión que incluye el token para el servicio
            const sessionData = { 
                ...authResponse.user, 
                token: authResponse.token 
            };
            
            setUsuarioActivo(sessionData); // Guardamos en el estado de React
            // CRÍTICO: El localStorage debe guardar el token para la persistencia
            guardarLS('usuarioActivo', sessionData); 

            showToast(`Bienvenido(a) ${sessionData.nombre}`);
            
            // Si es admin, cargamos la lista de usuarios
            if (sessionData.rol === 'admin' || sessionData.rol === 'administrador') {
                cargarUsuariosBD();
            }
            return sessionData; 
        } catch (error) {
            console.error("Falló el login", error);
            throw new Error("Correo o contraseña incorrectos");
        }
    };
    
    const logoutUser = () => {
        setUsuarioActivo(null);
        setUsuarios([]); // Limpiamos la memoria por seguridad
        showToast('Sesión cerrada correctamente');
        // CRÍTICO: Limpiar el token de localStorage
        guardarLS('usuarioActivo', null); 
    };
    
    const registerUser = async (newUser) => {
        try {
            const createdUser = await registerAPI(newUser);
            
            // Si el Backend devuelve null, significa que el correo ya existe
            if (!createdUser || createdUser.error) { 
                 throw new Error("El correo ya está registrado en la base de datos.");
            }
            
            return true;
        } catch (error) {
            console.error("Falló el registro", error);
            throw error; 
        }
    };

    // --- GESTIÓN DE USUARIOS (ADMIN) ---

    const cargarUsuariosBD = async () => {
        try {
            // Esta llamada ahora usa el token JWT en el UserService
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
            // Esta llamada ahora usa el token JWT en el UserService
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
            // Esta llamada ahora usa el token JWT en el UserService
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
    // (Estas funciones deben modificarse en ProductService.js para usar el token si la ruta está protegida)

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