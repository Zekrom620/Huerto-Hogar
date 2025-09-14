// ========== VALIDACIONES REGISTRO ========== //
// Arreglos regiones y comunas
const regiones = [
  { nombre: "Región Metropolitana", comunas: ["Santiago", "Puente Alto", "La Florida"] },
  { nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué"] },
  { nombre: "Región de Biobío", comunas: ["Concepción", "Chiguayante", "Coronel"] },
  // Agrega más si quieres
];

// Elementos del DOM
const form = document.getElementById('formRegistro');
const runInput = document.getElementById('run');
const nombreInput = document.getElementById('nombre');
const apellidosInput = document.getElementById('apellidos');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const fechaNacimientoInput = document.getElementById('fechaNacimiento');
const regionSelect = document.getElementById('region');
const comunaSelect = document.getElementById('comuna');
const direccionInput = document.getElementById('direccion');
const mensajeGeneral = document.getElementById('mensajeGeneral');

// Funciones para mostrar y limpiar mensajes
function mostrarError(input, mensaje) {
  const errorElement = document.getElementById(`error-${input.id}`);
  errorElement.textContent = mensaje;
  input.classList.add('input-error');
}

function limpiarError(input) {
  const errorElement = document.getElementById(`error-${input.id}`);
  errorElement.textContent = '';
  input.classList.remove('input-error');
}

function mostrarMensajeGeneral(mensaje, tipo) {
  mensajeGeneral.textContent = mensaje;
  mensajeGeneral.style.color = tipo === 'error' ? 'red' : 'green';
}

// Validaciones específicas
function validarRun(value) {
  const regexRun = /^[0-9]{7,8}[0-9Kk]$/;
  if (!value) return "El RUN es obligatorio.";
  if (value.length < 7 || value.length > 9) return "El RUN debe tener entre 7 y 9 caracteres.";
  if (!regexRun.test(value)) return "El RUN debe tener solo números y un dígito verificador (K o número). Sin puntos ni guion.";
  return "";
}

function validarNombre(value) {
  if (!value) return "El nombre es obligatorio.";
  if (value.length > 50) return "El nombre no puede exceder 50 caracteres.";
  return "";
}

function validarApellidos(value) {
  if (!value) return "Los apellidos son obligatorios.";
  if (value.length > 100) return "Los apellidos no pueden exceder 100 caracteres.";
  return "";
}

function validarEmail(value) {
  if (!value) return "El correo es obligatorio.";
  if (value.length > 100) return "El correo no puede exceder 100 caracteres.";
  const allowedDomains = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  const emailLower = value.toLowerCase();
  const valido = allowedDomains.some(domain => emailLower.endsWith(domain));
  if (!valido) return "El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(value)) return "El correo no tiene un formato válido.";
  return "";
}

function validarPassword(value) {
  if (!value) return "La contraseña es obligatoria.";
  if (value.length < 4 || value.length > 10) return "La contraseña debe tener entre 4 y 10 caracteres.";
  return "";
}

function validarRegion(value) {
  if (!value) return "La región es obligatoria.";
  return "";
}

function validarComuna(value) {
  if (!value) return "La comuna es obligatoria.";
  return "";
}

function validarDireccion(value) {
  if (!value) return "La dirección es obligatoria.";
  if (value.length > 300) return "La dirección no puede exceder 300 caracteres.";
  return "";
}

// Cargar regiones al select
function cargarRegiones() {
  regiones.forEach(r => {
    const option = document.createElement('option');
    option.value = r.nombre;
    option.textContent = r.nombre;
    regionSelect.appendChild(option);
  });
}

// Cargar comunas según región seleccionada
function cargarComunas(regionNombre) {
  comunaSelect.innerHTML = '<option value="">Seleccione comuna</option>';
  const region = regiones.find(r => r.nombre === regionNombre);
  if (region) {
    region.comunas.forEach(comuna => {
      const option = document.createElement('option');
      option.value = comuna;
      option.textContent = comuna;
      comunaSelect.appendChild(option);
    });
  }
}

// Validar campo específico y mostrar error o limpiar
function validarCampo(input, validarFuncion) {
  const error = validarFuncion(input.value.trim());
  if (error) {
    mostrarError(input, error);
    return false;
  } else {
    limpiarError(input);
    return true;
  }
}

// Validaciones en tiempo real
runInput.addEventListener('input', () => validarCampo(runInput, validarRun));
nombreInput.addEventListener('input', () => validarCampo(nombreInput, validarNombre));
apellidosInput.addEventListener('input', () => validarCampo(apellidosInput, validarApellidos));
emailInput.addEventListener('input', () => validarCampo(emailInput, validarEmail));
passwordInput.addEventListener('input', () => validarCampo(passwordInput, validarPassword));
regionSelect.addEventListener('change', () => {
  validarCampo(regionSelect, validarRegion);
  cargarComunas(regionSelect.value);
  limpiarError(comunaSelect);
  comunaSelect.value = '';
});
comunaSelect.addEventListener('change', () => validarCampo(comunaSelect, validarComuna));
direccionInput.addEventListener('input', () => validarCampo(direccionInput, validarDireccion));

// Al enviar formulario
form.addEventListener('submit', function(e) {
  e.preventDefault();

  let esValido = true;

  if(!validarCampo(runInput, validarRun)) esValido = false;
  if(!validarCampo(nombreInput, validarNombre)) esValido = false;
  if(!validarCampo(apellidosInput, validarApellidos)) esValido = false;
  if(!validarCampo(emailInput, validarEmail)) esValido = false;
  if(!validarCampo(passwordInput, validarPassword)) esValido = false;
  if(!validarCampo(regionSelect, validarRegion)) esValido = false;
  if(!validarCampo(comunaSelect, validarComuna)) esValido = false;
  if(!validarCampo(direccionInput, validarDireccion)) esValido = false;

  if (!esValido) {
    mostrarMensajeGeneral("Por favor corrige los errores antes de enviar.", "error");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  if (usuarios.some(u => u.email.toLowerCase() === emailInput.value.trim().toLowerCase())) {
    mostrarMensajeGeneral("Ya existe un usuario registrado con este correo.", "error");
    return;
  }

  const nuevoUsuario = {
    run: runInput.value.trim(),
    nombre: nombreInput.value.trim(),
    apellidos: apellidosInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    password: passwordInput.value.trim(),
    fechaNacimiento: fechaNacimientoInput.value || null,
    region: regionSelect.value,
    comuna: comunaSelect.value,
    direccion: direccionInput.value.trim(),
    tipoUsuario: "Cliente"
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  mostrarMensajeGeneral("¡Registro exitoso! Ya puedes iniciar sesión.", "success");
  form.reset();
  comunaSelect.innerHTML = '<option value="">Seleccione comuna</option>';
});

// Cargar regiones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarRegiones();
});

// Mostrar/ocultar contraseña
const toggleBtn = document.querySelector('.toggle-password');
if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const input = document.getElementById('password');
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    toggleBtn.textContent = type === 'password' ? '👁' : '🙈';
  });
}

