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
import { getFacturas, getSuscripciones, obtenerTokenOperativo, updateEmail, saveTokens } from '../services/api.js';
import { formatearPrecioCLP } from '../utils/indicadoresEconomicos.js';
import FacturaComponent from '../components/FacturaComponent.jsx';
import '../styles/PerfilPage.css';

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
  const [cargandoSSO, setCargandoSSO] = useState(false); // Estado para manejar SSO
  const [errorSSO, setErrorSSO] = useState(''); // Mensaje de error SSO
  const [tieneSuscripcionActiva, setTieneSuscripcionActiva] = useState(false); // Estado de suscripción activa
  const [errorFacturas, setErrorFacturas] = useState(''); // Error al cargar facturas
  const [mostrarActualizarEmail, setMostrarActualizarEmail] = useState(false); // Mostrar formulario de actualizar email
  const [nuevoEmail, setNuevoEmail] = useState(''); // Nuevo email
  const [passwordEmail, setPasswordEmail] = useState(''); // Contraseña para confirmar cambio de email
  const [cargandoEmail, setCargandoEmail] = useState(false); // Loading al actualizar email
  const [mensajeEmail, setMensajeEmail] = useState(''); // Mensaje de éxito/error al actualizar email

  if (!usuario) {
    return null;
  }

  // Solo permitir “datos simulados” en desarrollo LOCAL
  const permitirFallbackLocal = import.meta.env.DEV && window.location.hostname === 'localhost';

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
    const cargarFacturas = async () => {
      if (usuario && usuario.id) {
        try {
          setErrorFacturas('');
          // Intentar cargar facturas desde el backend
          const response = await getFacturas();
          if (response.success && response.facturas) {
            setFacturas(response.facturas);
          } else {
            throw new Error('Error al obtener facturas del backend');
          }
        } catch (error) {
          if (!permitirFallbackLocal) {
            console.error('Error al cargar facturas desde backend:', error);
            setFacturas([]);
            setErrorFacturas(error?.message || 'No se pudieron cargar las facturas desde el backend.');
          } else {
            console.warn('Error al cargar facturas desde backend, usando locales:', error);
            // Fallback a datos locales
            const facturasUsuario = obtenerFacturasDelUsuario(usuario.id);
            setFacturas(facturasUsuario);
          }
        }
      }
    };
    
    cargarFacturas();
  }, [usuario]);

  // Verificar suscripción activa al montar el componente
  useEffect(() => {
    const verificarSuscripcion = async () => {
      if (usuario && usuario.id) {
        try {
          const response = await getSuscripciones();
          if (response.success && response.suscripciones) {
            const suscripcionActiva = response.suscripciones.find(
              s => s.estado === 'ACTIVA'
            );
            setTieneSuscripcionActiva(!!suscripcionActiva);
          } else {
            // En producción NO adivinar: si no hay datos válidos del backend, tratamos como NO activa
            if (!permitirFallbackLocal) {
              setTieneSuscripcionActiva(false);
            } else {
            // Fallback: verificar desde planId (cualquier planId !== null es suscripción activa)
            setTieneSuscripcionActiva(usuario.planId !== null);
            }
          }
        } catch (error) {
          console.warn('Error al verificar suscripción, usando fallback:', error);
          // En producción NO adivinar: si falla, tratamos como NO activa (evita accesos incorrectos)
          if (!permitirFallbackLocal) {
            setTieneSuscripcionActiva(false);
          } else {
            // Fallback: considerar activa si tiene plan asignado (cualquier planId !== null)
            setTieneSuscripcionActiva(usuario.planId !== null);
          }
        }
      }
    };
    
    verificarSuscripcion();
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
    if (window.confirm('¿Deseas iniciar un trial gratuito de 14 días? Después del trial, perderás el acceso hasta que contrates un plan de pago.')) {
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

  // Manejar acceso a WebApp mediante SSO
  const manejarAccederAWebApp = async () => {
    setCargandoSSO(true);
    setErrorSSO('');
    
    try {
      console.log('🔍 Iniciando SSO. Usuario:', usuario);
      
      // Verificar que tenga suscripción activa
      const suscripcionesResponse = await getSuscripciones();
      console.log('📋 Respuesta de suscripciones:', suscripcionesResponse);
      
      if (!suscripcionesResponse.success || !suscripcionesResponse.suscripciones || 
          suscripcionesResponse.suscripciones.length === 0) {
        // Fallback: verificar planId (cualquier planId !== null es válido)
        if (!usuario.planId) {
          console.warn('⚠️ Usuario sin planId y sin suscripciones en backend');
          setErrorSSO('No tienes una suscripción activa. Por favor adquiere un plan primero.');
          setCargandoSSO(false);
          return;
        } else {
          console.warn('⚠️ Usuario tiene planId pero no suscripciones en backend. Intentando SSO de todas formas...');
        }
      } else {
        // Verificar que tenga al menos una suscripción activa
        const suscripcionActiva = suscripcionesResponse.suscripciones.find(
          s => s.estado === 'ACTIVA'
        );
        
        if (!suscripcionActiva) {
          console.warn('⚠️ Usuario tiene suscripciones pero ninguna está activa:', suscripcionesResponse.suscripciones);
          setErrorSSO('Tu suscripción no está activa. Por favor renueva tu plan.');
          setCargandoSSO(false);
          return;
        }
        
        console.log('✅ Suscripción activa encontrada:', suscripcionActiva);
      }
      
      // Obtener token operativo mediante SSO
      console.log('🔄 Obteniendo token operativo...');
      const ssoResponse = await obtenerTokenOperativo();
      console.log('🔑 Respuesta SSO:', ssoResponse);
      
      if (!ssoResponse.success) {
        // Mejorar mensaje de error
        let errorMsg = ssoResponse.message || 'No se pudo obtener acceso a WebApp';
        
        if (ssoResponse.message?.includes('suscripción') || ssoResponse.message?.includes('suscripcion')) {
          errorMsg = 'No tienes una suscripción activa. Por favor adquiere un plan primero.';
        } else if (ssoResponse.message?.includes('401') || ssoResponse.message?.includes('No autenticado')) {
          errorMsg = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        } else if (ssoResponse.message?.includes('404')) {
          errorMsg = 'El endpoint de SSO no está disponible. Por favor, contacta al soporte.';
        }
        
        console.error('❌ Error en SSO:', ssoResponse);
        throw new Error(errorMsg);
      }
      
      if (!ssoResponse.data?.accessToken) {
        console.error('❌ SSO exitoso pero sin accessToken:', ssoResponse);
        throw new Error('No se recibió token de acceso. Por favor, intenta nuevamente.');
      }
      
      const tokenOperativo = ssoResponse.data.accessToken;
      const webAppUrl = ssoResponse.data.webAppUrl || 'https://app.siga.com';
      
      console.log('✅ SSO exitoso. Redirigiendo a WebApp...');
      
      // Redirigir a WebApp con token en URL
      window.location.href = `${webAppUrl}?token=${tokenOperativo}`;
      
    } catch (error) {
      console.error('❌ Error al acceder a WebApp:', error);
      setErrorSSO(error.message || 'No se pudo acceder a WebApp. Verifica tu suscripción.');
      setCargandoSSO(false);
    }
  };

  const manejarActualizarEmail = async (e) => {
    e.preventDefault();
    setMensajeEmail('');
    setCargandoEmail(true);

    // Validaciones
    if (!nuevoEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nuevoEmail)) {
      setMensajeEmail('Por favor ingresa un email válido');
      setCargandoEmail(false);
      return;
    }

    if (!passwordEmail) {
      setMensajeEmail('Por favor ingresa tu contraseña actual para confirmar');
      setCargandoEmail(false);
      return;
    }

    if (nuevoEmail === usuario.email) {
      setMensajeEmail('El nuevo email debe ser diferente al actual');
      setCargandoEmail(false);
      return;
    }

    try {
      const response = await updateEmail(nuevoEmail, passwordEmail);
      
      if (response.success) {
        // Actualizar tokens
        if (response.accessToken && response.refreshToken) {
          saveTokens(response.accessToken, response.refreshToken);
        }
        
        // Actualizar usuario en localStorage
        const usuarioActualizado = {
          ...usuario,
          email: response.user?.email || nuevoEmail,
        };
        guardarUsuarioAutenticado(usuarioActualizado);
        
        setMensajeEmail('✅ Email actualizado exitosamente');
        setNuevoEmail('');
        setPasswordEmail('');
        setMostrarActualizarEmail(false);
        
        // Recargar la página después de 2 segundos para reflejar los cambios
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // El backend retorna mensajes claros, usarlos directamente
        throw new Error(response.message || 'Error al actualizar el email');
      }
    } catch (error) {
      console.error('Error al actualizar email:', error);
      
      // Manejar errores específicos según las instrucciones
      let mensajeError = error.message || 'Error al actualizar el email';
      
      if (error.message?.includes('404') || error.message?.includes('Endpoint no encontrado')) {
        mensajeError = '❌ Endpoint no encontrado. Verifica que el backend esté desplegado.';
      } else if (error.message?.includes('401') || error.message?.includes('No autenticado') || error.message?.includes('Contraseña incorrecta')) {
        mensajeError = '❌ Contraseña incorrecta. Por favor, verifica tu contraseña actual.';
      } else if (error.message?.includes('409') || error.message?.includes('ya está en uso')) {
        mensajeError = '❌ El email ya está en uso por otro usuario. Por favor, elige otro email.';
      } else if (error.message?.includes('igual al actual')) {
        mensajeError = '❌ El nuevo email debe ser diferente al actual.';
      } else if (error.message) {
        // Usar el mensaje del backend directamente si está disponible
        mensajeError = error.message;
      }
      
      setMensajeEmail(mensajeError);
    } finally {
      setCargandoEmail(false);
    }
  };

  return (
    <div className="perfil-section">
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

        {/* Plan Actual y Suscripción - Primero, información más importante */}
      {planActual ? (
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
                          Después del trial, perderás el acceso hasta que contrates un plan de pago.
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
                      {planActual.precio} {planActual.unidad}/mes
                      {trialInfo && trialInfo.activo && (
                        <span className="badge bg-warning ms-2">Trial Activo</span>
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
                {planActual && planActual.esFreemium === false && (
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

                {/* Opción de free trial para usuarios sin plan */}
                {!planActual && puedeTrial && (
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
                {planActual && planActual.nombre !== 'Crecimiento' && planCrecimiento && (
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

      {/* Acciones Rápidas - Después del plan */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-4">
          <Link to="/planes" style={{ textDecoration: 'none' }}>
            <div className="action-card-glass">
              <div className="action-card-icon">
                <Package size={48} weight="fill" className="text-primario" />
              </div>
              <h3 className="h5 fw-bold text-primario mb-3">Planes y Suscripción</h3>
              <p className="text-muted mb-0">
                Explora nuestros planes y actualiza tu suscripción.
              </p>
            </div>
          </Link>
        </div>
        <div className="col-md-6 col-lg-4">
          <Link to="/carrito" style={{ textDecoration: 'none' }}>
            <div className="action-card-glass">
              <div className="action-card-icon">
                <ShoppingCart size={48} weight="fill" className="text-primario" />
              </div>
              <h3 className="h5 fw-bold text-primario mb-3">Carrito</h3>
              <p className="text-muted mb-0">
                Revisa tus planes seleccionados y completa tu compra.
              </p>
            </div>
          </Link>
        </div>
      </div>

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
              {errorFacturas && (
                <div className="alert alert-warning" role="alert">
                  <Warning size={18} className="me-2" style={{ verticalAlign: 'middle' }} />
                  {errorFacturas}
                </div>
              )}
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
                                <span className={`badge ${factura.estado === 'pagada'
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
                  <div className="d-flex align-items-center gap-2">
                    <p className="mb-0">{usuario.email}</p>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setMostrarActualizarEmail(!mostrarActualizarEmail);
                        setMensajeEmail('');
                        setNuevoEmail('');
                        setPasswordEmail('');
                      }}
                    >
                      {mostrarActualizarEmail ? 'Cancelar' : 'Cambiar'}
                    </button>
                  </div>
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

              {/* Formulario de actualizar email */}
              {mostrarActualizarEmail && (
                <div className="mt-4 pt-4 border-top">
                  <h5 className="mb-3 text-primario">Cambiar Email</h5>
                  
                  {mensajeEmail && (
                    <div className={`alert ${mensajeEmail.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
                      {mensajeEmail}
                    </div>
                  )}

                  <form onSubmit={manejarActualizarEmail}>
                    <div className="mb-3">
                      <label htmlFor="nuevoEmail" className="form-label">
                        Nuevo Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="nuevoEmail"
                        value={nuevoEmail}
                        onChange={(e) => setNuevoEmail(e.target.value)}
                        placeholder="nuevo@email.com"
                        required
                        disabled={cargandoEmail}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="passwordEmail" className="form-label">
                        Contraseña Actual <span className="text-danger">*</span>
                        <small className="text-muted d-block">Necesaria para confirmar el cambio</small>
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="passwordEmail"
                        value={passwordEmail}
                        onChange={(e) => setPasswordEmail(e.target.value)}
                        placeholder="Ingresa tu contraseña actual"
                        required
                        disabled={cargandoEmail}
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={cargandoEmail}
                      >
                        {cargandoEmail ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Actualizando...
                          </>
                        ) : (
                          'Actualizar Email'
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setMostrarActualizarEmail(false);
                          setNuevoEmail('');
                          setPasswordEmail('');
                          setMensajeEmail('');
                        }}
                        disabled={cargandoEmail}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}
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
