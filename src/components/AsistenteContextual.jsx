import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente de asistente contextual flotante para guiar al usuario
// Similar al asistente de la aplicación SIGA original
export default function AsistenteContextual() {
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();

  const mensajes = [
    'Bienvenido a SIGA. Selecciona un plan de suscripción para comenzar.',
    '¿Necesitas ayuda? Visita nuestra página de planes para ver las opciones disponibles.',
    'Puedes iniciar sesión para acceder a funciones avanzadas.',
  ];

  const manejarVerPlanes = () => {
    navigate('/planes');
    setAbierto(false);
  };

  return (
    <div className="asistente-contextual">
      <button
        className="toggle-asistente"
        onClick={() => setAbierto(!abierto)}
        aria-label={abierto ? 'Cerrar asistente' : 'Abrir asistente'}
        title="Asistente contextual de SIGA"
      >
        <img src="/S.png" alt="SIGA" className="siga-logo" />
      </button>
      
      {abierto && (
        <div className="asistente-panel">
          <div className="asistente-header">
            <strong>Asistente SIGA</strong>
            <button 
              className="btn-close-asistente" 
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
            >×</button>
          </div>
          <div className="asistente-contenido">
            <p>¡Hola! Soy tu asistente virtual.</p>
            <ul className="asistente-mensajes">
              {mensajes.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
            <div className="asistente-acciones">
              <button className="btn btn-sm btn-acento" onClick={manejarVerPlanes}>
                Ver planes
              </button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setAbierto(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

