import React, { useEffect, useState } from 'react';
import { getAllParticipaciones, createParticipacion, updateParticipacion, deleteParticipacion } from '../api/participacionesApi';
import { getAllPersonas } from '../api/personasApi'; // Para seleccionar el participante
import { getAllCursos } from '../api/cursosApi';     // Para seleccionar el curso
import { getAllActividades } from '../api/actividadesApi'; // Para seleccionar la actividad

function Participaciones() {
  const [participaciones, setParticipaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [actividades, setActividades] = useState([]);

  const [formData, setFormData] = useState({
    participacionId: null, // null para crear, ID para editar
    persona: { personaId: '' }, // ID de la persona
    curso: { cursoId: '' },     // ID del curso (puede ser null)
    actividad: { actividadId: '' }, // ID de la actividad (puede ser null)
    rol: '', // Ej: ALUMNO, PARTICIPANTE, ETC
    estado: '', // Ej: ACTIVO, COMPLETADO, ABANDONO
    calificacion: null // Opcional, puede ser número
  });

  // Estado para controlar qué tipo de evento se selecciona (curso o actividad)
  const [eventType, setEventType] = useState('curso'); // 'curso' o 'actividad'

  // --- Funciones para interactuar con la API ---

  const fetchParticipaciones = async () => {
    try {
      setLoading(true);
      const data = await getAllParticipaciones();
      setParticipaciones(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las participaciones. Por favor, asegúrate de que el backend esté funcionando.');
      console.error("Detalle del error al cargar participaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDependenciesForSelects = async () => {
    try {
      const personasData = await getAllPersonas();
      setPersonas(personasData);
      const cursosData = await getAllCursos();
      setCursos(cursosData);
      const actividadesData = await getAllActividades();
      setActividades(actividadesData);
    } catch (err) {
      console.error("Error al cargar datos para los selectores:", err);
      // Opcional: setError('Error al cargar opciones para el formulario.');
    }
  };

  // --- Manejo del Formulario ---

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Manejo especial para IDs de relaciones
    if (name === "personaId") {
      setFormData({ ...formData, persona: { personaId: value } });
    } else if (name === "cursoId") {
      setFormData({ ...formData, curso: { cursoId: value === "" ? null : value }, actividad: { actividadId: null } }); // Si elige curso, limpia actividad
      setEventType('curso');
    } else if (name === "actividadId") {
      setFormData({ ...formData, actividad: { actividadId: value === "" ? null : value }, curso: { cursoId: null } }); // Si elige actividad, limpia curso
      setEventType('actividad');
    } else if (name === "calificacion") {
      setFormData({ ...formData, [name]: value === "" ? null : parseFloat(value) }); // Puede ser nulo o un número
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;
      const participacionToSend = {
        ...formData,
        // Asegurarse de enviar solo el ID de persona si existe
        persona: formData.persona.personaId ? { personaId: formData.persona.personaId } : null,
        // Asegurarse de enviar SOLO curso O actividad, no ambos
        curso: eventType === 'curso' && formData.curso.cursoId ? { cursoId: formData.curso.cursoId } : null,
        actividad: eventType === 'actividad' && formData.actividad.actividadId ? { actividadId: formData.actividad.actividadId } : null,
      };

      // Si la calificación está vacía, enviarla como null
      if (participacionToSend.calificacion === "") {
        participacionToSend.calificacion = null;
      }

      // Validación básica antes de enviar
      if (!participacionToSend.persona.personaId || (!participacionToSend.curso && !participacionToSend.actividad)) {
        setError("Debe seleccionar una persona y un curso o una actividad.");
        return;
      }


      if (participacionToSend.participacionId) { // Editar
        result = await updateParticipacion(participacionToSend.participacionId, participacionToSend);
        setParticipaciones(participaciones.map(p => p.participacionId === result.participacionId ? result : p));
        alert('Participación actualizada con éxito!');
      } else { // Crear
        result = await createParticipacion(participacionToSend);
        setParticipaciones([...participaciones, result]);
        alert('Participación registrada con éxito!');
      }
      resetForm();
      setError(null);
    } catch (err) {
      setError('Error al guardar la participación. Verifica los datos.');
      console.error("Detalle del error al guardar participación:", err);
    }
  };

  const handleEditClick = (participacion) => {
    setFormData({
      ...participacion,
      persona: { personaId: participacion.persona ? participacion.persona.personaId : '' },
      curso: { cursoId: participacion.curso ? participacion.curso.cursoId : '' },
      actividad: { actividadId: participacion.actividad ? participacion.actividad.actividadId : '' },
      calificacion: participacion.calificacion !== null ? String(participacion.calificacion) : '', // Mostrar nulo como vacío en input
    });
    // Determinar el tipo de evento para el formulario de edición
    setEventType(participacion.curso ? 'curso' : (participacion.actividad ? 'actividad' : 'curso')); // Por defecto a curso si no hay ninguno
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      participacionId: null,
      persona: { personaId: '' },
      curso: { cursoId: '' },
      actividad: { actividadId: '' },
      rol: '',
      estado: '',
      calificacion: null
    });
    setEventType('curso'); // Resetea a la opción por defecto
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta participación?')) {
      try {
        await deleteParticipacion(id);
        setParticipaciones(participaciones.filter(p => p.participacionId !== id));
        setError(null);
        alert('Participación eliminada con éxito!');
      } catch (err) {
        setError('Error al eliminar la participación.');
        console.error("Detalle del error al eliminar participación:", err);
      }
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchParticipaciones();
    fetchDependenciesForSelects(); // Carga personas, cursos y actividades
  }, []);

  // --- Renderizado del Componente ---

  if (loading) {
    return <div className="text-center mt-4">Cargando participaciones...</div>;
  }

  return (
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Participaciones registradas</h4>
          <button
              className="btn btn-success"
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm();
              }}
          >
            {showForm ? 'Cerrar Formulario' : '+ Registrar Participación'}
          </button>
        </div>

        {showForm && (
            <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded shadow-sm">
              <h5 className="mb-3">{formData.participacionId ? 'Editar Participación' : 'Nueva Participación'}</h5>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="personaSelect" className="form-label visually-hidden">Seleccionar Alumno/Participante</label>
                  <select
                      className="form-select"
                      id="personaSelect"
                      name="personaId"
                      value={formData.persona.personaId}
                      onChange={handleChange}
                      required
                  >
                    <option value="">Seleccionar Alumno/Participante</option>
                    {personas.map(p => (
                        <option key={p.personaId} value={p.personaId}>
                          {p.nombre} {p.apellido} ({p.dni})
                        </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="rolInput" className="form-label visually-hidden">Rol</label>
                  <input
                      type="text"
                      className="form-control"
                      id="rolInput"
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                      placeholder="Rol (Ej: ALUMNO, ENCARGADO, PARTICIPANTE)"
                      required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="eventTypeSelect" className="form-label visually-hidden">Tipo de Evento</label>
                  <select
                      className="form-select"
                      id="eventTypeSelect"
                      value={eventType}
                      onChange={(e) => {
                        setEventType(e.target.value);
                        // Limpiar los IDs del otro tipo de evento al cambiar
                        setFormData({
                          ...formData,
                          curso: { cursoId: null },
                          actividad: { actividadId: null }
                        });
                      }}
                  >
                    <option value="curso">Curso</option>
                    <option value="actividad">Actividad</option>
                  </select>
                </div>
                <div className="col-md-6">
                  {eventType === 'curso' ? (
                      <select
                          className="form-select"
                          name="cursoId"
                          value={formData.curso.cursoId}
                          onChange={handleChange}
                          required
                      >
                        <option value="">Seleccionar Curso</option>
                        {cursos.map(c => (
                            <option key={c.cursoId} value={c.cursoId}>
                              {c.nombre}
                            </option>
                        ))}
                      </select>
                  ) : (
                      <select
                          className="form-select"
                          name="actividadId"
                          value={formData.actividad.actividadId}
                          onChange={handleChange}
                          required
                      >
                        <option value="">Seleccionar Actividad</option>
                        {actividades.map(a => (
                            <option key={a.actividadId} value={a.actividadId}>
                              {a.nombre}
                            </option>
                        ))}
                      </select>
                  )}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <label htmlFor="estadoSelect" className="form-label visually-hidden">Estado</label>
                  <select
                      className="form-select"
                      id="estadoSelect"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                  >
                    <option value="">Seleccionar Estado</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="COMPLETADO">Completado</option>
                    <option value="ABANDONO">Abandono</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="calificacionInput" className="form-label visually-hidden">Calificación</label>
                  <input
                      type="number"
                      className="form-control"
                      id="calificacionInput"
                      name="calificacion"
                      value={formData.calificacion !== null ? formData.calificacion : ''}
                      onChange={handleChange}
                      placeholder="Calificación (Opcional)"
                      min="0"
                      max="10"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary me-2">
                {formData.participacionId ? 'Actualizar Participación' : 'Guardar Participación'}
              </button>
              {formData.participacionId && (
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
              <th>Participante</th>
              <th>Tipo Evento</th>
              <th>Evento</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Calificación</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {participaciones.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No hay participaciones registradas.</td>
                </tr>
            ) : (
                participaciones.map(p => (
                    <tr key={p.participacionId}>
                      <td>{p.persona ? `${p.persona.nombre} ${p.persona.apellido}` : 'N/A'}</td>
                      <td>{p.curso ? 'Curso' : (p.actividad ? 'Actividad' : 'N/A')}</td>
                      <td>{p.curso ? p.curso.nombre : (p.actividad ? p.actividad.nombre : 'N/A')}</td>
                      <td>{p.rol}</td>
                      <td>{p.estado}</td>
                      <td>{p.calificacion !== null ? p.calificacion : 'N/A'}</td>
                      <td>
                        <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEditClick(p)}
                        >
                          Editar
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p.participacionId)}
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

export default Participaciones;