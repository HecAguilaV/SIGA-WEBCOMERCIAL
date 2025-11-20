# 📚 Documentación API - SIGA Portal Comercial

## 📋 Descripción

Esta carpeta contiene la documentación OpenAPI/Swagger de las funciones del Portal Comercial SIGA. Aunque actualmente el proyecto usa funciones JavaScript con localStorage, esta documentación describe las funciones como si fueran endpoints REST para facilitar la migración futura a un backend real.

## 📁 Archivos

- `openapi.yaml` - Especificación OpenAPI 3.0 completa de todas las funciones
- `README.md` - Este archivo

## 🚀 Cómo Visualizar la Documentación

### Opción 1: Swagger Editor Online

1. Ve a https://editor.swagger.io/
2. Copia el contenido de `openapi.yaml`
3. Pégalo en el editor
4. Verás la documentación interactiva

### Opción 2: Swagger UI Local

1. Instala swagger-ui-dist:
```bash
npm install --save-dev swagger-ui-dist
```

2. Crea un servidor simple o usa un servidor estático

3. Abre `openapi.yaml` en Swagger UI

### Opción 3: Herramientas de VSCode

Instala la extensión "OpenAPI (Swagger) Editor" en VSCode para visualizar y editar el archivo.

## 📊 Endpoints Documentados

### Usuarios (7 endpoints)
- GET `/usuarios` - Listar usuarios
- POST `/usuarios` - Crear usuario
- GET `/usuarios/{id}` - Obtener usuario
- PUT `/usuarios/{id}` - Actualizar usuario
- DELETE `/usuarios/{id}` - Eliminar usuario
- POST `/usuarios/{id}/reset-password` - Resetear contraseña

### Planes (5 endpoints)
- GET `/planes` - Listar planes
- POST `/planes` - Crear plan
- GET `/planes/{id}` - Obtener plan
- PUT `/planes/{id}` - Actualizar plan
- DELETE `/planes/{id}` - Eliminar plan
- GET `/planes/{id}/limites` - Obtener límites

### Suscripciones (5 endpoints)
- POST `/suscripciones/asignar` - Asignar plan
- GET `/usuarios/{usuarioId}/plan` - Obtener plan del usuario
- POST `/suscripciones/trial/iniciar` - Iniciar trial
- GET `/usuarios/{usuarioId}/trial` - Verificar trial
- POST `/suscripciones/trial/convertir` - Convertir trial

### Facturas (5 endpoints)
- POST `/facturas` - Crear factura
- GET `/usuarios/{usuarioId}/facturas` - Listar facturas del usuario
- GET `/facturas/{id}` - Obtener factura por ID
- GET `/facturas/numero/{numeroFactura}` - Buscar por número
- GET `/facturas/todas` - Listar todas (admin)

### Autenticación (3 endpoints)
- POST `/auth/login` - Iniciar sesión
- POST `/auth/logout` - Cerrar sesión
- GET `/auth/usuario-actual` - Usuario autenticado

### Carrito (3 endpoints)
- GET `/carrito` - Obtener carrito
- POST `/carrito` - Agregar al carrito
- DELETE `/carrito` - Vaciar carrito

### Indicadores Económicos (3 endpoints)
- GET `/indicadores/uf` - Valor de UF
- GET `/indicadores/usd` - Valor de USD
- GET `/indicadores/convertir-uf-clp` - Convertir UF a CLP

**Total: 31 endpoints documentados**

## 🔄 Mapeo de Funciones a Endpoints

| Función JavaScript | Endpoint OpenAPI |
|-------------------|------------------|
| `crearUsuario()` | POST `/usuarios` |
| `leerUsuarios()` | GET `/usuarios` |
| `actualizarUsuario()` | PUT `/usuarios/{id}` |
| `eliminarUsuario()` | DELETE `/usuarios/{id}` |
| `crearPlan()` | POST `/planes` |
| `leerPlanes()` | GET `/planes` |
| `asignarPlanAUsuario()` | POST `/suscripciones/asignar` |
| `crearFactura()` | POST `/facturas` |
| `obtenerFacturasDelUsuario()` | GET `/usuarios/{id}/facturas` |
| `obtenerFacturaPorNumero()` | GET `/facturas/numero/{numeroFactura}` |
| `guardarPlanEnCarrito()` | POST `/carrito` |
| `obtenerPlanDelCarrito()` | GET `/carrito` |
| `convertirUFaCLP()` | GET `/indicadores/convertir-uf-clp` |

## 📝 Notas Importantes

1. **Esta es documentación de referencia**: Las funciones actuales no son endpoints HTTP reales
2. **Migración futura**: Esta documentación servirá como guía cuando se implemente un backend REST
3. **Estructura de datos**: Todos los esquemas están documentados y pueden usarse como referencia
4. **Ejemplos**: Cada endpoint incluye ejemplos de request/response

## 🔗 Recursos

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger Editor](https://editor.swagger.io/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

---

**Última actualización:** Diciembre 2024

