// Utilidades de autenticación usando localStorage (simulación)

const CLAVE_USUARIO = 'siga_usuario_actual';
const CLAVE_CARRITO = 'siga_carrito_plan';

export function guardarUsuarioAutenticado(usuario) {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function obtenerUsuarioAutenticado() {
  const dato = localStorage.getItem(CLAVE_USUARIO);
  return dato ? JSON.parse(dato) : null;
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE_USUARIO);
}

export function guardarPlanEnCarrito(plan) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(plan));
}

export function obtenerPlanDelCarrito() {
  const dato = localStorage.getItem(CLAVE_CARRITO);
  return dato ? JSON.parse(dato) : null;
}

export function vaciarCarrito() {
  localStorage.removeItem(CLAVE_CARRITO);
}


