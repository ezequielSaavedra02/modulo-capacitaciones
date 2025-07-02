import React, { useEffect, useState } from 'react';
import { getAllCursos, createCurso, updateCurso, deleteCurso } from '../api/cursosApi'; // Importa las funciones de la API
import { getAllPersonas } from '../api/personasApi'; // Necesitamos esto para el selector de responsable

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [personas, setPersonas] = useState([]); // Estado para almacenar la lista de personas (responsables)
  const [formData, setFormData] = useState({
    cursoId: null, // null para crear, ID para editar
    nombre: '',
    descripcion: '',
    duracion: '', // Asumo que es un número
    modalidad: '',
    responsable: {
      personaId: '' // ID del responsable
    }
  });

  // --- Funciones para interactuar con la API ---

  const fetchCursos = async () => {
    try {
      setLoading(true);
      const data = await getAllCursos();
      setCursos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los cursos. Por favor, asegúrate de que el backend esté funcionando.');
      console.error("Detalle del error al cargar cursos:", err);
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
      // Opcional: setError('Error al cargar opciones de responsables.');
    }
  };

  // --- Manejo del Formulario ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "responsableId") { // Si el campo es el ID del responsable
      setFormData({
        ...formData,
        responsable: {
          personaId: value // Actualiza solo el ID del responsable
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
      // Convertir duración a número si es necesario (el backend espera un Integer)
      const cursoToSend = {
        ...formData,
        duracion: formData.duracion ? parseInt(formData.duracion) : null,
        // Asegurarse de que el responsable solo envía el ID si existe
        responsable: formData.responsable.personaId ? { personaId: formData.responsable.personaId } : null
      };


      if (cursoToSend.cursoId) { // Si hay un ID, estamos editando
        result = await updateCurso(cursoToSend.cursoId, cursoToSend);
        setCursos(cursos.map(c => c.cursoId === result.cursoId ? result : c));
        alert('Curso actualizado con éxito!');
      } else { // Si no hay ID, estamos creando
        result = await createCurso(cursoToSend);
        setCursos([...cursos, result]);
        alert('Curso creado con éxito!');
      }
      resetForm(); // Limpia el formulario y lo cierra
      setError(null);
    } catch (err) {
      setError('Error al guardar el curso. Verifica los datos y el responsable.');
      console.error("Detalle del error al guardar curso:", err);
    }
  };

  const handleEditClick = (curso) => {
    // Asegurarse de que formData tenga el objeto responsable.personaId para el selector
    setFormData({
      ...curso,
      duracion: curso.duracion ? String(curso.duracion) : '', // Convertir a string para input type="text"
      responsable: {
        personaId: curso.responsable ? curso.responsable.personaId : ''
      }
    });
    setShowForm(true); // Abre el formulario para editar
  };

  const resetForm = () => {
    setFormData({
      cursoId: null,
      nombre: '',
      descripcion: '',
      duracion: '',
      modalidad: '',
      responsable: {
        personaId: ''
      }
    });
    setShowForm(false); // Cierra el formulario
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      try {
        await deleteCurso(id);
        setCursos(cursos.filter(c => c.cursoId !== id));
        setError(null);
        alert('Curso eliminado con éxito!');
      } catch (err) {
        setError('Error al eliminar el curso.');
        console.error("Detalle del error al eliminar curso:", err);
      }
    }
  };

  // Cargar cursos y personas al montar el componente
  useEffect(() => {
    fetchCursos();
    fetchPersonasForSelect();
  }, []);

  // --- Renderizado del Componente ---

  if (loading) {
    return <div className="text-center mt-4">Cargando cursos...</div>;
  }

  return (
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0">Cursos disponibles</h4>
          <button
              className="btn btn-success"
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) resetForm(); // Si se cierra el formulario, resetéalo
              }}
          >
            {showForm ? 'Cerrar Formulario' : '+ Agregar Curso'}
          </button>
        </div>

        {/* Formulario de Agregar/Editar Curso */}
        {showForm && (
            <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded shadow-sm">
              <h5 className="mb-3">{formData.cursoId ? 'Editar Curso' : 'Nuevo Curso'}</h5>
              <div className="row mb-3">
                <div className="col-md-6 mb-3 mb-md-0">
                  <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Nombre del curso"
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
                <div className="col-md-4 mb-3 mb-md-0">
                  <input
                      type="number" // Cambiado a number para mejor validación
                      className="form-control"
                      name="duracion"
                      value={formData.duracion}
                      onChange={handleChange}
                      placeholder="Duración (en horas)"
                      required
                  />
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <select
                      className="form-select"
                      name="modalidad"
                      value={formData.modalidad}
                      onChange={handleChange}
                      required
                  >
                    <option value="">Seleccionar Modalidad</option>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="VIRTUAL">Virtual</option>
                    <option value="HIBRIDO">Híbrido</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <select
                      className="form-select"
                      name="responsableId" // Cambiado a responsableId para el selector
                      value={formData.responsable.personaId} // Accede al ID dentro del objeto responsable
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
                {formData.cursoId ? 'Actualizar Curso' : 'Guardar Curso'}
              </button>
              {formData.cursoId && ( // Solo muestra "Cancelar Edición" si estamos editando
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
              <th>Duración (hs)</th>
              <th>Modalidad</th>
              <th>Responsable</th>
              <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            {cursos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No hay cursos registrados.</td>
                </tr>
            ) : (
                cursos.map(curso => (
                    <tr key={curso.cursoId}>
                      <td>{curso.nombre}</td>
                      <td>{curso.descripcion}</td>
                      <td>{curso.duracion}</td>
                      <td>{curso.modalidad}</td>
                      <td>{curso.responsable ? `${curso.responsable.nombre} ${curso.responsable.apellido}` : 'N/A'}</td>
                      <td>
                        <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEditClick(curso)}
                        >
                          Editar
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(curso.cursoId)}
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

export default Cursos;