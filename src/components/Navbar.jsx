import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { obtenerUsuarioAutenticado, cerrarSesion } from '../utils/auth.js';
import { Rocket, ShoppingCart } from 'phosphor-react';

// Barra de navegación principal de la aplicación SIGA
// Diseñada con la identidad visual de la marca
export default function Navbar() {
  const navigate = useNavigate();
  const usuario = obtenerUsuarioAutenticado();

  const manejarSalir = () => {
    cerrarSesion();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-siga" aria-label="Navegación principal">
      <div className="container">
        {/* Logo y marca SIGA */}
        <Link className="navbar-brand" to="/" title="SIGA - Volver al inicio">
          <img src="/brand/Logo_SIGA.png" alt="Logo de SIGA - Volver al inicio" className="marca-logo" style={{ height: '32px', width: 'auto' }} />
        </Link>

        {/* Botón hamburguesa para móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navPrincipal"
          aria-label="Abrir menú"
          aria-expanded="false"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú de navegación */}
        <div className="collapse navbar-collapse" id="navPrincipal">
          {/* Enlaces principales */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/planes">Planes</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/acerca">Acerca de</NavLink>
            </li>
            {/* Mostrar acceso según el rol del usuario */}
            {usuario && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/perfil">Mi Perfil</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link fw-bold" to="/app">
                    <Rocket size={18} className="me-1" style={{ verticalAlign: 'middle' }} />
                    Aplicación SIGA
                  </NavLink>
                </li>
              </>
            )}
            {usuario?.rol === 'admin' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">Administrador</NavLink>
              </li>
            )}
          </ul>

          {/* Enlaces de usuario */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/carrito">
                <ShoppingCart size={18} className="me-1" style={{ verticalAlign: 'middle' }} />
                Carrito
              </NavLink>
            </li>
            {!usuario ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Iniciar Sesión</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/registro">Registro</NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {usuario.nombre}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/perfil">
                      Mi Perfil
                    </Link>
                  </li>
                  {usuario?.rol === 'admin' && (
                    <li>
                      <Link className="dropdown-item" to="/admin">
                        Panel Administrador
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={manejarSalir}>
                      Salir
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}


