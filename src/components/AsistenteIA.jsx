import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import GraficoTorta from './GraficoTorta';
import GraficoBarras from './GraficoBarras';
import GraficoLineas from './GraficoLineas';
import { obtenerDatosNegocio } from '../datos/datosSimulados.js';
import { obtenerContextoSIGA } from '../utils/contextoSIGA.js';
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

  // Estado para gráficos y modal
  const [graficoActivo, setGraficoActivo] = useState(null);
  const [graficoAbierto, setGraficoAbierto] = useState(false);
  const [modalExplicacion, setModalExplicacion] = useState('');
  const [modalAnimating, setModalAnimating] = useState(false);
  const [graficoGeneradoLocal, setGraficoGeneradoLocal] = useState(false);

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
    if (ruta === "/") return "El usuario está viendo el inventario. ";
    if (ruta === "/analisis") return "El usuario está viendo análisis de ventas. ";
    if (ruta === "/acerca") return "El usuario está leyendo sobre SIGA. ";
    return "";
  };

  // Posicionar panel al abrir
  useEffect(() => {
    if (estaAbierto && botonToggleRef.current) {
      const rect = botonToggleRef.current.getBoundingClientRect();
      const anchoPanel = 380;
      const altoPanel = 500;

      let x = rect.left - anchoPanel - 20;
      let y = rect.top;

      if (x < 0) x = rect.right + 20;
      if (y + altoPanel > window.innerHeight) y = window.innerHeight - altoPanel - 20;

      setPosX(Math.max(0, x));
      setPosY(Math.max(0, y));
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

  // Lógica de gráficos
  const generarGraficoDesdeSolicitud = (tipoSolicitado, textoUsuario) => {
    const negocio = obtenerDatosNegocio();
    const textoLower = (textoUsuario || "").toLowerCase();

    // Ventas por local (Torta)
    if (
      textoLower.includes("por local") ||
      textoLower.includes("ventas semanales por local") ||
      (textoLower.includes("local") && textoLower.includes("venta"))
    ) {
      const ventasPorLocal = negocio.locales.map(l => ({
        nombre: l.nombre,
        total: negocio.ventasSemana
          .filter(v => v.localId === l.id)
          .reduce((a, b) => a + b.cantidad, 0)
      }));
      return {
        tipo: "torta",
        titulo: "Ventas semanales por local",
        etiquetas: ventasPorLocal.map(v => v.nombre),
        valores: ventasPorLocal.map(v => v.total)
      };
    }

    // Productos más vendidos (Barras o Torta)
    if (textoLower.includes("productos") || textoLower.includes("más vendidos")) {
      const ventasPorProducto = negocio.productos.map(p => ({
        nombre: p.nombre,
        total: negocio.ventasSemana
          .filter(v => v.productoId === p.id)
          .reduce((a, b) => a + b.cantidad, 0)
      }));
      const sorted = [...ventasPorProducto].sort((a, b) => b.total - a.total).slice(0, 6);
      return {
        tipo: tipoSolicitado === "torta" ? "torta" : "barras",
        titulo: "Productos más vendidos (semana)",
        etiquetas: sorted.map(s => s.nombre),
        valores: sorted.map(s => s.total)
      };
    }

    // Tendencia (Líneas)
    if (textoLower.includes("tendencia") || textoLower.includes("por día") || tipoSolicitado === "lineas") {
      return {
        tipo: "lineas",
        titulo: "Tendencia de ventas (últimos 7 días)",
        etiquetas: negocio.ventasPorDia.map(d => d.dia),
        valores: negocio.ventasPorDia.map(d => d.totalVentas)
      };
    }

    // Default: Mermas (Torta)
    const mermas = negocio.mermasMes || [];
    return {
      tipo: "torta",
      titulo: "Mermas por categoría",
      etiquetas: mermas.map(m => m.categoria),
      valores: mermas.map(m => m.cantidad)
    };
  };

  const generarExplicacionGrafico = (grafico) => {
    if (!grafico || !grafico.etiquetas || !grafico.valores) return "";
    const total = grafico.valores.reduce((a, b) => a + b, 0) || 1;
    let maxIndex = 0;
    for (let i = 1; i < grafico.valores.length; i++) {
      if (grafico.valores[i] > grafico.valores[maxIndex]) maxIndex = i;
    }
    const topLabel = grafico.etiquetas[maxIndex];
    const topValue = grafico.valores[maxIndex];
    const pct = Math.round((topValue / total) * 100);
    return `Resumen: muestra '${grafico.titulo}' — el mayor aporte es ${topLabel} con ${topValue} unidades (${pct}%).`;
  };

  const openModalFromElement = (el) => {
    if (el) {
      const rect = el.getBoundingClientRect();
      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      document.documentElement.style.setProperty("--modal-start-x", `${startX}px`);
      document.documentElement.style.setProperty("--modal-start-y", `${startY}px`);
    }
    setModalAnimating(true);
    setGraficoAbierto(true);
    setTimeout(() => setModalAnimating(false), 420);
  };

  const generarGraficoVentasPorLocal = () => {
    const grafico = generarGraficoDesdeSolicitud("torta", "ventas por local");
    if (grafico) {
      setGraficoActivo(grafico);
      const explicacion = generarExplicacionGrafico(grafico);
      setModalExplicacion(explicacion || "He generado un gráfico y lo abrí en una vista ampliada.");
      openModalFromElement(botonToggleRef.current);

      if (explicacion) {
        setMensajes(prev => [...prev, {
          id: crypto.randomUUID(),
          emisor: "siga",
          tipo: "texto",
          contenido: explicacion
        }]);
      }
    }
  };

  // Envío de mensajes
  const enviarMensaje = async (textoOverride = null) => {
    const contenido = textoOverride || mensajeUsuario.trim();
    if (!contenido) return;

    setMensajes(prev => [...prev, { id: crypto.randomUUID(), emisor: "usuario", tipo: "texto", contenido }]);
    setMensajeUsuario('');
    setEstaPensando(true);
    setMensajeError('');

    // Detección local de gráficos
    const esPeticionGrafico = /gr[aá]fico|por local|ventas por local|comparativa|comparar|productos m[aá]s vendidos|m[aá]s vendidos|tendencia|por d[ií]a|ventas semanales/i.test(contenido);

    if (esPeticionGrafico) {
      const grafico = generarGraficoDesdeSolicitud(undefined, contenido);
      if (grafico) {
        setGraficoActivo(grafico);
        setGraficoAbierto(true);
        setGraficoGeneradoLocal(true);
        const explicacion = generarExplicacionGrafico(grafico);
        setModalExplicacion(explicacion);

        setMensajes(prev => [...prev, {
          id: crypto.randomUUID(),
          emisor: "siga",
          tipo: "texto",
          contenido: explicacion || "He generado un gráfico y lo abrí en una vista ampliada."
        }]);

        setEstaPensando(false);
        return; // Salir si se generó localmente
      }
    }

    // Llamada a API Gemini
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Falta API Key");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const contexto = obtenerContextoSIGA() + obtenerContextoActual();

      const prompt = `${contexto}
      
      Usuario: ${contenido}
      
      Si el usuario pide un gráfico, responde con una de estas etiquetas al inicio: [GRAFICO_TORTA], [GRAFICO_BARRAS], [GRAFICO_LINEAS].
      Responde de forma útil y concisa.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const textoIA = response.text();

      // Procesar respuesta IA
      let textoLimpio = textoIA;
      let tipoGraficoIA = null;

      if (textoIA.includes("[GRAFICO_TORTA]")) tipoGraficoIA = "torta";
      else if (textoIA.includes("[GRAFICO_BARRAS]")) tipoGraficoIA = "barras";
      else if (textoIA.includes("[GRAFICO_LINEAS]")) tipoGraficoIA = "lineas";

      if (tipoGraficoIA) {
        textoLimpio = textoLimpio.replace(/\[GRAFICO_.*?\]/g, "").trim();
        const grafico = generarGraficoDesdeSolicitud(tipoGraficoIA, contenido);
        setGraficoActivo(grafico);
        setGraficoAbierto(true);
        const explicacion = generarExplicacionGrafico(grafico);
        setModalExplicacion(explicacion);

        if (explicacion && !textoLimpio) textoLimpio = explicacion;
      }

      setMensajes(prev => [...prev, {
        id: crypto.randomUUID(),
        emisor: "siga",
        tipo: "texto",
        contenido: textoLimpio || "Aquí tienes la información solicitada."
      }]);

    } catch (error) {
      console.error("Error IA:", error);
      // Fallback simulado
      setMensajes(prev => [...prev, {
        id: crypto.randomUUID(),
        emisor: "siga",
        tipo: "texto",
        contenido: "Lo siento, no pude conectar con mi cerebro digital. Pero estoy aquí para ayudarte con funciones básicas."
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
            <button
              type="button"
              className="btn-grafico-quick"
              onClick={generarGraficoVentasPorLocal}
              title="Generar gráfico de ventas por local"
              disabled={estaPensando}
            >
              📊
            </button>
          </div>

          <div className="mensajes-area">
            {mensajes.length === 0 && (
              <div className="mensaje-bienvenida">
                <p><strong>¡Hola! 👋</strong></p>
                <p>Soy tu asistente SIGA. Puedo ayudarte con:</p>
                <ul className="bienvenida-lista">
                  <li>📊 Análisis de ventas y tendencias</li>
                  <li>📦 Consultas sobre inventario</li>
                  <li>⚠️ Alertas de stock crítico</li>
                  <li>💡 Recomendaciones de gestión</li>
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

      {graficoAbierto && graficoActivo && (
        <>
          <div className={`grafico-modal-backdrop ${modalAnimating ? 'animando' : ''}`}></div>
          <div
            className={`grafico-modal movable ${modalAnimating ? 'animando' : ''}`}
            style={{
              left: `${posX}px`,
              top: `${posY}px`,
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              borderRadius: '24px',
              width: '600px',
              height: '450px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <header className="grafico-modal-header" onMouseDown={iniciarArrastre} style={{ cursor: 'grab' }}>
              <div>
                <strong>{graficoActivo.titulo}</strong>
                {modalExplicacion && <div className="grafico-explicacion-header">{modalExplicacion}</div>}
              </div>
              <button
                className="cerrar-modal"
                onClick={() => {
                  setGraficoAbierto(false);
                  setGraficoActivo(null);
                  setModalExplicacion('');
                }}
              >✕</button>
            </header>
            <div className="grafico-modal-body">
              {graficoActivo.tipo === "torta" && (
                <GraficoTorta
                  titulo={graficoActivo.titulo}
                  etiquetas={graficoActivo.etiquetas}
                  valores={graficoActivo.valores}
                />
              )}
              {graficoActivo.tipo === "barras" && (
                <GraficoBarras
                  titulo={graficoActivo.titulo}
                  etiquetas={graficoActivo.etiquetas}
                  valores={graficoActivo.valores}
                />
              )}
              {graficoActivo.tipo === "lineas" && (
                <GraficoLineas
                  titulo={graficoActivo.titulo}
                  etiquetas={graficoActivo.etiquetas}
                  valores={graficoActivo.valores}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

