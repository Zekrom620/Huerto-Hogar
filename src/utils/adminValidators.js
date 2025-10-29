// src/utils/adminValidators.js

// Función para validar el RUT/RUN Chileno
export function validarRUT(rut) {
    if (!rut) return true; // Asumimos que la obligatoriedad se maneja en el formulario
    return /^[0-9]{7,8}-[0-9kK]$/.test(rut);
}

// Función para validar el Correo Electrónico con dominios permitidos
export function validarCorreo(correo) {
    if (!correo) return true; 
    return /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);
}

// Función para validar la Contraseña (mínimo 6 caracteres)
export function validarPassword(pass) {
    if (!pass) return true; 
    return pass.length >= 6;
}

// Función para validar el Stock (número no negativo)
export function validarStock(stock) {
    // Convertimos a número solo si hay valor
    const numStock = Number(stock);
    if (stock === null || stock === undefined || stock === '') return true; 
    return !isNaN(numStock) && numStock >= 0;
}

// Función para validar el Precio (número positivo)
export function validarPrecio(precio) {
    // Convertimos a número solo si hay valor
    const numPrecio = Number(precio);
    if (precio === null || precio === undefined || precio === '') return true; 
    return !isNaN(numPrecio) && numPrecio > 0;
}

/**
 * Función centralizada para validar un objeto de formulario de producto o usuario.
 * @param {object} data - Objeto con los datos del formulario (ej: {run, correo, precio, stock}).
 * @returns {Array<string>} Lista de mensajes de error.
 */
export function validateAdminForm(data) {
    let errores = [];

    // Validaciones de Usuario/Comunes
    if (data.run && !validarRUT(data.run)) 
        errores.push("El RUN/RUT es inválido (ej: 12345678-9).");
    
    if (data.correo && !validarCorreo(data.correo)) 
        errores.push("Correo no permitido. Debe usar los dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    
    if (data.password && !validarPassword(data.password)) 
        errores.push("La contraseña debe tener un mínimo de 6 caracteres.");

    // Validaciones de Producto
    if (data.stock !== undefined && data.stock !== null && !validarStock(data.stock)) 
        errores.push("El Stock (kilos/unidades) debe ser un número válido o cero.");
        
    if (data.precio !== undefined && data.precio !== null && !validarPrecio(data.precio)) 
        errores.push("El Precio debe ser un número válido y positivo.");

    // NOTA: Otras validaciones específicas (ej: nombre, descripción requeridos) se harán en el componente.

    return errores;
}