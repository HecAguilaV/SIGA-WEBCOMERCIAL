# GUÍA DE ESTUDIO
## SIGA Portal Comercial - Documentación Técnica

---

## 📚 ÍNDICE

1. [Tecnologías y Librerías](#tecnologías-y-librerías)
2. [APIs Externas](#apis-externas)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Estructura de Datos](#estructura-de-datos)
5. [Sistema de Rutas](#sistema-de-rutas)
6. [Persistencia de Datos](#persistencia-de-datos)
7. [Sistema de Autenticación](#sistema-de-autenticación)
8. [Funcionalidades Principales](#funcionalidades-principales)
9. [Testing](#testing)

---

## 🛠️ TECNOLOGÍAS Y LIBRERÍAS

### Dependencias Principales (Producción)

#### **React 18.3.1**
- **Qué es:** Librería de JavaScript para construir interfaces de usuario
- **Uso en el proyecto:** Framework base para todos los componentes
- **Características utilizadas:**
  - Componentes funcionales con hooks (`useState`, `useEffect`, `useNavigate`, `useLocation`)
  - JSX para estructurar la UI
  - Ciclo de vida de componentes

#### **React DOM 18.3.1**
- **Qué es:** Renderizador de React para navegadores web
- **Uso en el proyecto:** Renderiza los componentes React en el DOM del navegador

#### **React Router DOM 6.26.2**
- **Qué es:** Librería de enrutamiento para aplicaciones React
- **Uso en el proyecto:** Navegación entre páginas (SPA - Single Page Application)
- **Componentes utilizados:**
  - `BrowserRouter`: Envuelve la aplicación para habilitar routing
  - `Routes` y `Route`: Define las rutas y sus componentes
  - `Link` y `NavLink`: Navegación entre páginas
  - `Navigate`: Redirecciones
  - `Outlet`: Renderiza rutas anidadas (admin layout)
- **Conceptos aplicados:**
  - Rutas públicas, protegidas y de administrador
  - Redirecciones condicionales basadas en autenticación
  - Rutas anidadas para el panel de administración

#### **Bootstrap 5.3.3**
- **Qué es:** Framework CSS para diseño responsive
- **Uso en el proyecto:** Componentes UI y layout responsivo
- **Componentes utilizados:**
  - Navbar, Cards, Buttons, Forms, Tables, Alerts, Badges, Dropdowns
  - Sistema de grid (row, col)
  - Utilidades (spacing, colors, display)
- **Integración:** Importado en `main.jsx` como CSS y JS

### Dependencias de Desarrollo

#### **Vite 5.4.10**
- **Qué es:** Herramienta de build rápida para desarrollo frontend
- **Uso en el proyecto:** Servidor de desarrollo y bundler para producción
- **Configuración:** `vite.config.js`
  - Puerto fijo: 5173
  - Plugin React habilitado
  - Archivos estáticos desde carpeta `static/`

#### **@vitejs/plugin-react 4.3.1**
- **Qué es:** Plugin oficial de Vite para React
- **Uso:** Transforma JSX y habilita HMR (Hot Module Replacement)

#### **Jasmine Core 5.3.0**
- **Qué es:** Framework de testing BDD (Behavior-Driven Development)
- **Uso:** Escribir pruebas unitarias con sintaxis descriptiva

#### **Karma 6.4.4**
- **Qué es:** Test runner para ejecutar pruebas en navegadores reales
- **Uso:** Ejecuta las pruebas de Jasmine en Chrome
- **Configuración:** `karma.conf.js`
  - Usa Webpack y Babel para transpilar JSX
  - Genera reportes de coverage

#### **Webpack 5.95.0**
- **Qué es:** Bundler de módulos JavaScript
- **Uso:** Solo para testing (Karma necesita Webpack para procesar JSX)

#### **Babel (Core + Preset React + Loader)**
- **Qué es:** Transpilador de JavaScript moderno
- **Uso:** Convierte JSX y ES6+ a JavaScript compatible con navegadores
- **Preset React:** Transforma JSX en llamadas a `React.createElement`

---

## 🌐 APIs EXTERNAS

### **mindicador.cl API**

#### **Descripción**
API pública gratuita que proporciona indicadores económicos chilenos actualizados diariamente.

#### **Endpoints Utilizados**
- **Base URL:** `https://mindicador.cl/api`
- **UF:** `GET /api/uf` - Valor de la Unidad de Fomento en CLP
- **Dólar:** `GET /api/dolar` - Valor del dólar en CLP

#### **Implementación**
- **Archivo:** `src/utils/indicadoresEconomicos.js`
- **Funciones:**
  - `obtenerIndicadoresEconomicos()`: Obtiene UF y USD desde la API
  - `convertirUFaCLP(precioUF)`: Convierte precio en UF a pesos chilenos
  - `convertirUSDaCLP(precioUSD)`: Convierte precio en USD a pesos chilenos
  - `formatearPrecioCLP(precio)`: Formatea números como moneda chilena

#### **Características**
- **Cache:** 5 minutos para evitar demasiadas peticiones
- **Fallback:** Valores por defecto si la API falla
- **Manejo de errores:** Try-catch con valores aproximados

#### **Ejemplo de Respuesta**
```json
{
  "uf": {
    "valor": 38000,
    "fecha": "2025-01-15"
  },
  "dolar": {
    "valor": 950,
    "fecha": "2025-01-15"
  }
}
```

---

## 🏗️ ARQUITECTURA DEL PROYECTO

### **Patrón de Diseño: Component-Based Architecture**

El proyecto sigue una arquitectura de componentes React organizados jerárquicamente:

```
App.jsx (Raíz)
├── Navbar (Siempre visible excepto en /app)
├── Router (Sistema de rutas)
│   ├── Rutas Públicas
│   ├── Rutas Protegidas
│   └── Rutas Admin
├── Footer (Siempre visible excepto en /app)
└── AsistenteContextual (Siempre visible excepto en /app)
```

### **Separación de Responsabilidades**

1. **Components** (`src/components/`): Componentes reutilizables sin lógica de negocio
2. **Pages** (`src/pages/`): Páginas completas con lógica de negocio
3. **Utils** (`src/utils/`): Funciones auxiliares y utilidades
4. **Datos** (`src/datos/`): Datos simulados y funciones CRUD
5. **Styles** (`src/styles/`): Estilos globales y variables CSS

---

## 📊 ESTRUCTURA DE DATOS

### **Planes de Suscripción**

```javascript
{
  id: number,
  nombre: string,           // "Kiosco", "Emprendedor Pro", "Crecimiento"
  precio: number,           // 0, 0.9, 1.9 (en UF)
  unidad: string,           // "UF"
  esFreemium: boolean,      // true solo para Kiosco
  caracteristicas: string[]  // Array de beneficios
}
```

### **Usuarios**

```javascript
{
  id: number,
  nombre: string,
  email: string,
  password: string,         // Texto plano (simulación)
  rol: string,             // "admin" | "cliente"
  planId: number | null,   // ID del plan asignado
  enTrial: boolean,        // Si está en free trial
  fechaInicioTrial: string | null,  // ISO date
  fechaFinTrial: string | null      // ISO date
}
```

### **Suscripciones**

```javascript
{
  id: number,
  usuarioId: number,
  planId: number,
  fechaInicio: string,      // ISO date
  fechaActualizacion: string, // ISO date
  enTrial: boolean,
  trialUsado: boolean       // Si ya usó su trial gratuito
}
```

### **Límites de Plan**

```javascript
{
  usuarios: number,        // -1 = ilimitado
  bodegas: number,        // -1 = ilimitado
  productos: number,      // -1 = ilimitado
  reportes: string,       // "Básicos" | "Avanzados" | "Completos + IA"
  soporte: string,        // "Email" | "Email + Chat" | "Prioritario 24/7"
  asistenteSIGA: boolean // Siempre true
}
```

---

## 🗺️ SISTEMA DE RUTAS

### **Rutas Públicas** (Sin autenticación)
- `/` - HomePage
- `/planes` - Catálogo de planes
- `/acerca` - Información sobre SIGA
- `/login` - Inicio de sesión
- `/registro` - Registro de usuario
- `/carrito` - Carrito de compras
- `/checkout` - Pasarela de pago
- `/exito` - Confirmación de compra

### **Rutas Protegidas** (Requieren autenticación)
- `/perfil` - Perfil del usuario
- `/app` - Aplicación SIGA (iframe)

### **Rutas Admin** (Requieren rol admin)
- `/admin` - Dashboard administrativo
- `/admin/usuarios` - Gestión de usuarios
- `/admin/planes` - Gestión de planes
- `/admin/suscripciones` - Suscripciones activas

### **Protección de Rutas**
- **RutaPrivada:** Componente que verifica rol `admin`
- **RutaAutenticada:** Componente que verifica cualquier usuario autenticado
- Redirección automática a `/login` si no cumple requisitos

---

## 💾 PERSISTENCIA DE DATOS

### **localStorage**

Todos los datos se almacenan en el navegador usando `localStorage`:

#### **Claves Utilizadas**
- `siga_planes`: Array de planes de suscripción
- `siga_usuarios`: Array de usuarios registrados
- `siga_suscripciones`: Array de suscripciones (historial)
- `siga_usuario_autenticado`: Usuario actual logueado
- `siga_carrito`: Plan seleccionado en el carrito

#### **Funciones Helper**
- `cargarDesdeLocalStorage(clave, valorPorDefecto)`: Carga datos o usa valores por defecto
- `guardarEnLocalStorage(clave, datos)`: Guarda datos en localStorage
- Manejo de errores con try-catch

#### **Ventajas**
- Persistencia entre sesiones
- No requiere backend
- Funciona offline (después de primera carga)

#### **Limitaciones**
- Solo en el navegador actual
- Tamaño limitado (~5-10MB)
- Datos pueden ser eliminados por el usuario

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### **Autenticación Simulada**

El sistema usa autenticación simulada sin backend real:

#### **Flujo de Autenticación**
1. Usuario ingresa email y contraseña en `/login`
2. Se busca en array de usuarios (`datosSimulados.js`)
3. Si coincide, se guarda en `localStorage` como `siga_usuario_autenticado`
4. Se redirige según rol:
   - `admin` → `/admin`
   - `cliente` → `/perfil`

#### **Funciones** (`src/utils/auth.js`)
- `obtenerUsuarioAutenticado()`: Obtiene usuario desde localStorage
- `guardarUsuarioAutenticado(usuario)`: Guarda usuario en localStorage
- `cerrarSesion()`: Elimina usuario de localStorage

#### **Roles**
- **admin:** Acceso completo al panel administrativo
- **cliente:** Acceso a perfil y aplicación SIGA

---

## ⚙️ FUNCIONALIDADES PRINCIPALES

### **1. Sistema de Free Trial**

**Implementación:** `src/datos/datosSimulados.js`

**Funciones:**
- `iniciarFreeTrial(usuarioId, planId)`: Inicia trial de 14 días
- `verificarTrialActivo(usuarioId)`: Verifica si hay trial activo y días restantes
- `convertirTrialAPagado(usuarioId)`: Convierte trial a suscripción pagada
- `puedeIniciarTrial(usuarioId)`: Verifica si puede iniciar trial (solo una vez)

**Lógica:**
- Trial dura 14 días desde la fecha de inicio
- Al expirar, usuario vuelve automáticamente al plan Kiosco
- Solo se permite un trial por usuario

### **2. Pasarela de Pago Simulada**

**Archivo:** `src/pages/CheckoutPage.jsx`

**Características:**
- Validación de número de tarjeta (13-19 dígitos)
- Formato automático con espacios cada 4 dígitos
- Detección de tipo de tarjeta (Visa/Mastercard)
- Validación de CVV y fecha de vencimiento
- Simulación de procesamiento (2 segundos)
- Asignación automática de plan al usuario

### **3. Conversión de Precios UF → CLP**

**Archivo:** `src/utils/indicadoresEconomicos.js`

**Proceso:**
1. Obtiene valor actual de UF desde API
2. Multiplica precio en UF por valor de UF
3. Formatea resultado como moneda chilena
4. Cache de 5 minutos para optimizar

**Uso:**
- Se muestra en todas las tarjetas de planes
- Aparece en carrito y checkout
- Actualización automática según valor del día

### **4. Panel de Administración**

**Funcionalidades:**
- Dashboard con métricas (usuarios, planes, suscripciones)
- CRUD completo de usuarios (Crear, Leer, Actualizar, Eliminar)
- CRUD completo de planes
- Visualización de suscripciones activas
- Reset de contraseñas (sin mostrar contraseñas actuales)

---

## 🧪 TESTING

### **Configuración**
- **Framework:** Jasmine + Karma
- **Configuración:** `karma.conf.js`
- **Browser:** Chrome (headless)

### **Pruebas Incluidas**

#### **1. Componente Boton** (`tests/boton.spec.jsx`)
- Verifica renderizado correcto
- Verifica ejecución de onClick

#### **2. LoginPage** (`tests/login.spec.jsx`)
- Verifica cambios de estado en inputs
- Verifica validación de email
- Verifica manejo de errores

#### **3. Función eliminarUsuario** (`tests/eliminarUsuario.spec.js`)
- Verifica eliminación de usuario del array
- Verifica persistencia en localStorage

### **Ejecución**
```bash
npm test
```

### **Coverage**
Karma genera reportes de cobertura en `coverage/` después de ejecutar pruebas.

---

## 📝 CONCEPTOS TÉCNICOS APLICADOS

### **React Hooks Utilizados**

- **useState:** Manejo de estado local en componentes
- **useEffect:** Efectos secundarios (carga de datos, suscripciones)
- **useNavigate:** Navegación programática
- **useLocation:** Información de ruta actual

### **Patrones de Diseño**

- **Component Composition:** Componentes pequeños y reutilizables
- **Container/Presentational:** Separación de lógica y presentación
- **Higher-Order Components:** Rutas protegidas como componentes wrapper
- **Custom Hooks:** (Potencialmente para lógica reutilizable)

### **Manejo de Estado**

- **Estado Local:** `useState` para estado de componentes
- **Estado Global Simulado:** `localStorage` como fuente de verdad
- **Sincronización:** Carga desde localStorage en cada operación CRUD

### **Validaciones**

- **Email:** Regex `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`
- **Tarjeta:** 13-19 dígitos numéricos
- **CVV:** 3-4 dígitos
- **Contraseña:** Mínimo 6 caracteres

---

## 🔄 FLUJOS PRINCIPALES

### **Flujo de Compra**
1. Usuario navega a `/planes`
2. Selecciona plan → Guarda en carrito (`localStorage`)
3. Va a `/carrito` → Revisa plan seleccionado
4. Procede a `/checkout` → Completa formulario de pago
5. Procesa pago → Asigna plan al usuario
6. Redirige a `/exito` → Confirmación

### **Flujo de Free Trial**
1. Usuario con plan Kiosco va a `/perfil`
2. Ve opción de iniciar trial → Click en botón
3. Se inicia trial de 14 días → Plan temporal asignado
4. Durante trial → Ve contador de días restantes
5. Opciones:
   - Convertir a suscripción pagada antes de expirar
   - Esperar expiración → Vuelve a Kiosco automáticamente

### **Flujo de Autenticación**
1. Usuario va a `/login` o `/registro`
2. Si registro → Crea cuenta → Redirige a `/perfil`
3. Si login → Valida credenciales → Redirige según rol
4. Sesión guardada en `localStorage`
5. Rutas protegidas verifican autenticación antes de renderizar

---

## 🎨 ESTILOS Y DISEÑO

### **Bootstrap 5**
- Sistema de grid responsive
- Componentes pre-estilizados
- Utilidades de espaciado y colores

### **CSS Personalizado**
- Variables CSS para colores SIGA
- Estilos para Navbar personalizado
- Estilos para asistente contextual
- Estilos para landing page (hero, features)

### **Identidad Visual**
- Colores oficiales SIGA definidos como variables CSS
- Logo SIGA en navbar y favicon
- Tipografía consistente

---

## 📦 BUILD Y DEPLOYMENT

### **Desarrollo**
```bash
npm run dev
```
- Servidor Vite en puerto 5173
- Hot Module Replacement (HMR)
- Recarga automática en cambios

### **Producción**
```bash
npm run build
```
- Genera bundle optimizado en `dist/`
- Minificación y tree-shaking
- Assets estáticos procesados

### **Preview**
```bash
npm run preview
```
- Servidor local para probar build de producción

---

## 🔍 DEBUGGING Y DESARROLLO

### **Console Logs**
- Errores de localStorage registrados en consola
- Errores de API registrados con fallback

### **Herramientas de Desarrollo**
- React DevTools (extensión de navegador)
- Chrome DevTools para inspección de localStorage
- Network tab para verificar llamadas a API

### **Datos de Prueba**
- Usuarios por defecto incluidos en `datosSimulados.js`
- Pueden limpiarse con `localStorage.clear()` en consola

---

## 📚 RECURSOS ADICIONALES

### **Documentación Oficial**
- [React](https://react.dev)
- [React Router](https://reactrouter.com)
- [Bootstrap 5](https://getbootstrap.com)
- [Vite](https://vitejs.dev)
- [Jasmine](https://jasmine.github.io)
- [Karma](https://karma-runner.github.io)

### **APIs Utilizadas**
- [mindicador.cl](https://mindicador.cl/api) - Documentación de API

---

**Última actualización:** Enero 2025

