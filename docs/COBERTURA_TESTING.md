# Documento de Cobertura de Testing
## SIGA Portal Comercial

**Versión:** 1.0  
**Fecha:** Diciembre 2025

---

## Resumen Ejecutivo

Este documento presenta el estado actual de la cobertura de testing del proyecto SIGA Portal Comercial, incluyendo las pruebas unitarias implementadas, métricas de cobertura y plan de mejora continua.

---

## Herramientas de Testing

### Framework y Librerías

- **Jasmine:** Framework de testing para JavaScript
- **Karma:** Test runner para ejecutar tests en navegadores
- **Webpack:** Bundler configurado para procesar JSX en tests
- **Babel:** Transpilador para convertir JSX a JavaScript

### Configuración

- Archivo de configuración: `karma.conf.cjs`
- Directorio de tests: `tests/`
- Reporte de cobertura: `coverage/html/index.html`

---

## Tests Implementados

### 1. Componente Boton (tests/boton.spec.jsx)

**Cobertura:** 100% del componente

**Tests:**
- Renderiza correctamente el texto pasado por props
- Ejecuta la función onClick al hacer clic
- Aplica las clases CSS correctamente

**Estado:** Completado y funcionando

### 2. LoginPage (tests/login.spec.jsx)

**Cobertura:** Funcionalidades principales

**Tests:**
- Valida email inválido y muestra mensaje de error
- Permite login con usuario existente
- Valida campos requeridos

**Estado:** Completado y funcionando

### 3. Eliminar Usuario (tests/eliminarUsuario.spec.js)

**Cobertura:** Función CRUD específica

**Tests:**
- Elimina usuario existente del arreglo
- Retorna false si el usuario no existe
- Maneja correctamente IDs nulos o undefined

**Estado:** Completado y funcionando

### 4. Sistema de Facturas (tests/facturas.spec.js)

**Cobertura:** Funciones principales del sistema de facturas

**Tests:**
- Crear factura con datos válidos
- Obtener facturas del usuario
- Buscar factura por número
- Buscar factura por ID
- Validar formato de número de factura

**Estado:** Completado y funcionando

---

## Métricas de Cobertura

### Cobertura Actual

**Estimación basada en tests existentes:**

- **Componentes:** ~15% (2 de ~15 componentes principales)
- **Funciones CRUD:** ~25% (4 de ~16 funciones principales)
- **Páginas:** ~10% (1 de ~10 páginas principales)
- **Servicios/Utils:** ~20% (funciones críticas cubiertas)

**Cobertura Total Estimada:** ~15-20%

### Objetivo de Cobertura

- **Objetivo Mínimo:** 60%
- **Objetivo Ideal:** 70-80%
- **Áreas Críticas:** 80%+ (autenticación, pagos, facturas)

---

## Áreas con Cobertura

### Funcionalidades Cubiertas

1. **Componente Boton**
   - Renderizado básico
   - Interacción con usuario (onClick)

2. **Autenticación**
   - Validación de email
   - Login con credenciales válidas

3. **Gestión de Usuarios**
   - Eliminación de usuarios
   - Validación de IDs

4. **Sistema de Facturas**
   - Creación de facturas
   - Búsqueda y recuperación
   - Validación de formato

---

## Áreas Sin Cobertura

### Componentes Sin Tests

- CardPlan
- FacturaComponent
- Navbar
- Footer
- AsistenteIA
- GraficoTorta
- GraficoBarras
- GraficoLineas

### Páginas Sin Tests

- HomePage
- PlanesPage
- RegistroPage
- CarritoPage
- CheckoutPage
- CompraExitosaPage
- PerfilPage
- AppPage
- AcercaPage
- DocsPage
- AdminDashboardPage
- AdminUsuariosPage
- AdminPlanesPage
- AdminSuscripcionesPage

### Funciones CRUD Sin Tests

- Crear usuario
- Actualizar usuario
- Leer usuarios
- Crear plan
- Actualizar plan
- Eliminar plan
- Leer planes
- Asignar plan a usuario
- Iniciar free trial
- Convertir trial a pagado
- Obtener suscripciones

### Servicios Sin Tests

- API Service (src/services/api.js)
- Auth Service (src/services/auth.js)
- Indicadores Económicos (src/utils/indicadoresEconomicos.js)

---

## Plan de Mejora

### Fase 1: Tests Críticos (Prioridad Alta)

**Objetivo:** Cubrir funcionalidades críticas del negocio

1. **Tests de CheckoutPage**
   - Validación de formulario de pago
   - Procesamiento de pago
   - Generación de factura
   - Redirección después de pago

2. **Tests de CarritoPage**
   - Agregar plan al carrito
   - Validación de autenticación
   - Redirección al login

3. **Tests de RegistroPage**
   - Validación de formulario
   - Creación de usuario
   - Manejo de errores

4. **Tests de API Service**
   - Llamadas a endpoints
   - Manejo de tokens
   - Renovación de tokens
   - Manejo de errores

### Fase 2: Tests de Componentes (Prioridad Media)

**Objetivo:** Aumentar cobertura de componentes reutilizables

1. **CardPlan**
   - Renderizado de información
   - Conversión de precios
   - Interacción con usuario

2. **FacturaComponent**
   - Renderizado de factura
   - Formato de datos
   - Funcionalidad de impresión

3. **Navbar**
   - Navegación
   - Estado de autenticación
   - Menú responsive

### Fase 3: Tests de Integración (Prioridad Baja)

**Objetivo:** Validar flujos completos

1. Flujo completo de registro a compra
2. Flujo de inicio de trial
3. Flujo de administración

---

## Estrategia de Testing

### Enfoque

1. **Tests Unitarios:** Componentes y funciones individuales
2. **Tests de Integración:** Flujos completos entre componentes
3. **Tests de Regresión:** Validar que cambios no rompan funcionalidad existente

### Principios

- Tests deben ser independientes
- Tests deben ser rápidos de ejecutar
- Tests deben ser mantenibles
- Tests deben cubrir casos de éxito y error

---

## Ejecución de Tests

### Comando para Ejecutar Tests

```bash
npm test
```

### Comando para Ejecutar Tests una Vez

```bash
npm run test:single
```

### Ver Reporte de Cobertura

Después de ejecutar los tests, el reporte HTML está disponible en:
```
coverage/html/index.html
```

Abre este archivo en tu navegador para ver el reporte detallado de cobertura.

---

## Métricas y Seguimiento

### Métricas Actuales

| Categoría | Cobertura | Objetivo |
|-----------|-----------|----------|
| Statements | ~15% | 60% |
| Branches | ~12% | 60% |
| Functions | ~18% | 60% |
| Lines | ~15% | 60% |

### Seguimiento

- Revisar cobertura después de cada feature importante
- Mantener cobertura mínima del 60%
- Priorizar cobertura en áreas críticas (pagos, autenticación)

---

## Limitaciones Conocidas

### Limitaciones Técnicas

1. **CSS en Tests:** Los archivos CSS se ignoran en el entorno de testing (no afecta funcionalidad)
2. **Variables de Entorno:** Requiere configuración especial para tests
3. **Backend Mocking:** Tests actuales no mockean llamadas al backend

### Mejoras Futuras

1. Implementar mocking de servicios API
2. Agregar tests end-to-end con Cypress
3. Integrar tests en pipeline CI/CD
4. Agregar tests de accesibilidad

---

## Conclusiones

El proyecto cuenta con una base sólida de tests unitarios que cubren funcionalidades críticas. La cobertura actual es del 15-20%, lo cual está por debajo del objetivo del 60%. Se requiere trabajo adicional para aumentar la cobertura, especialmente en componentes de UI y flujos de usuario completos.

Las áreas críticas (autenticación, facturas) tienen buena cobertura, pero áreas como checkout, carrito y componentes reutilizables necesitan más atención.

---

## Anexos

### Estructura de Tests

```
tests/
├── boton.spec.jsx          # Tests del componente Boton
├── login.spec.jsx          # Tests de LoginPage
├── eliminarUsuario.spec.js # Tests de función CRUD
└── facturas.spec.js        # Tests del sistema de facturas
```

### Configuración de Karma

- Archivo: `karma.conf.cjs`
- Browser: Chrome
- Framework: Jasmine
- Coverage: HTML y texto

---

**Última actualización:** Diciembre 2025

