import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllActividades = async () => {
    try {
        const response = await api.get('/actividades');
        return response.data;
    } catch (error) {
        console.error("Error al obtener actividades:", error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const getActividadById = async (id) => {
    try {
        const response = await api.get(`/actividades/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener actividad con ID ${id}:`, error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const createActividad = async (actividadData) => {
    try {
        const response = await api.post('/actividades', actividadData);
        return response.data;
    } catch (error) {
        console.error("Error al crear actividad:", error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const updateActividad = async (id, actividadData) => {
    try {
        const response = await api.put(`/actividades/${id}`, actividadData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar actividad con ID ${id}:`, error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const deleteActividad = async (id) => {
    try {
        await api.delete(`/actividades/${id}`);
        return true;
    } catch (error) {
        console.error(`Error al eliminar actividad con ID ${id}:`, error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};