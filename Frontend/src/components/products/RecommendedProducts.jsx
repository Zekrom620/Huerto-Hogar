import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; 

// --- FUNCIÓN DE UTILIDAD: SELECCIÓN AL AZAR ---
const getRandomProducts = (array, cantidad = 4) => {
    if (!array || array.length === 0) return [];
    
    const copia = [...array];
    const seleccion = [];
    
    for (let i = 0; i < cantidad && copia.length > 0; i++) {
        const idx = Math.floor(Math.random() * copia.length);
        seleccion.push(copia[idx]);
        copia.splice(idx, 1); // Elimina el producto para que no se repita
    }
    return seleccion;
};

const RecommendedProducts = () => {
    // 1. Obtenemos los datos y funciones del Contexto Global
    const { productos, formatCLP } = useCart();
    const [productosRecomendados, setProductosRecomendados] = useState([]);
    
    // 2. Lógica para seleccionar productos al azar al cargar (usa datos de la API)
    useEffect(() => {
        if (productos.length > 0) {
            const seleccion = getRandomProducts(productos, 4); 
            setProductosRecomendados(seleccion);
        }
    }, [productos]); // Se ejecuta al cargar los productos en el contexto

    if (productosRecomendados.length === 0) {
        return <p style={{ textAlign: 'center', padding: '20px' }}>Cargando recomendaciones o no hay productos registrados...</p>;
    }

    return (
        <div className="recomendaciones catalogo">
            {productosRecomendados.map(p => (
                <div key={p.id} className="producto-item card">
                    
                    {/* CRÍTICO: RUTA DE IMAGEN ORIGINAL (p.imagen) */}
                    <img 
                        src={p.imagen} // CRÍTICO: Mantenemos la ruta simple para que funcione como lo hacía originalmente
                        alt={p.nombre} 
                        loading="lazy"
                        style={{ width: '100%', height: '180px', objectFit: 'cover'}}
                        // Usamos el mismo onError que tenías para el fallback
                        onError={(e) => { e.target.onerror = null; e.target.src="/img/Logo.png" }}
                    />
                    
                    <p>{p.nombre}</p>
                    <p className="badge">{p.origen || 'Origen Local'}</p>
                    <p>{formatCLP(p.precio)}</p>
                    
                    <div className="prod-buttons" style={{ display: 'flex', justifyContent: 'center' }}>
                        
                        {/* CRÍTICO: Solo el botón Ver Producto, ruta corregida a /detalle/:id */}
                        <Link 
                            to={`/detalle/${p.id}`} // Ruta correcta al detalle
                            className="btn-ver-detalle" // Clase de estilo original
                            style={{ 
                                display: 'block', 
                                padding: '10px 0', 
                                textDecoration: 'none', 
                                textAlign: 'center',
                                width: '100%',
                                backgroundColor: 'var(--color-primario, #2E8B57)', 
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

export default RecommendedProducts;