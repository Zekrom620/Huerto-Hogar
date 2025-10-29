import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; // Para redireccionar en React

const ShoppingCart = () => {
    // Usamos el hook useCart para acceder al estado y las funciones globales
    const { 
        carrito, 
        subtotal, 
        total, 
        totalItems, 
        cuponAplicado, 
        changeQty, 
        removeItem, 
        applyCoupon, 
        doCheckout,
        formatCLP 
    } = useCart();

    const navigate = useNavigate(); // Hook para la navegación
    const [couponCode, setCouponCode] = useState('');

    // Función para manejar el checkout con redirección (reemplaza el window.location.href en doCheckout de script.js)
    const handleCheckout = () => {
        // La lógica de validación (carrito vacío, usuario logueado) ya está en doCheckout del Contexto
        const success = doCheckout();

        // Aquí puedes añadir la redirección si el checkout es exitoso
        // Nota: La validación de usuario logueado en tu script original usaba 'confirm' y 'location.href'. 
        // La implementación del Contexto te mostrará un mensaje, pero si necesitas la redirección:
        // if (!usuarioActivo) { navigate('/login'); }
        // Si el checkout es exitoso (e.g., limpió el carrito), puedes redirigir a una página de "Gracias"
    };


    // Reemplazo de la función renderCarritoPage()
    const renderCartContent = () => {
        if (totalItems === 0) {
            return (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h2>Tu Cesta de Productos</h2>
                    <p>Tu carrito está vacío. ¡Añade productos frescos del campo!</p>
                    <button className="btn-primary" onClick={() => navigate('/productos')}>
                        Ir al Catálogo
                    </button>
                </div>
            );
        }

        return (
            <div id="cart-content">
                <h2>Tu Cesta de Productos</h2>
                <table className="tabla-carrito">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carrito.map(item => (
                            <tr key={item.id}>
                                <td style={{ textAlign: 'left', padding: '8px' }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        {/* La ruta de imagen se ajusta a la ubicación en public/img */}
                                        <img src={`/${item.imagen}`} alt={item.nombre} style={{ width: '64px', height: 'auto', borderRadius: '6px' }} />
                                        <div style={{ fontWeight: '600' }}>{item.nombre}</div>
                                    </div>
                                </td>
                                <td>{formatCLP(item.precio)}</td>
                                <td>
                                    {/* Los botones de cantidad usan changeQty del Contexto */}
                                    <button className="qty-decrease" onClick={() => changeQty(item.id, -1)}>-</button>
                                    <span className="qty-value">{item.qty}</span>
                                    <button className="qty-increase" onClick={() => changeQty(item.id, 1)}>+</button>
                                </td>
                                <td>{formatCLP(item.precio * item.qty)}</td>
                                <td>
                                    {/* El botón eliminar usa removeItem del Contexto */}
                                    <button className="remove-item" onClick={() => removeItem(item.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Resumen y Cupón (Migración de la lógica de Resumen) */}
                <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div><strong>Subtotal:</strong> {formatCLP(subtotal)}</div>

                        {/* Control de Cupón */}
                        <div>
                            <label htmlFor="coupon-code">Cupón:</label>
                            <input 
                                id="coupon-code" 
                                placeholder="Código (ej: CAMPO10)" 
                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
                                value={couponCode} // Conectamos el input al estado local
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button 
                                id="apply-coupon" 
                                style={{ padding: '6px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                                onClick={() => applyCoupon(couponCode)} // Ejecuta la función del Contexto
                            >
                                Aplicar
                            </button>
                            <div id="coupon-msg" style={{ marginTop: '6px', color: '#555' }}>
                                {cuponAplicado ? `Cupón ${cuponAplicado.codigo} aplicado (${cuponAplicado.descuento}% off)` : ''}
                            </div>
                        </div>

                        <div><strong>Total:</strong> <span id="total-final">{formatCLP(total)}</span></div>

                        {/* Botón de Finalizar Pedido */}
                        <div>
                            <button 
                                id="checkout-btn" 
                                className="btn-primary" 
                                style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                                onClick={handleCheckout} // Ejecuta la función del Contexto
                            >
                                Finalizar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Renderizado Final
    return (
        <main id="carrito-contenedor">
            {renderCartContent()}
        </main>
    );
}

export default ShoppingCart;