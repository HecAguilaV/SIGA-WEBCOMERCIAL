import React, { useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { obtenerUsuarioAutenticado, cerrarSesion } from '../utils/auth.js';
import { Rocket, ShoppingCart } from 'phosphor-react';

// Barra de navegación principal de la aplicación SIGA
// Diseñada con la identidad visual de la marca
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = obtenerUsuarioAutenticado();
  const navbarCollapseRef = useRef(null);

  const manejarSalir = () => {
    cerrarSesion();
    navigate('/');
  };

  // Función para cerrar el menú hamburguesa
  const cerrarMenu = () => {
    if (navbarCollapseRef.current) {
      // Verificar si el menú está visible (tiene la clase 'show')
      const estaAbierto = navbarCollapseRef.current.classList.contains('show');
      
      if (estaAbierto) {
        // Intentar usar Bootstrap Collapse API si está disponible
        if (window.bootstrap?.Collapse) {
          const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapseRef.current);
          if (bsCollapse) {
            bsCollapse.hide();
            return;
          }
        }
        
        // Fallback: cerrar manualmente removiendo clases y atributos
        navbarCollapseRef.current.classList.remove('show');
        const toggler = document.querySelector('[data-bs-target="#navPrincipal"]');
        if (toggler) {
          toggler.setAttribute('aria-expanded', 'false');
          toggler.classList.add('collapsed');
        }
      }
    }
  };

  // Cerrar menú cuando cambia la ruta (al seleccionar una página)
  useEffect(() => {
    cerrarMenu();
  }, [location.pathname]);

  // Cerrar menú al hacer scroll hacia abajo
  useEffect(() => {
    let ultimaPosicionScroll = window.scrollY;
    let ticking = false;

    const manejarScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const posicionActual = window.scrollY;
          
          // Si el usuario hace scroll hacia abajo (más de 50px), cerrar el menú
          if (posicionActual > ultimaPosicionScroll && posicionActual > 50) {
            cerrarMenu();
          }
          
          ultimaPosicionScroll = posicionActual;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', manejarScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', manejarScroll);
    };
  }, []);

  // Cerrar menú al hacer click en cualquier NavLink
  const manejarClickNavLink = () => {
    // Pequeño delay para permitir que la navegación ocurra primero
    setTimeout(() => {
      cerrarMenu();
    }, 100);
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
        <div className="collapse navbar-collapse" id="navPrincipal" ref={navbarCollapseRef}>
          {/* Enlaces principales */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={manejarClickNavLink}>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/planes" onClick={manejarClickNavLink}>Planes</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/acerca" onClick={manejarClickNavLink}>Acerca de</NavLink>
            </li>
            {/* Mostrar acceso según el rol del usuario */}
            {usuario && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/perfil" onClick={manejarClickNavLink}>Mi Perfil</NavLink>
                </li>
                {/* Mostrar acceso a WebApp solo si tiene suscripción activa (plan de pago o trial activo) */}
                {usuario.planId && (
                  <li className="nav-item">
                    <NavLink className="nav-link fw-bold" to="/perfil" onClick={manejarClickNavLink}>
                      <Rocket size={18} className="me-1" style={{ verticalAlign: 'middle' }} />
                      Acceder a WebApp
                    </NavLink>
                  </li>
                )}
              </>
            )}
            {usuario?.rol === 'admin' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin" onClick={manejarClickNavLink}>Administrador</NavLink>
              </li>
            )}
          </ul>

          {/* Enlaces de usuario */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/carrito" onClick={manejarClickNavLink}>
                <ShoppingCart size={18} className="me-1" style={{ verticalAlign: 'middle' }} />
                Carrito
              </NavLink>
            </li>
            {!usuario ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login" onClick={manejarClickNavLink}>Iniciar Sesión</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/registro" onClick={manejarClickNavLink}>Registro</NavLink>
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
                    <Link className="dropdown-item" to="/perfil" onClick={manejarClickNavLink}>
                      Mi Perfil
                    </Link>
                  </li>
                  {usuario?.rol === 'admin' && (
                    <li>
                      <Link className="dropdown-item" to="/admin" onClick={manejarClickNavLink}>
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


