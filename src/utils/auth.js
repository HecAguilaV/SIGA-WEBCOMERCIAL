// Utilidades de autenticación usando localStorage (simulación)

const CLAVE_USUARIO = 'siga_usuario_actual';
const CLAVE_CARRITO = 'siga_carrito_plan';

export function iniciarSesion(email, password) {
  try {
    const usuariosStr = localStorage.getItem('siga_usuarios');
    if (!usuariosStr) {
      return null;
    }
    
    const usuarios = JSON.parse(usuariosStr);
    const usuario = usuarios.find((u) => u.email === email && u.password === password);
    
    if (usuario) {
      guardarUsuarioAutenticado(usuario);
      return usuario;
    }
    
    return null;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return null;
  }
}

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


