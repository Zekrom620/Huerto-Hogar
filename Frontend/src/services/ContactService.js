import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/contact";

// Función para enviar el formulario de contacto al Backend
export const submitContactFormAPI = async (formData) => {
    try {
        // Esta es una ruta pública, no necesita token JWT
        const response = await axios.post(BASE_URL, formData);
        return response.data; 
    } catch (error) {
        console.error("Error al enviar formulario de contacto:", error);
        throw error;
    }
};