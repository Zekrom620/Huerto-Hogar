// src/utils/helpers.js

// Función para manejar localStorage
export function guardarLS(key, value) { 
    try {
        localStorage.setItem(key, JSON.stringify(value)); 
    } catch (error) {
        console.error("Error guardando localStorage", error);
    }
}

export function leerLS(key, fallback) { 
    try { 
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : fallback;
    } catch (error) { 
        console.error("Error leyendo localStorage", error);
        return fallback; 
    } 
}

// Función de formato CLP
export function formatCLP(n) { 
    // Aseguramos que n sea un número
    if (typeof n !== 'number' || isNaN(n)) return '$0 CLP';
    return n.toLocaleString('es-CL', { 
        style: 'currency', 
        currency: 'CLP', 
        maximumFractionDigits: 0 
    }); 
}

// Función para escapar HTML
export function escapeHtml(text) { 
    if (typeof text !== 'string') return '';
    return text.replace(/[&"'<>]/g, function (m) { 
        return ({'&':'&amp;','"':'&quot;','\'':'&#39;','<':'&lt;','>':'&gt;'})[m]; 
    }); 
}

// MODIFICADO: Ahora recibe la lista de productos como argumento
export function findProductIdByName(name, listaProductos = []) {
    if (!name) return null;
    const prod = listaProductos.find(p => p.nombre.toLowerCase().trim() === name.toLowerCase().trim());
    return prod ? prod.id : null;
}

// MODIFICADO: Ahora recibe la lista de productos como argumento
export function getProductNameById(id, listaProductos = []) { 
    const p = listaProductos.find(x => x.id === id); 
    return p ? p.nombre : id; 
}

// Función de selección aleatoria
export function getProductoRandom(array, cantidad = 8) { 
    if (!Array.isArray(array)) return [];
    const copia = [...array];
    const seleccion = [];
    for (let i = 0; i < cantidad && copia.length; i++) {
        const idx = Math.floor(Math.random() * copia.length);
        seleccion.push(copia[idx]);
        copia.splice(idx, 1);
    }
    return seleccion;
}