import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTOS } from '../../data/ProductsData'; // Importamos la lista de productos
import { useCart } from '../../context/CartContext'; // Para acceder a formatCLP

const AdminProducts = () => {
    // Obtenemos las utilidades necesarias
    const { formatCLP } = useCart(); 

    // Función de ejemplo para manejar la eliminación (simulada)
    const handleDelete = (productId) => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar el producto ${productId}? (Esta es una simulación)`)) {
            // Aquí iría la lógica real para eliminar el producto y actualizar el estado global.
            alert(`Producto ${productId} eliminado (simulación).`);
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
                {/* Comprobación de si hay productos para listar */}
                {PRODUCTOS.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>No hay productos registrados en el sistema.</p>
                ) : (
                    <table className="tabla-admin">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre del Producto</th>
                                <th>Precio (CLP)</th>
                                <th>Stock (Unid./Kg)</th>
                                <th>Origen</th>
                                <th>Categoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mapeamos la lista global de productos para crear las filas */}
                            {PRODUCTOS.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.nombre}</td>
                                    {/* Usamos la utilidad de formato CLP */}
                                    <td>{formatCLP(p.precio)}</td>
                                    <td>{p.stock}</td>
                                    <td>{p.origen}</td>
                                    <td>{p.categoria}</td>
                                    <td>
                                        {/* Enlace al formulario de edición con el ID del producto */}
                                        <Link 
                                            to={`/admin/productos/editar/${p.id}`} 
                                            className="btn-small"
                                        >
                                            Editar
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(p.id)} 
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