import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllCursos = async () => {
    try {
        const response = await api.get('/cursos');
        return response.data;
    } catch (error) {
        console.error("Error al obtener cursos:", error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const getCursoById = async (id) => {
    try {
        const response = await api.get(`/cursos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener curso con ID ${id}:`, error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const createCurso = async (cursoData) => {
    try {
        const response = await api.post('/cursos', cursoData);
        return response.data;
    } catch (error) {
        console.error("Error al crear curso:", error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const updateCurso = async (id, cursoData) => {
    try {
        const response = await api.put(`/cursos/${id}`, cursoData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar curso con ID ${id}:`, error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};

export const deleteCurso = async (id) => {
    try {
        await api.delete(`/cursos/${id}`);
        return true;
    } catch (error) {
        console.error(`Error al eliminar curso con ID ${id}:`, error);
        if (error.response) { console.error("Detalles del error (Axios):", error.response.data, error.response.status); }
        throw error;
    }
};