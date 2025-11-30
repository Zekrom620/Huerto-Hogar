import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateAdminForm } from '../../utils/adminValidators'; 
// Usamos el contexto para obtener los datos REALES y la función de actualizar
import { useCart } from '../../context/CartContext';

// Opciones de categoría
const CATEGORY_OPTIONS = [
    { value: "frutas-frescas", label: "Frutas Frescas" },
    { value: "verduras-organicas", label: "Verduras Orgánicas" },
    { value: "productos-organicos", label: "Productos Orgánicos" },
    { value: "lacteos", label: "Productos Lácteos" },
];

const AdminProductEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // ID de la URL (String "1")
    
    // Extraemos productos (lista real) y la función actualizar
    const { showToast, productos, actualizarProductoBD } = useCart(); 
    
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        origen: '',
        descripcion: '',
        precio: '',
        stock: '',
        stockCritico: '',
        categoria: '',
        imagen: null, // Aquí guardaremos la RUTA (string) o el ARCHIVO (File)
    });
    
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. CARGAR DATOS
    useEffect(() => {
        // Si la lista de productos aun no carga del backend, esperamos
        if (productos.length === 0) return;

        // Buscamos usando parseInt porque el ID en BD es numérico
        const productToEdit = productos.find(p => p.id === parseInt(id));

        if (!productToEdit) {
            showToast(`Producto ID ${id} no encontrado.`);
            navigate('/admin/productos');
            return;
        }

        // Rellenamos el formulario con los datos de la BD
        setFormData({
            codigo: productToEdit.codigo || '',
            nombre: productToEdit.nombre || '',
            origen: productToEdit.origen || '',
            descripcion: productToEdit.descripcion || '',
            precio: productToEdit.precio,
            stock: productToEdit.stock,
            stockCritico: productToEdit.stockCritico || 0,
            categoria: productToEdit.categoria || '',
            imagen: productToEdit.imagen, // Ruta actual (ej: "img/manzana.jpg")
        });
        setLoading(false);

    }, [id, navigate, showToast, productos]); 

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'imagen' && files) {
            // Si sube nueva imagen, guardamos el archivo
            setFormData(prev => ({ ...prev, imagen: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- VALIDACIONES ---
        const formValidationErrors = [];
        if (!formData.nombre) formValidationErrors.push("El Nombre es requerido.");
        if (!formData.origen) formValidationErrors.push("El Origen es requerido.");
        if (!formData.precio) formValidationErrors.push("El Precio es requerido.");
        if (!formData.stock) formValidationErrors.push("El Stock es requerido.");
        if (!formData.categoria) formValidationErrors.push("La Categoría es requerida.");

        const generalErrors = validateAdminForm({ precio: formData.precio, stock: formData.stock });
        const allErrors = [...formValidationErrors, ...generalErrors];

        setErrors(allErrors);

        if (allErrors.length > 0) {
            showToast(`Error: ${allErrors.length} errores encontrados.`);
            return;
        }

        // --- PREPARAR DATOS ---
        // Lógica de Imagen:
        // Si formData.imagen es un objeto File (nueva subida) -> usamos su nombre
        // Si formData.imagen es un String (dato viejo) -> lo mantenemos
        let rutaImagen = formData.imagen; 

        if (formData.imagen && typeof formData.imagen === 'object') {
            // Es un archivo nuevo, simulamos la ruta
            rutaImagen = `img/${formData.imagen.name}`;
        }

        const productoActualizado = {
            codigo: formData.codigo, // El código no suele editarse, pero lo mandamos
            nombre: formData.nombre,
            origen: formData.origen,
            descripcion: formData.descripcion,
            precio: parseInt(formData.precio),
            stock: parseInt(formData.stock),
            categoria: formData.categoria,
            imagen: rutaImagen // Enviamos la ruta final
        };

        // --- ENVIAR AL BACKEND ---
        // Pasamos el ID numérico y el objeto
        const exito = await actualizarProductoBD(parseInt(id), productoActualizado);

        if (exito) {
            setTimeout(() => {
                navigate('/admin/productos');
            }, 800);
        }
    };

    if (loading) {
        return <main className="main" style={{ padding: '50px', textAlign:'center' }}>Cargando datos del producto...</main>;
    }

    return (
        <>
            <header className="header">
                <h1>Editar Producto: {formData.nombre}</h1>
            </header>

            <form id="formProductoEditar" className="formulario" onSubmit={handleSubmit}>
                
                {errors.length > 0 && (
                    <div className="error" style={{ marginBottom: '15px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>⚠️ Errores:</strong></p>
                        <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
                    </div>
                )}

                <label>Código Producto (No editable):</label>
                <input type="text" name="codigo" value={formData.codigo} readOnly disabled style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />

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
                {/* Mostramos el nombre de la imagen actual si es texto */}
                <p style={{ fontSize: '0.85em', color: '#666' }}>
                    Actual: {typeof formData.imagen === 'string' ? formData.imagen.split('/').pop() : 'Nueva seleccionada'}
                </p>
                <input type="file" name="imagen" accept="image/*" onChange={handleChange} />

                <button type="submit" className="btn">Guardar Cambios</button>
            </form>
        </>
    );
};

export default AdminProductEdit;