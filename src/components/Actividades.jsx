import React, { useEffect, useState } from 'react';
import { getAllActividades, createActividad, updateActividad, deleteActividad } from '../api/actividadesApi'; // Importa las funciones de la API
import { getAllPersonas } from '../api/personasApi'; // Necesitamos esto para el selector de responsable

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [personas, setPersonas] = useState([]); // Estado para la lista de posibles responsables
  const [formData, setFormData] = useState({
    actividadId: null, // null para crear, ID para editar
    nombre: '',
    descripcion: '',
    fecha: '', // Formato YYYY-MM-DD para el input type="date"
    tipo: '', // Nuevo campo para el tipo de actividad
    responsable: {
      personaId: '' // ID del responsable
    }
  });

  // --- Funciones para interactuar con la API ---

  const fetchActividades = async () => {
    try {
      setLoading(true);
      const data = await getAllActividades();
      setActividades(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las actividades. Por favor, asegúrate de que el backend esté funcionando.');
      console.error("Detalle del error al cargar actividades:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonasForSelect = async () => {
    try {
      const data = await getAllPersonas();
      setPersonas(data);
    } catch (err) {
      console.error("Error al cargar personas para el selector de responsable:", err);
    }
  };

  // --- Manejo del Formulario ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "responsableId") { // Si el campo es el ID del responsable
      setFormData({
        ...formData,
        responsable: {
          personaId: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;
      const actividadToSend = {
        ...formData,
        // Asegurarse de que el responsable solo envía el ID si existe
        responsable: formData.responsable.personaId ? { personaId: formData.responsable.personaId } : null
      };

      if (actividadToSend.actividadId) { // Si hay un ID, estamos editando
        result = await updateActividad(actividadToSend.actividadId, actividadToSend);
        setActividades(actividades.map(a => a.actividadId === result.actividadId ? result : a));
        alert('Actividad actualizada con éxito!');
      } else { // Si no hay ID, estamos creando
        result = await createActividad(actividadToSend);
        setActividades([...actividades, result]);
        alert('Actividad creada con éxito!');
      }
      resetForm();
      setError(null);
    } catch (err) {
      setError('Error al guardar la actividad. Verifica los datos y el responsable.');
      console.error("Detalle del error al guardar actividad:", err);
    }
  };

  const handleEditClick = (actividad) => {
    // Para el input type="date", el valor debe ser un string en formato 'YYYY-MM-DD'
    // Si tu backend devuelve la fecha con formato de hora, deberás ajustarlo.
    const formattedDate = actividad.fecha ? new Date(actividad.fecha).toISOString().split('T')[0] : '';
    setFormData({
      ...actividad,
      fecha: formattedDate,
      responsable: {
        personaId: actividad.responsable ? actividad.responsable.personaId : ''
      }
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      actividadId: null,
      nombre: '',
      descripcion: '',
      fecha: '',
      tipo: '',
      responsable: {
        personaId: ''
      }
    });
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      try {
        await deleteActividad(id);
        setActividades(actividades.filter(a => a.actividadId !== id));
        setError(null);
        alert('Actividad eliminada con éxito!');
      } catch (err) {
        setError('Error al eliminar la actividad.');
        console.error("Detalle del error al eliminar actividad:", err);
      }
    }
  };

  // Cargar actividades y personas al montar el componente
  useEffect(() => {
    fetchActividades();
    fetchPersonasForSelect();
  }, []);

  // --- Renderizado del Componente ---

  if (loading) {
    return <div className="text-center mt-4">Cargando actividades...</div>;
  }

  return (
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Actividades de capacitación</h4>
          <button
              className="btn btn-success"
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm();
              }}
          >
            {showForm ? 'Cerrar Formulario' : '+ Agregar Actividad'}
          </button>
        </div>

        {showForm && (
            <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded shadow-sm">
              <h5 className="mb-3">{formData.actividadId ? 'Editar Actividad' : 'Nueva Actividad'}</h5>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Nombre de la actividad"
                      required
                  />
                </div>
                <div className="col-md-6">
                  <input
                      type="text"
                      className="form-control"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Descripción"
                      required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <input
                      type="text" // Asumo que 'tipo' es un string libre, como "Taller", "Charla", etc.
                      className="form-control"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      placeholder="Tipo de actividad (Ej: Taller, Charla)"
                      required
                  />
                </div>
                <div className="col-md-6">
                  <input
                      type="date"
                      className="form-control"
                      name="fecha"
                      value={formData.fecha} // Asegúrate de que el formato de fecha sea YYYY-MM-DD
                      onChange={handleChange}
                      required
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <select
                      className="form-select"
                      name="responsableId"
                      value={formData.responsable.personaId}
                      onChange={handleChange}
                      required
                  >
                    <option value="">Seleccionar Responsable</option>
                    {personas.map(p => (
                        <option key={p.personaId} value={p.personaId}>
                          {p.nombre} {p.apellido} ({p.tipoPersona})
                        </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary me-2">
                {formData.actividadId ? 'Actualizar Actividad' : 'Guardar Actividad'}
              </button>
              {formData.actividadId && (
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancelar Edición
                  </button>
              )}
            </form>
        )}

        {/* Mensaje de error (si existe) */}
        {error && <div className="alert alert-danger mt-4" role="alert">{error}</div>}

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {actividades.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No hay actividades registradas.</td>
                </tr>
            ) : (
                actividades.map(actividad => (
                    <tr key={actividad.actividadId}>
                      <td>{actividad.nombre}</td>
                      <td>{actividad.descripcion}</td>
                      <td>{actividad.tipo}</td>
                      <td>{actividad.fecha}</td>
                      <td>{actividad.responsable ? `${actividad.responsable.nombre} ${actividad.responsable.apellido}` : 'N/A'}</td>
                      <td>
                        <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEditClick(actividad)}
                        >
                          Editar
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(actividad.actividadId)}
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

export default Actividades;