import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/checkout";

// La función que obtiene el token de seguridad ya está en UserService.js, la usaremos
const getAuthHeader = () => {
    const sessionDataString = localStorage.getItem('usuarioActivo');
    if (!sessionDataString || sessionDataString === 'null') return {};
    const sessionData = JSON.parse(sessionDataString);
    if (sessionData && sessionData.token) {
        return { Authorization: `Bearer ${sessionData.token}` };
    }
    return {};
};

// Endpoint que finaliza la compra
export const finalizePurchaseAPI = async (checkoutData) => {
    try {
        // CRÍTICO: Esta llamada DEBE llevar el token, pues el endpoint es protegido
        const response = await axios.post(BASE_URL, checkoutData, { headers: getAuthHeader() });
        return response.data; 
    } catch (error) {
        console.error("Error al finalizar la compra:", error);
        throw error;
    }
};