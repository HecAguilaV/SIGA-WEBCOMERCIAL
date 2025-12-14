/**
 * Contexto completo de SIGA para el asistente con IA
 * Este contexto se envía a Gemini para que pueda responder preguntas sobre la empresa
 */

import { getPlanes } from '../services/api.js';

/**
 * Obtiene el contexto completo de SIGA incluyendo información de la empresa,
 * planes, contacto y características del servicio
 * Obtiene los planes desde el backend (fuente de verdad)
 */
export async function obtenerContextoSIGA() {
  // Obtener planes desde el backend
  let planes = [];
  try {
    const response = await getPlanes();
    if (response.success && response.planes) {
      planes = response.planes;
    }
  } catch (error) {
    console.error('Error al obtener planes para contexto:', error);
    // Si falla, usar planes por defecto básicos para el contexto
    planes = [
      {
        id: 2,
        nombre: 'Emprendedor Pro',
        precio: 0.9,
        unidad: 'UF',
        caracteristicas: [
          'Asistente SIGA con Inteligencia Artificial',
          'Reportes avanzados',
          '2 bodegas/sucursales',
          '3 usuarios',
          'Gestión de inventario multi-sucursal',
        ],
      },
      {
        id: 3,
        nombre: 'Crecimiento',
        precio: 1.9,
        unidad: 'UF',
        caracteristicas: [
          'Todo lo del plan Emprendedor Pro',
          'Bodegas ilimitadas',
          'Usuarios ilimitados',
          'Productos ilimitados',
          'Reportes completos con IA',
          'Soporte prioritario 24/7',
        ],
      },
    ];
  }
  
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

${planes.length > 0 ? planes.map(plan => `
### ${plan.nombre}
- **Precio:** ${plan.precio || plan.precioMensual || 'N/A'} ${plan.unidad || 'UF'}/mes
- **Características:**
${(plan.caracteristicas || []).map(car => `  - ${car}`).join('\n')}
`).join('\n') : 'No hay planes disponibles en este momento.'}

## DIFERENCIAS ENTRE PLANES

### Plan Emprendedor Pro (0.9 UF/mes)
- Ideal para: Emprendedores que están creciendo y necesitan más funcionalidades
- Incluye: Asistente SIGA con Inteligencia Artificial, reportes avanzados, gestión de inventario multi-sucursal
- Limitaciones: 2 bodegas/sucursales, 3 usuarios, hasta 500 productos, soporte por email y chat

### Plan Crecimiento (1.9 UF/mes)
- Ideal para: Empresas en crecimiento que necesitan escalabilidad
- Incluye: Todo lo del plan Emprendedor Pro, más integraciones contables
- Limitaciones: Sin límites (bodegas ilimitadas, usuarios ilimitados, productos ilimitados)
- Ventajas adicionales: Reportes completos con IA, soporte prioritario 24/7

## SISTEMA DE FREE TRIAL

**IMPORTANTE:** Ya NO hay plan gratuito permanente. Ofrecemos un **trial gratuito de 14 días** para los planes Emprendedor Pro y Crecimiento:
- Disponible para usuarios sin plan activo
- Un solo trial por usuario
- Después del trial, el usuario pierde acceso hasta que contrate un plan de pago
- Conversión automática a suscripción pagada si el usuario decide continuar
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
- Reportes avanzados (Plan Emprendedor Pro)
- Reportes completos con IA (Plan Crecimiento)
- **Nota:** Los reportes y análisis de datos operativos (ventas, inventario, mermas) están disponibles en la WebApp operativa, no en este portal comercial.

### Asistente SIGA con IA
- Chatbot inteligente con Inteligencia Artificial
- Disponible en todos los planes
- **IMPORTANTE:** Este asistente está en el PORTAL COMERCIAL y solo puede ayudar con:
  - Información sobre planes y suscripciones
  - Consultas sobre facturas y pagos
  - Ayuda con acceso a la WebApp
  - Preguntas sobre el portal comercial y la empresa
  - **NO puede generar gráficos ni análisis de datos operativos** (eso es solo en la WebApp)

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

