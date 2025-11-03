import React from 'react';

// Pie de página con identidad visual SIGA
export default function Footer() {
  return (
    <footer className="bg-primario text-white mt-auto py-4">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-2">
              <strong>SIGA</strong> - Sistema Inteligente de Gestión de Activos
            </p>
            <p className="mb-0">
              <small>
                © {new Date().getFullYear()} Todos los derechos reservados | 
                Portal Comercial y Gestión de Suscripciones
              </small>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


