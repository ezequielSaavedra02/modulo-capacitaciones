import React, { useState } from 'react';
import Cursos from './components/Cursos';
import Actividades from './components/Actividades';
import Participaciones from './components/Participaciones';
import PersonasList from './components/PersonasList.jsx'; // Asegúrate de que la extensión sea .jsx aquí también

function App() {
    const [activeTab, setActiveTab] = useState('personas'); // Cambié la pestaña inicial a 'personas'

    return (
        <div className='container pt-2'>
            <h1
                className="mb-4 text-center"
                style={{
                    borderBottom: '3px solid rgb(15, 15, 16)',
                    paddingBottom: '10px',
                }}
            >
                Capacitaciones
            </h1>

            <div className="d-flex justify-content-start mb-4">
                {/* NUEVO: Botón para la pestaña de Personas */}
                <button
                    className={`btn me-2 ${activeTab === 'personas' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('personas')}
                >
                    Personas
                </button>
                <button
                    className={`btn me-2 ${activeTab === 'cursos' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('cursos')}
                >
                    Cursos
                </button>
                <button
                    className={`btn me-2 ${activeTab === 'actividades' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('actividades')}
                >
                    Actividades
                </button>
                <button
                    className={`btn ${activeTab === 'participaciones' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('participaciones')}
                >
                    Participaciones
                </button>
            </div>

            <div>
                {/* NUEVO: Renderiza el componente PersonasList cuando la pestaña 'personas' está activa */}
                {activeTab === 'personas' && <PersonasList />}
                {activeTab === 'cursos' && <Cursos />}
                {activeTab === 'actividades' && <Actividades />}
                {activeTab === 'participaciones' && <Participaciones />}
            </div>
        </div>
    );
}

export default App;