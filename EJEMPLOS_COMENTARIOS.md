# EJEMPLOS DE COMENTARIOS EDUCATIVOS PARA SIGA PORTAL COMERCIAL

Este documento contiene ejemplos de cómo comentar cada tipo de archivo del proyecto pensando en preguntas del docente.

---

## 📄 EJEMPLO 1: main.jsx (Punto de entrada)

```javascript
// ============================================
// ARCHIVO: main.jsx
// DESCRIPCIÓN: Punto de entrada de la aplicación React
// FUNCIÓN: Inicializa React y renderiza el componente App en el DOM
// ============================================

// Importación de React y ReactDOM
// React: Librería principal para crear interfaces de usuario con componentes
//        Permite crear elementos interactivos que se actualizan automáticamente
// ReactDOM: Librería que renderiza componentes React en el DOM del navegador
//           Es el "puente" entre React (lógica) y el navegador (visualización)
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importación de Bootstrap CSS y JS
// Bootstrap: Framework CSS que proporciona componentes pre-estilizados
// ¿Por qué Bootstrap?
// 1. Acelera el desarrollo: botones, cards, navbar ya están diseñados
// 2. Responsive: se adapta automáticamente a móviles, tablets y desktop
// 3. Consistencia: todos los componentes tienen el mismo estilo
// bootstrap.min.css: Estilos visuales (colores, espaciados, tipografías)
// bootstrap.bundle.min.js: Funcionalidades JavaScript (dropdowns, modales, tooltips)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importación de estilos personalizados
// Contiene variables CSS con los colores oficiales de SIGA
// y estilos adicionales que no vienen con Bootstrap
import './styles/index.css';

// Importación del componente principal de la aplicación
import App from './App.jsx';

// Creación del punto de montaje de React
// ReactDOM.createRoot: Método moderno de React 18 para crear una raíz de renderizado
// document.getElementById('root'): Obtiene el elemento HTML con id="root" del index.html
// Este es el contenedor donde React renderizará toda la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizado de la aplicación
// root.render(): Método que renderiza el componente App y todos sus hijos en el DOM
// <React.StrictMode>: Componente de React que detecta problemas potenciales en desarrollo
//    - Ejecuta efectos dos veces en desarrollo para detectar side effects
//    - Advierte sobre el uso de APIs deprecadas
//    - Ayuda a identificar componentes con problemas de rendimiento
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 📄 EJEMPLO 2: App.jsx (Componente raíz)

```javascript
// ============================================
// ARCHIVO: App.jsx
// DESCRIPCIÓN: Componente raíz que define la estructura general de la aplicación
// FUNCIÓN: Decide qué componentes mostrar según la ruta actual
// ============================================

// Importación de React y hook useLocation
// React: Librería base
// useLocation: Hook de React Router que proporciona información sobre la ruta actual
//              location.pathname contiene la URL actual (ej: "/planes", "/login")
import React from 'react';
import { useLocation } from 'react-router-dom';

// Importación de componentes de la aplicación
import { Rutas } from './router.jsx';  // Componente que contiene todas las rutas
import Navbar from './components/Navbar.jsx';  // Barra de navegación superior
import Footer from './components/Footer.jsx';  // Pie de página
import AsistenteContextual from './components/AsistenteContextual.jsx';  // Asistente flotante

// ============================================
// COMPONENTE PRINCIPAL: App
// ============================================
export default function App() {
  // Hook useLocation: Obtiene información de la ruta actual
  // location.pathname: Contiene la ruta actual (ej: "/", "/planes", "/app")
  const location = useLocation();
  
  // Verificación: ¿Estamos en la página /app?
  // Esta página muestra la aplicación SIGA completa en un iframe
  // No necesita navbar ni footer porque la app SIGA tiene su propio diseño
  const estaEnApp = location.pathname === '/app';

  return (
    // Contenedor principal con clases de Bootstrap
    // d-flex: Convierte el div en un contenedor flexbox
    // flex-column: Apila elementos verticalmente (uno encima del otro)
    // min-vh-100: Altura mínima de 100% del viewport (altura de la pantalla completa)
    <div className="d-flex flex-column min-vh-100">
      
      {/* NAVBAR - Barra de navegación superior */}
      {/* Renderizado condicional: Solo se muestra si NO estamos en /app */}
      {/* ¿Por qué condicional? La app SIGA tiene su propio navbar */}
      {!estaEnApp && <Navbar />}
      
      {/* CONTENIDO PRINCIPAL */}
      {/* flex-grow-1: Hace que este contenedor ocupe todo el espacio disponible */}
      {/* Esto empuja el footer hacia abajo, manteniendo el footer siempre al final */}
      <main className="flex-grow-1">
        {/* Componente Rutas: Aquí se renderiza la página según la URL actual */}
        {/* React Router determina qué componente mostrar basado en la ruta */}
        <Rutas />
      </main>
      
      {/* FOOTER - Pie de página */}
      {/* Renderizado condicional: Solo se muestra si NO estamos en /app */}
      {!estaEnApp && <Footer />}
      
      {/* ASISTENTE CONTEXTUAL - Botón flotante de ayuda */}
      {/* Renderizado condicional: Solo se muestra si NO estamos en /app */}
      {/* ¿Por qué? La app SIGA tiene su propio asistente integrado */}
      {!estaEnApp && <AsistenteContextual />}
      
    </div>
  );
}
```

---

## 📄 EJEMPLO 3: Componente con useState (LoginPage.jsx)

```javascript
// ============================================
// ARCHIVO: LoginPage.jsx
// DESCRIPCIÓN: Página de inicio de sesión para usuarios
// FUNCIÓN: Permite a usuarios autenticarse con email y contraseña
// ============================================

import React, { useState } from 'react';
import { leerUsuarios } from '../datos/datosSimulados.js';
import { guardarUsuarioAutenticado } from '../utils/auth.js';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  // Hook useNavigate: Permite navegar programáticamente a otras rutas
  // Útil para redirigir después de login exitoso
  const navigate = useNavigate();
  
  // useState: Hook de React para manejar estado local en componentes
  // Estado: Datos que pueden cambiar y causan que el componente se vuelva a renderizar
  // [email, setEmail]: 
  //   - email: Valor actual del estado (string vacío inicialmente)
  //   - setEmail: Función para actualizar el valor de email
  // Cuando setEmail se llama, React re-renderiza el componente automáticamente
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Función para validar formato de email
  // Regex: Expresión regular que verifica el formato de email
  // /[^@\s]+@[^@\s]+\.[^@\s]+/
  //   - [^@\s]+: Uno o más caracteres que no sean @ ni espacios
  //   - @: Debe contener un símbolo @
  //   - [^@\s]+: Uno o más caracteres después del @
  //   - \.: Debe contener un punto literal
  //   - [^@\s]+: Uno o más caracteres después del punto
  const validarEmail = (valor) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(valor);

  // Función que se ejecuta cuando el usuario envía el formulario
  const manejarSubmit = (e) => {
    // e.preventDefault(): Evita que el formulario recargue la página
    // Por defecto, los formularios recargan la página al enviarse
    // En React queremos manejar esto manualmente con JavaScript
    e.preventDefault();
    
    // Limpiar errores anteriores
    setError('');
    
    // Validar formato de email
    if (!validarEmail(email)) {
      setError('Por favor ingresa un email válido.');
      return; // Detener la ejecución si el email es inválido
    }
    
    // Leer usuarios desde datos simulados
    const lista = leerUsuarios();
    
    // Array.find(): Busca el primer elemento que cumpla la condición
    // Busca un usuario cuyo email Y password coincidan con los ingresados
    const usuario = lista.find((u) => u.email === email && u.password === password);
    
    // Si no se encuentra usuario → mostrar error
    if (!usuario) {
      setError('Credenciales inválidas.');
      return;
    }
    
    // Guardar usuario autenticado en localStorage
    // Esto permite que el usuario permanezca logueado al recargar la página
    guardarUsuarioAutenticado(usuario);
    
    // Redirigir según el rol del usuario
    // navigate: Función de React Router para cambiar de ruta
    if (usuario.rol === 'admin') {
      navigate('/admin');  // Admins van al panel de administración
    } else {
      navigate('/perfil');  // Clientes van a su perfil
    }
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 480 }}>
        <h2 className="mb-4 text-primario">Iniciar Sesión</h2>
        
        {/* Formulario HTML5 con evento onSubmit */}
        {/* onSubmit: Se ejecuta cuando el usuario presiona Enter o hace click en submit */}
        <form onSubmit={manejarSubmit} data-testid="form-login">
          
          {/* Input controlado por React */}
          {/* value={email}: El valor del input está controlado por el estado email */}
          {/* onChange: Se ejecuta cada vez que el usuario escribe */}
          {/* e.target.value: Obtiene el texto que el usuario escribió */}
          {/* setEmail: Actualiza el estado, causando re-render */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          
          {/* Input de contraseña con type="password" para ocultar texto */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          {/* Renderizado condicional de error */}
          {/* Si error tiene contenido, muestra el mensaje */}
          {/* className="alert alert-danger": Clases de Bootstrap para alertas rojas */}
          {error && <div className="alert alert-danger">{error}</div>}
          
          {/* Botón de tipo submit que ejecuta onSubmit del formulario */}
          <button type="submit" className="btn btn-acento w-100">Entrar</button>
        </form>
      </div>
    </section>
  );
}
```

---

## 📄 EJEMPLO 4: Componente con useEffect (CardPlan.jsx)

```javascript
// ============================================
// ARCHIVO: CardPlan.jsx
// DESCRIPCIÓN: Componente que muestra una tarjeta de plan de suscripción
// FUNCIÓN: Muestra información del plan y carga precio en CLP desde API
// ============================================

import React, { useState, useEffect } from 'react';
import Boton from './Boton.jsx';
import { convertirUFaCLP, formatearPrecioCLP } from '../utils/indicadoresEconomicos.js';

export default function CardPlan({ plan, onSeleccionar }) {
  // useState: Maneja el precio convertido a CLP
  const [precioCLP, setPrecioCLP] = useState(null);
  const [cargandoPrecio, setCargandoPrecio] = useState(true);

  // useEffect: Hook que ejecuta código después de que el componente se renderiza
  // [plan.precio]: Array de dependencias - el efecto se ejecuta cuando plan.precio cambia
  // ¿Por qué useEffect aquí?
  // - La conversión de UF a CLP requiere una llamada a API (operación asíncrona)
  // - No podemos hacer llamadas async directamente en el cuerpo del componente
  // - useEffect permite ejecutar código después del render inicial
  useEffect(() => {
    // Función async para cargar precio en CLP
    // async/await: Sintaxis moderna para manejar promesas (código asíncrono)
    const cargarPrecioCLP = async () => {
      setCargandoPrecio(true);  // Mostrar indicador de carga
      
      try {
        // convertirUFaCLP: Función que llama a la API de mindicador.cl
        // await: Espera a que la promesa se resuelva antes de continuar
        const precio = await convertirUFaCLP(plan.precio);
        setPrecioCLP(precio);  // Guardar precio en estado
      } catch (error) {
        // Manejo de errores: Si la API falla, registra el error en consola
        console.error('Error al cargar precio en CLP:', error);
      } finally {
        // finally: Se ejecuta siempre, sin importar si hubo error o no
        setCargandoPrecio(false);  // Ocultar indicador de carga
      }
    };

    // Ejecutar la función solo si hay un plan
    if (plan.precio) {
      cargarPrecioCLP();
    }
  }, [plan.precio]);  // Dependencias: se ejecuta cuando plan.precio cambia

  return (
    <div className="col-md-4 mb-4">
      {/* Card: Componente de Bootstrap para mostrar contenido en tarjeta */}
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-primario">{plan.nombre}</h5>
          
          {/* Precio en UF */}
          <div className="mb-3">
            <p className="card-text mb-1">
              <span className="fs-3 fw-bold text-primario">{plan.precio}</span>
              <span className="ms-1">{plan.unidad}/mes</span>
            </p>
            
            {/* Renderizado condicional: Muestra precio en CLP si ya se cargó */}
            {!cargandoPrecio && precioCLP && (
              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                ≈ {formatearPrecioCLP(precioCLP)}/mes
              </p>
            )}
            
            {/* Renderizado condicional: Muestra spinner mientras carga */}
            {cargandoPrecio && (
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                Calculando precio...
              </p>
            )}
          </div>
          
          {/* Lista de características del plan */}
          <ul className="list-unstyled flex-grow-1">
            {/* Array.map(): Transforma cada elemento del array en un elemento JSX */}
            {/* key={i}: Propiedad requerida por React para identificar elementos en lista */}
            {plan.caracteristicas.map((c, i) => (
              <li key={i} className="mb-1">• {c}</li>
            ))}
          </ul>
          
          {/* Botón para seleccionar plan */}
          {/* onClick: Ejecuta función cuando usuario hace click */}
          {/* onSeleccionar es una función que viene como prop del componente padre */}
          <Boton 
            texto="Seleccionar Plan" 
            onClick={() => onSeleccionar(plan)} 
            clase="btn btn-acento mt-auto" 
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 📄 EJEMPLO 5: Utilidad con API Externa (indicadoresEconomicos.js)

```javascript
// ============================================
// ARCHIVO: indicadoresEconomicos.js
// DESCRIPCIÓN: Servicio para obtener indicadores económicos de Chile (UF y USD)
// FUNCIÓN: Convierte precios en UF a pesos chilenos usando API pública
// ============================================

// Constante: URL base de la API pública de mindicador.cl
// API pública: No requiere autenticación ni API key
// mindicador.cl: Servicio que proporciona indicadores económicos chilenos actualizados diariamente
const API_BASE = 'https://mindicador.cl/api';

// Cache simple para evitar demasiadas peticiones
// ¿Por qué cache?
// - Evita hacer la misma petición múltiples veces en poco tiempo
// - Mejora el rendimiento de la aplicación
// - Respeta los recursos del servidor de la API
let cache = null;  // Almacena los últimos datos obtenidos
let cacheTimestamp = null;  // Timestamp de cuándo se guardó el cache
const CACHE_DURATION = 5 * 60 * 1000;  // 5 minutos en milisegundos

// ============================================
// FUNCIÓN: obtenerIndicadoresEconomicos
// DESCRIPCIÓN: Obtiene valores actuales de UF y USD desde la API
// RETORNA: Promise que resuelve en objeto {uf, usd, fecha}
// ============================================
export async function obtenerIndicadoresEconomicos() {
  // Verificar cache: Si hay datos en cache y no han expirado, usar cache
  if (cache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cache;  // Retornar datos del cache sin hacer petición
  }

  try {
    // fetch: API nativa del navegador para hacer peticiones HTTP
    // fetch retorna una Promise que se resuelve con la respuesta
    const response = await fetch(API_BASE);
    
    // response.ok: Verifica si la petición fue exitosa (status 200-299)
    if (!response.ok) {
      throw new Error('Error al obtener indicadores económicos');
    }

    // response.json(): Convierte la respuesta (texto JSON) a objeto JavaScript
    // await: Espera a que la conversión termine antes de continuar
    const data = await response.json();
    
    // Extraer valores de UF y USD del objeto respuesta
    // Optional chaining (?.): Si uf no existe, usa 0 en lugar de dar error
    const uf = data.uf?.valor || 0;
    const usd = data.dolar?.valor || 0;
    const fecha = data.uf?.fecha || data.dolar?.fecha || new Date().toISOString();

    const resultado = {
      uf,
      usd,
      fecha,
    };

    // Guardar en cache para próximas peticiones
    cache = resultado;
    cacheTimestamp = Date.now();

    return resultado;
  } catch (error) {
    // Manejo de errores: Si la API falla, retornar valores por defecto
    // Esto permite que la aplicación siga funcionando aunque la API esté caída
    console.error('Error al obtener indicadores económicos:', error);
    
    // Valores aproximados de referencia (actualizar manualmente si es necesario)
    return {
      uf: 38000,  // Valor aproximado de UF en CLP
      usd: 950,   // Valor aproximado de USD en CLP
      fecha: new Date().toISOString(),
    };
  }
}

// ============================================
// FUNCIÓN: convertirUFaCLP
// DESCRIPCIÓN: Convierte un precio en UF a pesos chilenos
// PARÁMETROS: precioUF (number) - Precio en UF
// RETORNA: Promise que resuelve en precio en CLP (number)
// ============================================
export async function convertirUFaCLP(precioUF) {
  // Obtener indicadores económicos desde la API
  const indicadores = await obtenerIndicadoresEconomicos();
  
  // Multiplicar precio en UF por valor de UF en CLP
  // Math.round(): Redondea el resultado al número entero más cercano
  return Math.round(precioUF * indicadores.uf);
}

// ============================================
// FUNCIÓN: formatearPrecioCLP
// DESCRIPCIÓN: Formatea un número como precio en formato chileno
// PARÁMETROS: precio (number) - Precio en CLP
// RETORNA: string formateado (ej: "$38.000")
// ============================================
export function formatearPrecioCLP(precio) {
  // Intl.NumberFormat: API nativa para formatear números según localización
  // 'es-CL': Código de idioma y país (Español de Chile)
  // style: 'currency': Formatea como moneda
  // currency: 'CLP': Usa pesos chilenos como moneda
  // minimumFractionDigits: 0: No muestra decimales
  // maximumFractionDigits: 0: No muestra decimales
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}
```

---

## 📄 EJEMPLO 6: Función CRUD con localStorage (datosSimulados.js)

```javascript
// ============================================
// ARCHIVO: datosSimulados.js
// DESCRIPCIÓN: Datos simulados y funciones CRUD para Planes y Usuarios
// FUNCIÓN: Simula una base de datos usando arrays y localStorage
// ============================================

// Constantes: Claves para guardar datos en localStorage
// localStorage: Almacenamiento del navegador que persiste entre sesiones
// ¿Por qué usar claves constantes?
// - Evita errores de tipeo al escribir las claves
// - Facilita el mantenimiento si necesitamos cambiar nombres
const CLAVE_PLANES = 'siga_planes';
const CLAVE_USUARIOS = 'siga_usuarios';
const CLAVE_SUSCRIPCIONES = 'siga_suscripciones';

// ============================================
// FUNCIÓN: cargarDesdeLocalStorage
// DESCRIPCIÓN: Carga datos de localStorage o usa valores por defecto
// PARÁMETROS: 
//   - clave: string - Nombre de la clave en localStorage
//   - valorPorDefecto: any - Valor a usar si no hay datos guardados
// RETORNA: Datos cargados o valor por defecto
// ============================================
function cargarDesdeLocalStorage(clave, valorPorDefecto) {
  try {
    // localStorage.getItem(): Obtiene el valor guardado en localStorage
    // Retorna null si la clave no existe
    const datos = localStorage.getItem(clave);
    
    if (datos) {
      // JSON.parse(): Convierte string JSON a objeto JavaScript
      // localStorage solo guarda strings, por eso necesitamos parsear
      return JSON.parse(datos);
    }
  } catch (error) {
    // Manejo de errores: Si hay problema al leer, registrar en consola
    console.error(`Error al cargar ${clave} desde localStorage:`, error);
  }
  
  // Si no hay datos o hubo error, retornar valores por defecto
  return valorPorDefecto;
}

// ============================================
// FUNCIÓN: guardarEnLocalStorage
// DESCRIPCIÓN: Guarda datos en localStorage
// PARÁMETROS:
//   - clave: string - Nombre de la clave
//   - datos: any - Datos a guardar
// ============================================
function guardarEnLocalStorage(clave, datos) {
  try {
    // JSON.stringify(): Convierte objeto JavaScript a string JSON
    // localStorage solo acepta strings, por eso necesitamos convertir
    localStorage.setItem(clave, JSON.stringify(datos));
  } catch (error) {
    // Manejo de errores: Si hay problema al guardar, registrar en consola
    console.error(`Error al guardar ${clave} en localStorage:`, error);
  }
}

// ============================================
// FUNCIÓN: crearPlan
// DESCRIPCIÓN: Crea un nuevo plan de suscripción (CREATE en CRUD)
// PARÁMETROS: plan (object) - Objeto con datos del plan
// RETORNA: Plan creado con ID asignado
// ============================================
export function crearPlan(plan) {
  // Generar ID único para el nuevo plan
  // Math.max(...planes.map(...)): Encuentra el ID más alto y suma 1
  const nuevo = { ...plan, id: generarIdPara(planes) };
  
  // Spread operator (...planes): Copia todos los planes existentes
  // [...planes, nuevo]: Crea nuevo array con todos los planes + el nuevo
  planes = [...planes, nuevo];
  
  // Guardar en localStorage para persistencia
  guardarEnLocalStorage(CLAVE_PLANES, planes);
  
  return nuevo;
}

// ============================================
// FUNCIÓN: leerPlanes
// DESCRIPCIÓN: Obtiene todos los planes (READ en CRUD)
// RETORNA: Array con todos los planes
// ============================================
export function leerPlanes() {
  // Recargar desde localStorage para obtener datos actualizados
  // Esto asegura que siempre tengamos los datos más recientes
  planes = cargarDesdeLocalStorage(CLAVE_PLANES, planesPorDefecto);
  
  // Retornar copia del array para evitar mutaciones accidentales
  // [...planes]: Crea una copia nueva del array
  return [...planes];
}

// ============================================
// FUNCIÓN: actualizarPlan
// DESCRIPCIÓN: Actualiza un plan existente (UPDATE en CRUD)
// PARÁMETROS:
//   - id: number - ID del plan a actualizar
//   - cambios: object - Objeto con los campos a cambiar
// RETORNA: Plan actualizado o null si no existe
// ============================================
export function actualizarPlan(id, cambios) {
  // Array.map(): Crea nuevo array transformando cada elemento
  // Si el ID coincide, combina el plan existente con los cambios
  // Si no coincide, deja el plan sin cambios
  planes = planes.map((p) => (p.id === id ? { ...p, ...cambios } : p));
  
  // Guardar cambios en localStorage
  guardarEnLocalStorage(CLAVE_PLANES, planes);
  
  // Array.find(): Busca el plan actualizado
  return planes.find((p) => p.id === id) || null;
}

// ============================================
// FUNCIÓN: eliminarPlan
// DESCRIPCIÓN: Elimina un plan (DELETE en CRUD)
// PARÁMETROS: id (number) - ID del plan a eliminar
// RETORNA: boolean - true si se eliminó, false si no existía
// ============================================
export function eliminarPlan(id) {
  // Guardar cantidad antes de filtrar
  const antes = planes.length;
  
  // Array.filter(): Crea nuevo array con elementos que cumplen condición
  // p.id !== id: Mantiene solo planes cuyo ID NO sea el que queremos eliminar
  planes = planes.filter((p) => p.id !== id);
  
  // Guardar cambios en localStorage
  guardarEnLocalStorage(CLAVE_PLANES, planes);
  
  // Verificar si realmente se eliminó comparando longitudes
  return planes.length < antes;
}
```

---

## 💡 PREGUNTAS FRECUENTES DEL DOCENTE

### ¿Qué es React y por qué lo usaste?
**Respuesta:** React es una librería de JavaScript para crear interfaces de usuario. La usamos porque:
- Permite crear componentes reutilizables
- Actualiza automáticamente la UI cuando cambian los datos
- Tiene una gran comunidad y documentación
- Es eficiente: solo actualiza lo que cambió

### ¿Qué es useState y cómo funciona?
**Respuesta:** useState es un hook de React que permite manejar estado local en componentes:
- Retorna un array con [valor, funciónParaCambiar]
- Cuando cambias el estado, React re-renderiza el componente automáticamente
- Ejemplo: `const [email, setEmail] = useState('')`

### ¿Qué es useEffect y cuándo se usa?
**Respuesta:** useEffect ejecuta código después del render:
- Se usa para efectos secundarios (llamadas a API, suscripciones, etc.)
- Se ejecuta después de cada render o cuando cambian las dependencias
- Ejemplo: Cargar datos desde una API cuando el componente se monta

### ¿Qué es localStorage y por qué lo usaste?
**Respuesta:** localStorage es almacenamiento del navegador que persiste entre sesiones:
- Guarda datos como strings (por eso usamos JSON.stringify/parse)
- Los datos persisten aunque el usuario cierre el navegador
- Lo usamos para simular una base de datos sin necesidad de backend

### ¿Qué es React Router y para qué sirve?
**Respuesta:** React Router permite navegación entre páginas sin recargar:
- Crea una Single Page Application (SPA)
- Cambia qué componente mostrar según la URL
- Proporciona hooks como useNavigate y useLocation

### ¿Qué es Bootstrap y por qué lo usaste?
**Respuesta:** Bootstrap es un framework CSS que proporciona componentes pre-estilizados:
- Acelera el desarrollo con componentes listos para usar
- Diseño responsive automático
- Consistencia visual en toda la aplicación

### ¿Qué es una API y cómo la usaste?
**Respuesta:** API (Application Programming Interface) es una interfaz para comunicarse con servicios externos:
- Usamos la API de mindicador.cl para obtener valores de UF y USD
- fetch() es la función nativa del navegador para hacer peticiones HTTP
- async/await permite manejar código asíncrono de forma limpia

---

## 📝 CHECKLIST DE COMENTARIOS

Para cada archivo, asegúrate de tener:

- [ ] Encabezado con nombre y descripción del archivo
- [ ] Comentarios explicando cada importación y librería
- [ ] Comentarios en funciones principales explicando qué hacen
- [ ] Comentarios inline en código complejo
- [ ] Explicación de por qué se usa cada librería
- [ ] Explicación de conceptos clave (useState, useEffect, etc.)

---

**Este documento sirve como guía para agregar comentarios educativos a todo el proyecto.**

