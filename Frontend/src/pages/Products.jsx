// src/pages/Products.jsx

import React, { useState } from 'react';
// ELIMINAMOS: import { PRODUCTOS } from '../data/ProductsData'; 
// AGREGAMOS: El hook del contexto para traer los datos reales
import { useCart } from '../context/CartContext'; 

import ProductsGrid from '../components/products/ProductsGrid'; 
import { getProductoRandom } from '../utils/helpers'; 

// TUS CATEGORÍAS ORIGINALES (Se mantienen intactas)
const CATEGORIES = [
    { id: 'todos', label: '🧺 Ver Todo' },
    { id: 'frutas-frescas', label: '🍎 Frutas Frescas' },
    { id: 'verduras-organicas', label: '🥬 Verduras Orgánicas' },
    { id: 'productos-organicos', label: '🍯 Otros Orgánicos' },
    { id: 'lacteos', label: '🥛 Productos Lácteos' },
];

const Products = () => {
    // 1. OBTENER DATOS REALES: Usamos el contexto en vez del archivo importado
    const { productos } = useCart(); 

    // 2. Estado para el filtro (Tu código original)
    const [activeCategory, setActiveCategory] = useState('todos');

    // 3. Lógica de Filtrado (Tu código original, pero usando 'productos' minúscula que viene de la BD)
    // Nota: Si 'productos' aún no carga (es array vacío), esto simplemente devolverá array vacío, sin errores.
    const productosFiltrados = productos.filter(p => {
        return activeCategory === 'todos' || p.categoria === activeCategory;
    });

    // 4. Manejador de eventos (Tu código original)
    const handleFilterChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <main>
            {/* Título Original */}
            <h2>Catálogo: Productos Frescos del Campo</h2>

            {/* Contenedor de Filtros (Tu diseño exacto con estilos en línea) */}
            <div id="filtros-categoria" style={{ 
                marginBottom: '30px', 
                textAlign: 'center', 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '10px', 
                flexWrap: 'wrap' 
            }}>
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat.id}
                        className={`btn-primary ${activeCategory === cat.id ? 'activo-filtro' : ''}`}
                        onClick={() => handleFilterChange(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Renderizar la lista (Tu estructura exacta) */}
            <section className="catalogo">
                {productosFiltrados.length > 0 ? (
                    <ProductsGrid products={productosFiltrados} />
                ) : (
                    // Mensaje original cuando no hay productos
                    <p style={{ textAlign: 'center' }}>Aún no tenemos productos en esta categoría.</p>
                )}
            </section>
        </main>
    );
}

export default Products;