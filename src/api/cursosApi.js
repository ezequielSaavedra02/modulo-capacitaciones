// src/api/cursosApi.js

const API_BASE_URL = 'http://localhost:8080/api'; // La URL base de tu backend de Spring Boot

// Función para obtener todos los cursos
export const getAllCursos = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener cursos:", error);
        throw error;
    }
};

// Función para obtener un curso por ID
export const getCursoById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos/${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener curso con ID ${id}:`, error);
        throw error;
    }
};

// Función para crear un nuevo curso
export const createCurso = async (cursoData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cursoData),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al crear curso:", error);
        throw error;
    }
};

// Función para actualizar un curso existente
export const updateCurso = async (id, cursoData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cursoData),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al actualizar curso con ID ${id}:`, error);
        throw error;
    }
};

// Función para eliminar un curso
export const deleteCurso = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cursos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return true; // Retorna true si la eliminación fue exitosa
    } catch (error) {
        console.error(`Error al eliminar curso con ID ${id}:`, error);
        throw error;
    }
};