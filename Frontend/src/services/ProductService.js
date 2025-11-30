import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/products";

export const getAllProducts = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data; 
    } catch (error) {
        console.error("Error conectando con el Backend:", error);
        return [];
    }
};

export const deleteProductAPI = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
        return true;
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        throw error;
    }
};

export const createProductAPI = async (productData) => {
    try {
        const response = await axios.post(BASE_URL, productData);
        return response.data;
    } catch (error) {
        console.error("Error al crear producto:", error);
        throw error;
    }
};

// --- NUEVA FUNCIÓN AGREGADA: ACTUALIZAR ---
export const updateProductAPI = async (id, productData) => {
    try {
        // PUT http://localhost:8080/api/v1/products/1
        const response = await axios.put(`${BASE_URL}/${id}`, productData);
        return response.data; // Devuelve el producto ya actualizado
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        throw error;
    }
};