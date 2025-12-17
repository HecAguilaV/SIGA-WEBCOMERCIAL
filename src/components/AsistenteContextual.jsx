import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Microphone, X, PaperPlaneRight } from 'phosphor-react';
import '../styles/AsistenteIA.css';

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
        <div className="panel-chat glass-panel">
          <div className="panel-header">
            <h3>✨ Asistente SIGA</h3>
            <button
              className="btn-close-asistente"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="mensajes-area">
            <div className="mensaje-bienvenida">
              <p>Hola, aquí tienes algunas sugerencias:</p>
            </div>
            {/* Mensajes del sistema */}
            {mensajes.map((msg, i) => (
              <div key={i} className="mensaje siga">
                <p>{msg}</p>
              </div>
            ))}

            {/* Acciones sugeridas (ahora dentro del chat como botones opción) */}
            <div className="asistente-acciones" style={{ marginTop: '1rem' }}>
              <button className="btn-sm btn-acento" onClick={manejarVerPlanes}>
                Ver planes
              </button>
              <button className="btn-sm btn-outline-secondary" onClick={() => setAbierto(false)}>
                Cerrar
              </button>
            </div>
          </div>

          {/* Footer tipo Input Chat (Copia visual exacta WebApp) */}
          <form className="input-area" onSubmit={(e) => e.preventDefault()}>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Escribe aquí..."
                className="mensaje-input"
              />
              <button type="button" className="btn-mic">
                <Microphone size={20} weight="regular" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
