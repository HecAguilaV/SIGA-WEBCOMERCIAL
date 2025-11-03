import React, { useState, useEffect } from 'react';
import { obtenerPlanDelCarrito, vaciarCarrito, obtenerUsuarioAutenticado } from '../utils/auth.js';
import { useNavigate } from 'react-router-dom';
import { convertirUFaCLP, formatearPrecioCLP } from '../utils/indicadoresEconomicos.js';

// Página de carrito que persiste en localStorage
// Muestra el plan seleccionado con precio en UF y conversión a CLP
export default function CarritoPage() {
  const navigate = useNavigate();
  
  // Estados para manejar la información del carrito y usuario
  const [plan, setPlan] = useState(null); // Plan seleccionado en el carrito
  const [precioCLP, setPrecioCLP] = useState(null); // Precio convertido a pesos chilenos
  const [cargandoPrecio, setCargandoPrecio] = useState(false); // Indicador de carga del precio
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null); // Usuario autenticado actual

  // useEffect se ejecuta cuando el componente se monta (al cargar la página)
  useEffect(() => {
    // Obtener el plan guardado en el carrito desde localStorage
    const planCarrito = obtenerPlanDelCarrito();
    // Obtener el usuario autenticado desde localStorage
    const usuario = obtenerUsuarioAutenticado();
    
    // Actualizar los estados con los valores obtenidos
    setPlan(planCarrito);
    setUsuarioAutenticado(usuario);

    // Cargar precio en CLP si hay plan
    if (planCarrito) {
      const cargarPrecioCLP = async () => {
        setCargandoPrecio(true);
        try {
          const precio = await convertirUFaCLP(planCarrito.precio);
          setPrecioCLP(precio);
        } catch (error) {
          console.error('Error al cargar precio en CLP:', error);
        } finally {
          setCargandoPrecio(false);
        }
      };

      cargarPrecioCLP();
    }
  }, []);

  // Función para vaciar el carrito cuando el usuario hace clic en "Vaciar Carrito"
  const manejarVaciar = () => {
    vaciarCarrito(); // Limpia el localStorage del carrito
    setPlan(null); // Limpia el estado del plan
    setPrecioCLP(null); // Limpia el precio convertido
  };

  // Función que se ejecuta cuando el usuario hace clic en "Proceder al Pago"
  const manejarPagar = () => {
    // Si no hay plan en el carrito, no hacer nada
    if (!plan) return;
    
    // IMPORTANTE: Verificar si el usuario está autenticado antes de permitir el pago
    // Esto previene que usuarios no registrados puedan acceder al checkout
    const usuario = obtenerUsuarioAutenticado();
    
    if (!usuario) {
      // Si el usuario NO está autenticado:
      // 1. Guardamos la ruta de destino (/checkout) en localStorage
      //    para redirigir al usuario después de que inicie sesión
      localStorage.setItem('siga_redirect_after_login', '/checkout');
      // 2. Redirigimos al usuario a la página de login
      navigate('/login');
      return; // Detener la ejecución aquí
    }
    
    // Si el usuario SÍ está autenticado, redirigir normalmente al checkout
    navigate('/checkout');
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-4 text-primario">Carrito</h2>
        {!plan ? (
          <div className="alert alert-info">No hay planes en el carrito.</div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between">
              <div>
                <h5 className="mb-2 text-primario">{plan.nombre}</h5>
                <div className="mb-1">
                  <strong className="fs-5">{plan.precio}</strong> {plan.unidad}/mes
                </div>
                {!cargandoPrecio && precioCLP && (
                  <small className="text-muted">
                    ≈ {formatearPrecioCLP(precioCLP)}/mes
                  </small>
                )}
                {cargandoPrecio && (
                  <small className="text-muted">
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                    Calculando...
                  </small>
                )}
              </div>
              {/* Botones de acción del carrito */}
              <div className="mt-3 mt-md-0 d-flex flex-column flex-md-row gap-2">
                <button className="btn btn-outline-danger" onClick={manejarVaciar}>Vaciar Carrito</button>
                {/* 
                  Botón dinámico que cambia según el estado de autenticación:
                  - Si el usuario está autenticado: muestra "Proceder al Pago"
                  - Si NO está autenticado: muestra "Iniciar Sesión para Pagar"
                */}
                <button className="btn btn-acento" onClick={manejarPagar}>
                  {usuarioAutenticado ? 'Proceder al Pago' : 'Iniciar Sesión para Pagar'}
                </button>
              </div>
              {/* 
                Mostrar advertencia solo si el usuario NO está autenticado.
                Esto informa visualmente al usuario que necesita iniciar sesión.
              */}
              {!usuarioAutenticado && (
                <div className="alert alert-warning mt-3 mb-0">
                  <small>
                    <strong>⚠️ Requerido:</strong> Debes iniciar sesión para realizar el pago.
                  </small>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


