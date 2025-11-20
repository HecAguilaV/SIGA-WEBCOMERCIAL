import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBar, Rocket, Lock, TrendUp, ArrowRight } from 'phosphor-react';
import '../styles/HomePage.css';

// Landing page completo de SIGA con hero, características y CTAs
export default function HomePage() {
  return (
    <>
      {/* Hero Section - SIGA Future Glass */}
      <section className="hero-section">
        {/* Fondo animado con destellos */}
        <div className="hero-background">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
        </div>

        <div className="container">
          <div className="hero-content">
            {/* Columna izquierda - Texto */}
            <div className="hero-text">
              <h1 className="hero-title">
                Gestiona tu tiempo,
                <br />
                no tu inventario
              </h1>
              <p className="hero-subtitle">
                SIGA es tu ERP simplificado. Automatiza el control de stock en tiempo real para que te enfoques en lo que realmente importa: crecer sin interrupciones.
              </p>
              <Link to="/planes" className="hero-cta">
                Comienza Gratis
                <ArrowRight size={20} weight="bold" />
              </Link>
            </div>

            {/* Columna derecha - Tarjetas flotantes con glassmorphism */}
            <div className="hero-cards">
              <div className="glass-card glass-card-1">
                <div className="glass-card-icon">
                  <ChartBar size={40} weight="fill" color="#00b4d8" />
                </div>
                <p className="glass-card-title">Reportes en Tiempo Real</p>
              </div>
              <div className="glass-card glass-card-2">
                <div className="glass-card-icon">
                  <TrendUp size={40} weight="fill" color="#80ffdb" />
                </div>
                <p className="glass-card-title">IA Predictiva</p>
              </div>
              <div className="glass-card glass-card-3">
                <div className="glass-card-icon">
                  <Lock size={40} weight="fill" color="#00b4d8" />
                </div>
                <p className="glass-card-title">100% Seguro</p>
              </div>
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
                <div className="feature-icon mb-3">
                  <ChartBar size={48} weight="fill" className="text-primario" />
                </div>
                <h3 className="h5 fw-bold text-primario mb-3">Control en Tiempo Real</h3>
                <p className="text-muted">
                  Monitorea tu inventario al instante. Actualizaciones automáticas en todos tus puntos de venta.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card h-100 p-4 rounded shadow-sm">
                <div className="feature-icon mb-3">
                  <Rocket size={48} weight="fill" className="text-primario" />
                </div>
                <h3 className="h5 fw-bold text-primario mb-3">Fácil de Usar</h3>
                <p className="text-muted">
                  Interfaz intuitiva que no requiere capacitación extensa. Tu equipo lo dominará en minutos.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card h-100 p-4 rounded shadow-sm">
                <div className="feature-icon mb-3">
                  <Lock size={48} weight="fill" className="text-primario" />
                </div>
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


