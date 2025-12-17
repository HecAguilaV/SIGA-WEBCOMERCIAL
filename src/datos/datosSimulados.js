
// Claves de LocalStorage
const K_USUARIOS = 'siga_usuarios';
const K_PLANES = 'siga_planes';
const K_SUSCRIPCIONES = 'siga_suscripciones';
const K_FACTURAS = 'siga_facturas';

// --- UTILIDADES ---
const getStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// --- USUARIOS ---
export const crearUsuario = (usuario) => {
    const usuarios = getStorage(K_USUARIOS);
    const nuevoUsuario = { ...usuario, id: Date.now() + Math.floor(Math.random() * 100000), role: usuario.role || 'cliente' };
    usuarios.push(nuevoUsuario);
    setStorage(K_USUARIOS, usuarios);
    return nuevoUsuario;
};

export const login = (email, password) => {
    const usuarios = getStorage(K_USUARIOS);
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (usuario) {
        const { password, ...userWithoutPass } = usuario;
        return userWithoutPass;
    }
    return null;
};

export const obtenerUsuarioPorId = (id) => {
    const usuarios = getStorage(K_USUARIOS);
    return usuarios.find(u => u.id === id) || null;
};

export const actualizarUsuario = (id, datos) => {
    let usuarios = getStorage(K_USUARIOS);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return null;

    usuarios[index] = { ...usuarios[index], ...datos };
    setStorage(K_USUARIOS, usuarios);
    return usuarios[index];
};

export const eliminarUsuario = (id) => {
    let usuarios = getStorage(K_USUARIOS);
    const inicial = usuarios.length;
    usuarios = usuarios.filter(u => u.id !== id);
    setStorage(K_USUARIOS, usuarios);
    return usuarios.length < inicial;
};

export const leerUsuarios = () => getStorage(K_USUARIOS);
// Alias para compatibilidad
export const obtenerUsuarios = leerUsuarios;

// --- PLANES ---
const PLANES_DEFAULT = [
    { id: 1, nombre: 'Kiosco', precio: 0, precio_clp: 0, unidad: 'UF', descripcion: 'Para pequeños negocios' },
    { id: 2, nombre: 'Emprendedor Pro', precio: 0.9, precio_clp: 35000, unidad: 'UF', descripcion: 'Para negocios en crecimiento' },
    { id: 3, nombre: 'Crecimiento', precio: 1.9, precio_clp: 70000, unidad: 'UF', descripcion: 'Para empresas consolidadas' }
];

export const crearPlan = (plan) => {
    let planes = getStorage(K_PLANES);

    // Si está vacío, inicializar con defaults primero para mantener consistencia
    if (planes.length === 0) {
        planes = [...PLANES_DEFAULT];
    }

    const nuevoPlan = {
        ...plan,
        id: plan.id || (Date.now() + Math.floor(Math.random() * 100000))
    };
    planes.push(nuevoPlan);
    setStorage(K_PLANES, planes);
    return nuevoPlan;
};

export const leerPlanes = () => {
    const planes = getStorage(K_PLANES);
    if (planes.length === 0) {
        setStorage(K_PLANES, PLANES_DEFAULT);
        return PLANES_DEFAULT;
    }
    return planes;
};
export const obtenerPlanes = leerPlanes;

export const obtenerPlanPorId = (id) => {
    const planes = leerPlanes();
    return planes.find(p => p.id === Number(id)) || null;
};

export const actualizarPlan = (id, datos) => {
    let planes = getStorage(K_PLANES);
    const index = planes.findIndex(p => p.id === id);
    if (index === -1) return null;

    planes[index] = { ...planes[index], ...datos };
    setStorage(K_PLANES, planes);
    return planes[index];
};

export const eliminarPlan = (id) => {
    let planes = getStorage(K_PLANES);
    const inicial = planes.length;
    planes = planes.filter(p => p.id !== id);
    setStorage(K_PLANES, planes);
    return planes.length < inicial;
};

// --- SUSCRIPCIONES ---
export const crearSuscripcion = (suscripcion) => {
    const suscripciones = getStorage(K_SUSCRIPCIONES);
    const nueva = {
        ...suscripcion,
        id: Date.now() + Math.floor(Math.random() * 100000),
        fechaInicio: new Date().toISOString(),
        estado: 'activa'
    };
    suscripciones.push(nueva);
    setStorage(K_SUSCRIPCIONES, suscripciones);
    return nueva;
};

export const obtenerSuscripcionPorUsuario = (usuarioId) => {
    const suscripciones = getStorage(K_SUSCRIPCIONES);
    return suscripciones.find(s => s.usuarioId === usuarioId && s.estado === 'activa') || null;
};

// --- FACTURAS ---
export const crearFactura = (datos) => {
    const facturas = getStorage(K_FACTURAS);
    // Generar número de factura único: FAC-YYYYMMDD-XXXX
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    const numero = `FAC-${yyyy}${mm}${dd}-${random}`;

    const nuevaFactura = {
        id: Date.now() + Math.floor(Math.random() * 100000),
        numero,
        fecha: new Date().toISOString(),
        ...datos
    };

    facturas.push(nuevaFactura);
    setStorage(K_FACTURAS, facturas);
    return nuevaFactura;
};

export const obtenerFacturasDelUsuario = (usuarioId) => {
    const facturas = getStorage(K_FACTURAS);
    return facturas.filter(f => f.usuarioId === usuarioId);
};

export const obtenerFacturaPorNumero = (numero) => {
    const facturas = getStorage(K_FACTURAS);
    return facturas.find(f => f.numero === numero) || null;
};

export const buscarFacturaPorId = (id) => {
    const facturas = getStorage(K_FACTURAS);
    return facturas.find(f => f.id === id) || null;
};

export const obtenerTodasLasFacturas = () => {
    return getStorage(K_FACTURAS);
};

// Inicializar datos si están vacíos (para pruebas)
if (localStorage.getItem(K_PLANES) === null) {
    setStorage(K_PLANES, PLANES_DEFAULT);
}
