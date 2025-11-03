import React from 'react';
import { Link } from 'react-router-dom';

// Página "Acerca de" con información sobre SIGA, misión, visión y valores
export default function AcercaPage() {
  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-4 fw-bold text-primario mb-4">Acerca de SIGA</h1>
            <p className="lead text-muted">
              Sistema Inteligente de Gestión de Activos - Tu partner tecnológico para el crecimiento de tu negocio
            </p>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <h2 className="h4 fw-bold text-primario mb-3">🎯 Nuestra Misión</h2>
                <p className="text-muted mb-0">
                  Simplificar la gestión de inventarios para empresas de todos los tamaños, 
                  proporcionando herramientas intuitivas y poderosas que permitan a nuestros 
                  clientes enfocarse en lo que realmente importa: hacer crecer su negocio.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <h2 className="h4 fw-bold text-primario mb-3">👁️ Nuestra Visión</h2>
                <p className="text-muted mb-0">
                  Ser la plataforma de gestión de inventarios más confiable y fácil de usar 
                  en el mercado, reconocida por nuestra innovación constante y nuestro 
                  compromiso con el éxito de nuestros clientes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Qué es SIGA */}
        <div className="row mb-5">
          <div className="col-lg-10 mx-auto">
            <div className="card shadow-sm border-0">
              <div className="card-body p-5">
                <h2 className="h3 fw-bold text-primario mb-4">¿Qué es SIGA?</h2>
                <p className="text-muted mb-4">
                  SIGA (Sistema Inteligente de Gestión de Activos) es una solución SaaS completa 
                  diseñada para gestionar inventarios y puntos de venta de manera eficiente y en tiempo real.
                </p>
                <p className="text-muted mb-4">
                  Nuestra plataforma permite a las empresas controlar sus productos, monitorear ventas, 
                  generar reportes y tomar decisiones informadas basadas en datos precisos. Todo desde 
                  una interfaz moderna y accesible desde cualquier dispositivo.
                </p>
                <div className="row g-3 mt-4">
                  <div className="col-md-4">
                    <div className="text-center p-3">
                      <div className="fs-1 mb-2">⚡</div>
                      <h5 className="fw-bold text-primario">Rápido</h5>
                      <p className="small text-muted mb-0">Implementación en minutos</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3">
                      <div className="fs-1 mb-2">💰</div>
                      <h5 className="fw-bold text-primario">Económico</h5>
                      <p className="small text-muted mb-0">Planes flexibles y accesibles</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3">
                      <div className="fs-1 mb-2">📈</div>
                      <h5 className="fw-bold text-primario">Escalable</h5>
                      <p className="small text-muted mb-0">Crece con tu negocio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="row mb-5">
          <div className="col-lg-10 mx-auto">
            <h2 className="h3 fw-bold text-primario text-center mb-4">Nuestros Valores</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="text-center p-3">
                  <div className="fs-2 mb-3">🤝</div>
                  <h5 className="fw-bold text-primario mb-2">Compromiso</h5>
                  <p className="small text-muted">
                    Nos comprometemos con el éxito de cada cliente, ofreciendo soporte continuo 
                    y mejoras constantes.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-3">
                  <div className="fs-2 mb-3">🎨</div>
                  <h5 className="fw-bold text-primario mb-2">Simplicidad</h5>
                  <p className="small text-muted">
                    Creemos que la tecnología debe ser accesible para todos, sin complicaciones innecesarias.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-3">
                  <div className="fs-2 mb-3">🔬</div>
                  <h5 className="fw-bold text-primario mb-2">Innovación</h5>
                  <p className="small text-muted">
                    Estamos en constante evolución, incorporando las mejores prácticas y tecnologías.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <div className="card bg-primario text-white shadow-lg border-0">
              <div className="card-body p-5">
                <h2 className="h3 fw-bold mb-3">¿Quieres saber más?</h2>
                <p className="lead mb-4">
                  Explora nuestros planes de suscripción y descubre cómo SIGA puede transformar la gestión de tu inventario.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Link to="/planes" className="btn btn-light btn-lg">
                    Ver planes disponibles
                  </Link>
                  <Link to="/registro" className="btn btn-outline-light btn-lg">
                    Comenzar gratis
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

