// src/api/participacionesApi.js

const API_BASE_URL = 'http://localhost:8080/api'; // Asegúrate de que esta URL coincida con la de tu backend

// Función para obtener todas las participaciones
export const getAllParticipaciones = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/participaciones`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener participaciones:", error);
        throw error;
    }
};

// Función para obtener una participación por ID
export const getParticipacionById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/participaciones/${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener participación con ID ${id}:`, error);
        throw error;
    }
};

// Función para crear una nueva participación
export const createParticipacion = async (participacionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/participaciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(participacionData),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al crear participación:", error);
        throw error;
    }
};

// Función para actualizar una participación existente
export const updateParticipacion = async (id, participacionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/participaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(participacionData),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar participación con ID ${id}:`, error);
        throw error;
    }
};

// Función para eliminar una participación
export const deleteParticipacion = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/participaciones/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return true; // Retorna true si la eliminación fue exitosa
    } catch (error) {
        console.error(`Error al eliminar participación con ID ${id}:`, error);
        throw error;
    }
};