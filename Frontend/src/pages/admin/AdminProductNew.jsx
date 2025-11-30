import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateAdminForm } from '../../utils/adminValidators'; 
import { useCart } from '../../context/CartContext'; 

// Opciones de categoría
const CATEGORY_OPTIONS = [
    { value: "frutas-frescas", label: "Frutas Frescas" },
    { value: "verduras-organicas", label: "Verduras Orgánicas" },
    { value: "productos-organicos", label: "Productos Orgánicos" },
    { value: "lacteos", label: "Productos Lácteos" },
];

const AdminProductNew = () => {
    const navigate = useNavigate();
    // 1. Extraemos la función REAL del contexto
    const { showToast, crearProductoBD } = useCart(); 
    
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        origen: '',
        descripcion: '',
        precio: '',
        stock: '',
        stockCritico: '', // Este campo no va al backend, solo es visual/validación
        categoria: '',
        imagen: null, 
    });

    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imagen' && files) {
            setFormData(prev => ({ ...prev, imagen: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- 1. VALIDACIONES ---
        const formValidationErrors = [];
        if (!formData.codigo) formValidationErrors.push("El Código es requerido.");
        if (formData.codigo.length < 3) formValidationErrors.push("El Código min 3 caracteres.");
        if (!formData.nombre) formValidationErrors.push("El Nombre es requerido.");
        if (!formData.origen) formValidationErrors.push("El Origen es requerido.");
        if (!formData.precio) formValidationErrors.push("El Precio es requerido.");
        if (!formData.stock) formValidationErrors.push("El Stock es requerido.");
        if (!formData.categoria) formValidationErrors.push("La Categoría es requerida.");

        const generalErrors = validateAdminForm({ 
            precio: formData.precio, 
            stock: formData.stock 
        });
        
        const allErrors = [...formValidationErrors, ...generalErrors];
        setErrors(allErrors);

        if (allErrors.length > 0) {
            showToast(`Error: ${allErrors.length} errores encontrados.`);
            return;
        }

        // --- 2. PREPARAR DATOS PARA EL BACKEND ---
        // Convertimos el archivo a un string de ruta (Truco para este proyecto)
        // Si el usuario subió "foto.jpg", guardamos "img/foto.jpg"
        let rutaImagen = "img/default.jpg"; // Imagen por defecto
        if (formData.imagen) {
            rutaImagen = `img/${formData.imagen.name}`;
        }

        const nuevoProducto = {
            codigo: formData.codigo.toUpperCase(),
            nombre: formData.nombre,
            origen: formData.origen,
            descripcion: formData.descripcion,
            // Convertimos a números para que Java no falle
            precio: parseInt(formData.precio),
            stock: parseInt(formData.stock),
            categoria: formData.categoria,
            imagen: rutaImagen 
        };

        // --- 3. GUARDAR EN BASE DE DATOS ---
        const exito = await crearProductoBD(nuevoProducto);

        if (exito) {
            // Navegar a la vista de listado tras un pequeño delay
            setTimeout(() => {
                navigate('/admin/productos');
            }, 800);
        } else {
            setErrors(["Hubo un error al guardar en el servidor."]);
        }
    };

    return (
        <>
            <header className="header">
                <h1>Agregar Nueva Cosecha</h1>
            </header>

            <form id="formProductoNuevo" className="formulario" onSubmit={handleSubmit}>
                
                {errors.length > 0 && (
                    <div className="error" style={{ marginBottom: '15px', color: 'red', border: '1px solid red', padding: '10px', borderRadius: '5px' }}>
                        <p><strong>⚠️ Errores:</strong></p>
                        <ul>{errors.map((err, index) => <li key={index}>{err}</li>)}</ul>
                    </div>
                )}

                <label>Código Producto (ID):</label>
                <input type="text" name="codigo" placeholder="Ej: FR001" required minLength="3" maxLength="20" value={formData.codigo} onChange={handleChange} />

                <label>Nombre:</label>
                <input type="text" name="nombre" placeholder="Ej: Manzanas Fuji" required maxLength="100" value={formData.nombre} onChange={handleChange} />
                
                <label>Origen del Producto:</label>
                <input type="text" name="origen" placeholder="Ej: Valle del Maule" required maxLength="100" value={formData.origen} onChange={handleChange} />

                <label>Descripción:</label>
                <textarea name="descripcion" placeholder="Detalle..." maxLength="500" value={formData.descripcion} onChange={handleChange}></textarea>

                <label>Precio (CLP):</label>
                <input type="number" name="precio" min="0" step="100" placeholder="1200" required value={formData.precio} onChange={handleChange} />

                <label>Stock (Unidades/Kilos):</label>
                <input type="number" name="stock" min="0" required value={formData.stock} onChange={handleChange} />

                <label>Stock Crítico:</label>
                <input type="number" name="stockCritico" min="0" placeholder="Nivel alerta" value={formData.stockCritico} onChange={handleChange} />

                <label>Categoría:</label>
                <select name="categoria" required value={formData.categoria} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {CATEGORY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>

                <label>Imagen:</label>
                <p style={{fontSize: '0.8rem', color: '#666'}}>* Asegúrate de copiar el archivo a la carpeta <b>public/img</b></p>
                <input type="file" name="imagen" accept="image/*" onChange={handleChange} />

                <button type="submit" className="btn">Guardar Cosecha</button>
            </form>
        </>
    );
};

export default AdminProductNew;