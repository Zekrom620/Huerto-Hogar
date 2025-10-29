import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; 

const Contacto = () => {
    const { showToast } = useCart();

    // 1. Estado para manejar los campos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        mensaje: '',
    });

    // 2. Estado para manejar los errores de validación
    const [errors, setErrors] = useState([]);

    // Manejador genérico para inputs
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // 3. Función de Validación y Envío (Migración de setupContacto)
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = [];

        const { nombre, correo, mensaje } = formData;
        const correoL = correo.trim().toLowerCase();

        // Validaciones (basadas en tu script.js)
        if (!nombre.trim()) newErrors.push('Nombre requerido.');
        else if (nombre.length > 100) newErrors.push('Nombre máximo 100 caracteres.');

        if (correoL && correoL.length > 100) newErrors.push('Correo máximo 100 caracteres.');
        else if (correoL && !/^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correoL)) 
            newErrors.push('Correo inválido (dominios permitidos).');

        if (!mensaje.trim()) newErrors.push('Comentario requerido.');
        else if (mensaje.length > 500) newErrors.push('Comentario máximo 500 caracteres.');

        setErrors(newErrors);

        if (newErrors.length === 0) {
            // Si la validación pasa: Simular envío y mostrar toast
            console.log('Mensaje de contacto enviado:', formData);
            showToast('Gracias por contactarnos. Tu mensaje fue enviado.'); // Llama al toast

            // 4. Limpiar el formulario
            setFormData({ nombre: '', correo: '', mensaje: '' }); 
        }
    };

    // 5. Renderizado del Componente
    return (
        <main className="form-container" style={{ marginTop: 120, marginBottom: 120, marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="contacto-container">
                <form id="form-contacto" onSubmit={handleSubmit}>
                    <img src="/img/Logo.png" alt="Logo HuertoHogar" style={{ width: '80px', display: 'block', margin: '0 auto 10px auto' }} />
                    <h2>¿Tienes Preguntas sobre Nuestros Productos?</h2>
                    <p style={{ textAlign: 'center', color: 'var(--color-texto-secundario)' }}>
                        Contáctanos si necesitas información sobre tu pedido, el origen de un producto o para sugerencias.
                    </p>

                    {/* Visualización de Errores */}
                    {errors.length > 0 && (
                        <div className="error" style={{ marginBottom: '12px', padding: '10px', border: '1px solid red', color: 'red', borderRadius: '5px' }}>
                            {errors.map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </div>
                    )}

                    <input 
                        type="text" 
                        id="nombre" 
                        name="nombre" 
                        placeholder="Nombre completo *" 
                        required 
                        value={formData.nombre} 
                        onChange={handleChange}
                    />
                    <input 
                        type="email" 
                        id="correo" 
                        name="correo" 
                        placeholder="Correo electrónico *" 
                        required 
                        value={formData.correo} 
                        onChange={handleChange}
                    />
                    <textarea 
                        id="mensaje" 
                        name="mensaje" 
                        placeholder="Escribe tu mensaje aquí..." 
                        required
                        value={formData.mensaje}
                        onChange={handleChange}
                    ></textarea>

                    <button type="submit">ENVIAR CONSULTA</button>

                    {/* Información Adicional Estática */}
                    <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                        <h3 style={{ color: 'var(--color-marron-titulo, #8B4513)' }}>Información Adicional</h3>
                        <p style={{ marginBottom: '5px' }}>📞 **Teléfono:** +56 9 1234 5678</p>
                        <p>📧 **Email Soporte:** soporte@huertohogar.cl</p>
                        <p style={{ fontSize: '0.9em', color: 'var(--color-acento-verde)' }}>
                            Te responderemos en menos de 24 horas laborables.
                        </p>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Contacto;