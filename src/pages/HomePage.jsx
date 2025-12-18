import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBar, Rocket, Lock, TrendUp, ArrowRight, ChartLineUp, Storefront } from 'phosphor-react';
import '../styles/HomePage.css';

// Landing page completo de SIGA con hero, características y CTAs
export default function HomePage() {
  return (
    <>
      {/* Hero Section - SIGA Modern SaaS */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
        </div>

        <div className="container">
          <div className="hero-content">
            {/* Texto Hero */}
            <div className="hero-text">

              <h1 className="hero-title">
                No gestiones tu inventario, <br />Gestiona tu tiempo.
              </h1>
              <p className="hero-subtitle">
                La plataforma inteligente que centraliza ventas, stock y facturación.
                Toma decisiones basadas en datos reales, no en intuición.
              </p>
              <div className="hero-actions">
                <Link to="/planes" className="hero-btn-primary">
                  Comenzar Gratis <ArrowRight size={20} weight="bold" />
                </Link>
                <Link to="/acerca" className="hero-btn-secondary">
                  Cómo funciona
                </Link>
              </div>
            </div>

            {/* Visuals / Glass Mockup */}
            <div className="hero-visuals d-none d-lg-block">
              {/* Contenedor del Video con marco de dispositivo estilizado */}
              <div className="glass-dashboard p-2" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(20px)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="video-wrapper position-relative overflow-hidden" style={{ borderRadius: '12px', height: '350px' }}>
                  <img
                    src="/brand/Dashboard.png"
                    alt="Dashboard SIGA"
                    className="w-100 h-100"
                    style={{ display: 'block', objectFit: 'cover', objectPosition: 'top' }}
                  />

                  {/* Overlay sutil para integrar con el fondo */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(3,4,94,0.1), transparent)' }}></div>
                </div>

                {/* Elementos flotantes sobre el video (Efecto AR) */}
                <div className="floating-card card-sales">
                  <div className="icon-circle bg-success bg-opacity-25 text-success p-2 rounded-circle">
                    <ChartLineUp size={24} weight="fill" color="#4cc9f0" />
                  </div>
                  <div>
                    <div className="stat-value">+24%</div>
                    <div className="stat-label">Crecimiento</div>
                  </div>
                </div>

                <div className="floating-card card-users">
                  <div className="icon-circle bg-info bg-opacity-25 text-info p-2 rounded-circle">
                    <Storefront size={24} weight="fill" color="#4cc9f0" />
                  </div>
                  <div>
                    <div className="stat-value">12</div>
                    <div className="stat-label">Locales Conectados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold text-primario mb-3">Todo lo que necesitas</h2>
            <p className="lead text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Herramientas potentes diseñadas para emprendedores modernos.
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="modern-card">
                <div className="icon-box">
                  <ChartBar size={32} weight="fill" />
                </div>
                <h3 className="h4 fw-bold mb-3">Analytics Real-Time</h3>
                <p className="text-muted">
                  Visualiza tus ventas al instante. Detecta tendencias y ajusta tu estrategia sobre la marcha.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="modern-card">
                <div className="icon-box">
                  <Rocket size={32} weight="fill" />
                </div>
                <h3 className="h4 fw-bold mb-3">IA Predictiva</h3>
                <p className="text-muted">
                  Nuestro asistente te avisa cuándo reponer stock antes de que te quedes sin productos.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="modern-card">
                <div className="icon-box">
                  <Lock size={32} weight="fill" />
                </div>
                <h3 className="h4 fw-bold mb-3">Seguridad Total</h3>
                <p className="text-muted">
                  Tus datos encriptados y respaldados en la nube. Accede desde cualquier lugar, 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Banner - Connected to Identity */}
      <section className="mission-banner py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="modern-card bg-primario text-white text-center p-5 border-0 position-relative overflow-hidden">
            {/* Decorative Background */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(135deg, rgba(3,4,94,0.95), rgba(0,180,216,0.8))', zIndex: 0 }}></div>

            <div className="position-relative" style={{ zIndex: 1 }}>
              <h3 className="h2 fw-bold mb-4">Nuestra Filosofía</h3>
              <p className="lead fst-italic" style={{ maxWidth: '800px', margin: '0 auto', opacity: 0.95, fontSize: '1.5rem' }}>
                "No gestiones tu inventario, gestiona tu tiempo."
              </p>
              <div className="mt-4 pt-3 border-top border-light opacity-50 w-25 mx-auto"></div>
              <p className="mt-3 text-uppercase tracking-wider fw-bold text-acento">
                QUE EL EMPRENDEDOR NUNCA SE DETENGA
              </p>
              <p className="small opacity-75 mt-2">
                Transformamos la parálisis operativa en libertad de crecimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-white">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold text-primario mb-3">
                Tu negocio merece escalar
              </h2>
              <p className="lead mb-4 text-muted">
                Únete a los comercios que ya están transformando su gestión con SIGA.
              </p>
              <Link to="/planes" className="btn btn-acento btn-lg px-5 py-3 rounded-pill fw-bold shadow">
                Ver Planes y Precios
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


