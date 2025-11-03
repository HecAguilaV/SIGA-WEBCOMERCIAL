import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { obtenerUsuarioAutenticado, cerrarSesion } from '../utils/auth.js';

// Página protegida que muestra la aplicación SIGA real (prototipo)
// Solo accesible para usuarios autenticados (clientes o admins)
export default function AppPage() {
  const navigate = useNavigate();
  const usuario = obtenerUsuarioAutenticado();
  const [cargando, setCargando] = useState(true);

  // Si no hay usuario autenticado, redirigir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const manejarCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  const manejarVolver = () => {
    navigate('/');
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header con información del usuario y acciones */}
      <div className="bg-primario text-white p-3 d-flex justify-content-between align-items-center shadow-sm flex-shrink-0">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <span className="fw-bold">🚀 Aplicación SIGA</span>
          <span className="badge bg-light text-dark">
            {usuario.nombre} ({usuario.rol})
          </span>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-light"
            onClick={manejarVolver}
            title="Volver al portal comercial"
          >
            ← Volver al portal
          </button>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={manejarCerrarSesion}
            title="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Indicador de carga */}
      {cargando && (
        <div className="bg-light p-3 text-center flex-shrink-0">
          <div className="spinner-border spinner-border-sm text-primario me-2" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <small className="text-muted">Cargando aplicación SIGA...</small>
        </div>
      )}

      {/* Iframe con la aplicación SIGA real */}
      <iframe
        src="https://siga-prototipo.vercel.app/"
        title="SIGA - Sistema de Gestión de Activos"
        style={{
          width: '100%',
          flex: '1',
          border: 'none',
          display: 'block',
        }}
        allow="fullscreen"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-modals"
        onLoad={() => setCargando(false)}
      />
    </div>
  );
}

