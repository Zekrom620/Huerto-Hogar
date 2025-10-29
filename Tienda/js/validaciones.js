// Tienda/js/validaciones.js
// ===============================
// VALIDACIONES EN TIEMPO REAL
// Login, Registro, Contacto
// ===============================

// ------------------------------
// UTILIDADES (usadas por todas las vistas)
// ------------------------------
function mostrarError(campoId, mensaje) {
  const errorDiv = document.getElementById(`error-${campoId}`);
  if (errorDiv) errorDiv.textContent = mensaje;
}

function limpiarError(campoId) {
  const errorDiv = document.getElementById(`error-${campoId}`);
  if (errorDiv) errorDiv.textContent = "";
}

function validarCorreo(valor) {
  if (!valor) return false;
  const regex = /^[\w.-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return regex.test(valor.trim().toLowerCase());
}

function validarRun(valor) {
  if (!valor) return false;
  // 7-9 dígitos seguidos opcionalmente de un dígito o K/k
  const regex = /^\d{7,9}[0-9Kk]?$/;
  return regex.test(valor.trim());
}

// ===================================================
// LOGIN (tienda / iniciar-sesion.html)
// ===================================================
(function initLoginValidations() {
  const formLogin = document.getElementById("formLogin");
  if (!formLogin) return;

  const email = document.getElementById("emailLogin");
  const password = document.getElementById("passwordLogin");
  const mensajeGeneral = document.getElementById("mensajeGeneralLogin");

  // Input email
  email.addEventListener("input", () => {
    if (!email.value) {
      mostrarError("emailLogin", "El correo es obligatorio");
    } else if (email.value.length > 100) {
      mostrarError("emailLogin", "Máximo 100 caracteres");
    } else if (!validarCorreo(email.value)) {
      mostrarError("emailLogin", "Correo no válido (duoc/profesor.duoc/gmail)");
    } else {
      limpiarError("emailLogin");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Input password
  password.addEventListener("input", () => {
    if (!password.value) {
      mostrarError("passwordLogin", "La contraseña es obligatoria");
    } else if (password.value.length < 4 || password.value.length > 10) {
      mostrarError("passwordLogin", "Debe tener entre 4 y 10 caracteres");
    } else {
      limpiarError("passwordLogin");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Submit
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    email.dispatchEvent(new Event("input"));
    password.dispatchEvent(new Event("input"));

    const errores = document.querySelectorAll(".error-text");
    const hayErrores = Array.from(errores).some(el => el.textContent.trim() !== "");
    if (!hayErrores) {
      const ok = window.hh && window.hh.iniciarSesion
        ? window.hh.iniciarSesion(email.value, password.value)
        : false;
      if (!ok) {
        if (mensajeGeneral) mensajeGeneral.textContent = "Correo o contraseña incorrectos";
      }
    }
  });
})();

// ===================================================
// REGISTRO (tienda / registro.html)
// ===================================================
(function initRegistroValidations() {
  const formRegistro = document.getElementById("formRegistro");
  if (!formRegistro) return;

  const run = document.getElementById("run");
  const nombre = document.getElementById("nombre");
  const apellidos = document.getElementById("apellidos");
  const email = document.getElementById("email");
  const region = document.getElementById("region");
  const comuna = document.getElementById("comuna");
  const direccion = document.getElementById("direccion");
  const password = document.getElementById("password");
  const mensajeGeneral = document.getElementById("mensajeGeneral");

  // RUN
  run.addEventListener("input", () => {
    if (!run.value) {
      mostrarError("run", "El RUN es obligatorio");
    } else if (!validarRun(run.value)) {
      mostrarError("run", "El RUN debe tener 7-9 dígitos y opcional dígito verificador (0-9 o K)");
    } else {
      limpiarError("run");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Nombre
  nombre.addEventListener("input", () => {
    if (!nombre.value.trim()) {
      mostrarError("nombre", "El nombre es obligatorio");
    } else if (nombre.value.trim().length > 50) {
      mostrarError("nombre", "Máximo 50 caracteres");
    } else {
      limpiarError("nombre");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Apellidos
  apellidos.addEventListener("input", () => {
    if (!apellidos.value.trim()) {
      mostrarError("apellidos", "Los apellidos son obligatorios");
    } else if (apellidos.value.trim().length > 100) {
      mostrarError("apellidos", "Máximo 100 caracteres");
    } else {
      limpiarError("apellidos");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Email
  email.addEventListener("input", () => {
    if (!email.value) {
      mostrarError("email", "El correo es obligatorio");
    } else if (email.value.length > 100) {
      mostrarError("email", "Máximo 100 caracteres");
    } else if (!validarCorreo(email.value)) {
      mostrarError("email", "Correo no válido (solo duoc.cl, profesor.duoc.cl o gmail.com)");
    } else {
      limpiarError("email");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Region
  region.addEventListener("change", () => {
    if (!region.value) {
      mostrarError("region", "Debe seleccionar una región");
    } else {
      limpiarError("region");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Comuna
  comuna.addEventListener("change", () => {
    if (!comuna.value) {
      mostrarError("comuna", "Debe seleccionar una comuna");
    } else {
      limpiarError("comuna");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Dirección
  direccion.addEventListener("input", () => {
    if (!direccion.value.trim()) {
      mostrarError("direccion", "La dirección es obligatoria");
    } else if (direccion.value.trim().length > 300) {
      mostrarError("direccion", "Máximo 300 caracteres");
    } else {
      limpiarError("direccion");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Password
  password.addEventListener("input", () => {
    if (!password.value) {
      mostrarError("password", "La contraseña es obligatoria");
    } else if (password.value.length < 4 || password.value.length > 10) {
      mostrarError("password", "Debe tener entre 4 y 10 caracteres");
    } else {
      limpiarError("password");
    }
    if (mensajeGeneral) mensajeGeneral.textContent = "";
  });

  // Submit registro
  formRegistro.addEventListener("submit", (e) => {
    e.preventDefault();

    run.dispatchEvent(new Event("input"));
    nombre.dispatchEvent(new Event("input"));
    apellidos.dispatchEvent(new Event("input"));
    email.dispatchEvent(new Event("input"));

    if (!region.value) {
      mostrarError("region", "Debe seleccionar una región");
    } else {
      limpiarError("region");
    }
    if (!comuna.value) {
      mostrarError("comuna", "Debe seleccionar una comuna");
    } else {
      limpiarError("comuna");
    }

    direccion.dispatchEvent(new Event("input"));
    password.dispatchEvent(new Event("input"));

    const errores = document.querySelectorAll(".error-text");
    const hayErrores = Array.from(errores).some(el => el.textContent.trim() !== "");
    if (hayErrores) {
      return;
    }

    const datosUsuario = {
      run: run.value.trim(),
      nombre: nombre.value.trim(),
      apellidos: apellidos.value.trim(),
      email: email.value.trim(),
      password: password.value,
      direccion: direccion.value.trim(),
      region: region.value,
      comuna: comuna.value,
      fechaNacimiento: document.getElementById("fechaNacimiento")
        ? document.getElementById("fechaNacimiento").value
        : ""
    };

    const resultado = window.hh && window.hh.registrarUsuario
      ? window.hh.registrarUsuario(datosUsuario)
      : { ok: false, mensaje: "Función de registro no disponible." };

    if (resultado.ok) {
      if (mensajeGeneral) {
        mensajeGeneral.textContent = resultado.mensaje;
        mensajeGeneral.classList.remove('error');
        mensajeGeneral.classList.add('success');
      }

      formRegistro.reset();

      const regionSelect = document.getElementById("region");
      const comunaSelect = document.getElementById("comuna");
      if (regionSelect) {
        const opt = regionSelect.querySelector('option[value=""]');
        if (opt) opt.selected = true;
        else regionSelect.selectedIndex = 0;
      }
      if (comunaSelect) {
        comunaSelect.innerHTML = '';
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "Seleccione región primero";
        placeholder.disabled = true;
        placeholder.selected = true;
        comunaSelect.appendChild(placeholder);
      }
    } else {
      if (mensajeGeneral) {
        mensajeGeneral.textContent = resultado.mensaje || 'Error en registro';
        mensajeGeneral.classList.remove('success');
        mensajeGeneral.classList.add('error');
      }
    }
  });
})();

// ===================================================
// CONTACTO (tienda / contacto.html)
// ===================================================
(function initContactoValidations() {
  const formContacto = document.getElementById("formContacto");
  if (!formContacto) return;

  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const comentario = document.getElementById("comentario");
  const mensajeError = document.getElementById("mensajeError");
  const mensajeExito = document.getElementById("mensajeExito");

  // Nombre
  nombre.addEventListener("input", () => {
    if (!nombre.value.trim()) {
      mostrarError("nombre", "El nombre es obligatorio");
    } else if (nombre.value.trim().length > 100) {
      mostrarError("nombre", "Máximo 100 caracteres");
    } else {
      limpiarError("nombre");
    }
    mensajeError.textContent = "";
  });

  // Correo
  correo.addEventListener("input", () => {
    if (!correo.value.trim()) {
      mostrarError("correo", "El correo es obligatorio");
    } else if (correo.value.trim().length > 100) {
      mostrarError("correo", "Máximo 100 caracteres");
    } else if (!validarCorreo(correo.value)) {
      mostrarError("correo", "Correo no válido (solo duoc.cl, profesor.duoc.cl o gmail.com)");
    } else {
      limpiarError("correo");
    }
    mensajeError.textContent = "";
  });

  // Comentario
  comentario.addEventListener("input", () => {
    if (!comentario.value.trim()) {
      mostrarError("comentario", "El comentario es obligatorio");
    } else if (comentario.value.trim().length > 500) {
      mostrarError("comentario", "Máximo 500 caracteres");
    } else {
      limpiarError("comentario");
    }
    mensajeError.textContent = "";
  });

  // Submit
  formContacto.addEventListener("submit", (e) => {
    e.preventDefault();

    nombre.dispatchEvent(new Event("input"));
    correo.dispatchEvent(new Event("input"));
    comentario.dispatchEvent(new Event("input"));

    const errores = document.querySelectorAll(".mensaje-error");
    const hayErrores = Array.from(errores).some(el => el.textContent.trim() !== "");
    if (hayErrores) {
      mensajeExito.textContent = "";
      mensajeError.textContent = "Por favor, corrige los errores antes de enviar.";
      return;
    }

    // Guardar en localStorage
    const mensaje = {
      nombre: nombre.value.trim(),
      correo: correo.value.trim().toLowerCase(),
      comentario: comentario.value.trim(),
      fecha: new Date().toISOString()
    };

    const LS_KEY = "hh_mensajes_contacto";
    const mensajesGuardados = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    mensajesGuardados.push(mensaje);
    localStorage.setItem(LS_KEY, JSON.stringify(mensajesGuardados));

    // Feedback al usuario
    mensajeError.textContent = "";
    mensajeExito.textContent = "Mensaje enviado correctamente. ¡Gracias por contactarnos!";

    // Reset form
    formContacto.reset();
  });
})();


// ===================================================
// PRODUCTOS Y DETALLE PRODUCTO  (VISTA DINAMICA)
// ===================================================

// tienda/js/productos.js
const productos = [
  {
    id: "FR001",
    nombre: "Manzanas Fuji",
    precio: 1200,
    unidad: "kg",
    stock: 150,
    categoria: "Frutas Frescas",
    descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres.",
    imagen: "../assets/img/manzanas-fuji.jpg"
  },
  {
    id: "FR002",
    nombre: "Naranjas Valencia",
    precio: 1000,
    unidad: "kg",
    stock: 200,
    categoria: "Frutas Frescas",
    descripcion: "Naranjas Valencia jugosas y dulces, ricas en vitamina C.",
    imagen: "../assets/img/naranjas-valencia.jpg"
  },
  {
    id: "FR003",
    nombre: "Plátanos Cavendish",
    precio: 800,
    unidad: "kg",
    stock: 180,
    categoria: "Frutas Frescas",
    descripcion: "Plátanos Cavendish maduros, ideales para batidos y postres.",
    imagen: "../assets/img/platanos-cavendish.jpg"
  },
  {
    id: "VR001",
    nombre: "Zanahorias Orgánicas",
    precio: 900,
    unidad: "kg",
    stock: 100,
    categoria: "Verduras Orgánicas",
    descripcion: "Zanahorias frescas, 100% orgánicas y libres de pesticidas.",
    imagen: "../assets/img/zanahorias-organicas.jpg"
  },
  {
    id: "VR002",
    nombre: "Espinacas Frescas",
    precio: 700,
    unidad: "bolsa 500g",
    stock: 80,
    categoria: "Verduras Orgánicas",
    descripcion: "Espinacas frescas, ricas en hierro y vitaminas.",
    imagen: "../assets/img/espinacas.jpg"
  },
  {
    id: "VR003",
    nombre: "Pimientos Tricolores",
    precio: 1500,
    unidad: "kg",
    stock: 70,
    categoria: "Verduras Orgánicas",
    descripcion: "Pimientos rojos, verdes y amarillos, ideales para ensaladas.",
    imagen: "../assets/img/pimientos-tricolores.jpg"
  },
  {
    id: "PO001",
    nombre: "Miel Orgánica",
    precio: 5000,
    unidad: "frasco",
    stock: 50,
    categoria: "Productos Orgánicos",
    descripcion: "Miel pura, sin aditivos, cosechada de colmenas sustentables.",
    imagen: "../assets/img/miel-organica.jpg"
  },
  {
    id: "PO003",
    nombre: "Quinua Orgánica",
    precio: 3000,
    unidad: "bolsa",
    stock: 60,
    categoria: "Productos Orgánicos",
    descripcion: "Quinua orgánica rica en proteínas y fibra.",
    imagen: "../assets/img/quinua-organica.jpg"
  },
  {
    id: "PL001",
    nombre: "Leche Entera",
    precio: 1200,
    unidad: "litro",
    stock: 90,
    categoria: "Productos Lácteos",
    descripcion: "Leche entera fresca, nutritiva y de producción local.",
    imagen: "../assets/img/leche-entera.jpg"
  }
];
