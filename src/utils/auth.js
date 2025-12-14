// Utilidades de autenticación usando localStorage
// NOTA: Las funciones de login/registro reales están en src/services/auth.js

const CLAVE_USUARIO = 'siga_usuario_actual';
const CLAVE_CARRITO = 'siga_carrito_plan';

export function guardarUsuarioAutenticado(usuario) {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function obtenerUsuarioAutenticado() {
  const dato = localStorage.getItem(CLAVE_USUARIO);
  return dato ? JSON.parse(dato) : null;
}

/**
 * Limpia TODOS los datos relacionados al usuario actual
 * Debe llamarse antes de login/registro y al hacer logout
 * @param {boolean} preservarRedirect - Si es true, no limpia siga_redirect_after_login
 */
export function limpiarDatosUsuario(preservarRedirect = false) {
  // Limpiar usuario y tokens
  localStorage.removeItem(CLAVE_USUARIO);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // Limpiar datos específicos del usuario
  localStorage.removeItem('siga_factura_actual'); // Factura del usuario anterior
  localStorage.removeItem('siga_portal_comercial_url'); // URL del portal
  if (!preservarRedirect) {
    localStorage.removeItem('siga_redirect_after_login'); // Redirect path (solo si no se preserva)
  }
  localStorage.removeItem('siga_carrito_plan'); // Carrito (limpiar al cambiar usuario)
  
  // NO limpiar siga_theme ya que es una preferencia del navegador, no del usuario
}

export function cerrarSesion() {
  limpiarDatosUsuario();
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


