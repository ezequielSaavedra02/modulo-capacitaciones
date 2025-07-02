import React, { useEffect, useState } from 'react';
import { getAllPersonas, createPersona, updatePersona, deletePersona } from '../api/personasApi';

function PersonasList() {
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
    const [formData, setFormData] = useState({
        personaId: null, // null para crear, ID para editar
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        tipoPersona: '',
        telefono: ''
    });

    // --- Funciones para interactuar con la API ---

    const fetchPersonas = async () => {
        try {
            setLoading(true);
            const data = await getAllPersonas();
            setPersonas(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las personas. Por favor, asegúrate de que el backend esté funcionando y la URL sea correcta.');
            console.error("Detalle del error al cargar personas:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- Manejo del Formulario ---

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene el recargar la página

        try {
            let result;
            if (formData.personaId) { // Si hay un ID, estamos editando
                result = await updatePersona(formData.personaId, formData);
                setPersonas(personas.map(p => p.personaId === result.personaId ? result : p));
                alert('Persona actualizada con éxito!');
            } else { // Si no hay ID, estamos creando
                result = await createPersona(formData);
                setPersonas([...personas, result]);
                alert('Persona creada con éxito!');
            }
            resetForm(); // Limpia el formulario y lo cierra
            setError(null);
        } catch (err) {
            setError('Error al guardar la persona. Verifica los datos y el formato (ej. DNI, Email, Tipo de Persona).');
            console.error("Detalle del error al guardar persona:", err);
        }
    };

    const handleEditClick = (persona) => {
        setFormData(persona); // Carga los datos de la persona a editar
        setShowForm(true);    // Abre el formulario para editar
    };

    const resetForm = () => {
        setFormData({
            personaId: null,
            nombre: '',
            apellido: '',
            dni: '',
            email: '',
            tipoPersona: '',
            telefono: ''
        });
        setShowForm(false); // Cierra el formulario
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta persona?')) {
            try {
                await deletePersona(id);
                setPersonas(personas.filter(p => p.personaId !== id));
                setError(null);
                alert('Persona eliminada con éxito!');
            } catch (err) {
                setError('Error al eliminar la persona.');
                console.error("Detalle del error al eliminar persona:", err);
            }
        }
    };

    // Cargar personas al montar el componente
    useEffect(() => {
        fetchPersonas();
    }, []);

    // --- Renderizado del Componente ---

    if (loading) {
        return <div className="text-center mt-4">Cargando personas...</div>;
    }

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="m-0">Listado de Personas</h4>
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) resetForm(); // Si se cierra el formulario, resetéalo
                    }}
                >
                    {showForm ? 'Cerrar Formulario' : '+ Agregar Persona'}
                </button>
            </div>

            {/* Formulario de Agregar/Editar Persona */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded shadow-sm">
                    <h5 className="mb-3">{formData.personaId ? 'Editar Persona' : 'Nueva Persona'}</h5>
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Nombre"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                placeholder="Apellido"
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <input
                                type="text"
                                className="form-control"
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                placeholder="DNI"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <input
                                type="text"
                                className="form-control"
                                name="tipoPersona"
                                value={formData.tipoPersona}
                                onChange={handleChange}
                                placeholder="Tipo (ej: ALUMNO, INSTRUCTOR)"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Teléfono (opcional)"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary me-2">
                        {formData.personaId ? 'Actualizar Persona' : 'Guardar Persona'}
                    </button>
                    {formData.personaId && ( // Solo muestra "Cancelar Edición" si estamos editando
                        <button type="button" onClick={resetForm} className="btn btn-secondary">
                            Cancelar Edición
                        </button>
                    )}
                </form>
            )}

            {/* Mensaje de error (si existe) */}
            {error && <div className="alert alert-danger mt-4" role="alert">{error}</div>}

            {/* Tabla de Personas */}
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-light">
                    <tr>
                        <th>Nombre Completo</th>
                        <th>DNI</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {personas.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">No hay personas registradas.</td>
                        </tr>
                    ) : (
                        personas.map(persona => (
                            <tr key={persona.personaId}>
                                <td>{persona.nombre} {persona.apellido}</td>
                                <td>{persona.dni}</td>
                                <td>{persona.email}</td>
                                <td>{persona.tipoPersona}</td>
                                <td>{persona.telefono || 'N/A'}</td> {/* Muestra N/A si no hay teléfono */}
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEditClick(persona)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(persona.personaId)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PersonasList;