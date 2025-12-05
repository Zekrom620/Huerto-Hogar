import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/users";

// --- FUNCIÓN DE UTILIDAD: Obtiene el encabezado de autenticación (CORREGIDA) ---
const getAuthHeader = () => {
    // CRÍTICO: Leer el item del localStorage, que puede ser 'null'
    const sessionDataString = localStorage.getItem('usuarioActivo');
    
    // Si no existe, es 'null' o 'undefined', devolvemos objeto vacío
    if (!sessionDataString || sessionDataString === 'null') {
        return {};
    }

    try {
        // Ahora es seguro parsear
        const sessionData = JSON.parse(sessionDataString);
        
        if (sessionData && sessionData.token) {
            // Formato estándar JWT: "Bearer <token>"
            return { Authorization: `Bearer ${sessionData.token}` };
        }
    } catch (e) {
        console.error("Error al parsear token de sesión:", e);
        // Si hay un error de parseo, limpiamos la sesión y devolvemos vacío
        localStorage.removeItem('usuarioActivo');
    }
    return {};
};


// --- CLIENTE AXIOS AUTENTICADO ---
// Este cliente se usará para TODAS las rutas protegidas (Admin CRUD)
const authClient = axios.create({
    baseURL: BASE_URL,
    // CRÍTICO: Aunque el header es fijo, su contenido se actualiza por la función getAuthHeader
    headers: { ...getAuthHeader() } 
});


// 1. Iniciar Sesión (Envía correo y contraseña) - RUTA PÚBLICA
export const loginAPI = async (credentials) => {
    try {
        // Esta ruta no necesita token
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        return response.data; // Devuelve { token, user }
    } catch (error) {
        console.error("Error en Login:", error);
        throw error; 
    }
};

// 2. Registrar Usuario (Envía el objeto completo) - RUTA PÚBLICA
export const registerAPI = async (userData) => {
    try {
        // Esta ruta no necesita token
        const response = await axios.post(`${BASE_URL}/register`, userData);
        return response.data; // Retorna el usuario creado (o null si falla)
    } catch (error) {
        console.error("Error en Registro:", error);
        throw error;
    }
};

// 3. Obtener todos los usuarios (GET) - RUTA PROTEGIDA
export const getAllUsersAPI = async () => {
    try {
        // Usamos el cliente autenticado y pasamos el token en el header
        const response = await authClient.get(BASE_URL, { headers: getAuthHeader() }); 
        return response.data; 
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        // Si hay error (403/401), devuelve vacío para no crashear
        return [];
    }
};

// 4. Eliminar usuario (DELETE) - RUTA PROTEGIDA
export const deleteUserAPI = async (id) => {
    try {
        await authClient.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
        return true;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
};

// 5. Actualizar usuario (PUT) - RUTA PROTEGIDA
export const updateUserAPI = async (id, userData) => {
    try {
        const response = await authClient.put(`${BASE_URL}/${id}`, userData, { headers: getAuthHeader() });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
    }
};