# 🚨 Error WebApp: Login directo no reconoce admin ni empresa

**Fecha:** 2025-01-XX  
**Equipo:** WebComercial → Backend/WebApp  
**Prioridad:** 🔴 ALTA

---

## 📋 RESUMEN

Al ingresar **directamente a la WebApp** (no vía SSO desde portal comercial), el usuario:
- ✅ Se autentica correctamente
- ✅ Obtiene permisos (`GET /api/saas/usuarios/1/permisos` → 200)
- ❌ **NO se reconoce como admin** (aunque debería serlo)
- ❌ **No se puede determinar la empresa** al crear recursos (`POST /api/saas/locales` → 400)

---

## 🔍 FLUJO ACTUAL

### Login Directo en WebApp
1. Usuario hace login en WebApp: `POST /api/auth/login` → ✅ 200
2. WebApp obtiene permisos: `GET /api/saas/usuarios/1/permisos` → ✅ 200
3. Usuario intenta crear local: `POST /api/saas/locales` → ❌ 400
   - Error: "No se pudo determinar la empresa. Por favor, contacta al administrador."

### Login vía SSO (Portal Comercial → WebApp)
1. Usuario en portal comercial hace SSO
2. Portal comercial obtiene token operativo
3. WebApp recibe token en URL
4. **Funciona correctamente** (presumiblemente)

---

## ❌ ERRORES OBSERVADOS

### Error 1: No se reconoce como admin

**Síntoma:**
- Usuario tiene rol `ADMINISTRADOR` en portal comercial
- Al hacer login directo en WebApp, no se reconoce como admin
- El endpoint `/api/saas/usuarios/1/permisos` retorna 200, pero los permisos no incluyen admin

**Logs:**
```
🔵 API Request: POST /api/auth/login → 200 ✅
🔵 API Request: GET /api/saas/usuarios/1/permisos → 200 ✅
```

**Pregunta:** ¿El endpoint de permisos está retornando los permisos correctos? ¿El backend está verificando el rol del usuario correctamente?

---

### Error 2: No se puede determinar la empresa

**Síntoma:**
- Usuario tiene `nombreEmpresa` en portal comercial
- Al hacer login directo en WebApp, el backend no puede determinar la empresa
- Al intentar crear recursos (locales, productos, etc.), falla con 400

**Error específico:**
```
POST /api/saas/locales
400 (Bad Request)
Error: No se pudo determinar la empresa. Por favor, contacta al administrador.
```

**Request Body:**
```json
{
  "nombre": "The Local",
  "direccion": "Rancagua 2541",
  "ciudad": "Puerto Montt"
}
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🔍 ANÁLISIS DEL PROBLEMA

### Diferencia entre Login Directo vs SSO

**Login Directo (WebApp):**
- Usuario hace login en WebApp directamente
- Backend genera token operativo
- **Problema:** El token o la sesión no incluye información de empresa

**SSO (Portal Comercial → WebApp):**
- Usuario hace login en portal comercial
- Portal comercial obtiene token operativo (que incluye empresa)
- WebApp recibe token con información completa
- **Funciona:** El token incluye `nombreEmpresa` o información de empresa

### Posibles Causas

1. **El token operativo generado en login directo no incluye `nombreEmpresa`**
   - El endpoint `/api/auth/login` en WebApp no está asociando la empresa del usuario
   - El token JWT no incluye información de empresa

2. **El backend no está extrayendo la empresa del token o usuario**
   - Cuando se crea un recurso, el backend intenta obtener la empresa del token
   - Si el token no tiene empresa, falla con "No se pudo determinar la empresa"

3. **El usuario no tiene `nombreEmpresa` asociado en la base de datos**
   - El usuario existe pero no tiene `nombreEmpresa` en `siga_comercial.USUARIOS`
   - El backend no puede determinar a qué empresa pertenece

4. **Permisos de admin no se están retornando correctamente**
   - El endpoint `/api/saas/usuarios/1/permisos` no está verificando el rol correctamente
   - O la WebApp no está interpretando los permisos correctamente

---

## 🎯 ACCIONES REQUERIDAS

### Para el Equipo Backend

1. **Verificar endpoint `/api/auth/login` (WebApp)**
   - ¿El token operativo generado incluye `nombreEmpresa`?
   - ¿El token incluye información de empresa en el payload?
   - Comparar token generado en login directo vs token generado en SSO

2. **Verificar endpoint `/api/saas/usuarios/{id}/permisos`**
   - ¿Está retornando permisos de admin correctamente?
   - ¿Está verificando el rol del usuario desde el token?
   - ¿Qué estructura de respuesta está retornando?

3. **Verificar endpoint `/api/saas/locales` (POST)**
   - ¿Cómo determina la empresa del usuario?
   - ¿Extrae la empresa del token JWT?
   - ¿O la busca en la base de datos usando el `userId` del token?
   - ¿Por qué falla cuando el usuario hace login directo?

4. **Verificar asociación usuario-empresa**
   - ¿El usuario tiene `nombreEmpresa` en `siga_comercial.USUARIOS`?
   - ¿Hay una relación entre usuario y empresa en la base de datos?
   - ¿El backend está buscando la empresa correctamente?

### Para el Equipo WebApp

1. **Verificar cómo se maneja el login directo**
   - ¿Cómo se genera el token operativo?
   - ¿Se está enviando información de empresa al backend?
   - ¿El token incluye información de empresa?

2. **Verificar cómo se interpretan los permisos**
   - ¿Cómo se determina si el usuario es admin?
   - ¿Se está usando la respuesta de `/api/saas/usuarios/{id}/permisos`?
   - ¿Hay alguna lógica adicional para verificar permisos de admin?

---

## 📊 INFORMACIÓN TÉCNICA

### Usuario Afectado
- **ID:** 1
- **Email:** `admin.test@siga.com` (según token decodificado)
- **Rol esperado:** `ADMINISTRADOR`
- **Empresa esperada:** (debe tener `nombreEmpresa` asociado)

### Endpoints Afectados
- `POST /api/auth/login` - Login directo en WebApp
- `GET /api/saas/usuarios/1/permisos` - Obtener permisos
- `POST /api/saas/locales` - Crear local (falla con 400)

### Token JWT (ejemplo del error)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzaWdhLWJhY2tlbmQiLCJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbi50ZXN0QHNpZ2EuY29tIiwidHlwZSI6ImFjY2VzcyIsInJvbCI6IkFETUlOSVNUUkFET1IiLCJleHAiOjE3NjU3ODkzODQsImlhdCI6MTc2NTcwMjk4NH0...
```

**Payload decodificado:**
```json
{
  "iss": "siga-backend",
  "sub": "1",
  "email": "admin.test@siga.com",
  "type": "access",
  "rol": "ADMINISTRADOR",
  "exp": 1765789384,
  "iat": 1765702984
}
```

**Observación:** El token **NO incluye `nombreEmpresa`** en el payload. Esto podría ser la causa del problema.

---

## 🔄 FLUJO ESPERADO

### Login Directo (debería funcionar igual que SSO)

1. **Usuario hace login en WebApp**
   - `POST /api/auth/login` con email/password
   - Backend valida credenciales
   - Backend busca usuario en BD
   - Backend obtiene `nombreEmpresa` del usuario
   - Backend genera token operativo **con información de empresa**

2. **Token operativo generado debería incluir:**
   ```json
   {
     "iss": "siga-backend",
     "sub": "1",
     "email": "admin.test@siga.com",
     "type": "operativo",
     "rol": "ADMINISTRADOR",
     "nombreEmpresa": "Mi Empresa S.A.", // ← DEBERÍA ESTAR AQUÍ
     "empresaId": 123, // ← O ID de empresa
     "exp": ...,
     "iat": ...
   }
   ```

3. **WebApp usa token para crear recursos**
   - Backend extrae `nombreEmpresa` o `empresaId` del token
   - Backend asocia el recurso a la empresa correcta
   - ✅ Recurso creado exitosamente

---

## 🐛 DEBUGGING

### Información Necesaria del Backend

1. **Logs del endpoint `/api/auth/login` (WebApp)**
   - ¿Qué usuario se está autenticando?
   - ¿El usuario tiene `nombreEmpresa` en la BD?
   - ¿El token generado incluye información de empresa?
   - Comparar con token generado en SSO desde portal comercial

2. **Logs del endpoint `/api/saas/usuarios/1/permisos`**
   - ¿Qué permisos está retornando?
   - ¿Está verificando el rol `ADMINISTRADOR`?
   - ¿La respuesta incluye permisos de admin?

3. **Logs del endpoint `/api/saas/locales` (POST)**
   - ¿Cómo intenta obtener la empresa?
   - ¿Del token JWT?
   - ¿De la base de datos usando `userId`?
   - ¿Por qué falla cuando viene de login directo?

4. **Verificar en base de datos**
   - ¿El usuario con ID 1 tiene `nombreEmpresa` en `siga_comercial.USUARIOS`?
   - ¿Hay una relación usuario-empresa?
   - ¿El backend está buscando correctamente?

---

## 💡 RECOMENDACIONES

### Solución 1: Incluir empresa en token operativo (recomendado)

Cuando se genera el token operativo (tanto en login directo como en SSO), incluir:
- `nombreEmpresa` en el payload del token
- O `empresaId` si hay una tabla de empresas

Esto asegura que todos los endpoints `/api/saas/*` puedan determinar la empresa del usuario.

### Solución 2: Buscar empresa en BD si no está en token

Si el token no incluye empresa, el backend debería:
1. Extraer `userId` del token
2. Buscar el usuario en `siga_comercial.USUARIOS`
3. Obtener `nombreEmpresa` del usuario
4. Usar esa empresa para crear recursos

### Solución 3: Estandarizar login directo con SSO

Asegurar que el login directo en WebApp funcione exactamente igual que el SSO:
- Mismo formato de token
- Misma información en el token
- Misma lógica de obtención de empresa

---

## 📞 CONTACTO

**Equipo WebComercial** está disponible para:
- Proporcionar más logs
- Probar diferentes escenarios
- Coordinar la solución

---

## ✅ ESTADO ACTUAL

- **Login directo en WebApp:** ⚠️ Funciona pero sin empresa
- **Permisos de admin:** ❌ No se reconocen correctamente
- **Creación de recursos:** ❌ Falla por falta de empresa
- **SSO desde portal comercial:** ✅ Funciona correctamente

---

**Última actualización:** 2025-01-XX  
**Estado:** 🔴 PENDIENTE DE REVISIÓN BACKEND/WEBAPP
