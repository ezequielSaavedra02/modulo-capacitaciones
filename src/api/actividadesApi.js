// src/api/actividadesApi.js

const API_BASE_URL = 'http://localhost:8080/api'; // Asegúrate de que esta URL coincida con la de tu backend

// Función para obtener todas las actividades
export const getAllActividades = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/actividades`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener actividades:", error);
        throw error;
    }
};

// Función para obtener una actividad por ID
export const getActividadById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/actividades/${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener actividad con ID ${id}:`, error);
        throw error;
    }
};

// Función para crear una nueva actividad
export const createActividad = async (actividadData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/actividades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actividadData),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al crear actividad:", error);
        throw error;
    }
};

// Función para actualizar una actividad existente
export const updateActividad = async (id, actividadData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/actividades/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actividadData),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar actividad con ID ${id}:`, error);
        throw error;
    }
};

// Función para eliminar una actividad
export const deleteActividad = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/actividades/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return true; // Retorna true si la eliminación fue exitosa
    } catch (error) {
        console.error(`Error al eliminar actividad con ID ${id}:`, error);
        throw error;
    }
};