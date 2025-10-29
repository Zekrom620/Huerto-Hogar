// src/components/products/ProductsGrid.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Para la función addToCart

// El componente recibe un array de productos como 'prop'
const ProductsGrid = ({ products }) => {
    const { addToCart, formatCLP } = useCart();

    return (
        // La clase 'catalogo' debería manejar el grid layout (CSS)
        <div className="catalogo"> 
            {products.map(p => (
                // Reemplazamos la creación de elementos DOM con JSX y la función 'map'
                <div key={p.id} className="producto-item card">
                    {/* Las rutas de imagen ya están ajustadas para apuntar a la carpeta 'public/img' */}
                    <img src={`/${p.imagen}`} alt={p.nombre} loading="lazy" />
                    <p className="prod-nombre">{p.nombre}</p>
                    <p className="badge">{p.origen || 'Origen Local'}</p> 
                    <p className="prod-precio">{formatCLP(p.precio)}</p>
                    <div className="prod-buttons">
                        {/* Reemplazamos el 'data-id' y el event listener global por un 'onClick' directo */}
                        <button 
                            className="btn-agregar" 
                            onClick={() => addToCart(p.id)}
                        >
                            Añadir al carrito
                        </button>
                        {/* Reemplazamos 'location.href = `detalle.html?id=${...}`' por 'Link' de React Router */}
                        <Link to={`/detalle/${p.id}`} className="btn-ver-detalle">
                            Ver Producto
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductsGrid;