import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllParticipaciones = async () => {
    try {
        const response = await api.get('/participaciones');
        return response.data;
    } catch (error) {
        console.error("Error al obtener participaciones:", error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const getParticipacionById = async (id) => {
    try {
        const response = await api.get(`/participaciones/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener participación con ID ${id}:`, error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const createParticipacion = async (participacionData) => {
    try {
        const response = await api.post('/participaciones', participacionData);
        return response.data;
    } catch (error) {
        console.error("Error al crear participación:", error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const updateParticipacion = async (id, participacionData) => {
    try {
        const response = await api.put(`/participaciones/${id}`, participacionData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar participación con ID ${id}:`, error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const deleteParticipacion = async (id) => {
    try {
        await api.delete(`/participaciones/${id}`);
        return true;
    } catch (error) {
        console.error(`Error al eliminar participación con ID ${id}:`, error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};