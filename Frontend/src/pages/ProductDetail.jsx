import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// ELIMINADO: import { PRODUCTOS } from '../data/ProductsData'; 
import { useCart } from '../context/CartContext'; // Traemos 'productos' de la BD desde aquí
import ProductsGrid from '../components/products/ProductsGrid'; 
import { getProductoRandom } from '../utils/helpers'; 

// Función auxiliar ajustada para recibir la lista real de productos
const getProductRecommendations = (allProducts, currentProductId, count) => {
    const filtered = allProducts.filter(p => p.id !== currentProductId);
    return getProductoRandom(filtered, count);
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. Obtenemos 'productos' (la lista real de la BD) del contexto
    const { addToCart, formatCLP, productos } = useCart(); 

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Si la lista de productos aún no ha cargado desde el backend, esperamos
        if (productos.length === 0) return;

        setLoading(true);

        // 2. Buscamos en la lista real. 
        // IMPORTANTE: Usamos parseInt(id) porque la URL trae texto ("1") y la BD tiene números (1).
        const foundProduct = productos.find(p => p.id === parseInt(id));

        if (foundProduct) {
            setProduct(foundProduct);
            // Generamos recomendaciones usando la lista real
            setRecommendations(getProductRecommendations(productos, foundProduct.id, 5)); 
            setQuantity(1); 
            setLoading(false);
        } else {
            // Si no lo encuentra, vuelve al catálogo
            console.warn("Producto no encontrado en la BD con ID:", id);
            navigate('/productos'); 
            setLoading(false);
        }
    }, [id, navigate, productos]); // Agregamos 'productos' a las dependencias

    const handleAddToCart = () => {
        if (product) {
            addToCart(product.id, quantity);
        }
    };

    if (loading || !product) {
        return <main style={{padding: '50px', textAlign: 'center'}}>Cargando detalle del producto...</main>;
    }

    return (
        <main>
            <div className="detalle-container">
                {/* Imagen (Asegúrate que la ruta en BD empiece con /img/... o ajusta aquí) */}
                <img id="detalle-img" src={`/${product.imagen}`} alt={product.nombre} /> 

                <div className="info-producto">
                    <h2>
                        <span id="detalle-nombre">{product.nombre}</span>
                        <span id="detalle-precio" style={{ marginLeft: '15px' }}>
                            {formatCLP(product.precio)}
                        </span>
                    </h2>
                    <hr />

                    <p style={{ fontWeight: 'bold', color: 'var(--color-marron-titulo, #8B4513)' }}>
                        <span id="detalle-origen">Origen: {product.origen || 'Local'}</span> 
                    </p>
                    <hr />

                    <h3>Descripción del Producto:</h3>
                    <p id="detalle-descripcion" className="descripcion">{product.descripcion}</p>

                    <p style={{ marginTop: '15px', color: 'var(--color-texto-secundario)' }}>
                        *Consejo HuertoHogar: Revisa la sección de blogs para ideas de recetas.
                    </p>
                    <hr />

                    <div className="cantidad-agregar">
                        <input 
                            type="number" 
                            id="cantidad-producto" 
                            value={quantity} 
                            min="1" 
                            max={product.stock} 
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button className="agregar-carrito" onClick={handleAddToCart}>
                            Añadir al Carrito
                        </button>
                        {product.stock <= 5 && <p style={{ color: 'red', marginTop: '5px' }}>¡Últimas unidades! Stock: {product.stock}</p>}
                    </div>
                </div>
            </div>

            {recommendations.length > 0 && (
                <>
                    <h3>Otros Productos de la Cosecha</h3>
                    <div className="recomendaciones-detalle catalogo">
                        <ProductsGrid products={recommendations} />
                    </div>
                </>
            )}
        </main>
    );
}

export default ProductDetail;