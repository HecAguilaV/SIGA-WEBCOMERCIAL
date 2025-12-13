import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { chatComercial } from '../services/api.js';
import '../styles/AsistenteIA.css';

export default function AsistenteIA() {
  const location = useLocation();
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [mensajeUsuario, setMensajeUsuario] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [estaPensando, setEstaPensando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  // Estado para ventana flotante
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [panelWidth, setPanelWidth] = useState(320);
  const [panelHeight, setPanelHeight] = useState(550);
  const [estaArrastrando, setEstaArrastrando] = useState(false);
  const [estaRedimensionando, setEstaRedimensionando] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [resizeOffset, setResizeOffset] = useState({ y: 0 });

  // Estado para voz
  const [estamosUsandoVoz, setEstamosUsandoVoz] = useState(false);
  const reconocimientoRef = useRef(null);

  const botonToggleRef = useRef(null);
  const panelRef = useRef(null);
  const mensajesEndRef = useRef(null);
  const inputMensajeRef = useRef(null);

  // Contexto basado en ruta
  const obtenerContextoActual = () => {
    const ruta = location.pathname;
    if (ruta === "/") return "El usuario está viendo la página principal. ";
    if (ruta === "/planes") return "El usuario está viendo los planes de suscripción. ";
    if (ruta === "/perfil") return "El usuario está viendo su perfil y suscripción. ";
    if (ruta === "/carrito") return "El usuario está viendo su carrito de compras. ";
    if (ruta === "/acerca") return "El usuario está leyendo sobre SIGA. ";
    return "";
  };

  // Posicionar panel al abrir y enfocar input
  useEffect(() => {
    if (estaAbierto && botonToggleRef.current) {
      const rect = botonToggleRef.current.getBoundingClientRect();
      const anchoPanel = 380;
      const altoPanel = 500;

      let x = rect.left - anchoPanel - 20;
      let y = rect.top - 40; // ✅ Movido 1cm (40px) más arriba

      if (x < 0) x = rect.right + 20;
      if (y + altoPanel > window.innerHeight) y = window.innerHeight - altoPanel - 20;

      setPosX(Math.max(0, x));
      setPosY(Math.max(0, y));
      
      // ✅ Enfocar automáticamente el input cuando se abre
      setTimeout(() => {
        inputMensajeRef.current?.focus();
      }, 100);
    }
  }, [estaAbierto]);

  // Scroll al final de mensajes
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, estaPensando]);

  // Inicializar voz
  useEffect(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setEstamosUsandoVoz(true);
        setMensajeError('');
      };

      recognition.onresult = (event) => {
        let textoTranscrito = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            textoTranscrito += event.results[i][0].transcript;
          }
        }
        if (textoTranscrito) {
          setMensajeUsuario(textoTranscrito);
          setEstamosUsandoVoz(false);
          setTimeout(() => {
            if (textoTranscrito.trim()) enviarMensaje(textoTranscrito);
          }, 2000);
        }
      };

      recognition.onerror = (event) => {
        console.error("Error de voz:", event.error);
        setEstamosUsandoVoz(false);
        let msg = "❌ Error desconocido.";
        if (event.error === 'not-allowed') msg = "🔒 Permiso de micrófono denegado.";
        if (event.error === 'no-speech') msg = "🤐 No se detectó voz.";
        setMensajeError(msg);
      };

      recognition.onend = () => setEstamosUsandoVoz(false);
      reconocimientoRef.current = recognition;
    }
  }, []);

  // Handlers de arrastre y resize
  const iniciarArrastre = (e) => {
    if (e.button !== 0 || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setEstaArrastrando(true);
  };

  const iniciarResize = (e) => {
    if (e.button !== 0) return;
    setResizeOffset({ y: e.clientY });
    setEstaRedimensionando(true);
  };

  useEffect(() => {
    const manejarMovimiento = (e) => {
      if (estaArrastrando && panelRef.current) {
        const nuevaX = e.clientX - offset.x;
        const nuevaY = e.clientY - offset.y;
        const maxX = window.innerWidth - panelRef.current.offsetWidth;
        const maxY = window.innerHeight - panelRef.current.offsetHeight;
        setPosX(Math.max(0, Math.min(nuevaX, maxX)));
        setPosY(Math.max(0, Math.min(nuevaY, maxY)));
      }
      if (estaRedimensionando) {
        const deltaY = e.clientY - resizeOffset.y;
        setPanelHeight(prev => Math.max(400, Math.min(prev - deltaY, window.innerHeight - 100)));
        setResizeOffset({ y: e.clientY });
      }
    };

    const finalizarInteraccion = () => {
      setEstaArrastrando(false);
      setEstaRedimensionando(false);
    };

    if (estaArrastrando || estaRedimensionando) {
      window.addEventListener('mousemove', manejarMovimiento);
      window.addEventListener('mouseup', finalizarInteraccion);
    }

    return () => {
      window.removeEventListener('mousemove', manejarMovimiento);
      window.removeEventListener('mouseup', finalizarInteraccion);
    };
  }, [estaArrastrando, estaRedimensionando, offset, resizeOffset]);

  // Envío de mensajes
  const enviarMensaje = async (textoOverride = null) => {
    const contenido = textoOverride || mensajeUsuario.trim();
    if (!contenido) return;

    setMensajes(prev => [...prev, { id: crypto.randomUUID(), emisor: "usuario", tipo: "texto", contenido }]);
    setMensajeUsuario('');
    setEstaPensando(true);
    setMensajeError('');

    // Llamada al endpoint del backend (NO directamente a Gemini)
    try {
      // El backend maneja la comunicación con Gemini
      const response = await chatComercial(contenido);
      
      if (response.success && response.response) {
        setMensajes(prev => [...prev, {
          id: crypto.randomUUID(),
          emisor: "siga",
          tipo: "texto",
          contenido: response.response
        }]);
      } else {
        throw new Error(response.message || 'Error al obtener respuesta del asistente');
      }

    } catch (error) {
      console.error("Error IA:", error);
      let errorMsg = `❌ Error al conectar con el asistente: ${error.message || "Error desconocido"}`;
      
      // Mensajes de error más específicos
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Error de conexión')) {
        errorMsg = '❌ No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.';
      } else if (error.message?.includes('404')) {
        errorMsg = '❌ El endpoint del asistente no está disponible. Por favor, contacta al soporte.';
      } else if (error.message?.includes('500')) {
        errorMsg = '❌ Error del servidor. Por favor, intenta nuevamente en unos momentos.';
      }
      
      setMensajeError(errorMsg);
      setMensajes(prev => [...prev, {
        id: crypto.randomUUID(),
        emisor: "siga",
        tipo: "texto",
        contenido: errorMsg
      }]);
    } finally {
      setEstaPensando(false);
      setTimeout(() => inputMensajeRef.current?.focus(), 100);
    }
  };

  return (
    <div className={`asistente-contextual ${estaAbierto ? 'is-open' : ''}`}>
      <button
        ref={botonToggleRef}
        className={`toggle-asistente ${estaAbierto ? 'abierto' : ''}`}
        onClick={() => setEstaAbierto(!estaAbierto)}
        aria-label={estaAbierto ? "Cerrar asistente" : "Abrir asistente"}
        title="Asistente contextual de SIGA"
      >
        <img src="/S.png" alt="SIGA" className="siga-logo" />
      </button>

      {estaAbierto && (
        <div
          ref={panelRef}
          className="panel-asistente"
          style={{
            left: `${posX}px`,
            top: `${posY}px`,
            width: `${panelWidth}px`,
            height: `${panelHeight}px`,
            cursor: estaArrastrando ? 'grabbing' : estaRedimensionando ? 'nwse-resize' : 'default'
          }}
        >
          <div
            className="resize-handle-top"
            onMouseDown={iniciarResize}
            role="button"
            tabIndex="0"
            title="Arrastra para agrandar/achicar"
          ></div>

          <div
            className="panel-header"
            onMouseDown={iniciarArrastre}
            role="button"
            tabIndex="0"
          >
            <h3>🤖 SIGA Asistente</h3>
            <button
              type="button"
              className={`btn-voz-header ${estamosUsandoVoz ? 'activo' : ''}`}
              onClick={() => reconocimientoRef.current?.start()}
              disabled={estaPensando}
              title="Usar micrófono"
            >
              🎤
            </button>
          </div>

          <div className="mensajes-area">
            {mensajes.length === 0 && (
              <div className="mensaje-bienvenida">
                <p><strong>¡Hola! 👋</strong></p>
                <p>Soy tu asistente SIGA del portal comercial. Puedo ayudarte con:</p>
                <ul className="bienvenida-lista">
                  <li>💳 Información sobre planes y suscripciones</li>
                  <li>📋 Consultas sobre facturas y pagos</li>
                  <li>🔐 Ayuda con acceso a la WebApp</li>
                  <li>💡 Preguntas sobre el portal comercial</li>
                </ul>
                <p className="hint">Escribe tu pregunta o usa el micrófono 🎤</p>
              </div>
            )}

            {mensajes.map((mensaje) => (
              <div key={mensaje.id} className={`mensaje ${mensaje.emisor}`}>
                <p>{mensaje.contenido}</p>
              </div>
            ))}

            {estaPensando && (
              <div className="mensaje siga">
                <p className="pensando">
                  <span></span>
                  <span></span>
                  <span></span>
                </p>
              </div>
            )}

            {mensajeError && (
              <div className="mensaje error">
                <p>{mensajeError}</p>
              </div>
            )}
            <div ref={mensajesEndRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); enviarMensaje(); }} className="input-area">
            <div className="input-group">
              <input
                type="text"
                ref={inputMensajeRef}
                value={mensajeUsuario}
                onChange={(e) => setMensajeUsuario(e.target.value)}
                placeholder="Escribe o usa micrófono..."
                disabled={estaPensando}
                className="mensaje-input"
              />
              <button
                type="submit"
                disabled={estaPensando || !mensajeUsuario.trim()}
                className="enviar-btn"
                aria-label="Enviar mensaje"
              >
                →
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

