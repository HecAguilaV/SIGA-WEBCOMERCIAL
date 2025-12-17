import React from 'react';

// Pie de página con identidad visual SIGA
export default function Footer() {
  return (
    <footer className="footer bg-dark text-white pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Columna Marca */}
          <div className="col-lg-4 col-md-6">
            <h3 className="h5 fw-bold text-info mb-3">SIGA</h3>
            <p className="text-white-50 small">
              Sistema Inteligente de Gestión de Activos.
              Automatiza, escala y controla tu negocio desde una sola plataforma.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="col-lg-2 col-md-6">
            <h4 className="h6 fw-bold text-white mb-3">Producto</h4>
            <ul className="list-unstyled small text-white-50">
              <li className="mb-2"><a href="/planes" className="text-decoration-none text-white-50 hover-text-white">Precios</a></li>
              <li className="mb-2"><a href="/acerca" className="text-decoration-none text-white-50 hover-text-white">Funcionalidades</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h4 className="h6 fw-bold text-white mb-3">Compañía</h4>
            <ul className="list-unstyled small text-white-50">
              <li className="mb-2"><a href="/acerca" className="text-decoration-none text-white-50 hover-text-white">Nosotros</a></li>
              <li className="mb-2"><a href="/contacto" className="text-decoration-none text-white-50 hover-text-white">Contacto</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-white-50">
          <div>© 2025 SIGA Inc. Todos los derechos reservados.</div>
          <div> > Un Soñador con Poca RAM 👨🏻‍💻</div>
        </div>
      </div>
    </footer>
  );
}


