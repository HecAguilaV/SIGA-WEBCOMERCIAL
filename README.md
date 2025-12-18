<p align="center">
  <img src="static/brand/Logo_SIGA.png" alt="Logo SIGA" width="300" />
</p>

<h1 align="center">SIGA - Portal Comercial</h1>

<p align="center">
  <strong>Sistema Inteligente de Gestión de Activos</strong><br/>
  Portal comercial y gestión de suscripciones para planes SaaS
</p>

<hr />

<p align="center">
  <img src="https://img.shields.io/badge/Coraz%C3%B3n_de-SIGA-00B4D8?style=for-the-badge&labelColor=03045E" />
  <img src="https://img.shields.io/badge/Visi%C3%B3n-Que_el_emprendedor_nunca_se_detenga-80FFDB?style=for-the-badge&labelColor=03045E" />
</p>

# SIGA - Portal Comercial

**Sistema Inteligente de Gestión de Activos**  
*Más que un software, una declaración de intenciones.*

> 🚀 **Live Demo:** [https://siga-webcomercial.vercel.app](https://siga-webcomercial.vercel.app)

---

##  Filosofía del Proyecto

> **"No gestiones tu inventario, gestiona tu tiempo."**

SIGA nace de una problemática real: la parálisis operativa que sufren las PYMES.
Nuestra misión no es solo registrar productos, es **reducir la fricción operativa** traduciendo la intención del negocio en acciones automáticas.

### Pilares
1.  **Menos Fricción:** Interfaces intuitivas que no requieren manuales.
2.  **Más Intención:** El sistema entiende lo que quieres hacer (Asistente IA).
3.  **Automatización:** El emprendedor no debe detenerse por tareas administrativas.

---

##  Identidad Visual y Experiencia (New Look 2025)

Hemos migrado de una interfaz genérica a una identidad propia y premium:

*   **Tema:** **Deep Blue** (`#03045e`) con acentos Cyan y Neon.
*   **Estilo:** **Glassmorphism** (Paneles de cristal translúcido).
*   **Dashboards Reales:** Mostramos la interfaz real de la aplicación desde el primer segundo.
*   **Unificación:** El **Asistente IA** ahora es un gemelo visual de la WebApp principal.

## Características Principales

### Portal Comercial
- **Página de inicio** con información sobre SIGA y video demostrativo
- **Catálogo de planes** con precios en UF y conversión a CLP
- **Carrito de compras** persistente en localStorage
- **Validación de autenticación** antes de permitir el pago
- **Pasarela de pago simulada** con diseño profesional
- **Generación automática de facturas** después de cada compra
- **Facturas imprimibles** con diseño profesional
- **Página de éxito** con visualización inmediata de factura
- **Historial completo de compras** en el perfil del usuario
- **Asistente con IA** para consultas y visualización de datos (gráficos de mermas)

### Gestión de Usuarios
- Sistema de autenticación JWT Integrado
- Registro e inicio de sesión
- Perfil de usuario con información del plan actual
- Dashboard personalizado para clientes
- **Historial de compras y facturas** accesible desde el perfil
- **Visualización e impresión** de facturas individuales

### Sistema de Free Trial
- **Trial gratuito de 14 días** para planes Pro y Crecimiento
- Un solo trial por usuario
- Conversión automática a suscripción pagada
- Notificaciones de días restantes

### Planes de Suscripción
1. **Emprendedor Pro** - 0.9 UF/mes (Precios Referenciales)
   - Asistente SIGA con Inteligencia Artificial
   - 2 bodegas/sucursales
   - 3 usuarios
   - Reportes avanzados

2. **Crecimiento** - 1.9 UF/mes (Precios Referenciales)
   - Asistente SIGA con Inteligencia Artificial
   - Bodegas ilimitadas
   - Usuarios ilimitados
   - Integraciones contables
   - Soporte prioritario 24/7

### Panel de Administración
- Dashboard con métricas del portal
- Gestión CRUD de usuarios
- Gestión CRUD de planes
- Visualización de suscripciones activas
- Reset de contraseñas

### Integración con Indicadores Económicos
- API de **mindicador.cl** para obtener UF y USD
- Conversión automática de precios UF a CLP
- Formato chileno de precios
- Cache de 5 minutos para optimizar peticiones

### Sistema de Facturas
- **Generación automática** de facturas después de cada compra
- **Números únicos** de factura (formato: FAC-YYYYMMDD-XXXX)
- **Facturas imprimibles** con diseño profesional optimizado para papel
- **Persistencia** en backend con fallback a localStorage
- **Historial completo** de compras accesible desde el perfil
- **Búsqueda** de facturas por número, ID o usuario
- **Integración completa** con API del backend
- Información completa: emisor, cliente, detalles de compra, método de pago

### Seguridad y Validación
- **Validación de autenticación** obligatoria antes de permitir compras
- **Protección de rutas** de checkout y carrito
- **Redirección inteligente** después del login
- **Validación de datos** en formularios de pago

## Tecnologías Utilizadas

- **React 18.3** - Framework principal
- **React Router DOM 6.26** - Navegación
- **Bootstrap 5.3** - Estilos y componentes UI
- **Phosphor React 1.4** - Librería de iconos moderna
- **Recharts** - Librería de gráficos para visualización de datos
- **Google Generative AI (@google/generative-ai)** - SDK para integración con Gemini AI
- **Vite 5.4** - Herramienta de build y desarrollo
- **Jasmine & Karma** - Testing unitario
- **Babel & Webpack** - Procesamiento de JSX para tests
- **pnpm 10.24.0** - Gestor de paquetes (recomendado por seguridad)
- **Backend REST API** - Integración con API real (Spring Boot)
- **localStorage** - Persistencia de datos (fallback)
- **OpenAPI/Swagger** - Documentación de API (referencia)

## Instalación

### Requisitos Previos
- Node.js 16+ instalado
- pnpm instalado (recomendado para mayor seguridad)
- Git (opcional)

### Instalar pnpm

Si no tienes pnpm instalado:
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

**Importante:** Después de instalar, cierra y abre una nueva terminal, o ejecuta:
```bash
source ~/.zshrc
```

Si pnpm no funciona después de instalar, ejecuta en tu terminal:
```bash
export PNPM_HOME="$HOME/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
```

### Pasos de Instalación

1. **Clonar el repositorio**:
```bash
git clone https://github.com/HecAguilaV/SIGA-WEBCOMERCIAL.git
cd SIGA-WEBCOMERCIAL
```

2. **Instalar dependencias**:
```bash
pnpm install
```

3. **Configurar variables de entorno** (opcional, para usar asistente con IA):
   - Crea un archivo `.env` en la raíz del proyecto
   - ~~`VITE_GEMINI_API_KEY`~~ **NO REQUERIDO** - El asistente IA usa el endpoint del backend que ya tiene configurada la API key
   - Ver sección [Configuración](#configuración) para más detalles

4. **Iniciar servidor de desarrollo**:
```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Uso

### Desarrollo

```bash
# Servidor de desarrollo
pnpm run dev

# Build para producción
pnpm run build

# Preview de producción
pnpm run preview
```

### Testing

```bash
# Ejecutar pruebas unitarias
pnpm test
```

### Usuarios por Defecto

El sistema incluye usuarios de prueba:

### Usuarios por Defecto

**Administrador:**
- Email: `admin@test.cl`
- Contraseña: `test123`

**Operador / Cliente:**
- Email: `oper@test.cl`
- Contraseña: `test123`

## Estructura del Proyecto

```
SIGA_WEB_COMERCIAL/
├── static/                 # Archivos estáticos (logo, favicon, video, etc.)
│   ├── brand/             # Logos y marca SIGA
│   ├── favicon/           # Iconos y manifest
│   └── demo-sigaapp.mp4   # Video demostrativo de la aplicación
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Boton.jsx
│   │   ├── CardPlan.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── AsistenteIA.jsx  # Asistente con IA y chatbot
│   │   ├── GraficoTorta.jsx # Componente de gráficos de torta
│   │   └── FacturaComponent.jsx  # Componente de factura imprimible
│   ├── pages/            # Páginas de la aplicación
│   │   ├── HomePage.jsx  # Landing page con video HTML5
│   │   ├── PlanesPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegistroPage.jsx
│   │   ├── CarritoPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── CompraExitosaPage.jsx
│   │   ├── PerfilPage.jsx
│   │   ├── AppPage.jsx
│   │   └── admin/        # Páginas administrativas
│   ├── datos/            # Datos simulados y CRUD
│   │   └── datosSimulados.js  # Incluye datos de mermas para gráficos
│   ├── utils/            # Utilidades
│   │   ├── auth.js
│   │   ├── indicadoresEconomicos.js
│   │   └── contextoSIGA.js  # Contexto completo para el asistente con IA
│   ├── styles/           # Estilos globales
│   │   └── index.css
│   ├── router.jsx        # Configuración de rutas
│   ├── App.jsx          # Componente raíz
│   └── main.jsx         # Punto de entrada
├── tests/               # Pruebas unitarias
│   ├── boton.spec.jsx
│   ├── login.spec.jsx
│   ├── eliminarUsuario.spec.js
│   └── facturas.spec.js         # Tests de sistema de facturas
├── docs/                # Documentación técnica
│   ├── ESTADO_TESTS.md           # Estado y plan de tests
│   ├── api/
│   │   ├── openapi.yaml          # Documentación Swagger/OpenAPI
│   │   └── README.md             # Guía de documentación API
│   └── ...
├── karma.conf.cjs       # Configuración de Karma (renombrado para ES modules)
├── vite.config.js      # Configuración de Vite
├── package.json
├── README.md
├── GUIA_DE_ESTUDIO.md          # Guía técnica completa del proyecto
├── COMENTARIOS_GUIA.md         # Guía para agregar comentarios educativos
├── RESUMEN_IMPLEMENTACION.md   # Detalles de implementación
└── GUIA_GIT_RAMAS.md            # Guía para trabajar con Git y ramas
```

## Funcionalidades Clave

### Sistema de Autenticación
- Autenticación real via JWT (Backend Spring Boot)
- Roles: `admin` (Administrador) y `operador` (Cliente)
- Sesiones persistentes
- **Validación obligatoria** antes de permitir compras
- **Redirección inteligente** después del login
- Protección de rutas sensibles (checkout, carrito)

### Gestión de Suscripciones
- Asignación de planes a usuarios
- Free trial de 14 días
- Conversión de trial a suscripción pagada
- Revocación automática de trials expirados

### Pasarela de Pago
- Diseño profesional tipo pasarela real
- Validación de tarjetas de crédito
- Formato automático de números de tarjeta
- Detección de tipo de tarjeta (Visa/Mastercard)
- Simulación de procesamiento

### Indicadores Económicos
- Integración con API pública de mindicador.cl
- Obtiene valores actuales de UF y USD
- Conversión automática a CLP
- Formato chileno de moneda

### Sistema de Facturas
- Generación automática con números únicos (FAC-YYYYMMDD-XXXX)
- Facturas imprimibles con diseño profesional
- Información completa: emisor, cliente, detalles, método de pago
- Persistencia en localStorage para historial completo
- Búsqueda por número, ID o usuario
- Visualización inmediata después de compra
- Historial accesible desde el perfil del usuario

### Asistente con IA
- Chatbot inteligente con **Google Gemini AI** (modelo gemini-2.5-flash)
- Respuestas contextuales basadas en información completa de SIGA
- Contexto incluye: información de la empresa, planes, contacto, ubicación, servicios
- Visualización de gráficos de mermas por categoría
- Integración con datos simulados del negocio
- Interfaz flotante con botón de acceso rápido (logo SIGA)
- Soporte para múltiples tipos de mensajes (texto y gráficos)
- Fallback a respuestas simuladas si no hay API key configurada
- Diseño responsive y accesible

### Video en Landing Page
- Video HTML5 nativo sin librerías adicionales
- Reproducción automática en bucle
- Optimizado para web (MP4 con codec H.264)
- Ubicación: `/static/demo-sigaapp.mp4`
- Atributos: autoplay, loop, muted, playsInline

## Identidad Visual

La aplicación utiliza la paleta de colores oficial de SIGA:

- **Primario:** `#03045E` (Azul oscuro)
- **Acento:** `#00B4D8` (Azul claro)
- **Acento Secundario:** `#80FFDB` (Turquesa)
- **Blanco:** `#FFFFFF`

## Testing

El proyecto incluye pruebas unitarias con Jasmine y Karma:

- Pruebas de componentes (`Boton`, `LoginPage`)
- Pruebas de funciones CRUD (`eliminarUsuario`, `facturas`)
- Configuración de coverage
- Babel configurado para procesar JSX en tests

**Tests implementados:**
- Componente Boton
- LoginPage (validación de email, login exitoso)
- Eliminar usuario
- Sistema de facturas (crear, obtener, buscar)

**Cobertura actual:** ~15% (objetivo: 60-70%)

Para ejecutar las pruebas:
```bash
npm test
```

Ver documentación completa de tests en [`docs/ESTADO_TESTS.md`](./docs/ESTADO_TESTS.md)

## Rutas Disponibles

### Públicas
- `/` - Página de inicio
- `/planes` - Catálogo de planes
- `/acerca` - Acerca de SIGA
- `/docs` - Documentación API (Swagger UI)
- `/login` - Iniciar sesión
- `/registro` - Registro de usuario
- `/carrito` - Carrito de compras
- `/checkout` - Pasarela de pago
- `/exito` - Confirmación de compra

### Protegidas (requieren autenticación)
- `/perfil` - Perfil del usuario
- `/app` - Aplicación SIGA (iframe)

### Administrador (requieren rol admin)
- `/admin` - Dashboard administrativo
- `/admin/usuarios` - Gestión de usuarios
- `/admin/planes` - Gestión de planes
- `/admin/suscripciones` - Suscripciones activas

## Configuración

### Variables de Entorno

El proyecto requiere variables de entorno para funcionalidades avanzadas:

#### Para Desarrollo Local

1. Crea un archivo `.env` en la raíz del proyecto
2. Agrega las siguientes variables:

```env
# VITE_GEMINI_API_KEY - NO REQUERIDO
# El asistente IA usa el endpoint del backend (/api/comercial/chat)
# La API key de Gemini está configurada en el backend (Railway)
```

**Obtener API Key de Gemini:**
- Ve a https://makersuite.google.com/app/apikey
- Crea una nueva API key
- Copia la key y pégala en tu archivo `.env`

**Nota:** El archivo `.env` está en `.gitignore` y no se subirá al repositorio.

#### Para Despliegue en Vercel

**Variables de Entorno Requeridas:**

1. Ve a tu proyecto en **Vercel Dashboard**
2. Abre **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

   **Variable 1: URL del Backend (CRÍTICA)**
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://siga-backend-production.up.railway.app`
   - **Environment:** Selecciona todas (Production, Preview, Development)

4. **Guarda** las variables
5. **Vuelve a desplegar** el proyecto para que las variables surtan efecto

**Importante:**
- El prefijo `VITE_` es necesario para que Vite exponga la variable al cliente
- Sin `VITE_API_BASE_URL`, el frontend intentará conectarse a `localhost:8080` y fallará
- **NOTA:** El asistente IA usa el endpoint del backend (`/api/comercial/chat`), NO requiere `VITE_GEMINI_API_KEY` en Vercel. La API key de Gemini está configurada en el backend (Railway).
- Nunca compartas tus API keys públicamente
- **Después de agregar/modificar variables de entorno, SIEMPRE debes redesplegar**

### Puerto del Servidor
El servidor de desarrollo está configurado para usar el puerto `5173` de forma fija. Puedes cambiarlo en `vite.config.js`:

```javascript
server: {
  port: 5173,
  host: true,
  strictPort: true,
}
```

### Archivos Estáticos
Los archivos estáticos se sirven desde la carpeta `static/` y son accesibles desde la raíz (`/brand/Logo_SIGA.png`, `/demo-sigaapp.mp4`).

**Video en Landing Page:**
- El video se carga usando el elemento HTML5 `<video>` nativo del navegador
- No requiere librerías adicionales
- Formato recomendado: MP4 con codec H.264
- Ubicación: `/static/demo-sigaapp.mp4`
- Atributos: `autoPlay`, `loop`, `muted`, `playsInline`

## Documentación Técnica

Todos los documentos técnicos están ubicados en la carpeta `docs/`:

1. **ERS (Especificación de Requisitos de Software)**
   - Ubicación: `docs/ERS.md`
   - Descripción completa del sistema, requisitos funcionales y no funcionales

2. **Manual de Usuario**
   - Ubicación: `docs/MANUAL_USUARIO.md`
   - Guía completa paso a paso para usuarios finales

3. **Documento de Cobertura de Testing**
   - Ubicación: `docs/COBERTURA_TESTING.md`
   - Estado actual de tests, métricas de cobertura y plan de mejora
   - Reporte HTML disponible en `coverage/html/index.html` después de ejecutar tests

4. **Documentación de APIs**
   - Especificación OpenAPI: `docs/api/openapi.yaml`
   - Swagger UI accesible en `/docs` de la aplicación
   - Documentación adicional: `docs/api/README.md`

5. **Documento APIs e Integración**
   - Ubicación: `docs/APIS_INTEGRACION.md`
   - Arquitectura de integración, endpoints, autenticación JWT

---

## Datos y Persistencia

### Backend API (Principal)
El sistema está integrado con un backend REST API que maneja:
- **Autenticación:** Registro, login, refresh tokens
- **Planes:** Listado y detalles de planes
- **Suscripciones:** Creación y gestión de suscripciones
- **Facturas:** Creación, listado y búsqueda de facturas
- **Chat:** Asistente IA comercial

### Fallback a localStorage
Si el backend no está disponible, el sistema usa datos locales en `localStorage`:
- **Planes:** `siga_planes`
- **Usuarios:** `siga_usuarios`
- **Suscripciones:** `siga_suscripciones`
- **Facturas:** `siga_facturas`
- **Usuario autenticado:** `siga_usuario_actual`
- **Carrito:** `siga_carrito_plan`
- **Redirección:** `siga_redirect_after_login`
- **Factura actual:** `siga_factura_actual`

Para limpiar los datos de prueba (solo localStorage), ejecuta en la consola del navegador:
```javascript
localStorage.clear()
```

## Documentación y Testing

### Documentación Swagger/OpenAPI

Visualiza la documentación completa de la API de forma interactiva directamente en la aplicación:

**📖 Documentación en la aplicación:**
 [http://localhost:5173/docs](http://localhost:5173/docs) (desarrollo local)
 `https://tu-dominio.com/docs` (producción)

**📖 Swagger Editor (Online) - Alternativa:**
 [Ver Documentación Swagger](https://editor.swagger.io/?url=https://raw.githubusercontent.com/HecAguilaV/SIGA-WEBCOMERCIAL/main/docs/api/openapi.yaml)

O copia y pega esta URL:
```
https://editor.swagger.io/?url=https://raw.githubusercontent.com/HecAguilaV/SIGA-WEBCOMERCIAL/main/docs/api/openapi.yaml
```

**31 endpoints documentados** incluyendo:
- Gestión de usuarios (7 endpoints)
- Gestión de planes (6 endpoints)
- Gestión de suscripciones (5 endpoints)
- Sistema de facturas (5 endpoints)
- Autenticación (3 endpoints)
- Carrito (3 endpoints)
- Indicadores económicos (3 endpoints)

### Interfaz de Testing (Jasmine/Karma)

Para ver la interfaz gráfica de los tests:

1. **Modifica `karma.conf.cjs`** cambiando `ChromeHeadless` por `Chrome`:
```javascript
browsers: ['Chrome'], // En lugar de ['ChromeHeadless']
singleRun: false,     // Para que no se cierre automáticamente
```

2. **Ejecuta los tests:**
```bash
pnpm test
```

3. **Reporte HTML de Coverage:**
Después de ejecutar los tests, abre el reporte HTML generado:
```
coverage/html/index.html
```

La interfaz de Karma se abrirá en tu navegador mostrando todos los tests con sus resultados en tiempo real.

## Características Futuras

- [ ] Integración con pasarela de pago real
- [ ] Notificaciones por email
- [ ] Dashboard con gráficos avanzados
- [ ] Exportación de reportes
- [ ] API REST para backend real
- [ ] Generación de PDF de facturas
- [ ] Envío de facturas por email
- [ ] Filtros y búsqueda avanzada en historial de compras
- [x] Integración con Google Gemini AI para el asistente
- [ ] Más tipos de gráficos en el asistente (barras, líneas, etc.)
- [ ] Chat con historial persistente en el asistente

## Licencia

Este proyecto es la base de SIGA.

---

## Autor

> **Héctor Aguila**  
>> Un Soñador con Poca RAM
