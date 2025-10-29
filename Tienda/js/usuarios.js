// Tienda/js/usuarios.js
// Gestión de usuarios: login + registro + utilidades
// Usa localStorage con las claves:
//   - 'hh_usuarios' para la lista de usuarios
//   - 'hh_sesion' para la sesión activa

(function () {
  const LS_KEY_USUARIOS = 'hh_usuarios';
  const LS_KEY_SESION = 'hh_sesion';

  // ----------------------
  // USUARIOS INICIALES
  // ----------------------
  const usuariosIniciales = [
    {
      run: "19011022K",
      nombre: "Juan",
      apellidos: "Pérez Soto",
      correo: "admin@duoc.cl",
      contrasena: "1234",
      tipoUsuario: "Administrador",
      direccion: "Santiago Centro",
      region: "Región Metropolitana",
      comuna: "Santiago"
    },
    {
      run: "20111033K",
      nombre: "María",
      apellidos: "González Díaz",
      correo: "cliente@gmail.com",
      contrasena: "abcd",
      tipoUsuario: "Cliente",
      direccion: "Viña del Mar",
      region: "Valparaíso",
      comuna: "Viña del Mar"
    },
    {
      run: "18100977K",
      nombre: "Pedro",
      apellidos: "López Ruiz",
      correo: "vendedor@profesor.duoc.cl",
      contrasena: "pass1",
      tipoUsuario: "Vendedor",
      direccion: "Concepción",
      region: "Biobío",
      comuna: "Concepción"
    }
  ];

  // ----------------------
  // UTILIDADES
  // ----------------------
  function cargarUsuarios() {
    const raw = localStorage.getItem(LS_KEY_USUARIOS);
    if (!raw) {
      localStorage.setItem(LS_KEY_USUARIOS, JSON.stringify(usuariosIniciales));
      return usuariosIniciales.slice();
    }
    try {
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) throw new Error('hh_usuarios inválido');
      return arr;
    } catch {
      // Si algo falla, reescribimos iniciales
      localStorage.setItem(LS_KEY_USUARIOS, JSON.stringify(usuariosIniciales));
      return usuariosIniciales.slice();
    }
  }

  function guardarUsuarios(lista) {
    localStorage.setItem(LS_KEY_USUARIOS, JSON.stringify(lista));
  }

  function guardarSesion(usuario) {
    const sesion = {
      correo: usuario.correo,
      nombre: usuario.nombre,
      tipoUsuario: usuario.tipoUsuario,
      run: usuario.run
    };
    localStorage.setItem(LS_KEY_SESION, JSON.stringify(sesion));
  }

  function obtenerSesion() {
    const raw = localStorage.getItem(LS_KEY_SESION);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function cerrarSesion() {
    localStorage.removeItem(LS_KEY_SESION);
  }

  function normalizeCorreo(c) {
    return (c || '').trim().toLowerCase();
  }

  // ----------------------
  // VALIDACIONES AUXILIARES
  // ----------------------
  function validarRun(run) {
    // 7-9 dígitos seguidos opcionalmente de un dígito o K/k
    if (!run) return false;
    return /^\d{7,9}[0-9Kk]?$/.test(run.trim());
  }

  function validarNombre(txt) {
    if (!txt) return false;
    return /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(txt.trim());
  }

  function validarCorreo(correo) {
    if (!correo) return false;
    const c = normalizeCorreo(correo);
    const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    return dominios.some(d => c.endsWith(d));
  }

  function validarPassword(pass) {
    if (!pass) return false;
    return pass.length >= 4 && pass.length <= 10;
  }

  // ----------------------
  // LOGIN
  // ----------------------
  function iniciarSesion(correoParam, contrasena) {
    const usuarios = cargarUsuarios();
    const correo = normalizeCorreo(correoParam);
    const usuarioEncontrado = usuarios.find(
      u => normalizeCorreo(u.correo) === correo && u.contrasena === contrasena
    );
    if (!usuarioEncontrado) return false;

    guardarSesion(usuarioEncontrado);

    const tipo = (usuarioEncontrado.tipoUsuario || '').toLowerCase();
    if (tipo === 'administrador' || tipo === 'vendedor') {
      // redirige a admin
      window.location.href = '../admin/index.html';
    } else {
      // redirige a tienda
      window.location.href = 'index.html';
    }
    return true;
  }

  // ----------------------
  // REGISTRO
  // ----------------------
  function registrarUsuario(datos) {
    const usuarios = cargarUsuarios();

    const emailDesde = datos.email || datos.correo || '';
    const passDesde = datos.password || datos.contrasena || '';

    // Validaciones
    if (!validarRun(datos.run)) {
      return { ok: false, mensaje: "RUN inválido. Debe tener 7-9 dígitos, con o sin dígito verificador." };
    }
    if (!validarNombre(datos.nombre)) {
      return { ok: false, mensaje: "Nombre inválido." };
    }
    if (!validarNombre(datos.apellidos)) {
      return { ok: false, mensaje: "Apellidos inválidos." };
    }
    if (!validarCorreo(emailDesde)) {
      return { ok: false, mensaje: "Correo no válido. Solo @duoc.cl, @profesor.duoc.cl o @gmail.com." };
    }
    if (!validarPassword(passDesde)) {
      return { ok: false, mensaje: "Contraseña debe tener entre 4 y 10 caracteres." };
    }
    if (!datos.direccion || !datos.direccion.trim()) {
      return { ok: false, mensaje: "Dirección obligatoria." };
    }
    if (!datos.region) {
      return { ok: false, mensaje: "Debes seleccionar una región." };
    }
    if (!datos.comuna) {
      return { ok: false, mensaje: "Debes seleccionar una comuna." };
    }

    // Evitar duplicados por correo
    const correoNormal = normalizeCorreo(emailDesde);
    const existe = usuarios.some(u => normalizeCorreo(u.correo) === correoNormal);
    if (existe) {
      return { ok: false, mensaje: "El correo ya está registrado." };
    }

    const nuevoUsuario = {
      run: datos.run,
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: correoNormal,
      contrasena: passDesde,
      tipoUsuario: "Cliente",
      direccion: datos.direccion.trim(),
      region: datos.region,
      comuna: datos.comuna,
      fechaNacimiento: datos.fechaNacimiento || ""
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    return { ok: true, mensaje: "Registro exitoso, ahora puedes iniciar sesión." };
  }

  // ----------------------
  // EXPONER FUNCIONES GLOBALES
  // ----------------------
  window.hh = window.hh || {};
  window.hh.cargarUsuarios = cargarUsuarios;
  window.hh.guardarUsuarios = guardarUsuarios;
  window.hh.guardarSesion = guardarSesion;
  window.hh.obtenerSesion = obtenerSesion;
  window.hh.cerrarSesion = cerrarSesion;
  window.hh.iniciarSesion = iniciarSesion;
  window.hh.registrarUsuario = registrarUsuario;

  // Inicializar (asegurar usuarios iniciales)
  document.addEventListener('DOMContentLoaded', cargarUsuarios);
})();

// ===============================
// HEADER DINÁMICO (todas las vistas tienda)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("header-usuario");
  if (!contenedor) return;

  const sesion = window.hh && window.hh.obtenerSesion
    ? window.hh.obtenerSesion()
    : null;

  if (sesion) {
    // Usuario logeado
    contenedor.innerHTML = `
      <span class="saludo">Hola, ${sesion.nombre}</span>
      <button id="btnCerrarSesion">Cerrar sesión</button>
    `;

    const btnCerrar = document.getElementById("btnCerrarSesion");
    if (btnCerrar) {
      btnCerrar.addEventListener("click", () => {
        window.hh.cerrarSesion();
        window.location.href = "index.html";
      });
    }
  } else {
    // Usuario no logeado
    contenedor.innerHTML = `
      <a href="iniciar-sesion.html">Iniciar sesión</a>
      <a href="registro.html">Registrarse</a>
    `;
  }
});


