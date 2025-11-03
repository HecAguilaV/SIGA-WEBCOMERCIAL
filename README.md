<p align="center">
  <img src="static/brand/Logo_SIGA.png" alt="Logo SIGA" width="300" />
</p>

<h1 align="center">SIGA - Portal Comercial</h1>

<p align="center">
  <strong>Sistema Inteligente de Gestión de Activos</strong><br/>
  Portal comercial y gestión de suscripciones para planes SaaS
</p>

<hr />

## Descripción

**SIGA Portal Comercial** es una aplicación web desarrollada con React que funciona como portal comercial y sistema de gestión de suscripciones para el software SIGA (Sistema Inteligente de Gestión de Activos). Este proyecto permite a los usuarios explorar planes de suscripción, realizar compras simuladas y gestionar sus cuentas.

### Objetivo

Proporcionar una plataforma comercial moderna donde los usuarios pueden:
- Explorar y comparar planes de suscripción SIGA
- Realizar compras simuladas de planes
- Gestionar sus cuentas y suscripciones
- Acceder a la aplicación SIGA después de autenticarse
- Administrar usuarios y planes (para administradores)

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
- Sistema de autenticación simulada
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
1. **Kiosco (Freemium)** - Plan gratuito permanente
   - Asistente SIGA con RAG
   - 1 bodega/sucursal
   - 1 usuario
   - Productos limitados

2. **Emprendedor Pro** - 0.9 UF/mes
   - Asistente SIGA con RAG
   - 2 bodegas/sucursales
   - 3 usuarios
   - Reportes avanzados

3. **Crecimiento** - 1.9 UF/mes
   - Asistente SIGA con RAG
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
- **Persistencia** de todas las facturas en localStorage
- **Historial completo** de compras accesible desde el perfil
- **Búsqueda** de facturas por número, ID o usuario
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
- **Vite 5.4** - Herramienta de build y desarrollo
- **Jasmine & Karma** - Testing unitario
- **Babel & Webpack** - Procesamiento de JSX para tests
- **localStorage** - Persistencia de datos
- **OpenAPI/Swagger** - Documentación de API (referencia)

## Instalación

### Requisitos Previos
- Node.js 16+ y npm instalados
- Git (opcional)

### Pasos de Instalación

1. **Clonar el repositorio** (si aplica):
```bash
git clone <url-del-repositorio>
cd SIGA_WEB_COMERCIAL
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Uso

### Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

### Testing

```bash
# Ejecutar pruebas unitarias
npm test
```

### Usuarios por Defecto

El sistema incluye usuarios de prueba:

**Administrador:**
- Email: `admin@siga.com`
- Contraseña: `admin123`

**Cliente:**
- Email: `hector@siga.com`
- Contraseña: `hector123`

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
│   │   └── indicadoresEconomicos.js
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
- Autenticación simulada con localStorage
- Roles: `admin` y `cliente`
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
- Chatbot inteligente con respuestas contextuales
- Visualización de gráficos de mermas por categoría
- Integración con datos simulados del negocio
- Interfaz flotante con botón de acceso rápido
- Soporte para múltiples tipos de mensajes (texto y gráficos)
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

## Datos Simulados

Todos los datos se almacenan en `localStorage`:
- **Planes:** `siga_planes`
- **Usuarios:** `siga_usuarios`
- **Suscripciones:** `siga_suscripciones`
- **Facturas:** `siga_facturas` (Nuevo)
- **Usuario autenticado:** `siga_usuario_actual`
- **Carrito:** `siga_carrito_plan`
- **Redirección:** `siga_redirect_after_login`
- **Factura actual:** `siga_factura_actual`

Para limpiar los datos de prueba, ejecuta en la consola del navegador:
```javascript
localStorage.clear()
```

## Documentación Adicional

- **[GUIA_DE_ESTUDIO.md](./GUIA_DE_ESTUDIO.md)** - Guía técnica completa con todas las tecnologías, arquitectura y funcionalidades
- **[COMENTARIOS_GUIA.md](./COMENTARIOS_GUIA.md)** - Guía para agregar comentarios educativos y ejemplos de código comentado
- **[RESUMEN_IMPLEMENTACION.md](./RESUMEN_IMPLEMENTACION.md)** - Detalles completos de todas las funcionalidades implementadas
- **[docs/ESTADO_TESTS.md](./docs/ESTADO_TESTS.md)** - Estado actual de tests y plan de acción
- **[docs/api/openapi.yaml](./docs/api/openapi.yaml)** - Documentación Swagger/OpenAPI de todas las funciones
- **[GUIA_GIT_RAMAS.md](./GUIA_GIT_RAMAS.md)** - Guía para trabajar con Git y ramas

### Documentación Swagger/OpenAPI

El proyecto incluye documentación OpenAPI completa que describe todas las funciones como endpoints REST. Esto facilita la migración futura a un backend real.

**Para visualizar la documentación:**
1. Ve a https://editor.swagger.io/
2. Copia el contenido de `docs/api/openapi.yaml`
3. Pégalo en el editor para ver la documentación interactiva

**31 endpoints documentados** incluyendo:
- Gestión de usuarios (7 endpoints)
- Gestión de planes (6 endpoints)
- Gestión de suscripciones (5 endpoints)
- Sistema de facturas (5 endpoints)
- Autenticación (3 endpoints)
- Carrito (3 endpoints)
- Indicadores económicos (3 endpoints)

Ver más detalles en [`docs/api/README.md`](./docs/api/README.md)

## Características Futuras

- [ ] Integración con pasarela de pago real
- [ ] Notificaciones por email
- [ ] Dashboard con gráficos avanzados
- [ ] Exportación de reportes
- [ ] API REST para backend real
- [ ] Generación de PDF de facturas
- [ ] Envío de facturas por email
- [ ] Filtros y búsqueda avanzada en historial de compras
- [ ] Integración con backend de IA real para el asistente
- [ ] Más tipos de gráficos en el asistente (barras, líneas, etc.)

## Licencia

Este proyecto es la base de SIGA.

## Autor

Héctor Aguila.
Un Soñador con Poca RAM.

---

<p align="center">
  <strong>© Para que no te detengas</strong>
</p>
