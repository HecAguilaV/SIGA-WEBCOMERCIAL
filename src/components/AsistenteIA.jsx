import React, { useState, useEffect, useRef } from 'react';
import { X, PaperPlaneRight } from 'phosphor-react';
import GraficoTorta from './GraficoTorta';
import { obtenerMermasMes } from '../datos/datosSimulados.js';

// Componente de asistente con IA para conversación y visualización de datos
// Similar al asistente de SIGA App pero adaptado para React
export default function AsistenteIA() {
  const [mensajeUsuario, setMensajeUsuario] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [estaPensando, setEstaPensando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [abierto, setAbierto] = useState(false);
  const mensajesEndRef = useRef(null);
  const mermas = obtenerMermasMes();

  // Desplazar al final cuando se agreguen nuevos mensajes
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, estaPensando]);

  /**
   * Prepara los datos para el gráfico de mermas transformando las parejas (categoría, cantidad) en etiquetas y valores.
   */
  const obtenerDatosMermas = () => {
    const etiquetas = mermas.map((item) => item.categoria);
    const valores = mermas.map((item) => item.cantidad);
    return { etiquetas, valores };
  };

  /**
   * Simula la respuesta del backend de IA
   * En producción, esto sería una llamada real a /api/chat
   */
  const obtenerRespuestaIA = async (mensaje) => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const mensajeLower = mensaje.toLowerCase();

    // Detectar si el usuario pregunta por mermas
    if (
      mensajeLower.includes('merma') ||
      mensajeLower.includes('pérdida') ||
      mensajeLower.includes('perdida') ||
      mensajeLower.includes('daño') ||
      mensajeLower.includes('dano') ||
      mensajeLower.includes('gráfico') ||
      mensajeLower.includes('grafico') ||
      mensajeLower.includes('visualizar')
    ) {
      return '[GRAFICO_MERMAS]';
    }

    // Respuestas genéricas según el contexto
    if (mensajeLower.includes('hola') || mensajeLower.includes('holi')) {
      return '¡Hola! Soy SIGA, tu asistente inteligente. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre tu inventario, planes, o mostrar visualizaciones de datos.';
    }

    if (mensajeLower.includes('plan') || mensajeLower.includes('suscripción') || mensajeLower.includes('suscripcion')) {
      return 'Puedo ayudarte con información sobre nuestros planes. Tenemos tres opciones: Kiosco (gratuito), Emprendedor Pro y Crecimiento. ¿Te gustaría conocer más detalles sobre alguno en particular?';
    }

    if (mensajeLower.includes('inventario') || mensajeLower.includes('stock')) {
      return 'Tu inventario está siendo gestionado en tiempo real. Puedo ayudarte a visualizar datos como mermas, productos más vendidos, o cualquier otra métrica que necesites. ¿Qué te gustaría ver?';
    }

    if (mensajeLower.includes('ayuda') || mensajeLower.includes('help')) {
      return 'Estoy aquí para ayudarte. Puedo:\n- Mostrarte gráficos de mermas\n- Informarte sobre planes y suscripciones\n- Responder preguntas sobre tu inventario\n- Y mucho más. ¿Qué necesitas?';
    }

    // Respuesta genérica
    return 'Entiendo tu consulta. Como asistente inteligente, puedo ayudarte con información sobre tu negocio, visualizar datos como mermas por categoría, y responder preguntas sobre SIGA. ¿Te gustaría ver algún gráfico específico o necesitas información sobre nuestros planes?';
  };

  /**
   * Envía el mensaje del usuario al backend y gestiona la respuesta del asistente.
   */
  const enviarMensaje = async () => {
    const contenido = mensajeUsuario.trim();
    if (!contenido) {
      return;
    }

    // Agregar mensaje del usuario
    const nuevoMensajeUsuario = {
      id: crypto.randomUUID(),
      emisor: 'usuario',
      tipo: 'texto',
      contenido,
    };

    setMensajes((prev) => [...prev, nuevoMensajeUsuario]);
    setMensajeUsuario('');
    setEstaPensando(true);
    setMensajeError('');

    try {
      // En producción, esto sería una llamada real:
      // const respuesta = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ mensaje: contenido }),
      // });
      // const datos = await respuesta.json();
      // const textoIA = datos.respuesta ?? '';

      // Por ahora, simulamos la respuesta
      const textoIA = await obtenerRespuestaIA(contenido);

      if (typeof textoIA === 'string' && textoIA.includes('[GRAFICO_MERMAS]')) {
        setMensajes((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            emisor: 'siga',
            tipo: 'grafico-mermas',
          },
        ]);
      } else {
        setMensajes((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            emisor: 'siga',
            tipo: 'texto',
            contenido: textoIA || 'Estoy aquí para ayudarte.',
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMensajeError('No pudimos obtener la respuesta. Por favor, revisa tu conexión o inténtalo más tarde.');
    } finally {
      setEstaPensando(false);
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const manejarEnvio = async (e) => {
    e.preventDefault();
    await enviarMensaje();
  };

  /**
   * Maneja la tecla Enter para enviar mensaje
   */
  const manejarKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  return (
    <div className="asistente-ia-container">
      {/* Botón flotante para abrir/cerrar */}
      <button
        className={`btn-asistente-toggle ${abierto ? 'abierto' : ''}`}
        onClick={() => setAbierto(!abierto)}
        aria-label={abierto ? 'Cerrar asistente' : 'Abrir asistente'}
        title="Asistente con IA"
      >
        <img src="/S.png" alt="SIGA" className="siga-logo-asistente" />
      </button>

      {/* Panel del asistente */}
      {abierto && (
        <div className="asistente-ia-panel">
          <div className="asistente-ia-header">
            <div>
              <h5 className="mb-0 fw-semibold">Asistente con IA</h5>
              <p className="mb-0 small text-muted">Pregunta lo que necesites. SIGA usa IA real para recomendaciones sin esperas.</p>
            </div>
            <button
              className="btn-close-asistente"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="asistente-ia-mensajes" ref={mensajesEndRef}>
            {mensajes.length === 0 && (
              <div className="mensaje-bienvenida">
                <p className="mb-0">
                  ¡Hola! Soy SIGA, tu asistente inteligente. Puedo ayudarte con información sobre tu inventario, 
                  mostrar visualizaciones de datos como mermas, y responder preguntas sobre SIGA.
                </p>
                <p className="mb-0 mt-2">
                  <strong>Prueba preguntando:</strong> "Muéstrame las mermas por categoría" o "¿Qué planes tienen disponibles?"
                </p>
              </div>
            )}

            {mensajes.map((mensaje) => {
              if (mensaje.tipo === 'texto') {
                return (
                  <div
                    key={mensaje.id}
                    className={`mensaje ${mensaje.emisor === 'usuario' ? 'mensaje-usuario' : 'mensaje-siga'}`}
                  >
                    <p className="mb-0">{mensaje.contenido}</p>
                  </div>
                );
              } else if (mensaje.tipo === 'grafico-mermas') {
                const datosMermas = obtenerDatosMermas();
                return (
                  <div key={mensaje.id} className="mensaje mensaje-siga">
                    <p className="mb-3">Aquí tienes el panorama de mermas por categoría:</p>
                    <GraficoTorta
                      titulo="Mermas mensuales por categoría"
                      etiquetas={datosMermas.etiquetas}
                      valores={datosMermas.valores}
                    />
                  </div>
                );
              }
              return null;
            })}

            {estaPensando && (
              <div className="mensaje mensaje-siga mensaje-pensando">
                <div className="loader"></div>
                <span>SIGA está pensando...</span>
              </div>
            )}

            {mensajeError && (
              <div className="alert alert-danger mt-3" role="alert">
                {mensajeError}
              </div>
            )}
          </div>

          <form className="asistente-ia-formulario" onSubmit={manejarEnvio}>
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="Escribe tu consulta..."
                value={mensajeUsuario}
                onChange={(e) => setMensajeUsuario(e.target.value)}
                onKeyDown={manejarKeyDown}
                disabled={estaPensando}
              />
              <button
                className="btn btn-acento"
                type="submit"
                disabled={estaPensando || !mensajeUsuario.trim()}
              >
                <PaperPlaneRight size={20} weight="fill" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

