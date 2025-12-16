import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Package, CheckCircle, Users, Storefront, Robot,
    ChatCircle, ChartBar, Rocket, Warning, Gift, Sparkle
} from 'phosphor-react';

export default function PlanActualCard({
    planActual,
    limites,
    planCrecimiento,
    manejarActualizarACrecimiento,
    errorSSO,
    cargandoSSO,
    manejarAccederAWebApp
}) {
    const navigate = useNavigate();

    // Si no hay plan, mostrar alerta
    if (!planActual) {
        return (
            <div className="row mb-4">
                <div className="col-lg-10 mx-auto">
                    <div className="alert alert-warning" role="alert">
                        <strong>
                            <Warning size={18} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
                            Aún no tienes un plan activo
                        </strong>
                        <p className="mb-0 mt-2">
                            Explora nuestros planes de suscripción y elige el que mejor se adapte a tu
                            negocio.
                        </p>
                        <Link to="/planes" className="btn btn-outline-primary mt-3">
                            Ver Planes Disponibles
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="row mb-5">
            <div className="col-lg-12">
                <div className="plan-actual-card">
                    <div className="plan-actual-header">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0 text-primario">
                                <Package size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                                Tu Plan Actual
                            </h4>
                            <span className="badge bg-acento text-white px-3 py-2">
                                {planActual.nombre}
                            </span>
                        </div>
                    </div>
                    <div className="plan-actual-body">
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h5 className="fw-bold text-primario mb-3">
                                    {planActual.precio} {planActual.unidad}/mes
                                </h5>
                                <h6 className="text-muted mb-3">Beneficios incluidos:</h6>
                                <ul className="list-unstyled">
                                    {planActual.caracteristicas?.map((caracteristica, index) => (
                                        <li key={index} className="mb-2">
                                            <CheckCircle size={16} weight="fill" className="text-success me-2" style={{ verticalAlign: 'middle' }} />
                                            {caracteristica}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <h6 className="text-muted mb-3">Límites de tu plan:</h6>
                                {limites && (
                                    <ul className="list-unstyled">
                                        <li className="mb-2">
                                            <Users size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                                            <strong>Usuarios:</strong>{' '}
                                            {limites.usuarios === -1 ? 'Ilimitados' : limites.usuarios}
                                        </li>
                                        <li className="mb-2">
                                            <Storefront size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                                            <strong>Bodegas/Sucursales:</strong>{' '}
                                            {limites.bodegas === -1 ? 'Ilimitadas' : limites.bodegas}
                                        </li>
                                        {limites.asistenteSIGA && (
                                            <li className="mb-2">
                                                <Robot size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                                                <strong>Asistente SIGA:</strong> Incluido (con Inteligencia Artificial)
                                            </li>
                                        )}
                                        <li className="mb-2">
                                            <Package size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                                            <strong>Productos:</strong>{' '}
                                            {limites.productos === -1 ? 'Ilimitados' : limites.productos}
                                        </li>
                                        <li className="mb-2">
                                            <ChartBar size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                                            <strong>Reportes:</strong> {limites.reportes}
                                        </li>
                                        <li className="mb-2">
                                            <ChatCircle size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                                            <strong>Soporte:</strong> {limites.soporte}
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Sección de Acceso a WebApp */}
                        {planActual.esFreemium === false && (
                            <div className="card mb-4 border-primary">
                                <div className="card-body">
                                    <h5 className="card-title d-flex align-items-center text-primario">
                                        <Rocket size={24} weight="fill" className="me-2" />
                                        Acceder a WebApp
                                    </h5>
                                    <p className="card-text text-muted">
                                        Accede a tu aplicación SIGA para gestionar tu negocio, inventario y ventas.
                                    </p>

                                    {errorSSO && (
                                        <div className="alert alert-warning mb-3" role="alert">
                                            <Warning size={20} className="me-2" />
                                            {errorSSO}
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={manejarAccederAWebApp}
                                        disabled={cargandoSSO}
                                    >
                                        {cargandoSSO ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Conectando...
                                            </>
                                        ) : (
                                            <>
                                                <Rocket size={20} weight="fill" className="me-2" />
                                                Acceder a WebApp
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Opción de actualizar al plan Crecimiento */}
                        {planActual.nombre !== 'Crecimiento' && planCrecimiento && (
                            <div className="alert alert-info mt-4" role="alert">
                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div>
                                        <strong>
                                            <Rocket size={18} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
                                            ¿Necesitas más?
                                        </strong>
                                        <p className="mb-0 mt-2">
                                            Actualiza al plan <strong>{planCrecimiento.nombre}</strong> y obtén
                                            usuarios ilimitados, bodegas ilimitadas, reportes completos con IA y
                                            soporte prioritario 24/7.
                                        </p>
                                    </div>
                                    <button
                                        className="btn btn-acento mt-3 mt-md-0"
                                        onClick={manejarActualizarACrecimiento}
                                    >
                                        Actualizar a {planCrecimiento.nombre}
                                    </button>
                                </div>
                            </div>
                        )}

                        {planActual.nombre === 'Crecimiento' && (
                            <div className="alert alert-success mt-4" role="alert">
                                <strong>
                                    <Sparkle size={18} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
                                    ¡Excelente!
                                </strong> Ya tienes el plan más completo. Disfruta de
                                todas las funcionalidades de SIGA sin límites.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
