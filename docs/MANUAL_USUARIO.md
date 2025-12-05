# Manual de Usuario
## SIGA Portal Comercial

**Versión:** 1.0  
**Fecha:** Diciembre 2025

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Registro de Usuario](#registro-de-usuario)
4. [Inicio de Sesión](#inicio-de-sesión)
5. [Explorar Planes](#explorar-planes)
6. [Proceso de Compra](#proceso-de-compra)
7. [Gestión de Perfil](#gestión-de-perfil)
8. [Historial de Facturas](#historial-de-facturas)
9. [Free Trial](#free-trial)
10. [Asistente con IA](#asistente-con-ia)
11. [Panel de Administración](#panel-de-administración)
12. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

SIGA Portal Comercial es la plataforma donde puedes explorar y suscribirte a los planes del software SIGA (Sistema Inteligente de Gestión de Activos). Este manual te guiará paso a paso para utilizar todas las funcionalidades del portal.

### Requisitos del Sistema

- Navegador web moderno (Chrome, Firefox, Safari o Edge)
- Conexión a internet
- JavaScript habilitado

---

## Acceso al Sistema

### URL del Portal

- **Producción:** https://siga-web.vercel.app
- **Desarrollo:** http://localhost:5173

### Primera Vez

Si es tu primera vez en el portal, deberás registrarte. Si ya tienes una cuenta, puedes iniciar sesión directamente.

---

## Registro de Usuario

### Paso 1: Acceder al Registro

1. Desde la página principal, haz clic en el botón "Iniciar Sesión" o "Registro" en el menú superior
2. Selecciona la opción "Registro" o "Crear cuenta"

### Paso 2: Completar Formulario

1. **Nombre completo:** Ingresa tu nombre completo
2. **Email:** Ingresa un email válido que no esté registrado
3. **Contraseña:** Crea una contraseña con mínimo 6 caracteres

### Paso 3: Validaciones

El sistema validará automáticamente:
- Que el email tenga formato válido
- Que el email no esté ya registrado
- Que la contraseña tenga al menos 6 caracteres
- Que todos los campos estén completos

### Paso 4: Confirmación

Si todos los datos son válidos:
- Se creará tu cuenta automáticamente
- Serás redirigido a tu perfil
- Podrás comenzar a explorar los planes

---

## Inicio de Sesión

### Credenciales de Prueba

Para probar el sistema, puedes usar estas credenciales:

**Administrador:**
- Email: `admin@siga.com`
- Contraseña: `admin123`

**Cliente:**
- Email: `hector@siga.com`
- Contraseña: `hector123`

### Proceso de Login

1. Haz clic en "Iniciar Sesión" en el menú superior
2. Ingresa tu email y contraseña
3. Haz clic en "Iniciar Sesión"
4. Serás redirigido automáticamente:
   - Si eres cliente: a tu perfil
   - Si eres administrador: al panel de administración

### Problemas de Acceso

Si olvidaste tu contraseña o tienes problemas:
- Verifica que el email y contraseña sean correctos
- Asegúrate de que no haya espacios adicionales
- Si eres administrador, puedes resetear contraseñas desde el panel de administración

---

## Explorar Planes

### Ver Catálogo de Planes

1. Desde cualquier página, haz clic en "Planes" en el menú superior
2. Verás los tres planes disponibles:
   - **Kiosco:** Plan gratuito permanente
   - **Emprendedor Pro:** 0.9 UF/mes
   - **Crecimiento:** 1.9 UF/mes

### Información de Cada Plan

Cada plan muestra:
- Precio en UF (Unidad de Fomento)
- Precio aproximado en pesos chilenos (CLP)
- Lista de características incluidas
- Límites de bodegas, usuarios y productos

### Seleccionar un Plan

1. Revisa las características de cada plan
2. Haz clic en "Seleccionar Plan" en la tarjeta del plan que te interese
3. El plan se agregará automáticamente a tu carrito
4. Serás redirigido a la página del carrito

---

## Proceso de Compra

### Paso 1: Revisar Carrito

1. En la página del carrito verás:
   - Plan seleccionado
   - Precio en UF y CLP
   - Opciones para vaciar carrito o proceder al pago

2. Si no has iniciado sesión:
   - Verás un mensaje indicando que debes iniciar sesión
   - Haz clic en "Iniciar Sesión para Pagar"
   - Después del login, volverás automáticamente al carrito

### Paso 2: Checkout

1. Haz clic en "Proceder al Pago"
2. Serás redirigido a la página de checkout
3. Completa la información de pago:
   - **Número de tarjeta:** 13-19 dígitos (puedes usar números de prueba)
   - **Nombre del titular:** Nombre completo como aparece en la tarjeta
   - **Fecha de vencimiento:** Mes (MM) y Año (AAAA)
   - **CVV:** 3-4 dígitos del reverso de la tarjeta

### Paso 3: Validación

El sistema validará:
- Que todos los campos estén completos
- Que el número de tarjeta sea válido
- Que la fecha de vencimiento sea válida
- Que el CVV tenga el formato correcto

### Paso 4: Procesamiento

1. Haz clic en "Pagar"
2. El sistema procesará el pago (simulado)
3. Se generará automáticamente tu factura
4. Serás redirigido a la página de éxito

### Paso 5: Confirmación

En la página de éxito verás:
- Mensaje de confirmación
- Tu factura generada
- Opciones para:
  - Ver tu plan en el perfil
  - Ir a la aplicación SIGA
  - Volver al inicio

---

## Gestión de Perfil

### Acceder al Perfil

1. Inicia sesión en el sistema
2. Haz clic en tu nombre o "Perfil" en el menú superior
3. O accede directamente desde la URL: `/perfil`

### Información Mostrada

En tu perfil verás:

**Plan Actual:**
- Nombre del plan
- Precio y período de facturación
- Características incluidas
- Límites de tu plan (bodegas, usuarios, productos)

**Acciones Rápidas:**
- Acceso directo a la aplicación SIGA
- Ver planes disponibles
- Ver carrito

**Información de Cuenta:**
- Nombre completo
- Email
- Rol (cliente o administrador)
- ID de usuario

---

## Historial de Facturas

### Ver Facturas

1. Desde tu perfil, desplázate a la sección "Historial de Compras y Facturas"
2. Verás una tabla con todas tus facturas que incluye:
   - Número de factura
   - Plan comprado
   - Fecha de compra
   - Monto pagado
   - Estado

### Ver Detalle de Factura

1. Haz clic en "Ver Factura" en la fila de la factura que deseas ver
2. Se mostrará la factura completa con:
   - Información del emisor (SIGA)
   - Información del cliente (tú)
   - Detalles de la compra
   - Método de pago utilizado
   - Total pagado

### Imprimir Factura

1. Con la factura abierta, haz clic en "Imprimir Factura"
2. Se abrirá el diálogo de impresión de tu navegador
3. Configura la impresión según tus preferencias
4. Imprime o guarda como PDF

---

## Free Trial

### ¿Qué es el Free Trial?

El free trial es un período de prueba gratuito de 14 días para los planes Emprendedor Pro o Crecimiento.

### Requisitos para Iniciar Trial

- Debes tener el plan Kiosco (gratuito) o no tener plan asignado
- Solo puedes iniciar un trial una vez
- El trial es de 14 días

### Iniciar un Trial

1. Accede a tu perfil
2. Si cumples los requisitos, verás una sección "Prueba gratis por 14 días"
3. Selecciona el plan que deseas probar:
   - Trial Emprendedor Pro
   - Trial Crecimiento
4. Confirma que deseas iniciar el trial
5. El trial se activará inmediatamente

### Durante el Trial

- Tendrás acceso completo a todas las funcionalidades del plan seleccionado
- Verás un aviso en tu perfil con los días restantes
- Podrás convertir el trial a suscripción pagada en cualquier momento

### Convertir Trial a Suscripción Pagada

1. Desde tu perfil, en la sección de tu plan actual
2. Haz clic en "Convertir a Suscripción"
3. Serás redirigido al checkout para completar el pago
4. Una vez pagado, el trial se convertirá en suscripción permanente

---

## Asistente con IA

### Acceder al Asistente

1. Busca el botón flotante con el logo "S" en la esquina inferior derecha de cualquier página
2. Haz clic en el botón para abrir el asistente

### Usar el Asistente

1. Escribe tu pregunta o consulta en el campo de texto
2. Presiona Enter o haz clic en el botón de enviar
3. El asistente responderá con información sobre SIGA

### Tipos de Consultas

Puedes preguntar sobre:
- Información de planes y suscripciones
- Datos de contacto
- Ubicación de la empresa
- Visualización de datos (mermas, gráficos)
- Cualquier información relacionada con SIGA

### Visualizar Gráficos

Para ver gráficos de mermas, pregunta:
- "Muéstrame las mermas por categoría"
- "Visualizar mermas"
- "Gráfico de mermas"

El asistente mostrará un gráfico interactivo con los datos.

---

## Panel de Administración

### Acceso al Panel

Solo usuarios con rol de administrador pueden acceder:
1. Inicia sesión con credenciales de administrador
2. Haz clic en "Admin" en el menú superior
3. O accede directamente a `/admin`

### Dashboard

El dashboard muestra:
- Métricas generales del portal
- Estadísticas de usuarios
- Estadísticas de planes
- Estadísticas de suscripciones

### Gestión de Usuarios

1. Accede a "Usuarios" en el menú del panel
2. Verás una tabla con todos los usuarios registrados
3. Puedes:
   - Ver información de cada usuario
   - Crear nuevos usuarios
   - Actualizar información de usuarios
   - Eliminar usuarios
   - Resetear contraseñas

### Gestión de Planes

1. Accede a "Planes" en el menú del panel
2. Verás todos los planes disponibles
3. Puedes:
   - Crear nuevos planes
   - Editar planes existentes
   - Eliminar planes
   - Ver detalles de cada plan

### Gestión de Suscripciones

1. Accede a "Suscripciones" en el menú del panel
2. Verás todas las suscripciones activas
3. Información mostrada:
   - Usuario suscrito
   - Plan asignado
   - Fechas de inicio y fin
   - Estado de la suscripción

---

## Solución de Problemas

### No puedo iniciar sesión

**Problema:** Las credenciales no funcionan

**Solución:**
- Verifica que el email y contraseña sean correctos
- Asegúrate de no tener espacios adicionales
- Si olvidaste tu contraseña, contacta a un administrador

### No puedo ver los planes

**Problema:** La página de planes no carga

**Solución:**
- Verifica tu conexión a internet
- Recarga la página (F5)
- Limpia la caché del navegador
- Si el problema persiste, el backend puede estar temporalmente no disponible

### El carrito está vacío

**Problema:** Agregué un plan pero el carrito aparece vacío

**Solución:**
- Verifica que hayas hecho clic en "Seleccionar Plan"
- Recarga la página
- Intenta agregar el plan nuevamente

### No puedo completar el pago

**Problema:** El formulario de pago muestra errores

**Solución:**
- Verifica que todos los campos estén completos
- Asegúrate de que el número de tarjeta tenga 13-19 dígitos
- Verifica que la fecha de vencimiento sea válida
- El CVV debe tener 3-4 dígitos

### No veo mis facturas

**Problema:** El historial de facturas está vacío

**Solución:**
- Verifica que hayas completado al menos una compra
- Las facturas se generan automáticamente después de cada compra exitosa
- Si completaste una compra y no ves la factura, contacta a soporte

### El asistente no responde

**Problema:** El asistente con IA no funciona

**Solución:**
- Verifica tu conexión a internet
- El asistente usa una API externa que puede tener limitaciones
- Si no hay API key configurada, el asistente usará respuestas simuladas
- Recarga la página e intenta nuevamente

---

## Contacto y Soporte

Para problemas técnicos o consultas:
- Email: soporte@siga.com
- Teléfono: +56 2 2345 6789
- Dirección: Los Cerezos 21, Puerto Montt, Chile

---

## Glosario

- **UF:** Unidad de Fomento, indicador económico chileno usado para indexar precios
- **CLP:** Peso Chileno, moneda oficial de Chile
- **Free Trial:** Período de prueba gratuito de 14 días
- **Factura:** Documento que certifica una compra realizada
- **Suscripción:** Plan activo asignado a un usuario
- **Checkout:** Proceso final de compra donde se completa el pago

---

**Última actualización:** Diciembre 2025

