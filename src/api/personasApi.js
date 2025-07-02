// src/api/personasApi.js

const API_BASE_URL = 'http://localhost:8080/api'; // La URL base de tu backend de Spring Boot

// Función para obtener todas las personas
export const getAllPersonas = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/personas`);
        if (!response.ok) {
            // Si la respuesta no es 2xx (ej. 404, 500), lanza un error
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json(); // Parsea la respuesta JSON
    } catch (error) {
        console.error("Error al obtener personas:", error);
        throw error; // Propaga el error para que el componente lo maneje
    }
};

// Función para obtener una persona por ID
export const getPersonaById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/personas/${id}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al obtener persona con ID ${id}:`, error);
        throw error;
    }
};

// Función para crear una nueva persona
export const createPersona = async (personaData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/personas`, {
            method: 'POST', // Método HTTP POST
            headers: {
                'Content-Type': 'application/json', // Indicar que enviamos JSON
            },
            body: JSON.stringify(personaData), // Convertir el objeto JS a JSON
        });
        if (!response.ok) {
            const errorBody = await response.text(); // Intenta leer el cuerpo del error
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al crear persona:", error);
        throw error;
    }
};

// Función para actualizar una persona
export const updatePersona = async (id, personaData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/personas/${id}`, {
            method: 'PUT', // Método HTTP PUT
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(personaData),
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        return await response.json(); // Normalmente PUT devuelve el objeto actualizado
    } catch (error) {
        console.error(`Error al actualizar persona con ID ${id}:`, error);
        throw error;
    }
};

// Función para eliminar una persona
export const deletePersona = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/personas/${id}`, {
            method: 'DELETE', // Método HTTP DELETE
        });
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Error HTTP: ${response.status} ${response.statusText} - ${errorBody}`);
        }
        // DELETE 204 No Content no devuelve cuerpo, así que no intentamos parsear JSON
        // Simplemente retornamos si fue exitoso (response.ok es true)
        return true;
    } catch (error) {
        console.error(`Error al eliminar persona con ID ${id}:`, error);
        throw error;
    }
};