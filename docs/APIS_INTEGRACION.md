# Documento de APIs e Integración
## SIGA Portal Comercial

**Versión:** 1.0  
**Fecha:** Diciembre 2025

---

## Resumen Ejecutivo

Este documento describe la arquitectura de integración entre el frontend de SIGA Portal Comercial y el backend REST, incluyendo los endpoints utilizados, manejo de autenticación, estrategias de comunicación y patrones de implementación.

---

## Arquitectura de Integración

### Componentes

1. **Frontend (React)**
   - Aplicación cliente ejecutándose en el navegador
   - Servicios de API para comunicación con backend
   - Manejo de estado local y persistencia

2. **Backend (REST API)**
   - Servidor en Railway
   - Base de datos para persistencia
   - Autenticación JWT
   - Endpoints RESTful

3. **Comunicación**
   - Protocolo HTTP/HTTPS
   - Formato JSON para datos
   - Autenticación mediante tokens JWT

---

## Configuración del Backend

### URLs del Backend

**Producción:**
```
https://siga-backend-production.up.railway.app
```

**Desarrollo:**
```
http://localhost:8080
```

### Configuración en Frontend

La URL del backend se configura mediante variable de entorno:

```env
VITE_API_BASE_URL=https://siga-backend-production.up.railway.app
```

En el código, se accede mediante:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_URL = `${API_BASE_URL}/api`;
```

---

## Servicios de API

### Estructura del Servicio API

El servicio principal se encuentra en `src/services/api.js` y proporciona:

1. **Manejo centralizado de peticiones HTTP**
2. **Gestión automática de tokens JWT**
3. **Renovación automática de tokens expirados**
4. **Manejo consistente de errores**
5. **Fallback a datos locales si backend no disponible**

### Funciones Principales

#### apiRequest(endpoint, options)
Función base que realiza todas las peticiones HTTP con:
- Agregado automático de headers de autenticación
- Manejo de errores 401 (token expirado)
- Renovación automática de tokens
- Reintento de petición después de renovar token

#### refreshAccessToken()
Renueva el token de acceso usando el refresh token almacenado.

#### Funciones Específicas por Endpoint
- registerUser(userData)
- loginUser(email, password)
- getPlanes()
- getPlanById(planId)
- chatComercial(message)
- getSuscripciones()
- createSuscripcion(planId, periodo)
- createFactura(facturaData)
- getFacturas()
- getFacturaById(facturaId)
- getFacturaByNumero(numeroFactura)

---

## Endpoints Implementados

### Autenticación

#### POST /api/auth/register
Registra un nuevo usuario en el sistema.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rut": "12345678-9",
  "telefono": "+56912345678"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "usuario@example.com"
}
```

#### POST /api/auth/login
Inicia sesión y obtiene tokens de autenticación.

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "usuario@example.com"
}
```

#### POST /api/auth/refresh
Renueva el token de acceso.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Planes

#### GET /api/comercial/planes
Obtiene todos los planes disponibles (público, no requiere autenticación).

**Response (200):**
```json
{
  "success": true,
  "planes": [
    {
      "id": 1,
      "nombre": "Emprendedor",
      "descripcion": "Plan ideal para emprendedores",
      "precioMensual": "0.50",
      "precioAnual": "5.00",
      "limiteBodegas": 1,
      "limiteUsuarios": 1,
      "limiteProductos": 100,
      "activo": true
    }
  ],
  "total": 3
}
```

#### GET /api/comercial/planes/{id}
Obtiene un plan específico por ID.

### Suscripciones

#### GET /api/comercial/suscripciones
Lista las suscripciones del usuario autenticado.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "suscripciones": [
    {
      "id": 1,
      "usuarioId": 1,
      "planId": 2,
      "fechaInicio": "2024-01-01",
      "fechaFin": "2024-02-01",
      "estado": "ACTIVA",
      "periodo": "MENSUAL"
    }
  ],
  "total": 1
}
```

#### POST /api/comercial/suscripciones
Crea una nueva suscripción.

**Request:**
```json
{
  "planId": 2,
  "periodo": "MENSUAL"
}
```

**Response (201):**
```json
{
  "success": true,
  "suscripcion": {
    "id": 1,
    "usuarioId": 1,
    "planId": 2,
    "fechaInicio": "2024-01-15",
    "fechaFin": "2024-02-15",
    "estado": "ACTIVA",
    "periodo": "MENSUAL"
  }
}
```

### Chat Comercial

#### POST /api/comercial/chat
Chat con el asistente comercial (público, no requiere autenticación).

**Request:**
```json
{
  "message": "¿Qué incluye el plan Emprendedor Pro?"
}
```

**Response (200):**
```json
{
  "response": "El plan Emprendedor Pro incluye...",
  "success": true
}
```

### Facturas

#### POST /api/comercial/facturas
Crea una nueva factura después de una compra exitosa.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "usuarioId": 1,
  "usuarioNombre": "Juan Pérez",
  "usuarioEmail": "juan@example.com",
  "planId": 2,
  "planNombre": "Emprendedor Pro",
  "precioUF": 0.9,
  "precioCLP": 34140.81,
  "unidad": "UF",
  "fechaVencimiento": "2025-01-15T00:00:00.000Z",
  "metodoPago": "Tarjeta de crédito",
  "ultimos4Digitos": "4242"
}
```

**Response (201):**
```json
{
  "success": true,
  "factura": {
    "id": 1,
    "numeroFactura": "FAC-20241205-0001",
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "usuarioEmail": "juan@example.com",
    "planId": 2,
    "planNombre": "Emprendedor Pro",
    "precioUF": 0.9,
    "precioCLP": 34140.81,
    "unidad": "UF",
    "fechaCompra": "2024-12-05T15:30:00.000Z",
    "fechaVencimiento": "2025-01-15T00:00:00.000Z",
    "estado": "pagada",
    "metodoPago": "Tarjeta de crédito",
    "ultimos4Digitos": "4242"
  }
}
```

#### GET /api/comercial/facturas
Obtiene todas las facturas del usuario autenticado.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "facturas": [
    {
      "id": 1,
      "numeroFactura": "FAC-20241205-0001",
      "usuarioId": 1,
      "planId": 2,
      "planNombre": "Emprendedor Pro",
      "precioUF": 0.9,
      "precioCLP": 34140.81,
      "fechaCompra": "2024-12-05T15:30:00.000Z",
      "estado": "pagada"
    }
  ],
  "total": 1
}
```

#### GET /api/comercial/facturas/{id}
Obtiene una factura específica por ID.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "factura": {
    "id": 1,
    "numeroFactura": "FAC-20241205-0001",
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "usuarioEmail": "juan@example.com",
    "planId": 2,
    "planNombre": "Emprendedor Pro",
    "precioUF": 0.9,
    "precioCLP": 34140.81,
    "unidad": "UF",
    "fechaCompra": "2024-12-05T15:30:00.000Z",
    "fechaVencimiento": "2025-01-15T00:00:00.000Z",
    "estado": "pagada",
    "metodoPago": "Tarjeta de crédito",
    "ultimos4Digitos": "4242"
  }
}
```

#### GET /api/comercial/facturas/numero/{numeroFactura}
Obtiene una factura por su número único (ej: FAC-20241205-0001).

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "success": true,
  "factura": {
    "id": 1,
    "numeroFactura": "FAC-20241205-0001",
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "usuarioEmail": "juan@example.com",
    "planId": 2,
    "planNombre": "Emprendedor Pro",
    "precioUF": 0.9,
    "precioCLP": 34140.81,
    "unidad": "UF",
    "fechaCompra": "2024-12-05T15:30:00.000Z",
    "fechaVencimiento": "2025-01-15T00:00:00.000Z",
    "estado": "pagada",
    "metodoPago": "Tarjeta de crédito",
    "ultimos4Digitos": "4242"
  }
}
```

---

## Autenticación JWT

### Flujo de Autenticación

1. **Registro/Login:**
   - Usuario se registra o inicia sesión
   - Backend valida credenciales
   - Backend genera accessToken y refreshToken
   - Frontend almacena tokens en localStorage

2. **Uso de Tokens:**
   - Cada petición protegida incluye header: `Authorization: Bearer {accessToken}`
   - Backend valida el token
   - Si válido, procesa la petición
   - Si inválido/expirado, retorna 401

3. **Renovación de Tokens:**
   - Frontend detecta error 401
   - Automáticamente llama a `/api/auth/refresh` con refreshToken
   - Obtiene nuevo accessToken
   - Reintenta la petición original con nuevo token

4. **Cierre de Sesión:**
   - Frontend elimina tokens de localStorage
   - Usuario debe volver a autenticarse

### Almacenamiento de Tokens

Los tokens se almacenan en localStorage:
- `accessToken`: Token de acceso (corto plazo)
- `refreshToken`: Token de renovación (largo plazo)

### Seguridad

- Tokens se envían solo por HTTPS en producción
- Tokens se validan en cada petición
- Refresh tokens permiten renovación sin re-autenticación
- Tokens expirados se renuevan automáticamente

---

## Manejo de Errores

### Códigos HTTP Utilizados

- **200 OK:** Petición exitosa
- **201 Created:** Recurso creado exitosamente
- **400 Bad Request:** Datos inválidos en la petición
- **401 Unauthorized:** No autenticado o token inválido/expirado
- **404 Not Found:** Recurso no encontrado
- **500 Internal Server Error:** Error del servidor

### Formato de Error

Todas las respuestas de error siguen el formato:

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

### Manejo en Frontend

El servicio API maneja errores de forma centralizada:

1. **401 Unauthorized:**
   - Intenta renovar token automáticamente
   - Si renovación falla, redirige a login
   - Limpia tokens almacenados

2. **Otros Errores:**
   - Muestra mensaje de error al usuario
   - Registra error en consola para debugging
   - Permite reintento manual si aplica

---

## Estrategia de Fallback

### Fallback a Datos Locales

El sistema implementa fallback a datos locales (localStorage) cuando:

1. **Backend no disponible:**
   - Error de conexión
   - Timeout de petición
   - Backend retorna error 500

2. **Implementación:**
   - Servicio de autenticación (`src/services/auth.js`) intenta backend primero
   - Si falla, usa funciones locales de `datosSimulados.js`
   - Usuario puede seguir usando la aplicación con funcionalidad limitada

3. **Limitaciones del Fallback:**
   - Datos no se sincronizan entre dispositivos
   - No hay persistencia en servidor
   - Funcionalidad reducida

---

## Integración con Servicios Externos

### Indicadores Económicos

**API:** mindicador.cl

**Endpoint utilizado:**
```
GET https://mindicador.cl/api
```

**Datos obtenidos:**
- Valor de UF (Unidad de Fomento)
- Valor de USD (Dólar)

**Uso:**
- Conversión de precios UF a CLP
- Cache de 5 minutos para optimizar peticiones
- Fallback a valores por defecto si API no disponible

**Implementación:** `src/utils/indicadoresEconomicos.js`

### Google Gemini AI

**API:** Google Generative AI

**Uso:**
- Asistente con IA para consultas
- Requiere API key configurada en variables de entorno
- Fallback a respuestas simuladas si no hay API key

**Implementación:** `src/components/AsistenteIA.jsx`

---

## Patrones de Implementación

### Servicio Centralizado

Todas las llamadas al backend pasan por `src/services/api.js`:

**Ventajas:**
- Código reutilizable
- Manejo consistente de errores
- Fácil mantenimiento
- Centralización de lógica de autenticación

### Separación de Responsabilidades

- **api.js:** Comunicación HTTP pura
- **auth.js:** Lógica de autenticación y fallback
- **Componentes:** Solo llaman a servicios, no manejan HTTP directamente

### Manejo de Estado

- **Tokens:** localStorage (persistencia entre sesiones)
- **Usuario actual:** localStorage (sincronizado con backend)
- **Carrito:** localStorage (temporal, se limpia después de compra)
- **Facturas:** Backend API con fallback a localStorage

---

## Flujos de Integración

### Flujo de Registro y Compra

1. Usuario se registra: `POST /api/auth/register`
2. Sistema guarda tokens y redirige a perfil
3. Usuario navega a planes: `GET /api/comercial/planes`
4. Usuario selecciona plan y va a checkout
5. Usuario completa pago
6. Sistema crea suscripción: `POST /api/comercial/suscripciones`
7. Sistema crea factura: `POST /api/comercial/facturas`
8. Usuario ve confirmación y factura
9. Usuario puede ver historial: `GET /api/comercial/facturas`

### Flujo de Renovación de Token

1. Usuario hace petición con token expirado
2. Backend retorna 401
3. Frontend detecta 401 automáticamente
4. Frontend llama `POST /api/auth/refresh`
5. Frontend obtiene nuevo accessToken
6. Frontend reintenta petición original
7. Usuario no nota la renovación (transparente)

---

## Documentación Swagger

### Ubicación

- **Especificación OpenAPI:** `docs/api/openapi.yaml`
- **Swagger UI:** Accesible en `/docs` de la aplicación

### Contenido

La documentación Swagger incluye:
- Todos los endpoints disponibles
- Esquemas de request/response
- Ejemplos de uso
- Códigos de respuesta
- Autenticación requerida

### Acceso

Desde la aplicación:
1. Navega a `/docs`
2. Visualiza documentación interactiva
3. Prueba endpoints directamente desde la UI

---

## Consideraciones Técnicas

### CORS

El backend debe estar configurado para aceptar peticiones desde el frontend. En producción, el frontend está en Vercel y el backend en Railway.

### Timeouts

Las peticiones tienen timeout configurado. Si el backend no responde en tiempo razonable, se activa el fallback.

### Rate Limiting

El backend puede implementar rate limiting. El frontend maneja errores 429 (Too Many Requests) mostrando mensaje al usuario.

### Versionado

Actualmente se usa la versión base de la API. Para futuras versiones, se puede implementar versionado en la URL (`/api/v1/`, `/api/v2/`).

---

## Testing de Integración

### Estrategia

1. **Tests Unitarios:** Mockear llamadas al backend
2. **Tests de Integración:** Usar backend de desarrollo
3. **Tests E2E:** Validar flujos completos con backend real

### Herramientas

- **MSW (Mock Service Worker):** Para mockear API en tests unitarios
- **Backend de Desarrollo:** Para tests de integración
- **Cypress/Playwright:** Para tests E2E

---

## Mejoras Futuras

### Corto Plazo

1. Implementar retry automático para peticiones fallidas
2. Agregar indicadores de carga en todas las peticiones
3. Mejorar manejo de errores de red

### Mediano Plazo

1. Implementar WebSocket para actualizaciones en tiempo real
2. Agregar cache inteligente para datos que no cambian frecuentemente
3. Implementar paginación para listas grandes

### Largo Plazo

1. Migrar a GraphQL si la complejidad lo requiere
2. Implementar service workers para funcionalidad offline
3. Agregar sincronización automática cuando vuelve la conexión

---

## Conclusiones

La integración entre frontend y backend está implementada mediante servicios REST estándar con autenticación JWT. El sistema incluye manejo robusto de errores, renovación automática de tokens y fallback a datos locales para garantizar disponibilidad.

La arquitectura es escalable y mantenible, con separación clara de responsabilidades y patrones consistentes de implementación.

---

## Referencias

- Documentación API Backend: `API_FRONTEND_COMERCIAL.md`
- Especificación OpenAPI: `docs/api/openapi.yaml`
- Servicio API: `src/services/api.js`
- Servicio Auth: `src/services/auth.js`

---

**Última actualización:** Diciembre 2025


---

## Autor

> **Héctor Aguila**  
>> Un Soñador con Poca RAM