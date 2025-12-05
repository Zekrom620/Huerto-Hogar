// src/components/products/ProductsGrid.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 

// El componente recibe un array de productos como 'prop'
const ProductsGrid = ({ products }) => {
    // SOLO necesitamos formatCLP, ya que addToCart se elimina del flujo principal
    const { formatCLP } = useCart(); 

    return (
        // La clase 'catalogo' debería manejar el grid layout (CSS)
        <div className="catalogo"> 
            {products.map(p => (
                <div key={p.id} className="producto-item card">
                    
                    {/* CRÍTICO: RUTA DE IMAGEN ORIGINAL (No se toca) */}
                    <img src={p.imagen} alt={p.nombre} loading="lazy" /> 
                    
                    <p className="prod-nombre">{p.nombre}</p>
                    <p className="badge">{p.origen || 'Origen Local'}</p> 
                    <p className="prod-precio">{formatCLP(p.precio)}</p>
                    
                    <div className="prod-buttons" style={{ width: '100%' }}>
                        
                        {/* Mantenemos SOLAMENTE el botón Ver Producto */}
                        <Link 
                            to={`/detalle/${p.id}`} // RUTA CORRECTA: /detalle/:id
                            className="btn-ver-detalle btn" // Usamos ambas clases para asegurar el estilo
                            style={{ 
                                display: 'block', 
                                padding: '10px 0', 
                                textDecoration: 'none', 
                                textAlign: 'center',
                                width: '100%',
                                backgroundColor: 'var(--color-primario, #2E8B57)', // Diseño bonito
                                color: 'white',
                                borderRadius: '5px'
                            }}
                        >
                            Ver Producto
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductsGrid;