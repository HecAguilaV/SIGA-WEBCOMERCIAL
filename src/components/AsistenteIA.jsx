import React, { useState, useEffect, useRef } from 'react';
import { X, PaperPlaneRight } from 'phosphor-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import GraficoTorta from './GraficoTorta';
import { obtenerMermasMes } from '../datos/datosSimulados.js';
import { obtenerContextoSIGA } from '../utils/contextoSIGA.js';

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
   * Obtiene la respuesta de Gemini AI con el contexto completo de SIGA
   * Si no hay API key configurada, usa respuestas simuladas como fallback
   */
  const obtenerRespuestaIA = async (mensaje) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Si no hay API key, usar respuestas simuladas como fallback
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY no está configurada. Usando respuestas simuladas.');
      return obtenerRespuestaSimulada(mensaje);
    }

    try {
      // Inicializar Gemini con modelo 1.5 Flash (más rápido y eficiente)
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Obtener el contexto completo de SIGA
      const contexto = obtenerContextoSIGA();
      const mensajeLower = mensaje.toLowerCase();

      // Detectar si el usuario pregunta por mermas/gráficos (respuesta especial)
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

      // Preparar el prompt con contexto
      const prompt = `${contexto}

---

Tú eres SIGA, el asistente virtual inteligente de SIGA (Sistema Inteligente de Gestión de Activos).

INSTRUCCIONES:
- Responde de manera amable, profesional y concisa
- Usa SOLO la información proporcionada en el contexto anterior
- Si te preguntan sobre mermas y quieren ver un gráfico, responde exactamente: "[GRAFICO_MERMAS]"
- Si no sabes algo fuera del contexto, sé honesto y ofrece ayudar con otra cosa relacionada con SIGA
- Mantén un tono conversacional pero profesional
- Responde en español chileno

Pregunta del usuario: ${mensaje}

Respuesta:`;

      // Obtener respuesta de Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const texto = response.text();

      return texto.trim();
    } catch (error) {
      console.error('Error al obtener respuesta de Gemini:', error);
      
      // Fallback a respuestas simuladas si hay error
      return obtenerRespuestaSimulada(mensaje);
    }
  };

  /**
   * Respuestas simuladas como fallback cuando no hay API key o hay error
   */
  const obtenerRespuestaSimulada = (mensaje) => {
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
      return '¡Hola! Soy SIGA, tu asistente inteligente. ¿En qué puedo ayudarte hoy? Puedo ayudarte con información sobre tu inventario, planes, contacto, o mostrar visualizaciones de datos.';
    }

    if (mensajeLower.includes('plan') || mensajeLower.includes('suscripción') || mensajeLower.includes('suscripcion')) {
      return 'Puedo ayudarte con información sobre nuestros planes. Tenemos tres opciones: Kiosco (gratuito), Emprendedor Pro (0.9 UF/mes) y Crecimiento (1.9 UF/mes). ¿Te gustaría conocer más detalles sobre alguno en particular?';
    }

    if (mensajeLower.includes('contacto') || mensajeLower.includes('email') || mensajeLower.includes('teléfono') || mensajeLower.includes('telefono')) {
      return 'Para contactarnos:\n- Email de soporte: soporte@siga.com\n- Email de facturación: facturacion@siga.com\n- Teléfono: +56 2 2345 6789\n- Dirección: Los Cerezos 21, Puerto Montt, Chile';
    }

    if (mensajeLower.includes('ubicación') || mensajeLower.includes('ubicacion') || mensajeLower.includes('dirección') || mensajeLower.includes('direccion')) {
      return 'Estamos ubicados en Los Cerezos 21, Puerto Montt, Chile. Si necesitas más información de contacto, puedo ayudarte con eso.';
    }

    if (mensajeLower.includes('inventario') || mensajeLower.includes('stock')) {
      return 'Tu inventario está siendo gestionado en tiempo real. Puedo ayudarte a visualizar datos como mermas, productos más vendidos, o cualquier otra métrica que necesites. ¿Qué te gustaría ver?';
    }

    if (mensajeLower.includes('ayuda') || mensajeLower.includes('help')) {
      return 'Estoy aquí para ayudarte. Puedo:\n- Mostrarte gráficos de mermas\n- Informarte sobre planes y suscripciones\n- Responder preguntas sobre contacto y ubicación\n- Responder preguntas sobre tu inventario\n- Y mucho más. ¿Qué necesitas?';
    }

    // Respuesta genérica
    return 'Entiendo tu consulta. Como asistente inteligente, puedo ayudarte con información sobre SIGA, planes, contacto, ubicación, visualizar datos como mermas por categoría, y mucho más. ¿En qué específicamente puedo ayudarte?';
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
                  <strong>Prueba preguntando:</strong> "Muéstrame las mermas por categoría", "¿Qué planes tienen disponibles?", "¿Cuál es su contacto?", o "¿Dónde están ubicados?"
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

