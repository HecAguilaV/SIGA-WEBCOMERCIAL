import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlanesPage from './pages/PlanesPage.jsx';
import AcercaPage from './pages/AcercaPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistroPage from './pages/RegistroPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import CarritoPage from './pages/CarritoPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import CompraExitosaPage from './pages/CompraExitosaPage.jsx';
import DocsPage from './pages/DocsPage.jsx';
import MigrationPage from './pages/MigrationPage.jsx';
import { obtenerUsuarioAutenticado } from './utils/auth.js';
import { MAINTENANCE_MODE } from './services/api.js';

// Ruta protegida para usuarios autenticados (clientes y admins)
function RutaAutenticada({ children }) {
  const usuario = obtenerUsuarioAutenticado();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function Rutas() {
  const [isBackendDown, setIsBackendDown] = useState(MAINTENANCE_MODE);

  useEffect(() => {
    // Escuchar errores de conexión globales
    const handleConnectionError = () => {
      setIsBackendDown(true);
    };

    window.addEventListener('backend-connection-error', handleConnectionError);
    return () => window.removeEventListener('backend-connection-error', handleConnectionError);
  }, []);

  // Si el backend está en mantenimiento o caído, interceptamos CIERTAS rutas o todo el flujo
  // Para no romper la experiencia, permitimos que las páginas informativas se vean,
  // pero si intentan ir a rutas que requieren backend, los llevamos a la página de migración.
  if (isBackendDown) {
    return (
      <Routes>
        {/* Vistas públicas informativas (Sin dependencia de Backend) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/acerca" element={<AcercaPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/mantenimiento" element={<MigrationPage />} />

        {/* Vistas que REQUIEREN backend -> Redirigir a Mantenimiento */}
        <Route path="/login" element={<MigrationPage />} />
        <Route path="/registro" element={<MigrationPage />} />
        <Route path="/planes" element={<MigrationPage />} />
        <Route path="/perfil" element={<MigrationPage />} />
        <Route path="/checkout" element={<MigrationPage />} />
        <Route path="/carrito" element={<MigrationPage />} />
        <Route path="/reset-password" element={<MigrationPage />} />
        
        {/* Fallback general */}
        <Route path="*" element={<Navigate to="/mantenimiento" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Vistas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/planes" element={<PlanesPage />} />
      <Route path="/acerca" element={<AcercaPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/carrito" element={<CarritoPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/exito" element={<CompraExitosaPage />} />
      <Route path="/mantenimiento" element={<MigrationPage />} />

      {/* Vistas protegidas - Solo usuarios autenticados */}
      <Route
        path="/perfil"
        element={
          <RutaAutenticada>
            <PerfilPage />
          </RutaAutenticada>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


