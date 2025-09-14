/* admin/js/usuarios.js
   CRUD usuarios en admin — trabaja con localStorage hh_usuarios
*/

const LS_KEY_USUARIOS = "hh_usuarios";

// usuarios iniciales (copiados de la vista tienda para inicializar si no existe)
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

function getUsuarios() {
  const raw = localStorage.getItem(LS_KEY_USUARIOS);
  if (!raw) {
    localStorage.setItem(LS_KEY_USUARIOS, JSON.stringify(usuariosIniciales));
    return usuariosIniciales.slice();
  }
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw new Error("hh_usuarios inválido");
    return arr;
  } catch {
    localStorage.setItem(LS_KEY_USUARIOS, JSON.stringify(usuariosIniciales));
    return usuariosIniciales.slice();
  }
}

function saveUsuarios(lista) {
  localStorage.setItem(LS_KEY_USUARIOS, JSON.stringify(lista));
}

// render tabla (mostrar-usuario.html)
function renderTablaUsuarios() {
  const tabla = document.querySelector(".tabla-admin");
  if (!tabla) return;
  const theadCount = tabla.querySelectorAll("thead th").length;
  if (theadCount !== 10) return; // sólo para la tabla de usuarios

  const tbody = tabla.querySelector("tbody");
  const usuarios = getUsuarios();

  tbody.innerHTML = "";

  if (!usuarios || usuarios.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 10;
    td.textContent = "No hay usuarios registrados aún.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  usuarios.forEach((u, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.run || "-"}</td>
      <td>${u.nombre || "-"}</td>
      <td>${u.apellidos || "-"}</td>
      <td>${u.correo || "-"}</td>
      <td>${u.fechaNacimiento || "-"}</td>
      <td>${u.tipoUsuario || "-"}</td>
      <td>${u.region || "-"}</td>
      <td>${u.comuna || "-"}</td>
      <td>${u.direccion || "-"}</td>
      <td>
        <button class="btn-editar" data-idx="${idx}">✏️ Editar</button>
        <button class="btn-eliminar" data-idx="${idx}">🗑️ Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Delegación eventos
  tbody.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("btn-editar")) {
      const idx = parseInt(target.dataset.idx, 10);
      const usuarios = getUsuarios();
      localStorage.setItem("usuarioEditar", JSON.stringify(usuarios[idx]));
      window.location.href = "editar-usuario.html";
    }
    if (target.classList.contains("btn-eliminar")) {
      const idx = parseInt(target.dataset.idx, 10);
      if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        let usuarios = getUsuarios();
        usuarios.splice(idx, 1);
        saveUsuarios(usuarios);
        renderTablaUsuarios();
      }
    }
  }, { once: false });
}

// crear usuario desde formulario (nuevo-usuario.html)
function crearUsuarioDesdeFormulario() {
  const mensaje = document.getElementById("mensaje");
  const run = document.getElementById("run").value.trim();
  const nombre = document.getElementById("nombre").value.trim();
  const apellidos = document.getElementById("apellidos").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const tipoUsuario = document.getElementById("tipoUsuario").value;
  const region = document.getElementById("region").value;
  const comuna = document.getElementById("comuna").value;
  const direccion = document.getElementById("direccion").value.trim();

  let usuarios = getUsuarios();

  // duplicados
  if (usuarios.some(u => u.run === run)) {
    if (mensaje) { mensaje.textContent = "⚠️ Ya existe un usuario con ese RUN."; mensaje.style.color = "red"; }
    return;
  }
  if (usuarios.some(u => (u.correo || "").toLowerCase() === correo.toLowerCase())) {
    if (mensaje) { mensaje.textContent = "⚠️ Ya existe un usuario con ese correo."; mensaje.style.color = "red"; }
    return;
  }

  const nuevo = {
    run,
    nombre,
    apellidos,
    correo,
    contrasena: password,
    fechaNacimiento,
    tipoUsuario,
    region,
    comuna,
    direccion
  };

  usuarios.push(nuevo);
  saveUsuarios(usuarios);

  if (mensaje) { mensaje.textContent = "✅ Usuario registrado con éxito."; mensaje.style.color = "green"; }
  document.getElementById("form-nuevo-usuario").reset();

  setTimeout(() => window.location.href = "mostrar-usuario.html", 1100);
}

// lógica edición (editar-usuario.html)
function initEditarUsuario() {
  const form = document.getElementById("form-editar-usuario");
  if (!form) return;
  const mensajeGeneral = document.getElementById("mensajeGeneral");
  const usuarioEditar = JSON.parse(localStorage.getItem("usuarioEditar"));
  if (!usuarioEditar) {
    if (mensajeGeneral) {
      mensajeGeneral.textContent = "⚠️ No se encontró usuario para editar.";
      mensajeGeneral.style.color = "red";
    }
    form.style.display = "none";
    return;
  }

  // rellenar campos
  const fill = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.value = value || "";
  };
  fill("run", usuarioEditar.run);
  fill("nombre", usuarioEditar.nombre);
  fill("apellidos", usuarioEditar.apellidos);
  fill("correo", usuarioEditar.correo);
  fill("fechaNacimiento", usuarioEditar.fechaNacimiento || "");
  // tipoUsuario es el valor como "Cliente"/"Administrador"/"Vendedor"
  const tipoSel = document.getElementById("tipoUsuario");
  if (tipoSel) tipoSel.value = usuarioEditar.tipoUsuario || "";
  fill("region", usuarioEditar.region || "");
  // dispatch change para poblar comunas
  const regionEl = document.getElementById("region");
  if (regionEl) {
    regionEl.dispatchEvent(new Event("change"));
    setTimeout(() => fill("comuna", usuarioEditar.comuna || ""), 120);
  }
  fill("direccion", usuarioEditar.direccion || "");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // si existe validación, usarla
    if (typeof window.validarFormEditarUsuario === "function") {
      if (!window.validarFormEditarUsuario()) return;
    }

    let usuarios = getUsuarios();
    const idx = usuarios.findIndex(u => u.run === usuarioEditar.run);
    if (idx === -1) {
      if (mensajeGeneral) { mensajeGeneral.textContent = "⚠️ Usuario no encontrado."; mensajeGeneral.style.color = "red"; }
      return;
    }

    const passField = document.getElementById("password");
    const nuevaPass = passField && passField.value ? passField.value : usuarios[idx].contrasena;

    usuarios[idx] = {
      run: document.getElementById("run").value.trim(),
      nombre: document.getElementById("nombre").value.trim(),
      apellidos: document.getElementById("apellidos").value.trim(),
      correo: document.getElementById("correo").value.trim(),
      contrasena: nuevaPass,
      fechaNacimiento: document.getElementById("fechaNacimiento").value,
      tipoUsuario: document.getElementById("tipoUsuario").value,
      region: document.getElementById("region").value,
      comuna: document.getElementById("comuna").value,
      direccion: document.getElementById("direccion").value.trim()
    };

    saveUsuarios(usuarios);
    localStorage.removeItem("usuarioEditar");
    if (mensajeGeneral) { mensajeGeneral.textContent = "✅ Usuario actualizado correctamente."; mensajeGeneral.style.color = "green"; }

    setTimeout(() => window.location.href = "mostrar-usuario.html", 1000);
  });
}

// ------------------------------
// Inicialización DOM
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // asegurar datos
  getUsuarios();

  // render tabla si corresponde
  renderTablaUsuarios();

  // nuevo usuario: attach submit
  const nuevoForm = document.getElementById("form-nuevo-usuario");
  if (nuevoForm) {
    nuevoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (typeof window.validarFormNuevoUsuario === "function") {
        if (!window.validarFormNuevoUsuario()) return;
      }
      crearUsuarioDesdeFormulario();
    });
  }

  // editar
  initEditarUsuario();
});
