import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { chatComercial } from '../services/api.js';
import { Microphone, X, PaperPlaneRight, Sparkle } from 'phosphor-react';
import '../styles/AsistenteIA.css';

export default function AsistenteIA() {
  const location = useLocation();
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [mensajeUsuario, setMensajeUsuario] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [estaPensando, setEstaPensando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  // Estado para voz
  const [estamosUsandoVoz, setEstamosUsandoVoz] = useState(false);
  const reconocimientoRef = useRef(null);

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

  // Scroll al final de mensajes
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, estaPensando, estaAbierto]);

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
          // Auto-enviar despues de una pusa breve
          setTimeout(() => {
            if (textoTranscrito.trim()) enviarMensaje(textoTranscrito);
          }, 1500);
        }
      };

      recognition.onerror = (event) => {
        console.error("Error de voz:", event.error);
        setEstamosUsandoVoz(false);
      };

      recognition.onend = () => setEstamosUsandoVoz(false);
      reconocimientoRef.current = recognition;
    }
  }, []);

  // Envío de mensajes
  const enviarMensaje = async (textoOverride = null) => {
    const contenido = textoOverride || mensajeUsuario.trim();
    if (!contenido) return;

    // Agregar mensaje usuario + contexto
    setMensajes(prev => [...prev, { id: crypto.randomUUID(), emisor: "mensaje usuario", tipo: "texto", contenido }]); // clase 'usuario' para CSS
    setMensajeUsuario('');
    setEstaPensando(true);
    setMensajeError('');

    try {
      const contexto = obtenerContextoActual();
      const response = await chatComercial(contexto + contenido);

      if (response.success && response.response) {
        setMensajes(prev => [...prev, {
          id: crypto.randomUUID(),
          emisor: "mensaje siga", // clase 'siga' para CSS
          tipo: "texto",
          contenido: response.response
        }]);
      } else {
        throw new Error(response.message || 'Error al obtener respuesta');
      }

    } catch (error) {
      console.error("Error IA:", error);
      let errorMsg = "No pude conectar con el asistente. Intenta de nuevo.";
      setMensajes(prev => [...prev, {
        id: crypto.randomUUID(),
        emisor: "mensaje siga",
        tipo: "texto",
        contenido: errorMsg
      }]);
    } finally {
      setEstaPensando(false);
      setTimeout(() => inputMensajeRef.current?.focus(), 100);
    }
  };

  const toggleOpen = () => {
    setEstaAbierto(!estaAbierto);
    if (!estaAbierto) {
      setTimeout(() => inputMensajeRef.current?.focus(), 100);
    }
  };

  return (
    <div className="asistente-contextual">
      <button
        className="toggle-asistente"
        onClick={toggleOpen}
        aria-label={estaAbierto ? "Cerrar asistente" : "Abrir asistente"}
        title="Asistente contextual de SIGA"
      >
        <img src="/S.png" alt="SIGA" className="siga-logo" />
      </button>

      {estaAbierto && (
        <div className="panel-chat glass-panel">
          <div className="panel-header">
            <h3>✨ Asistente SIGA</h3>
            <button
              className="btn-close-asistente"
              onClick={() => setEstaAbierto(false)}
              aria-label="Cerrar"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="mensajes-area">
            {/* Bienvenida si no hay mensajes */}
            {mensajes.length === 0 && (
              <div className="mensaje-bienvenida">
                <p>Hola, estoy aquí para ayudarte con tu suscripción o dudas sobre SIGA.</p>
              </div>
            )}

            {/* Lista de Mensajes */}
            {mensajes.map((msg) => (
              <div key={msg.id} className={msg.emisor}> {/* 'mensaje usuario' o 'mensaje siga' */}
                <p>{msg.contenido}</p>
              </div>
            ))}

            {estaPensando && (
              <div className="mensaje siga">
                <p>Escribiendo...</p>
              </div>
            )}

            <div ref={mensajesEndRef} />
          </div>

          <form className="input-area" onSubmit={(e) => { e.preventDefault(); enviarMensaje(); }}>
            <div className="input-wrapper">
              <input
                type="text"
                ref={inputMensajeRef}
                value={mensajeUsuario}
                onChange={(e) => setMensajeUsuario(e.target.value)}
                placeholder="Escribe aquí..."
                className="mensaje-input"
                disabled={estaPensando}
              />
              <button
                type="button"
                className="btn-mic"
                onClick={() => reconocimientoRef.current?.start()}
                title="Usar micrófono"
              >
                {/* Visual feedback if recording */}
                <Microphone size={20} weight={estamosUsandoVoz ? "fill" : "regular"} color={estamosUsandoVoz ? "red" : "#00b4d8"} />
              </button>
            </div>
            {/* Opcional: Boton enviar visual si se desea, pero el diseño WebApp solo tenia input + mic. 
                Enter envia el form. */}
          </form>
        </div>
      )}
    </div>
  );
}

