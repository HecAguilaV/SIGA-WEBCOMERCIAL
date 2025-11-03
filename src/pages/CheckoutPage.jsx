import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaciarCarrito, obtenerUsuarioAutenticado, obtenerPlanDelCarrito, guardarUsuarioAutenticado } from '../utils/auth.js';
import { asignarPlanAUsuario, actualizarUsuario, convertirTrialAPagado, crearFactura } from '../datos/datosSimulados.js';
import { convertirUFaCLP, formatearPrecioCLP } from '../utils/indicadoresEconomicos.js';

// Página de pago simulada con diseño profesional tipo pasarela de pago real
export default function CheckoutPage() {
  const navigate = useNavigate();
  const [numero, setNumero] = useState('');
  const [nombre, setNombre] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [precioCLP, setPrecioCLP] = useState(null);
  const [cargandoPrecio, setCargandoPrecio] = useState(true);
  // Obtener el plan del carrito y el usuario autenticado desde localStorage
  const plan = obtenerPlanDelCarrito();
  const usuario = obtenerUsuarioAutenticado();

  // Validar formato de número de tarjeta
  const validarNumeroTarjeta = (numero) => {
    // Eliminar espacios y validar que sea solo números
    const numeroLimpio = numero.replace(/\s/g, '');
    return /^\d{13,19}$/.test(numeroLimpio);
  };

  // Formatear número de tarjeta con espacios cada 4 dígitos
  const formatearNumeroTarjeta = (valor) => {
    const numeroLimpio = valor.replace(/\s/g, '');
    const grupos = numeroLimpio.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : numeroLimpio;
  };

  // Detectar tipo de tarjeta por número (solo Visa y Mastercard para Chile)
  const detectarTipoTarjeta = (numero) => {
    const numeroLimpio = numero.replace(/\s/g, '');
    if (/^4/.test(numeroLimpio)) return 'visa';
    if (/^5[1-5]/.test(numeroLimpio)) return 'mastercard';
    return 'generic';
  };

  const manejarCambioNumero = (e) => {
    const valor = e.target.value.replace(/\D/g, ''); // Solo números
    if (valor.length <= 19) {
      setNumero(formatearNumeroTarjeta(valor));
    }
  };

  const manejarCambioCVV = (e) => {
    const valor = e.target.value.replace(/\D/g, ''); // Solo números
    if (valor.length <= 4) {
      setCvv(valor);
    }
  };

  const manejarCambioMes = (e) => {
    const valor = e.target.value.replace(/\D/g, '');
    if (valor.length <= 2 && parseInt(valor) <= 12) {
      setMes(valor);
    }
  };

  const manejarCambioAnio = (e) => {
    const valor = e.target.value.replace(/\D/g, '');
    if (valor.length <= 4) {
      setAnio(valor);
    }
  };

  const manejarPagar = async (e) => {
    e.preventDefault();
    setError('');
    setProcesando(true);

    // Validaciones
    if (!numero || !nombre || !mes || !anio || !cvv) {
      setError('Por favor completa todos los campos.');
      setProcesando(false);
      return;
    }

    if (!validarNumeroTarjeta(numero)) {
      setError('El número de tarjeta no es válido.');
      setProcesando(false);
      return;
    }

    if (!mes || !anio) {
      setError('Por favor ingresa la fecha de vencimiento.');
      setProcesando(false);
      return;
    }

    if (cvv.length < 3) {
      setError('El CVV debe tener al menos 3 dígitos.');
      setProcesando(false);
      return;
    }

    // Simular procesamiento de pago (delay de 2 segundos para realismo)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulación de pago exitoso
    if (plan && usuario) {
      // Si el usuario está en trial, convertirlo a suscripción pagada
      if (usuario.enTrial) {
        convertirTrialAPagado(usuario.id);
      }
      
      // Asignar el plan comprado al usuario en datos simulados
      asignarPlanAUsuario(usuario.id, plan.id);
      // Actualizar usuario en localStorage con el nuevo plan
      const usuarioActualizado = { ...usuario, planId: plan.id, enTrial: false };
      guardarUsuarioAutenticado(usuarioActualizado);
      
      // Actualizar también en el array de usuarios
      actualizarUsuario(usuario.id, { planId: plan.id, enTrial: false });
      
      // GENERAR FACTURA después de la compra exitosa
      // Extraer últimos 4 dígitos de la tarjeta para la factura
      const numeroLimpio = numero.replace(/\s/g, '');
      const ultimos4Digitos = numeroLimpio.slice(-4);
      
      // Calcular fecha de vencimiento (próximo mes para suscripción mensual)
      const fechaVencimiento = new Date();
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);
      
      // Crear la factura con todos los datos necesarios
      const factura = crearFactura({
        usuarioId: usuario.id,
        usuarioNombre: usuario.nombre,
        usuarioEmail: usuario.email,
        planId: plan.id,
        planNombre: plan.nombre,
        precioUF: plan.precio,
        precioCLP: precioCLP, // Precio convertido a CLP
        unidad: plan.unidad,
        fechaVencimiento: fechaVencimiento.toISOString(),
        metodoPago: 'Tarjeta de crédito',
        ultimos4Digitos: ultimos4Digitos,
      });
      
      // Guardar el número de factura en localStorage para que CompraExitosaPage pueda mostrarla
      localStorage.setItem('siga_factura_actual', factura.numeroFactura);
    }
    
    vaciarCarrito();
    setProcesando(false);
    navigate('/exito');
  };

  // useEffect se ejecuta cuando el componente se monta o cuando cambian plan/usuario/navigate
  // Este efecto valida que existan los requisitos necesarios para mostrar el checkout
  useEffect(() => {
    // VALIDACIÓN 1: Si no hay plan en el carrito, redirigir a la página de planes
    // Esto evita que alguien acceda directamente a /checkout sin tener un plan seleccionado
    if (!plan) {
      navigate('/planes');
      return; // Detener la ejecución
    }

    // VALIDACIÓN 2: Si el usuario NO está autenticado, redirigir al login
    // Esta es una protección adicional por si alguien intenta acceder directamente a /checkout
    if (!usuario) {
      // Guardar la ruta actual (/checkout) en localStorage
      // para que después del login el usuario vuelva automáticamente al checkout
      localStorage.setItem('siga_redirect_after_login', '/checkout');
      // Redirigir al login
      navigate('/login');
      return; // Detener la ejecución
    }

    // Si llegamos aquí, significa que:
    // 1. ✅ Hay un plan en el carrito
    // 2. ✅ El usuario está autenticado
    // Entonces podemos cargar el precio en CLP

    // Función asíncrona para obtener el precio convertido a pesos chilenos
    const cargarPrecioCLP = async () => {
      setCargandoPrecio(true); // Mostrar indicador de carga
      try {
        // Llamar a la API para convertir UF a CLP
        const precio = await convertirUFaCLP(plan.precio);
        setPrecioCLP(precio); // Guardar el precio convertido
      } catch (error) {
        console.error('Error al cargar precio en CLP:', error);
      } finally {
        setCargandoPrecio(false); // Ocultar indicador de carga siempre
      }
    };

    cargarPrecioCLP();
  }, [plan, usuario, navigate]); // Se ejecuta cuando cambian estos valores

  // Si no hay plan o usuario, no renderizar nada (ya se está redirigiendo)
  // Esto evita que se muestre contenido mientras se procesa la redirección
  if (!plan || !usuario) {
    return null;
  }

  const tipoTarjeta = numero ? detectarTipoTarjeta(numero) : 'generic';

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          {/* Resumen del pedido */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
              <div className="card-header bg-primario text-white">
                <h5 className="mb-0">📋 Resumen del Pedido</h5>
              </div>
              <div className="card-body">
                <div className="mb-3 pb-3 border-bottom">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Plan seleccionado:</span>
                    <strong>{plan.nombre}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Precio:</span>
                    <div className="text-end">
                      <strong className="text-primario d-block">
                        {plan.precio} {plan.unidad}/mes
                      </strong>
                      {!cargandoPrecio && precioCLP && (
                        <small className="text-muted d-block">
                          ≈ {formatearPrecioCLP(precioCLP)}/mes
                        </small>
                      )}
                      {cargandoPrecio && (
                        <small className="text-muted d-block">
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Calculando...
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Facturación:</span>
                    <small className="text-muted">Mensual</small>
                  </div>
                </div>
                <div className="mb-3">
                  <h6 className="mb-2">Características incluidas:</h6>
                  <ul className="list-unstyled small mb-0">
                    {plan.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="mb-1">
                        ✅ {caracteristica}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="alert alert-success mb-0" role="alert">
                  <small>
                    <strong>💡 Recuerda:</strong> Este es un pago simulado. 
                    No se realizará ningún cargo real.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de pago */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 text-primario">💳 Información de Pago</h4>
                  <div className="d-flex gap-2 align-items-center">
                    <span className="badge bg-white text-dark border px-3 py-2" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                      VISA
                    </span>
                    <span className="badge bg-white text-dark border px-3 py-2" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                      MASTERCARD
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <small className="text-muted">
                    🔒 Pago seguro y encriptado - Transacción simulada
                  </small>
                </div>
              </div>
              <div className="card-body p-4">
                <form onSubmit={manejarPagar}>
                  {/* Número de tarjeta */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Número de Tarjeta <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="1234 5678 9012 3456"
                        value={numero}
                        onChange={manejarCambioNumero}
                        maxLength="19"
                        required
                      />
                      {tipoTarjeta !== 'generic' && (
                        <span className="input-group-text bg-white border-start-0">
                          💳
                        </span>
                      )}
                    </div>
                    <small className="text-muted">Ejemplo: 4242 4242 4242 4242</small>
                  </div>

                  {/* Nombre del titular */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Nombre del Titular <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Nombre completo como aparece en la tarjeta"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>

                  {/* Fecha de vencimiento y CVV */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Fecha de Vencimiento <span className="text-danger">*</span>
                      </label>
                      <div className="row g-2">
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="MM"
                            value={mes}
                            onChange={manejarCambioMes}
                            maxLength="2"
                            required
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="AAAA"
                            value={anio}
                            onChange={manejarCambioAnio}
                            maxLength="4"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        CVV <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="123"
                        value={cvv}
                        onChange={manejarCambioCVV}
                        maxLength="4"
                        required
                      />
                      <small className="text-muted">3-4 dígitos en el reverso</small>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <strong>⚠️ Error:</strong> {error}
                    </div>
                  )}

                  {/* Botón de pago */}
                  <div className="d-grid gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-acento btn-lg py-3"
                      disabled={procesando}
                    >
                      {procesando ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Procesando pago...
                        </>
                      ) : (
                        <>
                          💳 Pagar {plan.precio} {plan.unidad}/mes
                          {!cargandoPrecio && precioCLP && (
                            <small className="d-block mt-1" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                              ≈ {formatearPrecioCLP(precioCLP)}
                            </small>
                          )}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/carrito')}
                      disabled={procesando}
                    >
                      ← Volver al carrito
                    </button>
                  </div>

                  {/* Información de seguridad */}
                  <div className="mt-4 pt-4 border-top">
                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <small className="text-muted">🔒 SSL Encriptado</small>
                      <small className="text-muted">•</small>
                      <small className="text-muted">✅ Pago seguro</small>
                      <small className="text-muted">•</small>
                      <small className="text-muted">🔐 Protección de datos</small>
                    </div>
                    <div className="text-center mt-2">
                      <small className="text-muted">
                        <strong>⚠️ Modo Simulación:</strong> Esta es una transacción simulada. 
                        No se realizará ningún cargo real a tu tarjeta.
                      </small>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


