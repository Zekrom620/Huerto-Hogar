import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTOS } from '../data/ProductsData'; // Data de productos
import { useCart } from '../context/CartContext'; // Para el carrito y utilidades
import ProductsGrid from '../components/products/ProductsGrid'; // Para las recomendaciones
import { getProductoRandom } from '../utils/helpers'; // Para seleccionar productos aleatorios

// Función auxiliar para simular la selección de recomendaciones aleatorias
const getProductRecommendations = (currentProductId, count) => {
    // Filtramos el producto actual y luego seleccionamos aleatoriamente
    const filtered = PRODUCTOS.filter(p => p.id !== currentProductId);
    return getProductoRandom(filtered, count);
};

const ProductDetail = () => {
    // 1. Obtener el ID del producto de la URL (reemplazo de URLSearchParams)
    const { id } = useParams();
    const navigate = useNavigate();

    // Obtenemos funciones y formato del contexto
    const { addToCart, formatCLP } = useCart(); 

    // 2. Estados locales para la data (reemplazo de la manipulación del DOM)
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    // 3. useEffect para cargar la data (reemplazo de document.addEventListener('DOMContentLoaded', renderDetallePage))
    useEffect(() => {
        setLoading(true);
        const foundProduct = PRODUCTOS.find(p => p.id === id);

        if (foundProduct) {
            setProduct(foundProduct);
            setRecommendations(getProductRecommendations(id, 5)); 
            setQuantity(1); // Reiniciar cantidad al cambiar de producto
            setLoading(false);
        } else {
            // Producto no encontrado, redirigir a 404 o productos
            navigate('/productos'); 
            setLoading(false);
        }
    }, [id, navigate]); // Dependencia [id]: se re-ejecuta cuando el ID de la URL cambia

    // 4. Manejador de Añadir al Carrito (reemplazo del event listener en el botón '.agregar-carrito')
    const handleAddToCart = () => {
        if (product) {
            // La lógica de stock ya está parcialmente en el Contexto, pero la enviamos aquí
            addToCart(product.id, quantity);
            // Opcional: mantener la cantidad o resetear a 1
        }
    };

    if (loading || !product) {
        return <main style={{padding: '50px', textAlign: 'center'}}>Cargando detalle del producto...</main>;
    }

    // 5. Renderizado del componente (usando la data del estado)
    return (
        <main>
            <div className="detalle-container">
                {/* Imagen */}
                <img id="detalle-img" src={`/${product.imagen}`} alt={product.nombre} /> 

                <div className="info-producto">
                    <h2>
                        <span id="detalle-nombre">{product.nombre}</span>
                        <span id="detalle-precio" style={{ marginLeft: '15px' }}>
                            {formatCLP(product.precio)}
                        </span>
                    </h2>
                    <hr />

                    {/* Origen */}
                    <p style={{ fontWeight: 'bold', color: 'var(--color-marron-titulo, #8B4513)' }}>
                        <span id="detalle-origen">Origen: {product.origen || 'Local'}</span> 
                    </p>
                    <hr />

                    {/* Descripción */}
                    <h3>Descripción del Producto:</h3>
                    <p id="detalle-descripcion" className="descripcion">{product.descripcion}</p>

                    <p style={{ marginTop: '15px', color: 'var(--color-texto-secundario)' }}>
                        *Consejo HuertoHogar: Revisa la sección de blogs para ideas de recetas.
                    </p>
                    <hr />

                    {/* Cantidad y Botón de Carrito */}
                    <div className="cantidad-agregar">
                        <input 
                            type="number" 
                            id="cantidad-producto" 
                            value={quantity} 
                            min="1" 
                            max={product.stock} // Usamos el stock como máximo
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button className="agregar-carrito" onClick={handleAddToCart}>
                            Añadir al Carrito
                        </button>
                        {product.stock <= 5 && <p style={{ color: 'red', marginTop: '5px' }}>¡Últimas unidades! Stock: {product.stock}</p>}
                    </div>
                </div>
            </div>

            {/* Recomendaciones Aleatorias (reemplazo de renderRecomendacionesAleatorias) */}
            {recommendations.length > 0 && (
                <>
                    <h3>Otros Productos de la Cosecha</h3>
                    <div className="recomendaciones-detalle catalogo">
                         {/* Usamos el ProductsGrid que ya creamos en un layout de fila simple */}
                        <ProductsGrid products={recommendations} />
                    </div>
                </>
            )}
        </main>
    );
}

export default ProductDetail;