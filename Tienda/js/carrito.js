// ================================
// Carrito de compras - Huerto Hogar
// ================================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ================================
// Guardar carrito en localStorage
// ================================
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito();
}

// ================================
// Agregar producto al carrito
// ================================
function agregarAlCarrito(producto) {
  if (typeof producto === "string") {
    producto = productos.find(p => p.id === producto);
    if (!producto) return;
    producto = { ...producto, cantidad: 1 };
  }

  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    if (existente.cantidad + producto.cantidad > 5) {
      alert("⚠️ No puedes agregar más de 5 unidades de este producto.");
      return;
    }
    existente.cantidad += producto.cantidad;
  } else {
    if (producto.cantidad > 5) {
      alert("⚠️ Máximo 5 unidades por producto.");
      producto.cantidad = 5;
    }
    carrito.push(producto);
  }

  guardarCarrito();
}

// ================================
// Mostrar carrito con imágenes
// ================================
function mostrarCarrito() {
  const contenedor = document.getElementById("carrito-items");
  const totalElemento = document.getElementById("carrito-total");

  if (!contenedor || !totalElemento) return;

  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Carrito vacío</p>";
    totalElemento.textContent = "Total: $0";
    return;
  }

  let total = 0;

  carrito.forEach(p => {
    const item = document.createElement("div");
    item.classList.add("item-carrito");

    item.innerHTML = `
      <div class="item-img">
        <img src="${p.imagen}" alt="${p.nombre}" />
      </div>
      <div class="item-info">
        <h3>${p.nombre}</h3>
        <p>$${p.precio.toLocaleString("es-CL")} x ${p.unidad}</p>
        <p>Cantidad: ${p.cantidad}</p>
        <div class="acciones-item">
          <button onclick="aumentar('${p.id}')">+</button>
          <button onclick="disminuir('${p.id}')">-</button>
          <button onclick="eliminar('${p.id}')">Eliminar</button>
        </div>
      </div>
    `;

    contenedor.appendChild(item);

    total += p.precio * p.cantidad;
  });

  totalElemento.textContent = `Total: $${total.toLocaleString("es-CL")}`;
}

// ================================
// Aumentar cantidad
// ================================
function aumentar(id) {
  const prod = carrito.find(p => p.id === id);
  if (prod) {
    if (prod.cantidad < 5) {
      prod.cantidad++;
    } else {
      alert("⚠️ Máximo 5 unidades por producto.");
    }
  }
  guardarCarrito();
}

// ================================
// Disminuir cantidad
// ================================
function disminuir(id) {
  const prod = carrito.find(p => p.id === id);
  if (prod) {
    prod.cantidad--;
    if (prod.cantidad <= 0) {
      carrito = carrito.filter(p => p.id !== id);
    }
  }
  guardarCarrito();
}

// ================================
// Eliminar producto del carrito
// ================================
function eliminar(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
}

// ================================
// Vaciar carrito
// ================================
function limpiarCarrito() {
  carrito = [];
  guardarCarrito();
}

// ================================
// Contador del carrito en header
// ================================
function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    const totalUnidades = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    contador.textContent = totalUnidades;
  }
}

// ================================
// Inicializar
// ================================
document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
  actualizarContadorCarrito();

  const btnLimpiar = document.getElementById("vaciar-carrito");
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", limpiarCarrito);
  }
});
