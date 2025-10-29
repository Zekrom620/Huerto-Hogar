// src/utils/helpers.js
// Funciones de productos (que usan la data de forma síncrona)
import { PRODUCTOS } from '../data/ProductsData';
// Función para manejar localStorage
export function guardarLS(key, value) { 
    localStorage.setItem(key, JSON.stringify(value)); 
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

// Función para escapar HTML (útil para prevenir inyección XSS, buena práctica)
export function escapeHtml(text) { 
    if (typeof text !== 'string') return '';
    return text.replace(/[&"'<>]/g, function (m) { 
        return ({'&':'&amp;','"':'&quot;','\'':'&#39;','<':'&lt;','>':'&gt;'})[m]; 
    }); 
}


export function findProductIdByName(name) {
    if (!name) return null;
    const prod = PRODUCTOS.find(p => p.nombre.toLowerCase().trim() === name.toLowerCase().trim());
    return prod ? prod.id : null;
}

export function getProductNameById(id) { 
    const p = PRODUCTOS.find(x => x.id === id); 
    return p ? p.nombre : id; 
}

// Función de selección aleatoria
export function getProductoRandom(array, cantidad = 8) { 
    const copia = [...array];
    const seleccion = [];
    for (let i = 0; i < cantidad && copia.length; i++) {
        const idx = Math.floor(Math.random() * copia.length);
        seleccion.push(copia[idx]);
        copia.splice(idx, 1);
    }
    return seleccion;
}