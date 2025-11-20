// Datos simulados y funciones CRUD para Planes y Usuarios
// Con persistencia en localStorage para que los datos persistan entre recargas

const CLAVE_PLANES = 'siga_planes';
const CLAVE_USUARIOS = 'siga_usuarios';
const CLAVE_SUSCRIPCIONES = 'siga_suscripciones';
const CLAVE_FACTURAS = 'siga_facturas';

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

// Planes de suscripción disponibles
const planesPorDefecto = [
  {
    id: 1,
    nombre: 'Kiosco',
    precio: 0,
    unidad: 'UF',
    esFreemium: true,
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
const usuariosPorDefecto = [
  { id: 1, nombre: 'Admin', email: 'admin@siga.com', password: 'admin123', rol: 'admin', planId: null },
  { id: 2, nombre: 'Hector', email: 'hector@siga.com', password: 'hector123', rol: 'cliente', planId: null },
];

// Inicializar datos desde localStorage o usar valores por defecto
export let planes = cargarDesdeLocalStorage(CLAVE_PLANES, planesPorDefecto);
export let usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
export let suscripciones = cargarDesdeLocalStorage(CLAVE_SUSCRIPCIONES, []);
export let facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);

// Utilidades internas para generar IDs
function generarIdPara(lista) {
  return lista.length ? Math.max(...lista.map((e) => e.id)) + 1 : 1;
}

function generarIdUnico() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ========== CRUD PLANES ==========

export function crearPlan(plan) {
  const nuevo = { ...plan, id: generarIdPara(planes) };
  planes = [...planes, nuevo];
  guardarEnLocalStorage(CLAVE_PLANES, planes);
  return nuevo;
}

export function leerPlanes() {
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

// ========== CRUD USUARIOS ==========

export function crearUsuario(usuario) {
  const nuevo = { ...usuario, id: generarIdPara(usuarios) };
  usuarios = [...usuarios, nuevo];
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  return nuevo;
}

export function leerUsuarios() {
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  return [...usuarios];
}

export function actualizarUsuario(id, cambios) {
  usuarios = usuarios.map((u) => (u.id === id ? { ...u, ...cambios } : u));
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  return usuarios.find((u) => u.id === id) || null;
}

export function eliminarUsuario(id) {
  if (!id || id === null || id === undefined) {
    return false;
  }

  const antes = usuarios.length;
  usuarios = usuarios.filter((u) => u.id !== id);
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  return usuarios.length < antes;
}

export function resetearPasswordUsuario(id, nuevaPassword) {
  usuarios = usuarios.map((u) => (u.id === id ? { ...u, password: nuevaPassword } : u));
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  return true;
}


// ========== SISTEMA DE FACTURAS ==========

/**
 * Crea una nueva factura
 * @param {object} datosFactura - Datos de la factura
 * @returns {object} Factura creada
 */
export function crearFactura(datosFactura) {
  facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  const fecha = new Date();
  const fechaStr = fecha.toISOString().split('T')[0].replace(/-/g, '');

  // Calcular el contador basado en las facturas existentes del mismo día
  const facturasDelDia = facturas.filter(f => f.numero && f.numero.startsWith(`FAC-${fechaStr}-`));
  const contador = facturasDelDia.length + 1;
  const numero = `FAC-${fechaStr}-${contador.toString().padStart(4, '0')}`;

  const factura = {
    id: generarIdUnico(),
    numero,
    numeroFactura: numero, // Alias para compatibilidad
    fechaCompra: fecha.toISOString(),
    usuarioId: datosFactura.usuarioId,
    usuarioNombre: datosFactura.usuarioNombre,
    usuarioEmail: datosFactura.usuarioEmail,
    planId: datosFactura.planId,
    planNombre: datosFactura.planNombre,
    precio: datosFactura.precioUF || datosFactura.precio || 0,
    precioUF: datosFactura.precioUF || datosFactura.precio || 0,
    precioCLP: datosFactura.precioCLP || null,
    unidad: datosFactura.unidad || 'UF',
    metodoPago: datosFactura.metodoPago || 'Tarjeta de crédito',
    ultimos4Digitos: datosFactura.ultimos4Digitos || null,
    fechaVencimiento: datosFactura.fechaVencimiento || null,
    estado: 'pagada',
  };

  facturas = [...facturas, factura];
  guardarEnLocalStorage(CLAVE_FACTURAS, facturas);
  return factura;
}

/**
 * Obtiene todas las facturas de un usuario
 * @param {number} usuarioId - ID del usuario
 * @returns {array} Array de facturas del usuario
 */
export function obtenerFacturasDelUsuario(usuarioId) {
  facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  return facturas.filter((f) => f.usuarioId === usuarioId);
}

/**
 * Busca una factura por su número
 * @param {string} numero - Número de factura
 * @returns {object|null} Factura encontrada o null
 */
export function obtenerFacturaPorNumero(numero) {
  facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  return facturas.find((f) => f.numero === numero || f.numeroFactura === numero) || null;
}

/**
 * Busca una factura por su ID
 * @param {string} id - ID de la factura
 * @returns {object|null} Factura encontrada o null
 */
export function buscarFacturaPorId(id) {
  facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  return facturas.find((f) => f.id === id) || null;
}

/**
 * Obtiene todas las facturas del sistema
 * @returns {array} Array de todas las facturas
 */
export function obtenerTodasLasFacturas() {
  facturas = cargarDesdeLocalStorage(CLAVE_FACTURAS, []);
  return [...facturas];
}

// ========== FUNCIONES ADICIONALES ==========

export function obtenerPlanDelUsuario(usuarioId) {
  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (!usuario || !usuario.planId) {
    return null;
  }
  return planes.find((p) => p.id === usuario.planId);
}

export function obtenerLimitesDelPlan(planId) {
  const limites = {
    1: {
      usuarios: 1,
      bodegas: 1,
      productos: 100,
      reportes: 'Básicos',
      soporte: 'Email',
      asistenteSIGA: true,
    },
    2: {
      usuarios: 3,
      bodegas: 2,
      productos: 500,
      reportes: 'Avanzados',
      soporte: 'Email + Chat',
      asistenteSIGA: true,
    },
    3: {
      usuarios: -1,
      bodegas: -1,
      productos: -1,
      reportes: 'Completos + IA',
      soporte: 'Prioritario 24/7',
      asistenteSIGA: true,
    },
  };
  return limites[planId] || null;
}

/**
 * Asigna un plan a un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {number} planId - ID del plan a asignar
 * @returns {boolean} True si se asignó correctamente
 */
export function asignarPlanAUsuario(usuarioId, planId) {
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);

  if (!usuario) {
    return false;
  }

  usuario.planId = planId;
  usuarios = usuarios.map((u) => (u.id === usuarioId ? usuario : u));
  guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);

  return true;
}

// ========== SISTEMA DE FREE TRIAL ==========

const CLAVE_TRIALS = 'siga_trials';

/**
 * Verifica si un usuario tiene un trial activo
 * @param {number} usuarioId - ID del usuario
 * @returns {object|null} Información del trial activo o null
 */
export function verificarTrialActivo(usuarioId) {
  const trials = cargarDesdeLocalStorage(CLAVE_TRIALS, []);
  const trial = trials.find((t) => t.usuarioId === usuarioId && t.activo === true);

  if (!trial) {
    return null;
  }

  const fechaInicio = new Date(trial.fechaInicio);
  const fechaFin = new Date(trial.fechaFin);
  const ahora = new Date();

  // Si el trial expiró, marcarlo como inactivo
  if (ahora > fechaFin) {
    trial.activo = false;
    guardarEnLocalStorage(CLAVE_TRIALS, trials);
    return null;
  }

  // Calcular días restantes
  const diasRestantes = Math.ceil((fechaFin - ahora) / (1000 * 60 * 60 * 24));

  return {
    activo: true,
    planId: trial.planId,
    fechaInicio: trial.fechaInicio,
    fechaFin: trial.fechaFin,
    diasRestantes: diasRestantes > 0 ? diasRestantes : 0,
  };
}

/**
 * Verifica si un usuario puede iniciar un trial
 * @param {number} usuarioId - ID del usuario
 * @returns {boolean} True si puede iniciar un trial
 */
export function puedeIniciarTrial(usuarioId) {
  const trials = cargarDesdeLocalStorage(CLAVE_TRIALS, []);
  const trialExistente = trials.find((t) => t.usuarioId === usuarioId);

  // Si ya tiene un trial (activo o completado), no puede iniciar otro
  if (trialExistente) {
    return false;
  }

  // Verificar si el usuario tiene el plan Kiosco (solo pueden hacer trial usuarios con plan Kiosco)
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (!usuario) {
    return false;
  }

  // Solo usuarios con plan Kiosco (id: 1) o sin plan pueden iniciar trial
  return usuario.planId === 1 || usuario.planId === null;
}

/**
 * Inicia un free trial de 14 días para un usuario
 * @param {number} usuarioId - ID del usuario
 * @param {number} planId - ID del plan para el trial
 * @returns {boolean} True si se inició el trial exitosamente
 */
export function iniciarFreeTrial(usuarioId, planId) {
  if (!puedeIniciarTrial(usuarioId)) {
    return false;
  }

  const ahora = new Date();
  const fechaFin = new Date(ahora);
  fechaFin.setDate(fechaFin.getDate() + 14); // 14 días de trial

  const trials = cargarDesdeLocalStorage(CLAVE_TRIALS, []);
  const nuevoTrial = {
    id: generarIdUnico(),
    usuarioId,
    planId,
    fechaInicio: ahora.toISOString(),
    fechaFin: fechaFin.toISOString(),
    activo: true,
  };

  trials.push(nuevoTrial);
  guardarEnLocalStorage(CLAVE_TRIALS, trials);

  // Asignar el plan al usuario temporalmente (trial)
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (usuario) {
    usuario.planId = planId;
    usuario.enTrial = true;
    usuarios = usuarios.map((u) => (u.id === usuarioId ? usuario : u));
    guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  }

  return true;
}

/**
 * Convierte un trial activo en una suscripción pagada
 * @param {number} usuarioId - ID del usuario
 * @returns {boolean} True si se convirtió exitosamente
 */
export function convertirTrialAPagado(usuarioId) {
  const trials = cargarDesdeLocalStorage(CLAVE_TRIALS, []);
  const trial = trials.find((t) => t.usuarioId === usuarioId && t.activo === true);

  if (!trial) {
    return false;
  }

  // Marcar el trial como completado (no activo)
  trial.activo = false;
  trial.convertido = true;
  trial.fechaConversion = new Date().toISOString();
  guardarEnLocalStorage(CLAVE_TRIALS, trials);

  // Actualizar el usuario para remover la marca de trial
  usuarios = cargarDesdeLocalStorage(CLAVE_USUARIOS, usuariosPorDefecto);
  const usuario = usuarios.find((u) => u.id === usuarioId);
  if (usuario) {
    usuario.enTrial = false;
    // El planId se mantiene, solo se remueve el flag de trial
    usuarios = usuarios.map((u) => (u.id === usuarioId ? usuario : u));
    guardarEnLocalStorage(CLAVE_USUARIOS, usuarios);
  }

  return true;
}

// ========== DATOS DE MERMAS PARA GRÁFICOS ==========


/**
 * Obtiene los datos de mermas del mes actual por categoría
 * @returns {array} Array de objetos con {categoria: string, cantidad: number}
 */
export function obtenerMermasMes() {
  // Datos simulados de mermas por categoría para el mes actual
  // Estos datos se usarían normalmente desde una API o base de datos
  return [
    { categoria: 'Productos Vencidos', cantidad: 45 },
    { categoria: 'Daños en Transporte', cantidad: 23 },
    { categoria: 'Robo', cantidad: 12 },
    { categoria: 'Pérdida por Manipulación', cantidad: 18 },
    { categoria: 'Otros', cantidad: 8 },
  ];
}

/**
 * Obtiene datos completos del negocio para el asistente
 * @returns {object} Objeto con locales, ventas, productos, etc.
 */
export function obtenerDatosNegocio() {
  return {
    locales: [
      { id: 1, nombre: 'Sucursal Centro' },
      { id: 2, nombre: 'Sucursal Norte' },
      { id: 3, nombre: 'Sucursal Sur' },
    ],
    productos: [
      { id: 1, nombre: 'Bebida Energética' },
      { id: 2, nombre: 'Papas Fritas' },
      { id: 3, nombre: 'Agua Mineral' },
      { id: 4, nombre: 'Galletas Chocolate' },
      { id: 5, nombre: 'Jugo Natural' },
      { id: 6, nombre: 'Sandwich Jamón' },
    ],
    ventasSemana: [
      { localId: 1, productoId: 1, cantidad: 150 },
      { localId: 1, productoId: 2, cantidad: 120 },
      { localId: 1, productoId: 3, cantidad: 200 },
      { localId: 2, productoId: 1, cantidad: 100 },
      { localId: 2, productoId: 4, cantidad: 80 },
      { localId: 3, productoId: 5, cantidad: 90 },
      { localId: 3, productoId: 6, cantidad: 60 },
      { localId: 1, productoId: 6, cantidad: 110 },
      { localId: 2, productoId: 2, cantidad: 95 },
    ],
    ventasPorDia: [
      { dia: 'Lun', totalVentas: 1200 },
      { dia: 'Mar', totalVentas: 1350 },
      { dia: 'Mié', totalVentas: 1100 },
      { dia: 'Jue', totalVentas: 1500 },
      { dia: 'Vie', totalVentas: 1800 },
      { dia: 'Sáb', totalVentas: 2100 },
      { dia: 'Dom', totalVentas: 1900 },
    ],
    mermasMes: obtenerMermasMes(),
  };
}


