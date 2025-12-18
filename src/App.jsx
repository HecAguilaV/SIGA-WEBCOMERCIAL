import React from 'react';
import { useLocation } from 'react-router-dom';
import { Rutas } from './router.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AsistenteIA from './components/AsistenteIA.jsx';

// Componente raíz de la aplicación que define el layout general (Navbar + Rutas + Footer + Asistente)
// El asistente no se muestra en /app porque la aplicación SIGA tiene su propio asistente
export default function App() {
  const location = useLocation();
  const estaEnApp = location.pathname === '/app';

  const isHome = location.pathname === '/';

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar y Footer no se muestran en /app ya que AppPage tiene su propio layout */}
      {!estaEnApp && <Navbar />}
      <main className="flex-grow-1" style={{ paddingTop: (!isHome && !estaEnApp) ? '80px' : '0' }}>
        <Rutas />
      </main>
      {!estaEnApp && <Footer />}
      {/* Asistente IA solo visible fuera de /app */}
      {!estaEnApp && <AsistenteIA />}
    </div>
  );
}


