// Datos simulados y funciones CRUD para Planes y Usuarios
// Con persistencia en localStorage para que los datos persistan entre recargas

const CLAVE_PLANES = 'siga_planes';
const CLAVE_USUARIOS = 'siga_usuarios';
const CLAVE_SUSCRIPCIONES = 'siga_suscripciones';
const CLAVE_FACTURAS = 'siga_facturas'; // Clave para guardar facturas/compras

// Función para cargar datos de localStorage o usar valores por defecto
function cargarDesdeLocalStorage(clave, valorPorDefecto) {
  try {
    const datos = localStorage.getItem(clave);
    if (datos) {
      return JSON.parse(datos);
    }
  } catch (error) {
    console.error(`Error al cargar ${clave} desde localStorage:`, error);
  }
  return valorPorDefecto;
}

// Función para guardar datos en localStorage
function guardarEnLocalStorage(clave, datos) {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
  } catch (error) {
    console.error(`Error al guardar ${clave} en localStorage:`, error);
  }
}

// Función para migrar/actualizar usuarios antiguos a los nuevos valores por defecto
function migrarUsuariosSiEsNecesario(usuariosCargados) {
  let necesitaGuardar = false;
  
  // Buscar si existe el usuario antiguo "Carlos Pérez" y actualizarlo a "Hector"
  const carlosIndex = usuariosCargados.findIndex((u) => 
    u.id === 2 && (u.email === 'carlos@siga.com' || u.nombre === 'Carlos Pérez')
  );
  
  if (carlosIndex !== -1) {
    usuariosCargados[carlosIndex] = {
      ...usuariosCargados[carlosIndex],
      nombre: 'Hector',
      email: 'hector@siga.com',
      password: 'hector123',
    };
    necesitaGuardar = true;
  }
  
  // Asegurar que exista el usuario Hector si no existe
  const hectorExiste = usuariosCargados.some((u) => u.id === 2 && u.email === 'hector@siga.com');
  if (!hectorExiste) {
    // Si no existe Hector pero sí existe el ID 2 con datos diferentes, actualizarlo
    const usuarioId2 = usuariosCargados.find((u) => u.id === 2);
    if (usuarioId2) {
      usuarioId2.nombre = 'Hector';
      usuarioId2.email = 'hector@siga.com';
      usuarioId2.password = 'hector123';
      necesitaGuardar = true;
    } else {
      // Si no existe el ID 2, agregarlo
      usuariosCargados.push({
        id: 2,
        nombre: 'Hector',
        email: 'hector@siga.com',
        password: 'hector123',
        rol: 'cliente',
        planId: null,
      });
      necesitaGuardar = true;
    }
  }
  
  // Asegurar que exista el admin
  const adminExiste = usuariosCargados.some((u) => u.id === 1 && u.email === 'admin@siga.com');
  if (!adminExiste) {
    const adminId1 = usuariosCargados.find((u) => u.id === 1);
    if (adminId1) {
      adminId1.nombre = 'Admin';
      adminId1.email = 'admin@siga.com';
      adminId1.password = 'admin123';
      adminId1.rol = 'admin';
      adminId1.planId = null;
      necesitaGuardar = true;
    } else {
      usuariosCargados.unshift({
        id: 1,
        nombre: 'Admin',
        email: 'admin@siga.com',
        password: 'admin123',
        rol: 'admin',
        planId: null,
      });
      necesitaGuardar = true;
    }
  }
  
  if (necesitaGuardar) {
    guardarEnLocalStorage(CLAVE_USUARIOS, usuariosCargados);
  }
  
  return usuariosCargados;
}

// Planes de suscripción disponibles - Cargar desde localStorage si existe
// Todos los planes incluyen el Asistente SIGA (chatbot RAG con contexto de datos de la app)
const planesPorDefecto = [
  {
    id: 1,
    nombre: 'Kiosco',
    precio: 0,
    unidad: 'UF',
    esFreemium: true, // Plan gratuito permanente
    caracteristicas: [
      'Asistente SIGA con RAG',
      'Punto de venta básico',
      'Gestión simple de inventario',
      '1 bodega/sucursal',
      '1 usuario',
    ],
  },
  {
    id: 2,
    nombre: 'Emprendedor Pro',
    precio: 0.9,
    unidad: 'UF',
    esFreemium: false,
    caracteristicas: [
      'Asistente SIGA con RAG',
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
    esFreemium: false,
    caracteristicas: [
      'Asistente SIGA con RAG',
      'Integraciones contables',
      'Bodegas/sucursales ilimitadas',
      'Usuarios ilimitados',
      'Soporte prioritario 24/7',
    ],
  },
];

// Usuarios por defecto del sistema
// planId: null = sin plan, 1 = Kiosco, 2 = Emprendedor Pro, 3 = Crecimiento
// Contraseñas por defecto: admin123, hector123
const usuariosPorDefecto = [
  { id: 1, nombre: 'Admin', email: 'admin@siga.com', password: 'admin123', rol: 'admin', planId: null },
  { id: 2, nombre: 'Hector', email: 'hector@siga.com', password: 'hector123', rol: 'cliente', planId: null },
];

// Inicializar datos desde localStorage o usar valores por defecto
export let planes = cargarDesdeLocalStorage(CLAVE_PLANES, planesPorDefecto);
let usuariosCargados = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
// Migrar usuarios antiguos si es necesario (ej: actualizar Carlos a Hector)
export let usuarios = migrarUsuariosSiEsNecesario([...usuariosCargados]);
export let suscripciones = cargarDesdeLocalStorage(CLAVE_SUSCRIPCIONES, []);

// Utilidades internas para generar IDs
function generarIdPara(lista) {
  return lista.length ? Math.max(...lista.map((e) => e.id)) + 1 : 1;
}

// CRUD Planes - Con persistencia en localStorage
export function crearPlan(plan) {
  const nuevo = { ...plan, id: generarIdPara(planes) };
  planes = [...planes, nuevo];
  guardarEnLocalStorage(CLAVE_PLANES, planes);
  return nuevo;
}

export function leerPlanes() {
  // Recargar desde localStorage para obtener datos actualizados
  planes = cargarDesdeLocalStorage(CLAVE_PLANES, planesPorDefecto);
  return [...planes];
}

export function actualizarPlan(id, cambios) {
  planes = planes.map((p) => (p.id === id ? { ...p, ...cambios } : p));
  guardarEnLocalStorage(CLAVE_PLANES, planes);
  return planes.find((p) => p.id === id) || null;
}

export function eliminarPlan(id) {
  const antes = planes.length;
  planes = planes.filter((p) => p.id !== id);
  guardarEnLocalStorage(CLAVE_PLANES, planes);
  return planes.length < antes;
}

// CRUD Usuarios - Con persistencia en localStorage
export function crearUsuario(usuario) {
  const nuevo = { ...usuario, id: generarIdPara(usuarios) };
  usuarios = [...usuarios, nuevo];
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  return nuevo;
}

export function leerUsuarios() {
  // Recargar desde localStorage para obtener datos actualizados
  let usuariosCargados = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  // Migrar usuarios antiguos si es necesario
  usuarios = migrarUsuariosSiEsNecesario([...usuariosCargados]);
  return [...usuarios];
}

export function actualizarUsuario(id, cambios) {
  usuarios = usuarios.map((u) => (u.id === id ? { ...u, ...cambios } : u));
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  return usuarios.find((u) => u.id === id) || null;
}

export function eliminarUsuario(id) {
  const antes = usuarios.length;
  usuarios = usuarios.filter((u) => u.id !== id);
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  return usuarios.length < antes;
}

// Función para resetear contraseña de un usuario
export function resetearPasswordUsuario(id, nuevaPassword) {
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === id);
  if (usuario) {
    usuario.password = nuevaPassword;
    guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
    return true;
  }
  return false;
}

// Funciones para gestión de suscripciones/planes de usuarios - Con persistencia
export function asignarPlanAUsuario(usuarioId, planId) {
  // Recargar usuarios desde localStorage
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (usuario) {
    usuario.planId = planId;
    // Si se asigna un plan pagado, ya no está en trial
    const plan = planes.find((p) => p.id === planId);
    if (plan && !plan.esFreemium) {
      usuario.enTrial = false;
      usuario.fechaInicioTrial = null;
      usuario.fechaFinTrial = null;
    }
    guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
    
    // También guardar en suscripciones para historial
    suscripciones = cargarDesdeLocalStorage(CLAVE_SUSCRIPCIONES, []);
    const existente = suscripciones.find((s) => s.usuarioId === usuarioId);
    if (existente) {
      existente.planId = planId;
      existente.enTrial = false; // Al comprar, ya no es trial
      existente.fechaActualizacion = new Date().toISOString();
    } else {
      suscripciones.push({
        id: suscripciones.length + 1,
        usuarioId,
        planId,
        fechaInicio: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        enTrial: false,
        trialUsado: false,
      });
    }
    guardarEnLocalStorage(CLAVE_SUSCRIPCIONES, suscripciones);
    return true;
  }
  return false;
}

export function obtenerPlanDelUsuario(usuarioId) {
  // Recargar usuarios desde localStorage para obtener datos actualizados
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  planes = cargarDesdeLocalStorage(CLAVE_PLANES, planesPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (!usuario || !usuario.planId) return null;
  return planes.find((p) => p.id === usuario.planId);
}

export function obtenerLimitesDelPlan(planId) {
  const limites = {
    1: { // Kiosco (Freemium)
      usuarios: 1,
      bodegas: 1, // Límite de bodegas/sucursales
      productos: 100,
      reportes: 'Básicos',
      soporte: 'Email',
      asistenteSIGA: true, // Incluye asistente SIGA con RAG
    },
    2: { // Emprendedor Pro
      usuarios: 3,
      bodegas: 2, // Límite de 2 bodegas/sucursales
      productos: 500,
      reportes: 'Avanzados',
      soporte: 'Email + Chat',
      asistenteSIGA: true, // Incluye asistente SIGA con RAG
    },
    3: { // Crecimiento
      usuarios: -1, // ilimitado
      bodegas: -1, // ilimitado
      productos: -1, // ilimitado
      reportes: 'Completos + IA',
      soporte: 'Prioritario 24/7',
      asistenteSIGA: true, // Incluye asistente SIGA con RAG
    },
  };
  return limites[planId] || null;
}

// ========== FUNCIONES PARA FREE TRIAL DE 14 DÍAS ==========

/**
 * Inicia un free trial de 14 días para un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {number} planId - ID del plan para el trial (generalmente Emprendedor Pro o Crecimiento)
 * @returns {boolean} - true si se inició el trial exitosamente
 */
export function iniciarFreeTrial(usuarioId, planId) {
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  
  if (!usuario) return false;

  // Verificar si el usuario ya tuvo un trial
  suscripciones = cargarDesdeLocalStorage(CLAVE_SUSCRIPCIONES, []);
  const suscripcionAnterior = suscripciones.find((s) => s.usuarioId === usuarioId);
  
  if (suscripcionAnterior && suscripcionAnterior.trialUsado) {
    // El usuario ya usó su trial, no puede iniciar otro
    return false;
  }

  const fechaInicio = new Date();
  const fechaFin = new Date(fechaInicio);
  fechaFin.setDate(fechaFin.getDate() + 14); // 14 días de trial

  // Asignar plan temporalmente durante el trial
  usuario.planId = planId;
  usuario.enTrial = true;
  usuario.fechaInicioTrial = fechaInicio.toISOString();
  usuario.fechaFinTrial = fechaFin.toISOString();
  
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);

  // Guardar en suscripciones
  const nuevaSuscripcion = {
    id: suscripciones.length + 1,
    usuarioId,
    planId,
    fechaInicio: fechaInicio.toISOString(),
    fechaFin: fechaFin.toISOString(),
    enTrial: true,
    trialUsado: true,
    fechaActualizacion: fechaInicio.toISOString(),
  };

  suscripciones.push(nuevaSuscripcion);
  guardarEnLocalStorage(CLAVE_SUSCRIPCIONES, suscripciones);

  return true;
}

/**
 * Verifica si un usuario tiene un trial activo
 * @param {number} usuarioId - ID del usuario
 * @returns {object|null} - Objeto con información del trial o null si no está en trial
 */
export function verificarTrialActivo(usuarioId) {
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  
  if (!usuario || !usuario.enTrial || !usuario.fechaFinTrial) {
    return null;
  }

  const ahora = new Date();
  const fechaFinTrial = new Date(usuario.fechaFinTrial);
  const diasRestantes = Math.ceil((fechaFinTrial - ahora) / (1000 * 60 * 60 * 24));

  if (diasRestantes <= 0) {
    // Trial expirado, revocar acceso
    revocarTrialExpirado(usuarioId);
    return null;
  }

  return {
    activo: true,
    fechaInicio: usuario.fechaInicioTrial,
    fechaFin: usuario.fechaFinTrial,
    diasRestantes: diasRestantes,
    planId: usuario.planId,
  };
}

/**
 * Revoca el trial expirado y vuelve al plan Kiosco (freemium)
 * @param {number} usuarioId - ID del usuario
 */
function revocarTrialExpirado(usuarioId) {
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  
  if (usuario) {
    usuario.enTrial = false;
    usuario.planId = 1; // Volver al plan Kiosco (freemium)
    usuario.fechaInicioTrial = null;
    usuario.fechaFinTrial = null;
    guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  }
}

/**
 * Convierte un trial activo en una suscripción pagada
 * @param {number} usuarioId - ID del usuario
 * @returns {boolean} - true si se convirtió exitosamente
 */
export function convertirTrialAPagado(usuarioId) {
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  
  if (!usuario || !usuario.enTrial) {
    return false;
  }

  // Mantener el plan pero quitar el estado de trial
  usuario.enTrial = false;
  usuario.fechaInicioTrial = null;
  usuario.fechaFinTrial = null;
  
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);

  // Actualizar suscripción
  suscripciones = cargarDesdeLocalStorage(CLAVE_SUSCRIPCIONES, []);
  const suscripcion = suscripciones.find((s) => s.usuarioId === usuarioId);
  if (suscripcion) {
    suscripcion.enTrial = false;
    suscripcion.fechaActualizacion = new Date().toISOString();
    guardarEnLocalStorage(CLAVE_SUSCRIPCIONES, suscripciones);
  }

  return true;
}

/**
 * Verifica si un usuario puede iniciar un free trial
 * @param {number} usuarioId - ID del usuario
 * @returns {boolean} - true si puede iniciar un trial
 */
export function puedeIniciarTrial(usuarioId) {
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  suscripciones = cargarDesdeLocalStorage(CLAVE_SUSCRIPCIONES, []);
  
  const suscripcion = suscripciones.find((s) => s.usuarioId === usuarioId);
  
  // Si ya usó el trial, no puede iniciar otro
  if (suscripcion && suscripcion.trialUsado) {
    return false;
  }

  return true;
}

// ========== FUNCIONES PARA GESTIÓN DE FACTURAS/COMPRAS ==========

/**
 * Crea una nueva factura después de una compra exitosa
 * @param {object} datosFactura - Datos de la factura (usuarioId, planId, precioUF, precioCLP, etc.)
 * @returns {object} - La factura creada con número único
 */
export function crearFactura(datosFactura) {
  // Cargar facturas existentes desde localStorage
  let facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  
  // Generar número de factura único (formato: FAC-YYYYMMDD-XXXX)
  const ahora = new Date();
  const fechaStr = ahora.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
  const numeroFactura = `FAC-${fechaStr}-${String(facturas.length + 1).padStart(4, '0')}`;
  
  // Crear objeto de factura
  const factura = {
    id: facturas.length + 1,
    numeroFactura: numeroFactura,
    usuarioId: datosFactura.usuarioId,
    usuarioNombre: datosFactura.usuarioNombre,
    usuarioEmail: datosFactura.usuarioEmail,
    planId: datosFactura.planId,
    planNombre: datosFactura.planNombre,
    precioUF: datosFactura.precioUF,
    precioCLP: datosFactura.precioCLP,
    unidad: datosFactura.unidad || 'UF',
    fechaCompra: new Date().toISOString(),
    fechaVencimiento: datosFactura.fechaVencimiento || null, // Para suscripciones mensuales
    estado: 'pagada', // 'pagada', 'cancelada', 'reembolsada'
    metodoPago: datosFactura.metodoPago || 'Tarjeta de crédito', // Simulado
    ultimos4Digitos: datosFactura.ultimos4Digitos || '****', // Últimos 4 dígitos de la tarjeta
  };
  
  // Agregar factura al array
  facturas.push(factura);
  
  // Guardar en localStorage
  guardarEnLocalStorage(CLAVE_FACTURAS, facturas);
  
  return factura;
}

/**
 * Obtiene todas las facturas de un usuario específico
 * @param {number} usuarioId - ID del usuario
 * @returns {array} - Array de facturas del usuario ordenadas por fecha (más reciente primero)
 */
export function obtenerFacturasDelUsuario(usuarioId) {
  const facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  
  // Filtrar facturas del usuario y ordenar por fecha (más reciente primero)
  const facturasUsuario = facturas
    .filter((f) => f.usuarioId === usuarioId)
    .sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));
  
  return facturasUsuario;
}

/**
 * Obtiene una factura específica por su ID
 * @param {number} facturaId - ID de la factura
 * @returns {object|null} - La factura encontrada o null
 */
export function obtenerFacturaPorId(facturaId) {
  const facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  return facturas.find((f) => f.id === facturaId) || null;
}

/**
 * Obtiene una factura específica por su número de factura
 * @param {string} numeroFactura - Número de factura (ej: FAC-20241201-0001)
 * @returns {object|null} - La factura encontrada o null
 */
export function obtenerFacturaPorNumero(numeroFactura) {
  const facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  return facturas.find((f) => f.numeroFactura === numeroFactura) || null;
}

/**
 * Obtiene todas las facturas del sistema (útil para administradores)
 * @returns {array} - Array de todas las facturas ordenadas por fecha
 */
export function obtenerTodasLasFacturas() {
  const facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  return facturas.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));
}

// ========== DATOS DE MERMAS PARA EL ASISTENTE IA ==========

const CLAVE_MERMAS = 'siga_mermas';

// Datos simulados de mermas por categoría
const mermasPorDefecto = [
  { categoria: 'Productos caducados', cantidad: 45 },
  { categoria: 'Daños en almacén', cantidad: 28 },
  { categoria: 'Robo o pérdida', cantidad: 12 },
  { categoria: 'Error en registro', cantidad: 8 },
  { categoria: 'Otros', cantidad: 7 },
];

// Cargar mermas desde localStorage o usar valores por defecto
function cargarMermas() {
  return cargarDesdeLocalStorage(CLAVE_MERMAS, mermasPorDefecto);
}

/**
 * Obtiene las mermas del mes actual
 * @returns {array} - Array de objetos con categoria y cantidad
 */
export function obtenerMermasMes() {
  return cargarMermas();
}

/**
 * Exporta un objeto reactivo compatible con el código original de Svelte
 * Para usar con stores reactivos si es necesario
 */
export const datosNegocio = {
  get mermasMes() {
    return obtenerMermasMes();
  },
};

