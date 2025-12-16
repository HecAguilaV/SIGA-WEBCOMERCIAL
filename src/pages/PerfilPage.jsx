import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerUsuarioAutenticado, guardarPlanEnCarrito, guardarUsuarioAutenticado } from '../utils/auth.js';
import {
  HandWaving, Rocket, Package, ShoppingCart, Clock, CreditCard, Gift, Sparkle,
  Warning, FileText, ClipboardText, CheckCircle, Users, Storefront, Robot,
  ChatCircle, UserCircle, ChartBar
} from 'phosphor-react';
import { getFacturas, getSuscripciones, obtenerTokenOperativo, updateEmail, updatePerfil, saveTokens, getPlanes } from '../services/api.js';
import { formatearPrecioCLP } from '../utils/indicadoresEconomicos.js';
import FacturaComponent from '../components/FacturaComponent.jsx';
import { useWebAppSSO } from '../hooks/useWebAppSSO.js';
import PlanActualCard from '../components/perfil/PlanActualCard.jsx';
import PerfilHeader from '../components/perfil/PerfilHeader.jsx';
import '../styles/PerfilPage.css';

// Página de perfil/dashboard para clientes
// Vista personalizada diferente del panel de administrador
// Incluye gestión de free trial de 14 días
export default function PerfilPage() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(obtenerUsuarioAutenticado);
  const [facturas, setFacturas] = useState([]); // Estado para almacenar las facturas del usuario
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null); // Factura seleccionada para ver/imprimir
  const { loading: cargandoSSO, error: errorSSO, iniciarSSO } = useWebAppSSO();
  const [tieneSuscripcionActiva, setTieneSuscripcionActiva] = useState(false); // Estado de suscripción activa
  const [errorFacturas, setErrorFacturas] = useState(''); // Error al cargar facturas
  const [mostrarActualizarEmail, setMostrarActualizarEmail] = useState(false); // Mostrar formulario de actualizar email
  const [nuevoEmail, setNuevoEmail] = useState(''); // Nuevo email
  const [passwordEmail, setPasswordEmail] = useState(''); // Contraseña para confirmar cambio de email
  const [cargandoEmail, setCargandoEmail] = useState(false); // Loading al actualizar email
  const [mensajeEmail, setMensajeEmail] = useState(''); // Mensaje de éxito/error al actualizar email

  // Estados para edición de perfil completo
  const [mostrarEditarPerfil, setMostrarEditarPerfil] = useState(false); // Mostrar formulario de editar perfil
  const [perfilEditado, setPerfilEditado] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    telefono: '',
    nombreEmpresa: ''
  });
  const [cargandoPerfil, setCargandoPerfil] = useState(false); // Loading al actualizar perfil
  const [mensajePerfil, setMensajePerfil] = useState(''); // Mensaje de éxito/error al actualizar perfil

  // Estados para suscripciones (definir antes del useEffect que los usa)
  const [suscripcionVerificada, setSuscripcionVerificada] = useState(false);
  const [suscripcionActivaData, setSuscripcionActivaData] = useState(null);

  // Actualizar usuario desde localStorage cuando el componente se monta
  // También verificar cuando la página se vuelve visible (por ejemplo, después de volver del pago)
  useEffect(() => {
    const actualizarUsuario = () => {
      const usuarioActual = obtenerUsuarioAutenticado();
      if (usuarioActual) {
        // Si el usuario cambió o tiene un planId nuevo, actualizar y resetear verificación
        if (!usuario || usuarioActual.id !== usuario.id || usuarioActual.planId !== usuario?.planId) {
          setUsuario(usuarioActual);
          // Si el usuario tiene un planId nuevo, resetear la verificación de suscripción
          if (usuarioActual.planId && usuarioActual.planId !== usuario?.planId) {
            console.log('🔄 PlanId cambió, reseteando verificación de suscripción');
            setSuscripcionVerificada(false);
            setTieneSuscripcionActiva(false);
            setSuscripcionActivaData(null);
          }
        }
      }
    };

    // Actualizar al montar
    actualizarUsuario();

    // También actualizar cuando la página se vuelve visible (usuario vuelve de otra página)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        actualizarUsuario();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // También escuchar evento personalizado cuando el usuario se actualiza
    const handleUsuarioActualizado = () => {
      actualizarUsuario();
    };

    window.addEventListener('usuarioActualizado', handleUsuarioActualizado);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('usuarioActualizado', handleUsuarioActualizado);
    };
  }, []); // Solo al montar

  if (!usuario) {
    return null;
  }

  // Solo permitir “datos simulados” en desarrollo LOCAL
  // Obtener plan del usuario desde el backend
  const [planActual, setPlanActual] = useState(null);
  const [planes, setPlanes] = useState([]);

  // NOTA: suscripcionVerificada y suscripcionActivaData ya están definidos arriba (líneas 52-53)

  // Cargar planes desde el backend
  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        const response = await getPlanes();
        if (response.success && response.planes) {
          setPlanes(response.planes);
        } else {
          setPlanes([]);
        }
      } catch (error) {
        console.error('Error al cargar planes:', error);
        setPlanes([]);
      }
    };

    cargarPlanes();
  }, []);

  // Determinar plan actual basado en suscripción activa
  useEffect(() => {
    const determinarPlanActual = async () => {
      // Si hay suscripción activa, usar el planId de la suscripción (fuente de verdad del backend)
      const planIdParaBuscar = suscripcionActivaData?.planId || usuario?.planId;

      if (tieneSuscripcionActiva && planIdParaBuscar && planes.length > 0) {
        const plan = planes.find((p) => p.id === planIdParaBuscar);
        console.log('📦 Plan encontrado para mostrar:', plan);
        setPlanActual(plan || null);
      } else {
        // Si no hay suscripción activa, no mostrar plan
        console.log('❌ No se muestra plan - tieneSuscripcionActiva:', tieneSuscripcionActiva, 'planId:', planIdParaBuscar, 'planes:', planes.length);
        setPlanActual(null);
      }
    };

    determinarPlanActual();
  }, [tieneSuscripcionActiva, suscripcionActivaData, usuario?.planId, planes]);

  // ❌ ELIMINADO: Trial management ahora es responsabilidad del backend
  // El backend maneja los trials automáticamente
  // const [trialInfo, setTrialInfo] = useState(null);
  // const [puedeTrial, setPuedeTrial] = useState(false);

  // Cargar facturas del usuario al montar el componente (solo una vez)
  const [facturasCargadas, setFacturasCargadas] = useState(false);

  useEffect(() => {
    // Evitar múltiples cargas
    if (facturasCargadas || !usuario || !usuario.id) {
      return;
    }

    const cargarFacturas = async () => {
      try {
        setErrorFacturas('');
        // Intentar cargar facturas desde el backend
        const response = await getFacturas();
        if (response.success && response.facturas) {
          setFacturas(response.facturas);
        } else {
          // Si no hay facturas, es válido (usuario nuevo)
          setFacturas([]);
        }
        setFacturasCargadas(true);
      } catch (error) {
        // Manejar 404 específicamente (usuario sin facturas es válido)
        if (error.message?.includes('404') || error.message?.includes('NOT_FOUND')) {
          console.log('ℹ️ Usuario sin facturas (404 es válido para usuarios nuevos)');
          setFacturas([]);
          setErrorFacturas(''); // No mostrar error si es 404 (usuario nuevo)
          setFacturasCargadas(true);
        } else if (error.message?.includes('401') || error.message?.includes('Sesión expirada') || error.message?.includes('No autenticado')) {
          // Si es 401, el refresh token ya intentó renovar. Si falló, se redirigió a login.
          // No intentar cargar de nuevo para evitar bucle infinito
          console.warn('⚠️ Error de autenticación al cargar facturas. Sesión puede haber expirado.');
          setFacturas([]);
          setFacturasCargadas(true); // Marcar como cargado para evitar reintentos
        } else {
          console.error('Error al cargar facturas desde backend:', error);
          setFacturas([]);
          setErrorFacturas(error?.message || 'No se pudieron cargar las facturas desde el backend.');
          setFacturasCargadas(true);
        }
      }
    };

    cargarFacturas();
  }, [usuario?.id, facturasCargadas]);

  // Verificar suscripción activa al montar el componente y cuando el usuario cambia
  // Verificar suscripción activa - se ejecuta cuando el usuario está disponible
  // NOTA: suscripcionVerificada y suscripcionActivaData ya están definidos arriba (líneas 52-53)
  // También se ejecuta cuando el usuario cambia (por ejemplo, después del pago)
  useEffect(() => {
    // Evitar múltiples verificaciones
    if (!usuario || !usuario.id) {
      return;
    }

    // Si ya está verificado para este usuario Y el planId no cambió, no verificar de nuevo
    if (suscripcionVerificada && usuario.planId === suscripcionActivaData?.planId) {
      return;
    }

    const verificarSuscripcion = async () => {
      try {
        console.log('🔍 Verificando suscripción para usuario:', usuario.id);
        const response = await getSuscripciones();

        // Log sanitizado (sin tokens) solo en desarrollo
        if (import.meta.env.DEV) {
          const responseSanitized = { ...response };
          if (responseSanitized.accessToken) delete responseSanitized.accessToken;
          if (responseSanitized.refreshToken) delete responseSanitized.refreshToken;
          if (responseSanitized.token) delete responseSanitized.token;
          console.log('📋 Respuesta de getSuscripciones (sanitizada):', responseSanitized);
        }

        if (response.success && response.suscripciones && response.suscripciones.length > 0) {
          const suscripcionActiva = response.suscripciones.find(
            s => s.estado === 'ACTIVA'
          );

          if (suscripcionActiva) {
            console.log('✅ Suscripción activa encontrada:', suscripcionActiva);
            setTieneSuscripcionActiva(true);
            setSuscripcionActivaData(suscripcionActiva);

            // Actualizar usuario con planId de la suscripción activa (fuente de verdad)
            if (suscripcionActiva.planId) {
              const usuarioActualizado = {
                ...usuario,
                planId: suscripcionActiva.planId
              };
              guardarUsuarioAutenticado(usuarioActualizado);
              setUsuario(usuarioActualizado);
              console.log('🔄 Usuario actualizado con planId:', suscripcionActiva.planId);
            }
          } else {
            console.log('ℹ️ Usuario tiene suscripciones pero ninguna está activa');
            setTieneSuscripcionActiva(false);
            setSuscripcionActivaData(null);
          }
        } else {
          // Si no hay suscripciones, es válido (usuario nuevo)
          console.log('ℹ️ No hay suscripciones para este usuario');
          setTieneSuscripcionActiva(false);
          setSuscripcionActivaData(null);
        }
        setSuscripcionVerificada(true);
      } catch (error) {
        // Manejar 404 específicamente (usuario sin suscripciones es válido)
        if (error.message?.includes('404') || error.message?.includes('NOT_FOUND')) {
          console.log('ℹ️ Usuario sin suscripciones (404 es válido para usuarios nuevos)');
          setTieneSuscripcionActiva(false);
          setSuscripcionActivaData(null);
          setSuscripcionVerificada(true);
        } else if (error.message?.includes('401') || error.message?.includes('Sesión expirada') || error.message?.includes('No autenticado')) {
          console.warn('⚠️ Error de autenticación al verificar suscripción. Sesión puede haber expirado.');
          setTieneSuscripcionActiva(false);
          setSuscripcionActivaData(null);
          setSuscripcionVerificada(true);
        } else {
          console.error('❌ Error al verificar suscripción:', error);
          setTieneSuscripcionActiva(false);
          setSuscripcionActivaData(null);
          setSuscripcionVerificada(true);
        }
      }
    };

    verificarSuscripcion();
  }, [usuario?.id, usuario?.planId]); // Depende del ID y planId del usuario para detectar cambios

  const limites = planActual ? {
    usuarios: planActual.limiteUsuarios,
    bodegas: planActual.limiteBodegas,
    productos: planActual.limiteProductos,
    reportes: planActual.reportes || 'Básicos',
    soporte: planActual.soporte || 'Estándar',
    asistenteSIGA: planActual.asistenteSIGA || false
  } : null;
  const planCrecimiento = planes.find((p) => p.nombre === 'Crecimiento');
  const planPro = planes.find((p) => p.nombre === 'Emprendedor Pro');

  const manejarActualizarACrecimiento = () => {
    if (planCrecimiento) {
      guardarPlanEnCarrito(planCrecimiento);
      navigate('/checkout');
    }
  };

  const manejarIniciarTrial = (planId) => {
    // El trial se inicia automáticamente al registrarse
    // Para adquirir un plan, debe ir a /planes y comprarlo
    alert('Para adquirir un plan, por favor visita la página de Planes y realiza la compra.');
    navigate('/planes');
  };

  const manejarConvertirTrialAPagado = () => {
    // Para convertir trial a pagado, debe comprar un plan
    alert('Para convertir tu trial en una suscripción pagada, por favor visita la página de Planes y realiza la compra.');
    navigate('/planes');
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
        // Verificar planId como alternativa si no hay suscripciones en backend
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
      // Log sanitizado (sin tokens) solo en desarrollo
      if (import.meta.env.DEV) {
        const responseSanitized = { ...ssoResponse };
        if (responseSanitized.accessToken) delete responseSanitized.accessToken;
        if (responseSanitized.refreshToken) delete responseSanitized.refreshToken;
        if (responseSanitized.token) delete responseSanitized.token;
        if (responseSanitized.data?.accessToken) delete responseSanitized.data.accessToken;
        console.log('🔑 Respuesta SSO (sanitizada):', responseSanitized);
      }

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

      // El accessToken puede estar en ssoResponse.accessToken o ssoResponse.data.accessToken
      const tokenOperativo = ssoResponse.accessToken || ssoResponse.data?.accessToken;

      if (!tokenOperativo) {
        console.error('❌ SSO exitoso pero sin accessToken:', ssoResponse);
        throw new Error('No se recibió token de acceso. Por favor, intenta nuevamente.');
      }

      // URL de WebApp: usar la del backend si viene, sino usar la URL de producción
      const webAppUrl = ssoResponse.webAppUrl || ssoResponse.data?.webAppUrl || 'https://siga-webapp.vercel.app/';

      console.log('✅ SSO exitoso. Redirigiendo a WebApp:', webAppUrl);

      // Guardar URL del portal comercial para que WebApp pueda redirigir de vuelta
      const portalComercialUrl = window.location.origin;
      localStorage.setItem('siga_portal_comercial_url', portalComercialUrl);

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

  // Inicializar formulario de perfil con datos actuales del usuario
  // Solo cuando se abre el formulario (cuando mostrarEditarPerfil cambia a true)
  const formularioInicializado = useRef(false);

  useEffect(() => {
    // Solo inicializar cuando se abre el formulario Y no está inicializado
    if (mostrarEditarPerfil && usuario && !formularioInicializado.current) {
      // Capturar los valores actuales del usuario solo cuando se abre el formulario
      setPerfilEditado({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        rut: usuario.rut || '',
        telefono: usuario.telefono || '',
        nombreEmpresa: usuario.nombreEmpresa || ''
      });
      formularioInicializado.current = true;
    }

    // Resetear el flag cuando se cierra el formulario
    if (!mostrarEditarPerfil) {
      formularioInicializado.current = false;
    }
  }, [mostrarEditarPerfil]); // SOLO depende de mostrarEditarPerfil

  const manejarActualizarPerfil = async (e) => {
    e.preventDefault();
    setMensajePerfil('');
    setCargandoPerfil(true);

    try {
      // Solo enviar campos que han cambiado o que tienen valor
      const datosActualizados = {};
      if (perfilEditado.nombre && perfilEditado.nombre !== usuario.nombre) {
        datosActualizados.nombre = perfilEditado.nombre;
      }
      if (perfilEditado.apellido && perfilEditado.apellido !== usuario.apellido) {
        datosActualizados.apellido = perfilEditado.apellido;
      }
      if (perfilEditado.rut && perfilEditado.rut !== usuario.rut) {
        datosActualizados.rut = perfilEditado.rut;
      }
      if (perfilEditado.telefono && perfilEditado.telefono !== usuario.telefono) {
        datosActualizados.telefono = perfilEditado.telefono;
      }
      if (perfilEditado.nombreEmpresa !== usuario.nombreEmpresa) {
        datosActualizados.nombreEmpresa = perfilEditado.nombreEmpresa || null;
      }

      // Si no hay cambios, no hacer nada
      if (Object.keys(datosActualizados).length === 0) {
        setMensajePerfil('No hay cambios para guardar');
        setCargandoPerfil(false);
        return;
      }

      const response = await updatePerfil(datosActualizados);

      if (response.success && response.user) {
        // Actualizar tokens si vienen en la respuesta
        if (response.accessToken && response.refreshToken) {
          saveTokens(response.accessToken, response.refreshToken);
        }

        // Actualizar usuario en localStorage con todos los datos actualizados
        const usuarioActualizado = {
          ...usuario,
          ...response.user,
        };
        guardarUsuarioAutenticado(usuarioActualizado);
        setUsuario(usuarioActualizado); // Actualizar estado sin recargar

        setMensajePerfil('✅ Perfil actualizado exitosamente');
        setMostrarEditarPerfil(false);
        formularioInicializado.current = false; // Resetear flag al guardar

        // No recargar la página, solo actualizar el estado
      } else {
        throw new Error(response.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMensajePerfil(error.message || 'Error al actualizar el perfil');
    } finally {
      setCargandoPerfil(false);
    }
  };

  return (
    <div className="perfil-section">
      <div className="container">
        {/* Header de bienvenida */}
        {/* Header de bienvenida */}
        <PerfilHeader usuario={usuario} />

        {/* Plan Actual y Suscripción - Primero, información más importante */}
        <PlanActualCard
          planActual={planActual}
          limites={limites}
          planCrecimiento={planCrecimiento}
          manejarActualizarACrecimiento={manejarActualizarACrecimiento}
          errorSSO={errorSSO}
          cargandoSSO={cargandoSSO}
          manejarAccederAWebApp={manejarAccederAWebApp}
        />
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
        </div >

        {/* Historial de Compras y Facturas */}
        < div className="row mb-4" >
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
        </div >

        {/* Información de la cuenta */}
        < div className="row" >
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-primario">
                  <ClipboardText size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                  Información de tu Cuenta
                </h4>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => {
                    setMostrarEditarPerfil(!mostrarEditarPerfil);
                    setMensajePerfil('');
                  }}
                >
                  {mostrarEditarPerfil ? 'Cancelar' : 'Editar Perfil'}
                </button>
              </div>
              <div className="card-body">
                {!mostrarEditarPerfil ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong className="text-muted d-block mb-1">Nombre:</strong>
                      <p className="mb-0">{usuario.nombre || 'No especificado'}</p>
                    </div>
                    {usuario.apellido && (
                      <div className="col-md-6">
                        <strong className="text-muted d-block mb-1">Apellido:</strong>
                        <p className="mb-0">{usuario.apellido}</p>
                      </div>
                    )}
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
                    {usuario.rut && (
                      <div className="col-md-6">
                        <strong className="text-muted d-block mb-1">RUT:</strong>
                        <p className="mb-0">{usuario.rut}</p>
                      </div>
                    )}
                    {usuario.telefono && (
                      <div className="col-md-6">
                        <strong className="text-muted d-block mb-1">Teléfono:</strong>
                        <p className="mb-0">{usuario.telefono}</p>
                      </div>
                    )}
                    {usuario.nombreEmpresa && (
                      <div className="col-md-6">
                        <strong className="text-muted d-block mb-1">Empresa:</strong>
                        <p className="mb-0">{usuario.nombreEmpresa}</p>
                      </div>
                    )}
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
                ) : (
                  <div>
                    <h5 className="mb-3 text-primario">Editar Perfil</h5>

                    {mensajePerfil && (
                      <div className={`alert ${mensajePerfil.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
                        {mensajePerfil}
                      </div>
                    )}

                    <form onSubmit={manejarActualizarPerfil}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="perfilNombre" className="form-label">
                            Nombre
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="perfilNombre"
                            value={perfilEditado.nombre}
                            onChange={(e) => setPerfilEditado({ ...perfilEditado, nombre: e.target.value })}
                            placeholder="Tu nombre"
                            disabled={cargandoPerfil}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="perfilApellido" className="form-label">
                            Apellido
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="perfilApellido"
                            value={perfilEditado.apellido}
                            onChange={(e) => setPerfilEditado({ ...perfilEditado, apellido: e.target.value })}
                            placeholder="Tu apellido"
                            disabled={cargandoPerfil}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="perfilRut" className="form-label">
                            RUT
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="perfilRut"
                            value={perfilEditado.rut}
                            onChange={(e) => {
                              // Formatear RUT automáticamente
                              let val = e.target.value.replace(/[^0-9kK]/g, '');
                              if (val.length > 1) {
                                const dv = val.slice(-1);
                                const num = val.slice(0, -1);
                                val = num.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + dv;
                              }
                              setPerfilEditado({ ...perfilEditado, rut: val });
                            }}
                            placeholder="12.345.678-9"
                            disabled={cargandoPerfil}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="perfilTelefono" className="form-label">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="perfilTelefono"
                            value={perfilEditado.telefono}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              // Si el usuario borra todo, dejarlo vacío
                              if (!val) {
                                setPerfilEditado({ ...perfilEditado, telefono: '' });
                                return;
                              }
                              // Asegurar prefijo 56
                              if (!val.startsWith('56')) {
                                val = '56' + val;
                              }
                              setPerfilEditado({ ...perfilEditado, telefono: '+' + val });
                            }}
                            placeholder="+56912345678"
                            disabled={cargandoPerfil}
                          />
                        </div>
                        <div className="col-md-12">
                          <label htmlFor="perfilNombreEmpresa" className="form-label">
                            Nombre de Empresa
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="perfilNombreEmpresa"
                            value={perfilEditado.nombreEmpresa}
                            onChange={(e) => setPerfilEditado({ ...perfilEditado, nombreEmpresa: e.target.value })}
                            placeholder="Mi Empresa S.A."
                            disabled={cargandoPerfil}
                          />
                          <small className="text-muted">Puedes actualizar el nombre de tu empresa aquí</small>
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={cargandoPerfil}
                        >
                          {cargandoPerfil ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Guardando...
                            </>
                          ) : (
                            'Guardar Cambios'
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setMostrarEditarPerfil(false);
                            setMensajePerfil('');
                            formularioInicializado.current = false; // Resetear flag al cancelar
                          }}
                          disabled={cargandoPerfil}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                )}

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
        </div >

        {/* Nota para administradores */}
        {
          usuario.rol === 'admin' && (
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
          )
        }
      </div >
    </div >
  );
}
