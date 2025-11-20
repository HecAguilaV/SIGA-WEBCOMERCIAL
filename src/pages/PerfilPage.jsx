import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerUsuarioAutenticado, guardarPlanEnCarrito, guardarUsuarioAutenticado } from '../utils/auth.js';
import { 
  HandWaving, Rocket, Package, ShoppingCart, Clock, CreditCard, Gift, Sparkle, 
  Warning, FileText, ClipboardText, CheckCircle, Users, Storefront, Robot, 
  ChatCircle, UserCircle, ChartBar
} from 'phosphor-react';
import { 
  obtenerPlanDelUsuario, 
  obtenerLimitesDelPlan, 
  leerPlanes,
  verificarTrialActivo,
  iniciarFreeTrial,
  puedeIniciarTrial,
  convertirTrialAPagado,
  obtenerFacturasDelUsuario,
} from '../datos/datosSimulados.js';
import { formatearPrecioCLP } from '../utils/indicadoresEconomicos.js';
import FacturaComponent from '../components/FacturaComponent.jsx';

// Página de perfil/dashboard para clientes
// Vista personalizada diferente del panel de administrador
// Incluye gestión de free trial de 14 días
export default function PerfilPage() {
  const navigate = useNavigate();
  const usuario = obtenerUsuarioAutenticado();
  const [trialInfo, setTrialInfo] = useState(null);
  const [puedeTrial, setPuedeTrial] = useState(false);
  const [facturas, setFacturas] = useState([]); // Estado para almacenar las facturas del usuario
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null); // Factura seleccionada para ver/imprimir

  if (!usuario) {
    return null;
  }

  // Obtener plan del usuario (primero desde localStorage, luego desde datos simulados)
  const planes = leerPlanes();
  let planActual = null;
  if (usuario.planId) {
    planActual = planes.find((p) => p.id === usuario.planId);
  } else {
    planActual = obtenerPlanDelUsuario(usuario.id);
    // Si hay plan en datos simulados pero no en localStorage, sincronizar
    if (planActual && !usuario.planId) {
      usuario.planId = planActual.id;
      guardarUsuarioAutenticado(usuario);
    }
  }

  // Verificar trial activo y capacidad de iniciar trial
  useEffect(() => {
    const trial = verificarTrialActivo(usuario.id);
    setTrialInfo(trial);
    setPuedeTrial(puedeIniciarTrial(usuario.id));
  }, [usuario.id]);

  // Cargar facturas del usuario al montar el componente
  useEffect(() => {
    if (usuario && usuario.id) {
      const facturasUsuario = obtenerFacturasDelUsuario(usuario.id);
      setFacturas(facturasUsuario);
    }
  }, [usuario]);

  const limites = planActual ? obtenerLimitesDelPlan(planActual.id) : null;
  const planCrecimiento = planes.find((p) => p.nombre === 'Crecimiento');
  const planPro = planes.find((p) => p.nombre === 'Emprendedor Pro');

  const manejarActualizarACrecimiento = () => {
    if (planCrecimiento) {
      guardarPlanEnCarrito(planCrecimiento);
      navigate('/checkout');
    }
  };

  const manejarIniciarTrial = (planId) => {
    if (window.confirm('¿Deseas iniciar un trial gratuito de 14 días? Después del trial, volverás automáticamente al plan Kiosco.')) {
      if (iniciarFreeTrial(usuario.id, planId)) {
        // Recargar usuario actualizado
        const usuarioActualizado = obtenerUsuarioAutenticado();
        usuarioActualizado.planId = planId;
        usuarioActualizado.enTrial = true;
        guardarUsuarioAutenticado(usuarioActualizado);
        
        // Actualizar trial info
        const nuevoTrial = verificarTrialActivo(usuario.id);
        setTrialInfo(nuevoTrial);
        setPuedeTrial(false);
        
        alert('¡Trial iniciado exitosamente! Tienes 14 días para probar todas las funcionalidades.');
        window.location.reload(); // Recargar para mostrar cambios
      } else {
        alert('No se pudo iniciar el trial. Es posible que ya hayas usado tu trial gratuito.');
      }
    }
  };

  const manejarConvertirTrialAPagado = () => {
    if (window.confirm('¿Deseas convertir tu trial en una suscripción pagada?')) {
      if (convertirTrialAPagado(usuario.id)) {
        alert('¡Trial convertido exitosamente! Ahora tienes una suscripción activa.');
        window.location.reload();
      }
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Header de bienvenida */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-5 fw-bold text-primario mb-3">
              ¡Bienvenido, {usuario.nombre}! <HandWaving size={32} weight="fill" className="text-acento" style={{ verticalAlign: 'middle' }} />
            </h1>
            <p className="lead text-muted">
              Tu portal personal de SIGA. Accede a tu aplicación y gestiona tu cuenta.
            </p>
          </div>
        </div>

        {/* Tarjetas de acciones principales */}
        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <Rocket size={48} weight="fill" className="text-primario" />
                </div>
                <h3 className="h5 fw-bold text-primario mb-3">Aplicación SIGA</h3>
                <p className="text-muted mb-4">
                  Accede a tu sistema de gestión de inventario y punto de venta.
                </p>
                <Link to="/app" className="btn btn-acento w-100">
                  Entrar a SIGA
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <Package size={48} weight="fill" className="text-primario" />
                </div>
                <h3 className="h5 fw-bold text-primario mb-3">Planes y Suscripción</h3>
                <p className="text-muted mb-4">
                  Explora nuestros planes y actualiza tu suscripción.
                </p>
                <Link to="/planes" className="btn btn-outline-primary w-100">
                  Ver planes
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <ShoppingCart size={48} weight="fill" className="text-primario" />
                </div>
                <h3 className="h5 fw-bold text-primario mb-3">Carrito</h3>
                <p className="text-muted mb-4">
                  Revisa tus planes seleccionados y completa tu compra.
                </p>
                <Link to="/carrito" className="btn btn-outline-secondary w-100">
                  Ver carrito
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Actual y Suscripción */}
        {planActual ? (
          <div className="row mb-4">
            <div className="col-lg-10 mx-auto">
              <div className="card shadow-sm border-0 border-start border-4 border-acento">
                <div className="card-header bg-light">
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
                <div className="card-body">
                  {/* Alerta de trial activo */}
                  {trialInfo && trialInfo.activo && (
                    <div className="alert alert-warning mb-4" role="alert">
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                          <strong>
                            <Clock size={18} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
                            Free Trial Activo
                          </strong>
                          <p className="mb-0 mt-2">
                            Tienes <strong>{trialInfo.diasRestantes} días restantes</strong> de tu trial gratuito de 14 días.
                            Después del trial, volverás automáticamente al plan Kiosco.
                          </p>
                        </div>
                        <button
                          className="btn btn-success mt-3 mt-md-0"
                          onClick={manejarConvertirTrialAPagado}
                        >
                          <CreditCard size={18} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
                          Convertir a Suscripción
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h5 className="fw-bold text-primario mb-3">
                        {planActual.precio === 0 ? (
                          <>
                            <span className="badge bg-success me-2">GRATIS</span>
                            Freemium
                          </>
                        ) : (
                          <>
                            {planActual.precio} {planActual.unidad}/mes
                            {trialInfo && trialInfo.activo && (
                              <span className="badge bg-warning ms-2">Trial</span>
                            )}
                          </>
                        )}
                      </h5>
                      <h6 className="text-muted mb-3">Beneficios incluidos:</h6>
                      <ul className="list-unstyled">
                        {planActual.caracteristicas.map((caracteristica, index) => (
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
                              <strong>Asistente SIGA:</strong> Incluido (RAG con contexto de datos)
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

                  {/* Opción de free trial o actualizar plan */}
                  {planActual.nombre === 'Kiosco' && puedeTrial && (
                    <div className="alert alert-primary mt-4" role="alert">
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                          <strong>
                            <Gift size={18} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
                            ¡Prueba gratis por 14 días!
                          </strong>
                          <p className="mb-0 mt-2">
                            Inicia un trial gratuito de 14 días de <strong>{planPro?.nombre}</strong> o{' '}
                            <strong>{planCrecimiento?.nombre}</strong> y descubre todas las funcionalidades.
                            Sin tarjeta de crédito requerida.
                          </p>
                        </div>
                        <div className="d-flex gap-2 mt-3 mt-md-0">
                          {planPro && (
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => manejarIniciarTrial(planPro.id)}
                            >
                              Trial {planPro.nombre}
                            </button>
                          )}
                          {planCrecimiento && (
                            <button
                              className="btn btn-primary"
                              onClick={() => manejarIniciarTrial(planCrecimiento.id)}
                            >
                              Trial {planCrecimiento.nombre}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Opción de actualizar al plan Crecimiento */}
                  {planActual.nombre !== 'Crecimiento' && planActual.nombre !== 'Kiosco' && planCrecimiento && (
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
        ) : (
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
        )}

        {/* Historial de Compras y Facturas */}
        <div className="row mb-4">
          <div className="col-lg-10 mx-auto">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light">
                <h4 className="mb-0 text-primario">
                  <FileText size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                  Historial de Compras y Facturas
                </h4>
              </div>
              <div className="card-body">
                {facturas.length === 0 ? (
                  <div className="alert alert-info mb-0">
                    <p className="mb-0">
                      <strong>No tienes compras registradas aún.</strong>
                      <br />
                      Cuando realices una compra, tus facturas aparecerán aquí.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-muted mb-3">
                      Aquí puedes ver todas tus facturas y compras realizadas en SIGA. 
                      Haz clic en "Ver Factura" para ver el detalle completo e imprimir.
                    </p>
                    
                    {/* Lista de facturas */}
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Número de Factura</th>
                            <th>Plan</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {facturas.map((factura) => {
                            const fecha = new Date(factura.fechaCompra);
                            const fechaFormateada = fecha.toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            });
                            
                            return (
                              <tr key={factura.id}>
                                <td>
                                  <strong className="text-primario">{factura.numeroFactura}</strong>
                                </td>
                                <td>{factura.planNombre}</td>
                                <td>{fechaFormateada}</td>
                                <td>
                                  <strong>{factura.precioUF} {factura.unidad}</strong>
                                  {factura.precioCLP && (
                                    <div className="text-muted small">
                                      ≈ {formatearPrecioCLP(factura.precioCLP)}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <span className={`badge ${
                                    factura.estado === 'pagada' 
                                      ? 'bg-success' 
                                      : factura.estado === 'cancelada'
                                      ? 'bg-danger'
                                      : 'bg-warning'
                                  }`}>
                                    {factura.estado === 'pagada' ? (
                                      <>
                                        <CheckCircle size={14} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
                                        Pagada
                                      </>
                                    ) : factura.estado}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => setFacturaSeleccionada(
                                      facturaSeleccionada?.id === factura.id ? null : factura
                                    )}
                                  >
                                    {facturaSeleccionada?.id === factura.id 
                                      ? 'Ocultar Factura' 
                                      : 'Ver Factura'}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mostrar factura seleccionada */}
                    {facturaSeleccionada && (
                      <div className="mt-4 pt-4 border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="mb-0 text-primario">
                            <FileText size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                            Factura: {facturaSeleccionada.numeroFactura}
                          </h5>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setFacturaSeleccionada(null)}
                          >
                            Cerrar
                          </button>
                        </div>
                        <FacturaComponent 
                          factura={facturaSeleccionada} 
                          onImprimir={() => window.print()} 
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información de la cuenta */}
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light">
                <h4 className="mb-0 text-primario">
                  <ClipboardText size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                  Información de tu Cuenta
                </h4>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <strong className="text-muted d-block mb-1">Nombre:</strong>
                    <p className="mb-0">{usuario.nombre}</p>
                  </div>
                  <div className="col-md-6">
                    <strong className="text-muted d-block mb-1">Email:</strong>
                    <p className="mb-0">{usuario.email}</p>
                  </div>
                  <div className="col-md-6">
                    <strong className="text-muted d-block mb-1">Rol:</strong>
                    <span className="badge bg-info text-dark px-3 py-2">
                      {usuario.rol}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <strong className="text-muted d-block mb-1">ID de Usuario:</strong>
                    <p className="mb-0 text-muted">#{usuario.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nota para administradores */}
        {usuario.rol === 'admin' && (
          <div className="row mt-4">
            <div className="col-lg-8 mx-auto">
              <div className="alert alert-warning" role="alert">
                <strong>
                  <UserCircle size={18} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
                  Eres Administrador:
                </strong> Puedes acceder al{' '}
                <Link to="/admin" className="alert-link">
                  panel de administración
                </Link>{' '}
                para gestionar usuarios, planes y estadísticas del portal.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

