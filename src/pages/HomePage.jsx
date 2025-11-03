import React from 'react';
import { Link } from 'react-router-dom';

// Landing page completo de SIGA con hero, características y CTAs
export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient py-5 mb-6">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="etiqueta-badge mb-3 d-inline-block">Sistema Inteligente de Gestión de Activos</span>
              <h1 className="display-4 fw-bold heading-gradient mb-4">
                Gestiona tu tiempo, no tu inventario
              </h1>
              <p className="lead mb-4">
                SIGA es tu ERP simplificado. Automatiza el control de stock en tiempo real para que te enfoques en lo que realmente importa: crecer sin interrupciones.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/planes" className="btn btn-acento btn-lg">
                  Ver planes de suscripción
                </Link>
                <Link to="/acerca" className="btn btn-outline-secondary btn-lg">
                  Conoce más sobre SIGA
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="/brand/Mockup_Web.png" 
                alt="SIGA Dashboard" 
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Características principales */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primario mb-3">¿Por qué elegir SIGA?</h2>
            <p className="lead text-muted">La solución completa para gestionar tu inventario y punto de venta</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card h-100 p-4 rounded shadow-sm">
                <div className="feature-icon mb-3">📊</div>
                <h3 className="h5 fw-bold text-primario mb-3">Control en Tiempo Real</h3>
                <p className="text-muted">
                  Monitorea tu inventario al instante. Actualizaciones automáticas en todos tus puntos de venta.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card h-100 p-4 rounded shadow-sm">
                <div className="feature-icon mb-3">🚀</div>
                <h3 className="h5 fw-bold text-primario mb-3">Fácil de Usar</h3>
                <p className="text-muted">
                  Interfaz intuitiva que no requiere capacitación extensa. Tu equipo lo dominará en minutos.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card h-100 p-4 rounded shadow-sm">
                <div className="feature-icon mb-3">🔒</div>
                <h3 className="h5 fw-bold text-primario mb-3">Seguro y Confiable</h3>
                <p className="text-muted">
                  Tus datos protegidos en la nube con respaldos automáticos y encriptación de punta a punta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-6 fw-bold text-primario mb-3">
                ¿Listo para comenzar?
              </h2>
              <p className="lead mb-4">
                Elige el plan que mejor se adapte a tu negocio y comienza a gestionar tu inventario como un profesional.
              </p>
              <Link to="/planes" className="btn btn-acento btn-lg px-5">
                Ver planes disponibles
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


