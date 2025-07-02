// src/api/personasApi.js
import axios from 'axios'; // ¡Nuevo!

const API_BASE_URL = 'http://localhost:8080/api';

// Configuración opcional de una instancia de Axios para reutilizar
// Esto es útil para establecer una baseURL, headers comunes, etc.
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Función para obtener todas las personas
export const getAllPersonas = async () => {
    try {
        const response = await api.get('/personas'); // Usamos api.get
        return response.data; // Axios pone la respuesta JSON en .data
    } catch (error) {
        console.error("Error al obtener personas:", error);
        // Axios proporciona detalles del error en error.response
        if (error.response) {
            console.error("Detalles del error (Axios):", error.response.data, error.response.status);
        }
        throw error;
    }
};

// Función para obtener una persona por ID
export const getPersonaById = async (id) => {
    try {
        const response = await api.get(`/personas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener persona con ID ${id}:`, error);
        if (error.response) {
            console.error("Detalles del error (Axios):", error.response.data, error.response.status);
        }
        throw error;
    }
};

// Función para crear una nueva persona
export const createPersona = async (personaData) => {
    try {
        const response = await api.post('/personas', personaData); // Axios stringify automáticamente
        return response.data;
    } catch (error) {
        console.error("Error al crear persona:", error);
        if (error.response) {
            console.error("Detalles del error (Axios):", error.response.data, error.response.status);
        }
        throw error;
    }
};

// Función para actualizar una persona existente
export const updatePersona = async (id, personaData) => {
    try {
        const response = await api.put(`/personas/${id}`, personaData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar persona con ID ${id}:`, error);
        if (error.response) {
            console.error("Detalles del error (Axios):", error.response.data, error.response.status);
        }
        throw error;
    }
};

// Función para eliminar una persona
export const deletePersona = async (id) => {
    try {
        await api.delete(`/personas/${id}`); // No hay .data para DELETE exitoso
        return true;
    } catch (error) {
        console.error(`Error al eliminar persona con ID ${id}:`, error);
        if (error.response) {
            console.error("Detalles del error (Axios):", error.response.data, error.response.status);
        }
        throw error;
    }
};