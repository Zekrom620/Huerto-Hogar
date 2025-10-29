// src/pages/Products.jsx

import React, { useState } from 'react';
import { PRODUCTOS } from '../data/ProductsData'; // Importamos la lista de productos
import ProductsGrid from '../components/products/ProductsGrid'; // Subcomponente para renderizar
import { getProductoRandom } from '../utils/helpers'; // Usamos la utilidad si necesitamos aleatorios

// Definición de las categorías para los botones de filtro
const CATEGORIES = [
    { id: 'todos', label: '🧺 Ver Todo' },
    { id: 'frutas-frescas', label: '🍎 Frutas Frescas' },
    { id: 'verduras-organicas', label: '🥬 Verduras Orgánicas' },
    { id: 'productos-organicos', label: '🍯 Otros Orgánicos' },
    { id: 'lacteos', label: '🥛 Productos Lácteos' },
];

const Products = () => {
    // 1. Estado para el filtro: 'useState' reemplaza la variable global de filtro y la clase 'activo-filtro'
    const [activeCategory, setActiveCategory] = useState('todos');

    // 2. Lógica de Filtrado (reemplaza la función 'renderProductosConFiltro')
    const productosFiltrados = PRODUCTOS.filter(p => {
        return activeCategory === 'todos' || p.categoria === activeCategory;
    });

    // 3. Manejador de eventos (reemplaza 'botonesFiltro.forEach(boton => { boton.addEventListener(...) })')
    const handleFilterChange = (category) => {
        setActiveCategory(category);
    };

    return (
        <main>
            <h2>Catálogo: Productos Frescos del Campo</h2>

            {/* Contenedor de Filtros (Reemplazo del div #filtros-categoria) */}
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
                        // 4. En React, usamos 'onClick' para manejar el evento
                        onClick={() => handleFilterChange(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* La clase activo-filtro probablemente no está definida en estilo.css, la definiremos 
                como un estilo global en CSS (ya importado en index.js) para que coincida con tu intención. 
                Si no está definida, puedes añadirla manualmente a 'src/assets/css/estilo.css': 
                .activo-filtro { background-color: #8B4513 !important; color: white !important; }
            */}

            {/* 5. Renderizar la lista de productos filtrados */}
            <section className="catalogo">
                {productosFiltrados.length > 0 ? (
                    // Componente ProductsGrid se encarga de dibujar cada item
                    <ProductsGrid products={productosFiltrados} />
                ) : (
                    <p style={{ textAlign: 'center' }}>Aún no tenemos productos en esta categoría.</p>
                )}
            </section>
        </main>
    );
}

export default Products;