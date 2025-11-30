import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// *** NOTA IMPORTANTE ***: 
// Las funciones y data (PRODUCTOS, getRandomProducts, formatCLP) deben migrarse.
// Asumiremos que las funciones de utilidad están en un archivo aparte.

// ******************************************************************************
// PASO TEMPORAL: Definiendo datos y funciones aquí hasta que me envíes script.js
// ******************************************************************************
const PRODUCTOS = [
    { id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, imagen: '/img/Manzanas Fuji.jpg', origen: 'Valle del Maule' },
    { id: 'FR002', nombre: 'Naranjas Valencia', precio: 1000, imagen: '/img/Naranjas Valencia.jpg', origen: 'Origen Local' },
    { id: 'VR001', nombre: 'Zanahorias Orgánicas', precio: 900, imagen: '/img/Zanahorias Orgánicas.jpg', origen: "O'Higgins" },
    { id: 'PO001', nombre: 'Miel Orgánica', precio: 5000, imagen: '/img/Miel Orgánica.jpg', origen: 'Apicultores Locales' },
    // ... (Agrega el resto de tus productos aquí para que funcione la recomendación)
];

const formatCLP = (precio) => {
    return `$${precio.toLocaleString('es-CL')} CLP`;
};

function getRandomProducts(array, cantidad = 8) {
    const copia = [...array];
    const seleccion = [];
    for (let i = 0; i < cantidad && copia.length; i++) {
        const idx = Math.floor(Math.random() * copia.length);
        seleccion.push(copia[idx]);
        copia.splice(idx, 1);
    }
    return seleccion;
}
// ******************************************************************************


const RecommendedProducts = () => {
    // 1. Usamos 'useState' para almacenar la lista de productos a mostrar
    const [productosRecomendados, setProductosRecomendados] = useState([]);

    // 2. Usamos 'useEffect' para ejecutar la lógica de carga (similar a DOMContentLoaded)
    useEffect(() => {
        // Lógica de obtención y selección de productos
        if (PRODUCTOS.length > 0) {
            const seleccion = getRandomProducts(PRODUCTOS, 8);
            // 3. Actualizamos el estado, lo que hará que el componente se re-renderice
            setProductosRecomendados(seleccion);
        }
    }, []); // El array vacío [] asegura que esto se ejecute solo una vez al montar

    // 4. Función de manejo de eventos (en React, no necesitas 'data-id' y 'querySelector')
    const handleAddToCart = (productId) => {
        alert(`Producto ${productId} añadido al carrito (Lógica a implementar con Context/Redux)`);
    };

    return (
        <div className="recomendaciones catalogo">
            {/* 5. Mapeamos el array para renderizar el JSX */}
            {productosRecomendados.map(p => (
                <div key={p.id} className="producto-item card">
                    <img src={p.imagen} alt={p.nombre} loading="lazy" />
                    <p>{p.nombre}</p>
                    <p className="badge">{p.origen || 'Origen Local'}</p>
                    <p>{formatCLP(p.precio)}</p>
                    <div className="prod-buttons">
                        {/* 6. En React, pasamos la función directamente como prop 'onClick' */}
                        <button className="btn-agregar" onClick={() => handleAddToCart(p.id)}>
                            Añadir al carrito
                        </button>
                        <Link to={`/productos/${p.id}`} className="btn-ver-detalle">
                            Ver Producto
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecommendedProducts;