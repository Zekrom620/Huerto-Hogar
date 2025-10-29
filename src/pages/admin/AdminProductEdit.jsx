import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateAdminForm } from '../../utils/adminValidators'; 
import { useCart } from '../../context/CartContext';
import { PRODUCTOS } from '../../data/ProductsData'; // Importamos la fuente de datos

// Opciones de categoría
const CATEGORY_OPTIONS = [
    { value: "frutas-frescas", label: "Frutas Frescas" },
    { value: "verduras-organicas", label: "Verduras Orgánicas" },
    { value: "productos-organicos", label: "Productos Orgánicos" },
    { value: "lacteos", label: "Productos Lácteos" },
];

const AdminProductEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // 1. Obtener el ID del producto de la URL
    const { showToast } = useCart();
    
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        origen: '',
        descripcion: '',
        precio: '',
        stock: '',
        stockCritico: '',
        categoria: '',
        imagen: null, 
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. useEffect para cargar los datos del producto al montar el componente
    useEffect(() => {
        const productToEdit = PRODUCTOS.find(p => p.id === id);

        if (!productToEdit) {
            showToast(`Producto ${id} no encontrado.`);
            navigate('/admin/productos');
            return;
        }

        // 3. Rellenar el estado con los datos existentes
        setFormData({
            codigo: productToEdit.id || '',
            nombre: productToEdit.nombre || '',
            origen: productToEdit.origen || '',
            descripcion: productToEdit.descripcion || '',
            precio: productToEdit.precio,
            stock: productToEdit.stock,
            stockCritico: productToEdit.stockCritico || 0, // Asumimos 0 si no existe
            categoria: productToEdit.categoria || '',
            imagen: productToEdit.imagen, // Aquí solo guardamos la referencia/ruta de la imagen actual
        });
        setLoading(false);
    }, [id, navigate, showToast]); // Se ejecuta al cambiar el ID de la URL

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'imagen' && files) {
            setFormData(prev => ({ ...prev, imagen: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 4. Validaciones
        const formValidationErrors = [];

        // Validaciones específicas del formulario (Requeridos, Longitud)
        if (!formData.nombre) formValidationErrors.push("El Nombre del Producto es requerido.");
        if (!formData.origen) formValidationErrors.push("El Origen del Producto es requerido.");
        if (!formData.precio) formValidationErrors.push("El Precio es requerido.");
        if (!formData.stock) formValidationErrors.push("El Stock es requerido.");
        if (!formData.categoria) formValidationErrors.push("La Categoría es requerida.");

        // Validaciones generales (Precio y Stock deben ser válidos)
        const generalErrors = validateAdminForm({ precio: formData.precio, stock: formData.stock });
        
        const allErrors = [...formValidationErrors, ...generalErrors];

        setErrors(allErrors);

        if (allErrors.length > 0) {
            showToast(`Error al actualizar: ${allErrors.length} campo(s) inválido(s).`);
            return;
        }

        // 5. Simulación de Actualización
        // Aquí iría la lógica real para encontrar y actualizar el producto en la lista global (Contexto/Redux)
        const productoActualizado = { ...formData, id: id };
        console.log('Simulando actualización de producto:', productoActualizado);

        // 6. Éxito y Redirección
        showToast(`Cosecha ${productoActualizado.nombre} (${id}) actualizada con éxito.`);
        
        setTimeout(() => {
            navigate('/admin/productos');
        }, 800);
    };

    if (loading) {
        return <main className="main" style={{ padding: '50px' }}>Cargando datos del producto...</main>;
    }

    return (
        <>
            <header className="header">
                <h1>Editar Producto de la Cosecha: {formData.nombre}</h1>
            </header>

            <form id="formProductoEditar" className="formulario" onSubmit={handleSubmit}>
                
                {/* Mostrar Errores */}
                {errors.length > 0 && (
                    <div className="error" style={{ marginBottom: '15px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>⚠️ Errores de Validación:</strong></p>
                        <ul>
                            {errors.map((err, index) => <li key={index}>{err}</li>)}
                        </ul>
                    </div>
                )}

                <label>Código Producto (ID):</label>
                {/* El campo ID es de solo lectura (readonly) */}
                <input type="text" name="codigo" value={formData.codigo} readOnly required disabled style={{ backgroundColor: '#f0f0f0' }} />

                <label>Nombre:</label>
                <input type="text" name="nombre" required maxLength="100" value={formData.nombre} onChange={handleChange} />
                
                <label>Origen del Producto:</label>
                <input type="text" name="origen" required maxLength="100" value={formData.origen} onChange={handleChange} />

                <label>Descripción:</label>
                <textarea name="descripcion" maxLength="500" value={formData.descripcion} onChange={handleChange}></textarea>

                <label>Precio (CLP):</label>
                <input type="number" name="precio" min="0" step="100" required value={formData.precio} onChange={handleChange} />

                <label>Stock (Unidades/Kilos):</label>
                <input type="number" name="stock" min="0" required value={formData.stock} onChange={handleChange} />

                <label>Stock Crítico:</label>
                <input type="number" name="stockCritico" min="0" value={formData.stockCritico} onChange={handleChange} />

                <label>Categoría:</label>
                <select name="categoria" required value={formData.categoria} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {CATEGORY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <label>Imagen:</label>
                {/* Aquí podrías mostrar la imagen actual (formData.imagen) */}
                <p style={{ fontSize: '0.85em', color: '#666' }}>Imagen actual: {formData.imagen ? formData.imagen.split('/').pop() : 'No cargada'}</p>
                <input type="file" name="imagen" accept="image/*" onChange={handleChange} />

                <button type="submit" className="btn">Actualizar Cosecha</button>
            </form>
        </>
    );
};

export default AdminProductEdit;