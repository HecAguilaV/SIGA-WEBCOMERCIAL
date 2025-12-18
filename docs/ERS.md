# Especificación de Requisitos de Software (ERS)
## SIGA Portal Comercial

**Fecha:** Diciembre 2025  
**Autor:** Héctor Aguila

---

## 1. Introducción

### 1.1 Propósito del Documento
Este documento especifica los requisitos funcionales y no funcionales del sistema SIGA Portal Comercial, una aplicación web para la gestión de suscripciones y portal comercial del software SIGA (Sistema Inteligente de Gestión de Activos).

### 1.2 Alcance del Proyecto
SIGA Portal Comercial es una aplicación web desarrollada con React que permite a los usuarios explorar planes de suscripción, realizar compras, gestionar sus cuentas y acceder a la aplicación principal SIGA. El sistema integra con un backend REST para operaciones de autenticación, gestión de planes y suscripciones.

### 1.3 Definiciones y Acrónimos
- **SIGA**: Sistema Inteligente de Gestión de Activos
- **UF**: Unidad de Fomento (indicador económico chileno)
- **CLP**: Peso Chileno
- **JWT**: JSON Web Token
- **REST**: Representational State Transfer
- **CRUD**: Create, Read, Update, Delete
- **SaaS**: Software as a Service

### 1.4 Referencias
- API Backend: https://siga-backend-production.up.railway.app
- Documentación API: docs/api/openapi.yaml
- Repositorio: https://github.com/HecAguilaV/SIGA-WEBCOMERCIAL

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
SIGA Portal Comercial es un sistema independiente que funciona como punto de entrada comercial para el software SIGA. Se comunica con un backend REST para operaciones de negocio y utiliza localStorage para persistencia local de datos de sesión.

### 2.2 Funciones del Producto
- Gestión de autenticación de usuarios (login, registro, sesión)
- Catálogo y visualización de planes de suscripción
- Proceso de compra y suscripción a planes
- Generación y gestión de facturas
- Panel de administración para gestión de usuarios y planes
- Sistema de free trial para planes premium
- Asistente con inteligencia artificial para consultas
- Integración con indicadores económicos (UF, USD)

### 2.3 Características del Usuario
- **Clientes**: Usuarios que pueden suscribirse a planes y gestionar su cuenta
- **Administradores**: Usuarios con permisos para gestionar usuarios, planes y suscripciones

### 2.4 Restricciones
- Requiere conexión a internet para operaciones con el backend
- Compatible con navegadores modernos (Chrome, Firefox, Safari, Edge)
- Requiere JavaScript habilitado
- Backend debe estar disponible para operaciones de autenticación y suscripciones

---

## 3. Requisitos Funcionales

### 3.1 Autenticación y Autorización

#### RF-001: Registro de Usuario
**Descripción:** El sistema debe permitir a nuevos usuarios registrarse en el portal.

**Prioridad:** Alta

**Entradas:**
- Nombre completo
- Email (único)
- Contraseña (mínimo 6 caracteres)

**Salidas:**
- Usuario creado exitosamente
- Token de autenticación JWT
- Redirección al perfil del usuario

**Validaciones:**
- Email debe tener formato válido
- Email no debe estar registrado previamente
- Contraseña debe tener mínimo 6 caracteres
- Todos los campos son obligatorios

#### RF-002: Inicio de Sesión
**Descripción:** El sistema debe permitir a usuarios registrados iniciar sesión.

**Prioridad:** Alta

**Entradas:**
- Email
- Contraseña

**Salidas:**
- Token de acceso JWT
- Token de refresh JWT
- Información del usuario autenticado
- Redirección según rol (cliente: /perfil, admin: /admin)

**Validaciones:**
- Email y contraseña deben coincidir con registros existentes
- Credenciales inválidas deben mostrar mensaje de error

#### RF-003: Gestión de Sesión
**Descripción:** El sistema debe mantener la sesión del usuario activa y segura.

**Prioridad:** Alta

**Funcionalidades:**
- Persistencia de sesión en localStorage
- Renovación automática de tokens expirados
- Cierre de sesión seguro
- Protección de rutas según autenticación

### 3.2 Gestión de Planes

#### RF-004: Visualización de Planes
**Descripción:** El sistema debe mostrar todos los planes de suscripción disponibles.

**Prioridad:** Alta

**Funcionalidades:**
- Listado de planes con precios en UF
- Conversión automática a CLP usando API de indicadores económicos
- Visualización de características de cada plan
- Diseño responsive

#### RF-005: Detalles de Plan
**Descripción:** El sistema debe mostrar información detallada de cada plan.

**Prioridad:** Media

**Información mostrada:**
- Nombre del plan
- Precio mensual en UF y CLP
- Características incluidas
- Límites (bodegas, usuarios, productos)

### 3.3 Proceso de Compra

#### RF-006: Carrito de Compras
**Descripción:** El sistema debe permitir agregar planes al carrito.

**Prioridad:** Alta

**Funcionalidades:**
- Agregar plan al carrito
- Persistencia del carrito en localStorage
- Validación de autenticación antes de proceder al pago
- Vaciar carrito

#### RF-007: Proceso de Pago
**Descripción:** El sistema debe procesar el pago de suscripciones.

**Prioridad:** Alta

**Entradas:**
- Información de tarjeta de crédito (simulada)
- Nombre del titular
- Fecha de vencimiento
- CVV

**Validaciones:**
- Número de tarjeta válido (13-19 dígitos)
- Fecha de vencimiento válida
- CVV válido (3-4 dígitos)
- Usuario debe estar autenticado

**Salidas:**
- Suscripción creada en el backend
- Factura generada automáticamente
- Redirección a página de éxito

#### RF-008: Generación de Facturas
**Descripción:** El sistema debe generar facturas automáticamente después de cada compra.

**Prioridad:** Alta

**Funcionalidades:**
- Generación de número único de factura (FAC-YYYYMMDD-XXXX)
- Información completa: emisor, cliente, detalles, método de pago
- Facturas imprimibles
- Persistencia en localStorage
- Historial accesible desde perfil

### 3.4 Gestión de Perfil

#### RF-009: Perfil de Usuario
**Descripción:** El sistema debe mostrar y permitir gestionar el perfil del usuario.

**Prioridad:** Alta

**Funcionalidades:**
- Información del plan actual
- Historial de compras y facturas
- Visualización de facturas individuales
- Opción de iniciar free trial (si aplica)
- Conversión de trial a suscripción pagada

#### RF-010: Free Trial
**Descripción:** El sistema debe permitir iniciar un trial gratuito de 14 días.

**Prioridad:** Media

**Reglas de negocio:**
- Solo usuarios con plan Kiosco pueden iniciar trial
- Un solo trial por usuario
- Trial de 14 días para planes Pro y Crecimiento
- Conversión automática a suscripción pagada al finalizar

### 3.5 Panel de Administración

#### RF-011: Gestión de Usuarios
**Descripción:** El sistema debe permitir a administradores gestionar usuarios.

**Prioridad:** Alta

**Funcionalidades:**
- Listar todos los usuarios
- Crear nuevos usuarios
- Actualizar información de usuarios
- Eliminar usuarios
- Resetear contraseñas

#### RF-012: Gestión de Planes
**Descripción:** El sistema debe permitir a administradores gestionar planes.

**Prioridad:** Alta

**Funcionalidades:**
- Listar todos los planes
- Crear nuevos planes
- Actualizar planes existentes
- Eliminar planes

#### RF-013: Visualización de Suscripciones
**Descripción:** El sistema debe mostrar todas las suscripciones activas.

**Prioridad:** Media

**Información mostrada:**
- Usuario suscrito
- Plan asignado
- Fecha de inicio
- Fecha de vencimiento
- Estado de la suscripción

### 3.6 Asistente con IA

#### RF-014: Chat con Asistente
**Descripción:** El sistema debe proporcionar un asistente con IA para consultas.

**Prioridad:** Baja

**Funcionalidades:**
- Chat interactivo con Google Gemini AI
- Respuestas contextuales sobre SIGA
- Visualización de gráficos de mermas
- Fallback a respuestas simuladas si no hay API key

---

## 4. Requisitos No Funcionales

### 4.1 Rendimiento
- Tiempo de carga inicial: < 3 segundos
- Tiempo de respuesta de API: < 2 segundos
- Cache de indicadores económicos: 5 minutos

### 4.2 Seguridad
- Autenticación mediante JWT
- Tokens almacenados de forma segura
- Validación de entrada en todos los formularios
- Protección de rutas según roles
- HTTPS en producción

### 4.3 Usabilidad
- Interfaz responsive (móvil, tablet, desktop)
- Mensajes de error claros y específicos
- Navegación intuitiva
- Diseño consistente con identidad visual SIGA

### 4.4 Compatibilidad
- Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- Dispositivos: Desktop, Tablet, Móvil
- Sistema operativo: Windows, macOS, Linux, iOS, Android

### 4.5 Mantenibilidad
- Código modular y bien estructurado
- Documentación de código
- Tests unitarios con cobertura mínima del 60%
- Uso de estándares de desarrollo

### 4.6 Escalabilidad
- Arquitectura preparada para crecimiento
- Separación de frontend y backend
- Uso de servicios REST para comunicación

---

## 5. Modelo de Datos

### 5.1 Entidades Principales

#### Usuario
- id: number
- nombre: string
- email: string (único)
- password: string (hasheado)
- rol: 'admin' | 'cliente'
- planId: number | null
- enTrial: boolean

#### Plan
- id: number
- nombre: string
- precio: number
- unidad: 'UF' | 'CLP'
- esFreemium: boolean
- caracteristicas: string[]

#### Suscripción
- id: string
- usuarioId: number
- planId: number
- fechaInicio: ISO string
- fechaFin: ISO string
- estado: 'ACTIVA' | 'CANCELADA' | 'VENCIDA'
- periodo: 'MENSUAL' | 'ANUAL'

#### Factura
- id: string
- numero: string (FAC-YYYYMMDD-XXXX)
- fechaCompra: ISO string
- usuarioId: number
- planId: number
- precioUF: number
- precioCLP: number
- metodoPago: string
- estado: 'pagada' | 'cancelada'

---

## 6. Interfaz de Usuario

### 6.1 Páginas Principales
- HomePage: Página de inicio con información y video
- PlanesPage: Catálogo de planes
- LoginPage: Inicio de sesión
- RegistroPage: Registro de usuario
- CarritoPage: Carrito de compras
- CheckoutPage: Proceso de pago
- CompraExitosaPage: Confirmación de compra
- PerfilPage: Perfil y gestión de cuenta
- AppPage: Acceso a aplicación SIGA principal
- AdminLayout: Panel de administración

### 6.2 Componentes Reutilizables
- Navbar: Navegación principal
- Footer: Pie de página
- CardPlan: Tarjeta de plan
- FacturaComponent: Componente de factura
- AsistenteIA: Chatbot con IA

---

## 7. Integración con Backend

### 7.1 Endpoints Utilizados

#### Autenticación
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh

#### Planes
- GET /api/comercial/planes
- GET /api/comercial/planes/{id}

#### Suscripciones
- GET /api/comercial/suscripciones
- POST /api/comercial/suscripciones

#### Chat
- POST /api/comercial/chat

### 7.2 Manejo de Errores
- Códigos HTTP estándar (200, 201, 400, 401, 404, 500)
- Formato de error consistente: { success: boolean, message: string }
- Renovación automática de tokens expirados
- Fallback a datos locales si backend no disponible

---

## 8. Casos de Uso Principales

### CU-001: Usuario se registra y compra un plan
1. Usuario accede a /registro
2. Completa formulario de registro
3. Sistema valida datos y crea usuario
4. Usuario es redirigido a /perfil
5. Usuario navega a /planes
6. Selecciona un plan y lo agrega al carrito
7. Procede al checkout
8. Completa información de pago
9. Sistema procesa pago y genera factura
10. Usuario ve confirmación y factura

### CU-002: Administrador gestiona usuarios
1. Administrador inicia sesión
2. Accede a /admin/usuarios
3. Visualiza lista de usuarios
4. Crea/actualiza/elimina usuario según necesidad
5. Resetea contraseña si es necesario

### CU-003: Usuario inicia free trial
1. Usuario con plan Kiosco accede a /perfil
2. Ve opción de iniciar trial
3. Selecciona plan para trial (Pro o Crecimiento)
4. Sistema inicia trial de 14 días
5. Usuario puede convertir a suscripción pagada

---

## 9. Glosario

- **Backend**: Servidor que procesa operaciones de negocio y gestiona base de datos
- **Frontend**: Interfaz de usuario ejecutada en el navegador
- **JWT**: Token de autenticación estándar de la industria
- **localStorage**: Almacenamiento local del navegador
- **REST**: Arquitectura de comunicación entre servicios
- **SaaS**: Modelo de distribución de software como servicio
- **UF**: Unidad de Fomento, indicador económico chileno usado para indexar precios

---

## 10. Historial de Cambios

| Versión | Fecha | Autor | Descripción |
|---------|-------|-------|-------------|
| 1.0 | Dic 2025 | Equipo SIGA | Versión inicial del documento |



---

## Autor

> **Héctor Aguila**  
>> Un Soñador con Poca RAM
