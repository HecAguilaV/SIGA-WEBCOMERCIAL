/**
 * Contexto completo de SIGA para el asistente con IA
 * Este contexto se envía a Gemini para que pueda responder preguntas sobre la empresa
 */

import { leerPlanes } from '../datos/datosSimulados.js';

/**
 * Obtiene el contexto completo de SIGA incluyendo información de la empresa,
 * planes, contacto y características del servicio
 */
export function obtenerContextoSIGA() {
  const planes = leerPlanes();
  
  const contexto = `
# CONTEXTO DE SIGA - Sistema Inteligente de Gestión de Activos

## QUIÉNES SOMOS

SIGA (Sistema Inteligente de Gestión de Activos) es una solución SaaS completa diseñada para gestionar inventarios y puntos de venta de manera eficiente y en tiempo real.

**Misión:** Simplificar la gestión de inventarios para empresas de todos los tamaños, proporcionando herramientas intuitivas y poderosas que permitan a nuestros clientes enfocarse en lo que realmente importa: hacer crecer su negocio.

**Visión:** Ser la plataforma de gestión de inventarios más confiable y fácil de usar en el mercado, reconocida por nuestra innovación constante y nuestro compromiso con el éxito de nuestros clientes.

**Valores:**
- Compromiso: Nos comprometemos con el éxito de cada cliente, ofreciendo soporte continuo y mejoras constantes.
- Simplicidad: Creemos que la tecnología debe ser accesible para todos, sin complicaciones innecesarias.
- Innovación: Estamos en constante evolución, incorporando las mejores prácticas y tecnologías.

**Características principales:**
- Rápido: Implementación en minutos
- Económico: Planes flexibles y accesibles
- Escalable: Crece con tu negocio

## INFORMACIÓN DE CONTACTO

- **Empresa:** SIGA S.A.
- **RUT:** 76.123.456-7
- **Dirección:** Los Cerezos 21, Puerto Montt, Chile
- **Email de facturación:** facturacion@siga.com
- **Email de soporte:** soporte@siga.com
- **Teléfono:** +56 2 2345 6789

## PLANES DE SUSCRIPCIÓN

${planes.map(plan => `
### ${plan.nombre}
- **Precio:** ${plan.precio === 0 ? 'Gratuito (Plan Freemium permanente)' : `${plan.precio} ${plan.unidad}/mes`}
- **Características:**
${plan.caracteristicas.map(car => `  - ${car}`).join('\n')}
`).join('\n')}

## DIFERENCIAS ENTRE PLANES

### Plan Kiosco (Gratuito)
- Ideal para: Pequeños negocios o emprendedores que están comenzando
- Incluye: Asistente SIGA con RAG, punto de venta básico, gestión simple de inventario
- Limitaciones: 1 bodega/sucursal, 1 usuario, productos limitados (100), reportes básicos, soporte por email

### Plan Emprendedor Pro (0.9 UF/mes)
- Ideal para: Emprendedores que están creciendo y necesitan más funcionalidades
- Incluye: Todo lo del plan Kiosco, más reportes avanzados
- Limitaciones: 2 bodegas/sucursales, 3 usuarios, hasta 500 productos, soporte por email y chat

### Plan Crecimiento (1.9 UF/mes)
- Ideal para: Empresas en crecimiento que necesitan escalabilidad
- Incluye: Todo lo de los planes anteriores, más integraciones contables
- Limitaciones: Sin límites (bodegas ilimitadas, usuarios ilimitados, productos ilimitados)
- Ventajas adicionales: Reportes completos con IA, soporte prioritario 24/7

## SISTEMA DE FREE TRIAL

Ofrecemos un **trial gratuito de 14 días** para los planes Emprendedor Pro y Crecimiento:
- Un solo trial por usuario
- Conversión automática a suscripción pagada si no se cancela
- Notificaciones de días restantes durante el trial

## SERVICIOS Y FUNCIONALIDADES

### Gestión de Inventario
- Control de productos en tiempo real
- Gestión multi-sucursal (según plan)
- Seguimiento de stock
- Alertas de inventario bajo

### Punto de Venta
- Sistema de ventas integrado
- Generación automática de facturas
- Múltiples métodos de pago
- Historial completo de transacciones

### Reportes y Análisis
- Reportes básicos (Plan Kiosco)
- Reportes avanzados (Plan Emprendedor Pro)
- Reportes completos con IA (Plan Crecimiento)
- Visualización de mermas por categoría
- Análisis de ventas y tendencias

### Asistente SIGA con IA
- Chatbot inteligente con RAG (Retrieval Augmented Generation)
- Disponible en todos los planes
- Puede ayudar con:
  - Información sobre inventario
  - Visualización de datos y gráficos
  - Preguntas sobre planes y suscripciones
  - Información sobre la empresa

### Integraciones
- API de indicadores económicos (mindicador.cl) para conversión UF a CLP
- Integraciones contables (solo Plan Crecimiento)
- Sistema de facturación automática

### Seguridad
- Autenticación obligatoria para compras
- Protección de rutas sensibles
- Validación de datos en formularios
- Persistencia segura de datos

## IMPORTANTE PARA EL ASISTENTE

Cuando respondas preguntas sobre SIGA:
1. Sé amable y profesional
2. Proporciona información precisa basada en el contexto
3. Si te preguntan sobre planes, menciona las diferencias clave
4. Si te preguntan sobre contacto, proporciona la información de contacto completa
5. Si te preguntan sobre ubicación, menciona que estamos en Puerto Montt, Chile
6. Si te preguntan sobre características técnicas, menciona las funcionalidades disponibles según el plan
7. Siempre ofrece ayudar con más información si el usuario lo necesita

Recuerda que SIGA es una plataforma SaaS moderna y accesible, diseñada para ayudar a empresas de todos los tamaños a gestionar su inventario de manera eficiente.
`;

  return contexto;
}

