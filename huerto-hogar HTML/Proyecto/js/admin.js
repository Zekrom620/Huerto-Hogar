function validarRUT(rut) {
    // RUN Chileno (ej: 12345678-9)
    return /^[0-9]{7,8}-[0-9kK]$/.test(rut);
}

// Adaptado para usar la misma lista de dominios que en script.js
function validarCorreo(correo) {
    return /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);
}

function validarPassword(pass) {
    // La contraseña debe tener al menos 6 caracteres
    return pass.length >= 6;
}

function validarStock(stock) {
    // El stock (kilos/unidades de producto fresco) debe ser un número no negativo
    return !isNaN(stock) && Number(stock) >= 0;
}

function validarPrecio(precio) {
    // El precio debe ser un número positivo
    return !isNaN(precio) && Number(precio) > 0;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        // Se buscan los campos por su atributo 'name' para mayor seguridad en los formularios de admin
        const rut = document.querySelector('[name="run"]')?.value || ""; 
        const correo = document.querySelector('[name="correo"]')?.value || "";
        // Nota: El campo 'password' no está en los formularios que me enviaste, se mantiene la validación si se usa en React.
        const pass = document.getElementById("password")?.value || ""; 
        const stock = document.querySelector('[name="stock"]')?.value || "";
        const precio = document.querySelector('[name="precio"]')?.value || "";

        let errores = [];

        if (rut && !validarRUT(rut)) errores.push("El RUN/RUT es inválido (ej: 12345678-9).");
        if (correo && !validarCorreo(correo)) errores.push("Correo no permitido. Debe usar los dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.");
        if (pass && !validarPassword(pass)) errores.push("La contraseña debe tener un mínimo de 6 caracteres.");
        if (stock && !validarStock(stock)) errores.push("El Stock (kilos/unidades) debe ser un número válido o cero.");
        if (precio && !validarPrecio(precio)) errores.push("El Precio debe ser un número válido y positivo.");

        if (errores.length > 0) {
            e.preventDefault();
            // Mensaje de alerta adaptado a HuertoHogar
            alert("⚠️ Errores en la Gestión de HuertoHogar:\n- " + errores.join("\n- "));
        }
    });
});