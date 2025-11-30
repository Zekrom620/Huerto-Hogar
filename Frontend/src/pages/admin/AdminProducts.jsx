import React from 'react';
import { Link } from 'react-router-dom';
// ELIMINADO: import { PRODUCTOS } from '../../data/ProductsData';
// Ahora usamos el contexto para todo
import { useCart } from '../../context/CartContext'; 

const AdminProducts = () => {
    // 1. Obtenemos 'productos' (lista real) y la función de eliminar
    const { formatCLP, productos, eliminarProductoBD } = useCart(); 

    // Función REAL para eliminar
    const handleDelete = async (productId, productName) => {
        // Confirmación simple
        if (window.confirm(`¿Estás SEGURO de eliminar "${productName}"? Esto no se puede deshacer.`)) {
            // Llamamos a la función del contexto que conecta con Java
            await eliminarProductoBD(productId);
        }
    };

    return (
        <>
            <header className="header">
                <h1>Gestión de la Cosecha</h1>
                {/* Enlace al formulario de creación */}
                <Link to="/admin/productos/nuevo" className="btn">+ Agregar Producto Fresco</Link>
            </header>

            <section className="tabla-contenido">
                {/* Usamos 'productos' del contexto en vez de la variable estática */}
                {productos.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>
                        No hay productos registrados en el sistema o están cargando...
                    </p>
                ) : (
                    <table className="tabla-admin">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Código</th>
                                <th>Nombre del Producto</th>
                                <th>Precio (CLP)</th>
                                <th>Stock</th>
                                <th>Categoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mapeamos la lista REAL de la base de datos */}
                            {productos.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.codigo}</td>
                                    <td>{p.nombre}</td>
                                    <td>{formatCLP(p.precio)}</td>
                                    <td>{p.stock}</td>
                                    <td>{p.categoria}</td>
                                    <td>
                                        <Link 
                                            to={`/admin/productos/editar/${p.id}`} 
                                            className="btn-small"
                                        >
                                            Editar
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(p.id, p.nombre)} 
                                            className="btn-small btn-delete" 
                                            style={{ marginLeft: '8px' }}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </>
    );
};

export default AdminProducts;