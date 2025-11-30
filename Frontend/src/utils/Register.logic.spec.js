/**
 * @fileoverview Pruebas unitarias (Jasmine) para la lógica de validación de registro.
 * Usa las funciones expuestas en window.RegisterLogic.
 */

// Definición de data de prueba
var usuariosDePrueba = [
    { correo: 'existente@gmail.com', nombre: 'Test Ex' },
    { correo: 'admin@profesor.duoc.cl', nombre: 'Admin' }
];

// Datos de ubicación válidos (copiados de las constantes en el archivo .logic.js)
var datosUbicacionValida = {
    region: "Santiago",
    comuna: "Providencia"
};

describe("RegisterLogic.validateForm", function() {
    // Usamos la referencia global para la función
    var validateForm = window.RegisterLogic.validateForm;
    var baseDataValida = {
        nombre: 'Juan Perez',
        correo: 'juan.perez@duoc.cl',
        contrasena: 'clave123',
        confirmar: 'clave123',
        telefono: '912345678',
        region: datosUbicacionValida.region,
        comuna: datosUbicacionValida.comuna
    };

    // --- Test 1: Entrada Válida (Happy Path) ---
    it("debería devolver un array vacío (0 errores) si todos los campos son válidos y únicos", function() {
        var errors = validateForm(baseDataValida, usuariosDePrueba);
        expect(errors.length).toEqual(0);
    });
    
    // --- Test 2: Caso Nulo / Incorrecto (Campos Requeridos) ---
    it("debería detectar errores si los campos nombre, correo, contraseña, región y comuna están vacíos", function() {
        var dataInvalida = {
            nombre: '',
            correo: '',
            contrasena: '',
            confirmar: 'abc',
            region: '',
            comuna: ''
        };
        var errors = validateForm(dataInvalida, usuariosDePrueba);
        // Esperamos 6 errores: Nombre, Correo, Contraseña, Contraseñas no coinciden, Región, Comuna.
        expect(errors.length).toBeGreaterThan(5); 
        expect(errors).toContain('Nombre es requerido.');
        expect(errors).toContain('Contraseña requerida.');
        expect(errors).toContain('Correo es requerido.');
        expect(errors).toContain('Las contraseñas no coinciden.');
        expect(errors).toContain('Región es requerida.');
        expect(errors).toContain('Comuna es requerida.');
    });

    // --- Test 3: Correo Inválido / Duplicado ---
    it("debería detectar correo con dominio no permitido y correo duplicado", function() {
        var dataDominioInvalido = { ...baseDataValida, correo: 'invalido@hotmail.com' };
        var errors1 = validateForm(dataDominioInvalido, usuariosDePrueba);
        expect(errors1).toContain('Correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.');

        var dataDuplicada = { ...baseDataValida, correo: 'existente@gmail.com' };
        var errors2 = validateForm(dataDuplicada, usuariosDePrueba);
        expect(errors2).toContain('Ya existe un usuario con ese correo.');
    });
    
    // --- Test 4: Contraseña (Caso Borde: Longitud y Desigualdad) ---
    it("debería fallar si la contraseña es muy corta o no coincide con la confirmación", function() {
        var dataCorta = { ...baseDataValida, contrasena: '123', confirmar: '123' };
        var errors1 = validateForm(dataCorta, usuariosDePrueba);
        expect(errors1).toContain('Contraseña entre 4 y 10 caracteres.');

        var dataDesigual = { ...baseDataValida, contrasena: 'clave123', confirmar: 'clavediferente' };
        var errors2 = validateForm(dataDesigual, usuariosDePrueba);
        expect(errors2).toContain('Las contraseñas no coinciden.');
    });
    
    // --- Test 5: Caso Borde: Ubicación Inválida (Comuna que no pertenece a la Región) ---
    it("debería fallar si la comuna no pertenece a la región seleccionada", function() {
        var dataComunaInvalida = { 
            ...baseDataValida, 
            region: "Santiago", // Región Santiago
            comuna: "Quilpué"  // Comuna de Viña/Valparaíso
        };
        var errors = validateForm(dataComunaInvalida, usuariosDePrueba);
        expect(errors).toContain('La comuna seleccionada no pertenece a la región.');
    });
});