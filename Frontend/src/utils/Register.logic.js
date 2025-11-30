/**
 * @fileoverview Lógica Pura para el componente Register.jsx.
 * Contiene funciones sin dependencias de React Hooks o DOM, ideal para pruebas unitarias.
 * Las funciones se exponen globalmente bajo window.RegisterLogic.
 */

// Se define la variable global para evitar errores de redeclaración en el entorno global (window)
window.RegisterLogic = window.RegisterLogic || {};

// Constantes de Mapeo de Ubicación (Copiadas del componente Register.jsx para usarlas en las pruebas)
const USER_REGIONS = [
    "Santiago",
    "Viña del Mar / Valparaíso",
    "Concepción / Nacimiento",
    "Puerto Montt / Villarica",
];
const USER_COMUNAS_MAP = {
    "Santiago": [
        "Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "Ñuñoa", "Vitacura"
    ],
    "Viña del Mar / Valparaíso": [
        "Viña del Mar", "Valparaíso", "Quilpué", "Villa Alemana"
    ],
    "Concepción / Nacimiento": [
        "Concepción", "San Pedro de la Paz", "Talcahuano", "Nacimiento", "Los Ángeles"
    ],
    "Puerto Montt / Villarica": [
        "Puerto Montt", "Puerto Varas", "Villarrica", "Pucón", "Osorno"
    ]
};

/**
 * Función central de validación de datos del formulario de registro.
 * Esta función es pura: toma datos de entrada y devuelve una lista de errores (sin side-effects).
 * * @param {object} formData - Objeto con los datos del formulario (nombre, correo, contrasena, confirmar, region, comuna).
 * @param {Array<object>} usuariosExistentes - Lista de usuarios ya registrados (simulando usuarios.find).
 * @returns {Array<string>} Una lista de mensajes de error de validación.
 */
window.RegisterLogic.validateForm = function(formData, usuariosExistentes) {
    var newErrors = [];
    // Usamos var para las variables internas para evitar problemas de hoisting/scope con Jasmine
    var nombre = formData.nombre;
    var correo = formData.correo;
    var contrasena = formData.contrasena;
    var confirmar = formData.confirmar;
    var region = formData.region;
    var comuna = formData.comuna;
    var correoL = correo ? correo.trim().toLowerCase() : '';

    // 1. Validaciones de Nombre
    if (!nombre) {
        newErrors.push('Nombre es requerido.');
    } else if (nombre.length > 100) {
        newErrors.push('Nombre máximo 100 caracteres.');
    }

    // 2. Validaciones de Correo
    if (!correoL) {
        newErrors.push('Correo es requerido.');
    } else if (correoL.length > 100) {
        newErrors.push('Correo máximo 100 caracteres.');
    } else if (!/^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correoL)) {
        newErrors.push('Correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');
    } else if (usuariosExistentes && usuariosExistentes.some(function(u) {
        return u.correo.toLowerCase() === correoL;
    })) {
        newErrors.push('Ya existe un usuario con ese correo.');
    }

    // 3. Validaciones de Contraseña
    if (!contrasena) {
        newErrors.push('Contraseña requerida.');
    } else if (contrasena.length < 4 || contrasena.length > 10) {
        newErrors.push('Contraseña entre 4 y 10 caracteres.');
    }

    // 4. Validaciones de Confirmación
    if (contrasena !== confirmar) {
        newErrors.push('Las contraseñas no coinciden.');
    }

    // 5. Validaciones de Ubicación
    if (!region) {
        newErrors.push('Región es requerida.');
    }
    if (!comuna) {
        newErrors.push('Comuna es requerida.');
    }
    
    // 6. Validación de Comuna vs Región (Caso Borde)
    if (region && comuna) {
        var comunasValidas = USER_COMUNAS_MAP[region];
        if (comunasValidas && comunasValidas.indexOf(comuna) === -1) {
             newErrors.push('La comuna seleccionada no pertenece a la región.');
        }
    }


    return newErrors;
};