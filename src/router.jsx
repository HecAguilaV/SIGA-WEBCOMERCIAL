import React from 'react';
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
import { obtenerUsuarioAutenticado } from './utils/auth.js';

// Ruta protegida para usuarios autenticados (clientes y admins)
function RutaAutenticada({ children }) {
  const usuario = obtenerUsuarioAutenticado();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function Rutas() {
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


