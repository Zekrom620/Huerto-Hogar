/******************************************
 * admin/js/validaciones.js
 * Restaura lógica de productos para admin
 ******************************************/

/* ============================
   PRODUCTOS BASE HUERTO HOGAR
   (no tocar)
   ============================ */
const productosBase = [
  {
    codigo: "FR001",
    nombre: "Manzanas Fuji",
    descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas o postres.",
    precio: 1200,
    stock: 150,
    stockCritico: 20,
    categoria: "fruta",
    unidad: "kilo",
    imagen: "assets/img/manzanas_fuji.jpg"
  },
  {
    codigo: "FR002",
    nombre: "Naranjas Valencia",
    descripcion: "Jugosas y ricas en vitamina C.",
    precio: 1000,
    stock: 200,
    stockCritico: 25,
    categoria: "fruta",
    unidad: "kilo",
    imagen: "assets/img/naranjas_valencia.jpg"
  },
  {
    codigo: "FR003",
    nombre: "Plátanos Cavendish",
    descripcion: "Plátanos maduros y dulces, perfectos para el desayuno o snack.",
    precio: 800,
    stock: 250,
    stockCritico: 30,
    categoria: "fruta",
    unidad: "kilo",
    imagen: "assets/img/platano_cavendish.jpg"
  },
  {
    codigo: "VR001",
    nombre: "Zanahorias Orgánicas",
    descripcion: "Zanahorias crujientes cultivadas sin pesticidas.",
    precio: 900,
    stock: 100,
    stockCritico: 15,
    categoria: "verdura",
    unidad: "kilo",
    imagen: "assets/img/zanahorias.jpg"
  },
  {
    codigo: "VR002",
    nombre: "Espinacas Frescas",
    descripcion: "Espinacas frescas y nutritivas.",
    precio: 700,
    stock: 80,
    stockCritico: 10,
    categoria: "verdura",
    unidad: "bolsa (500g)",
    imagen: "assets/img/espinacas.jpg"
  },
  {
    codigo: "VR003",
    nombre: "Pimientos Tricolores",
    descripcion: "Pimientos rojos, amarillos y verdes, ideales para salteados.",
    precio: 1500,
    stock: 120,
    stockCritico: 20,
    categoria: "verdura",
    unidad: "kilo",
    imagen: "assets/img/pimientos.jpg"
  },
  {
    codigo: "PO001",
    nombre: "Miel Orgánica",
    descripcion: "Miel pura y orgánica producida por apicultores locales.",
    precio: 5000,
    stock: 50,
    stockCritico: 5,
    categoria: "otro",
    unidad: "frasco (500g)",
    imagen: "assets/img/miel.jpg"
  }
];

/* ============================
   UTIL: asegurar productos en localStorage
   ============================ */
function asegurarProductosEnLocalStorage() {
  try {
    const raw = localStorage.getItem("productos");
    if (!raw) {
      localStorage.setItem("productos", JSON.stringify(productosBase));
      return productosBase.slice();
    }
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length === 0) {
      localStorage.setItem("productos", JSON.stringify(productosBase));
      return productosBase.slice();
    }
    return arr;
  } catch (err) {
    localStorage.setItem("productos", JSON.stringify(productosBase));
    return productosBase.slice();
  }
}

/* ============================
   DOC READY: una sola función que inicializa:
   - mostrar productos (si la tabla tiene 8 columnas)
   - nuevo/editar producto (si existen formularios)
   - regiones/comunas (si existen selects)
   ============================ */
document.addEventListener("DOMContentLoaded", () => {

  /******************************
   * 1) MOSTRAR PRODUCTOS (admin)
   * Detecta tabla con 8 columnas (productos)
   ******************************/
  const tabla = document.querySelector(".tabla-admin");
  if (tabla) {
    const thCount = tabla.querySelectorAll("thead th").length;
    if (thCount === 8) {
      const tablaBody = tabla.querySelector("tbody");
      let productos = asegurarProductosEnLocalStorage();
      tablaBody.innerHTML = "";

      if (!productos || productos.length === 0) {
        const fila = document.createElement("tr");
        const celda = document.createElement("td");
        celda.colSpan = 8;
        celda.textContent = "No hay productos registrados aún.";
        fila.appendChild(celda);
        tablaBody.appendChild(fila);
      } else {
        productos.forEach((prod) => {
          const fila = document.createElement("tr");

          fila.innerHTML = `
            <td>${prod.codigo}</td>
            <td>${prod.nombre}</td>
            <td>${prod.descripcion || "-"}</td>
            <td>$${parseFloat(prod.precio).toLocaleString("es-CL")}</td>
            <td>${prod.stock}</td>
            <td>${prod.stockCritico}</td>
            <td>${prod.categoria}</td>
            <td>
              <button class="btn-editar" data-codigo="${prod.codigo}">✏️ Editar</button>
            </td>
          `;

          // editar: guardar producto en LS y redirigir
          fila.querySelector(".btn-editar").addEventListener("click", () => {
            localStorage.setItem("productoEditar", JSON.stringify(prod));
            window.location.href = "editar-producto.html";
          });

          tablaBody.appendChild(fila);
        });
      }
    }
  }

  /******************************
   * 2) NUEVO PRODUCTO (admin)
   * Soporta ambos ids de formulario por compatibilidad
   ******************************/
  const formNuevo = document.getElementById("formNuevoProducto") || document.getElementById("form-nuevo-producto");
  if (formNuevo) {
    const mensajeEl = document.getElementById("mensaje") || document.getElementById("mensajeGeneral");

    formNuevo.addEventListener("submit", (e) => {
      e.preventDefault();

      const codigo = (document.getElementById("codigo") || {}).value || "";
      const nombre = (document.getElementById("nombre") || {}).value || "";
      const descripcion = (document.getElementById("descripcion") || {}).value || "";
      const precio = parseFloat((document.getElementById("precio") || {}).value || "0");
      const stock = parseInt((document.getElementById("stock") || {}).value || "0");
      const stockCritico = parseInt((document.getElementById("stockCritico") || {}).value || "0");
      const categoria = (document.getElementById("categoria") || {}).value || "";

      if (!codigo.trim() || !nombre.trim() || !precio || !categoria) {
        if (mensajeEl) { mensajeEl.textContent = "⚠️ Completa los campos obligatorios."; mensajeEl.style.color = "red"; }
        return;
      }

      let productos = JSON.parse(localStorage.getItem("productos")) || [];
      if (productos.some(p => p.codigo === codigo)) {
        if (mensajeEl) { mensajeEl.textContent = "⚠️ Ya existe un producto con ese código."; mensajeEl.style.color = "red"; }
        return;
      }

      const nuevoProducto = {
        codigo: codigo.trim(),
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio,
        stock,
        stockCritico,
        categoria
      };

      productos.push(nuevoProducto);
      localStorage.setItem("productos", JSON.stringify(productos));

      if (mensajeEl) { mensajeEl.textContent = "✅ Producto guardado con éxito."; mensajeEl.style.color = "green"; }
      formNuevo.reset();
      // opcional: redirigir a la lista
      // setTimeout(() => window.location.href = "mostrar-productos.html", 800);
    });
  }

  /******************************
   * 3) EDITAR PRODUCTO (admin)
   * Soporta ambos ids de formulario por compatibilidad
   ******************************/
  const formEditar = document.getElementById("formEditarProducto") || document.getElementById("form-editar-producto");
  if (formEditar) {
    const mensajeGen = document.getElementById("mensajeGeneral") || document.getElementById("mensaje");

    const productoEditar = JSON.parse(localStorage.getItem("productoEditar"));
    if (!productoEditar) {
      if (mensajeGen) {
        mensajeGen.textContent = "⚠️ No se encontró producto para editar.";
        mensajeGen.style.color = "red";
      }
      // ocultar form si quieres
      // formEditar.style.display = "none";
    } else {
      // rellenar campos si existen
      if (document.getElementById("codigo")) document.getElementById("codigo").value = productoEditar.codigo || "";
      if (document.getElementById("nombre")) document.getElementById("nombre").value = productoEditar.nombre || "";
      if (document.getElementById("descripcion")) document.getElementById("descripcion").value = productoEditar.descripcion || "";
      if (document.getElementById("precio")) document.getElementById("precio").value = productoEditar.precio || "";
      if (document.getElementById("stock")) document.getElementById("stock").value = productoEditar.stock || "";
      if (document.getElementById("stockCritico")) document.getElementById("stockCritico").value = productoEditar.stockCritico || "";
      if (document.getElementById("categoria")) document.getElementById("categoria").value = productoEditar.categoria || "";

      formEditar.addEventListener("submit", (e) => {
        e.preventDefault();
        const productos = JSON.parse(localStorage.getItem("productos")) || [];
        const index = productos.findIndex(p => p.codigo === productoEditar.codigo);
        if (index === -1) {
          if (mensajeGen) { mensajeGen.textContent = "⚠️ Producto no encontrado."; mensajeGen.style.color = "red"; }
          return;
        }

        productos[index] = {
          codigo: (document.getElementById("codigo") || {}).value || productoEditar.codigo,
          nombre: (document.getElementById("nombre") || {}).value || "",
          descripcion: (document.getElementById("descripcion") || {}).value || "",
          precio: parseFloat((document.getElementById("precio") || {}).value || "0"),
          stock: parseInt((document.getElementById("stock") || {}).value || "0"),
          stockCritico: parseInt((document.getElementById("stockCritico") || {}).value || "0"),
          categoria: (document.getElementById("categoria") || {}).value || ""
        };

        localStorage.setItem("productos", JSON.stringify(productos));
        localStorage.removeItem("productoEditar");

        if (mensajeGen) { mensajeGen.textContent = "✅ Producto actualizado correctamente."; mensajeGen.style.color = "green"; }
        // opcional: redirigir
        setTimeout(() => { window.location.href = "mostrar-productos.html"; }, 1000);
      });
    }
  }

  /********************************************************
   * 4) REGIONES Y COMUNAS (admin)
   * si en la página existen selects #region y #comuna los llena
   ********************************************************/
  const regionesYcomunas = {
    "Región Metropolitana": ["Santiago", "Maipú", "Las Condes", "La Florida", "Puente Alto"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Coronel"],
    "Maule": ["Talca", "Curicó", "Linares", "Cauquenes"],
    "O'Higgins": ["Rancagua", "San Fernando", "Santa Cruz"]
  };

  const selectRegion = document.getElementById("region");
  const selectComuna = document.getElementById("comuna");

  if (selectRegion && selectComuna) {
    // placeholder
    selectRegion.innerHTML = '<option value="">Seleccione región</option>';
    Object.keys(regionesYcomunas).forEach(region => {
      const opt = document.createElement("option");
      opt.value = region;
      opt.textContent = region;
      selectRegion.appendChild(opt);
    });

    // placeholder inicial de comuna
    selectComuna.innerHTML = '<option value="">Seleccione región primero</option>';
    selectComuna.disabled = true;

    selectRegion.addEventListener("change", () => {
      selectComuna.innerHTML = '<option value="">Seleccione...</option>';
      selectComuna.disabled = true;
      if (selectRegion.value) {
        regionesYcomunas[selectRegion.value].forEach(com => {
          const opt = document.createElement("option");
          opt.value = com;
          opt.textContent = com;
          selectComuna.appendChild(opt);
        });
        selectComuna.disabled = false;
      }
    });
  }

}); // fin DOMContentLoaded
