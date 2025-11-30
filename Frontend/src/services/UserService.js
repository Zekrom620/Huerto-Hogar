import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/users";

// 1. Iniciar Sesión (Envía correo y contraseña)
export const loginAPI = async (credentials) => {
    try {
        // El backend espera: { "correo": "...", "contrasena": "..." }
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        return response.data; // Retorna el usuario si es correcto (con ID, rol, etc.)
    } catch (error) {
        console.error("Error en Login:", error);
        throw error; // Lanzamos el error para que el componente Login lo capture
    }
};

// 2. Registrar Usuario (Envía el objeto completo)
export const registerAPI = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, userData);
        return response.data; // Retorna el usuario creado
    } catch (error) {
        console.error("Error en Registro:", error);
        throw error;
    }
};

// 3. Obtener todos los usuarios (GET)
export const getAllUsersAPI = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data; 
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return [];
    }
};

// 4. Eliminar usuario (DELETE)
export const deleteUserAPI = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
        return true;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
};

// 5. Actualizar usuario (PUT)
export const updateUserAPI = async (id, userData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        throw error;
    }
};
