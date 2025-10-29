import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateAdminForm } from '../../utils/adminValidators'; 
import { useCart } from '../../context/CartContext'; // Para el toast y funciones de producto (si existieran)

// Opciones de categoría
const CATEGORY_OPTIONS = [
    { value: "frutas-frescas", label: "Frutas Frescas" },
    { value: "verduras-organicas", label: "Verduras Orgánicas" },
    { value: "productos-organicos", label: "Productos Orgánicos" },
    { value: "lacteos", label: "Productos Lácteos" },
];

const AdminProductNew = () => {
    const navigate = useNavigate();
    const { showToast } = useCart(); // Para mostrar mensajes
    
    // Estado inicial del formulario, reflejando los campos del HTML
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        origen: '',
        descripcion: '',
        precio: '',
        stock: '',
        stockCritico: '',
        categoria: '',
        imagen: null, // Para manejar el archivo
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        // Manejo especial para el input de tipo file
        if (name === 'imagen' && files) {
            setFormData(prev => ({ ...prev, imagen: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Validaciones
        const formValidationErrors = [];

        // Validaciones específicas del formulario (Requeridos, Longitud)
        if (!formData.codigo) formValidationErrors.push("El Código de Producto es requerido.");
        if (formData.codigo.length < 3) formValidationErrors.push("El Código debe tener al menos 3 caracteres.");
        if (!formData.nombre) formValidationErrors.push("El Nombre del Producto es requerido.");
        if (!formData.origen) formValidationErrors.push("El Origen del Producto es requerido.");
        if (!formData.precio) formValidationErrors.push("El Precio es requerido.");
        if (!formData.stock) formValidationErrors.push("El Stock es requerido.");
        if (!formData.categoria) formValidationErrors.push("La Categoría es requerida.");

        // Validaciones generales (Precio y Stock deben ser válidos, usando adminValidators)
        const generalErrors = validateAdminForm({ 
            precio: formData.precio, 
            stock: formData.stock 
        });
        
        const allErrors = [...formValidationErrors, ...generalErrors];

        setErrors(allErrors);

        if (allErrors.length > 0) {
            // Mostrar los errores con el toast o con un modal de admin
            showToast(`Error al guardar: ${allErrors.length} campo(s) inválido(s).`);
            return;
        }

        // 2. Simulación de Guardado
        // Aquí iría la lógica real para añadir el producto a la lista global (Contexto/Redux)
        const nuevoProducto = { ...formData, id: formData.codigo.toUpperCase() };
        console.log('Simulando guardado de nuevo producto:', nuevoProducto);

        // 3. Éxito y Redirección
        showToast(`Cosecha ${nuevoProducto.nombre} agregada con éxito.`);
        
        // Navegar a la vista de listado de productos
        setTimeout(() => {
            navigate('/admin/productos');
        }, 800);
    };

    return (
        <>
            <header className="header">
                <h1>Agregar Nueva Cosecha</h1>
            </header>

            <form id="formProductoNuevo" className="formulario" onSubmit={handleSubmit}>
                
                {/* Mostrar Errores */}
                {errors.length > 0 && (
                    <div className="error" style={{ marginBottom: '15px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>⚠️ Errores en la Gestión de HuertoHogar:</strong></p>
                        <ul>
                            {errors.map((err, index) => <li key={index}>{err}</li>)}
                        </ul>
                    </div>
                )}

                <label>Código Producto (ID):</label>
                <input type="text" name="codigo" placeholder="Ej: FR001 o VR001" required minLength="3" maxLength="20" value={formData.codigo} onChange={handleChange} />

                <label>Nombre:</label>
                <input type="text" name="nombre" placeholder="Ej: Manzanas Fuji" required maxLength="100" value={formData.nombre} onChange={handleChange} />
                
                <label>Origen del Producto:</label>
                <input type="text" name="origen" placeholder="Ej: Valle del Maule o Productores Locales" required maxLength="100" value={formData.origen} onChange={handleChange} />

                <label>Descripción:</label>
                <textarea name="descripcion" placeholder="Detalle de sabor, textura y uso." maxLength="500" value={formData.descripcion} onChange={handleChange}></textarea>

                <label>Precio (CLP):</label>
                <input type="number" name="precio" min="0" step="100" placeholder="1200" required value={formData.precio} onChange={handleChange} />

                <label>Stock (Unidades/Kilos):</label>
                <input type="number" name="stock" min="0" required value={formData.stock} onChange={handleChange} />

                <label>Stock Crítico:</label>
                <input type="number" name="stockCritico" min="0" placeholder="Nivel para generar alerta" value={formData.stockCritico} onChange={handleChange} />

                <label>Categoría:</label>
                <select name="categoria" required value={formData.categoria} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {CATEGORY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <label>Imagen:</label>
                {/* En producción, manejar el archivo implicaría subirlo a un servidor. Aquí solo capturamos el objeto File. */}
                <input type="file" name="imagen" accept="image/*" onChange={handleChange} />

                <button type="submit" className="btn">Guardar Cosecha</button>
            </form>
        </>
    );
};

export default AdminProductNew;