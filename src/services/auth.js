// Servicio de autenticación que integra con el backend real
// El backend es la ÚNICA fuente de verdad - NO hay fallback a datos simulados

import { loginUser, registerUser, logout as apiLogout, isAuthenticated as apiIsAuthenticated } from './api.js';
import { guardarUsuarioAutenticado, obtenerUsuarioAutenticado as obtenerUsuarioLocal, cerrarSesion as localCerrarSesion, limpiarDatosUsuario } from '../utils/auth.js';

/**
 * Iniciar sesión con el backend real
 * NO hay fallback a datos simulados - el backend es la única fuente de verdad
 */
export async function iniciarSesion(email, password) {
  try {
    // CRÍTICO: Limpiar datos del usuario anterior antes de iniciar nueva sesión
    // Preservar redirect path si existe (se necesita después del login)
    const redirectPath = localStorage.getItem('siga_redirect_after_login');
    limpiarDatosUsuario(!!redirectPath);
    
    // Intentar login con el backend real
    const response = await loginUser(email, password);
    
    // Log de debugging (sin exponer tokens)
    if (import.meta.env.DEV) {
      const responseSanitized = { ...response };
      if (responseSanitized.accessToken) delete responseSanitized.accessToken;
      if (responseSanitized.refreshToken) delete responseSanitized.refreshToken;
      if (responseSanitized.token) delete responseSanitized.token;
      console.log('🔐 Respuesta del login (sanitizada):', responseSanitized);
    }
    
    if (response.success) {
      // Guardar información del usuario en localStorage para compatibilidad
      // El backend puede retornar response.user o campos directamente
      const userFromBackend = response.user || {};
      const usuario = {
        id: response.userId || userFromBackend.id,
        email: response.email || userFromBackend.email || email, // ✅ Asegurar que siempre tenga email
        nombre: response.nombre || userFromBackend.nombre || email.split('@')[0],
        apellido: response.apellido || userFromBackend.apellido,
        nombreEmpresa: response.nombreEmpresa || userFromBackend.nombreEmpresa,
        rol: response.rol || userFromBackend.rol || 'cliente',
        planId: response.planId || userFromBackend.planId || null,
      };
      
      // Validar que el email esté presente
      if (!usuario.email) {
        console.error('⚠️ ADVERTENCIA: Usuario logueado sin email');
        usuario.email = email; // Usar el email del login como fallback
      }
      
      // Log del usuario que se va a guardar (sin tokens)
      if (import.meta.env.DEV) {
        console.log('💾 Guardando usuario en localStorage:', { ...usuario, email: usuario.email ? '***' : undefined });
      }
      
      guardarUsuarioAutenticado(usuario);
      return usuario;
    }
    
    // Si el backend respondió pero no fue exitoso, lanzar error
    throw new Error(response?.message || 'Credenciales inválidas');
  } catch (error) {
    // NO hay fallback a datos simulados - el login debe funcionar con el backend o fallar
    throw error;
  }
}

/**
 * Registrar nuevo usuario con el backend real
 * NO hay fallback a datos simulados - el backend es la única fuente de verdad
 */
export async function registrarUsuario(userData) {
  try {
    // CRÍTICO: Limpiar datos del usuario anterior antes de registrar nuevo usuario
    limpiarDatosUsuario();
    
    // Intentar registro con el backend real
    const response = await registerUser(userData);
    
    // Log de debugging (sin exponer tokens)
    if (import.meta.env.DEV) {
      const responseSanitized = { ...response };
      if (responseSanitized.accessToken) delete responseSanitized.accessToken;
      if (responseSanitized.refreshToken) delete responseSanitized.refreshToken;
      if (responseSanitized.token) delete responseSanitized.token;
      console.log('📝 Respuesta del registro (sanitizada):', responseSanitized);
    }
    
    if (response.success) {
      // Guardar información del usuario
      // El backend puede retornar response.user o response.email/userId directamente
      const userFromBackend = response.user || {};
      const usuario = {
        id: response.userId || userFromBackend.id,
        email: response.email || userFromBackend.email || userData.email, // ✅ Asegurar que siempre tenga email
        nombre: userFromBackend.nombre || userData.nombre || userData.email.split('@')[0],
        apellido: userFromBackend.apellido || userData.apellido,
        nombreEmpresa: userFromBackend.nombreEmpresa || userData.nombreEmpresa,
        rol: userFromBackend.rol || 'cliente',
        planId: userFromBackend.planId || null,
      };
      
      // Validar que el email esté presente
      if (!usuario.email) {
        console.error('⚠️ ADVERTENCIA: Usuario registrado sin email');
        usuario.email = userData.email; // Usar el email del formulario como fallback
      }
      
      // Log del usuario que se va a guardar (sin tokens)
      if (import.meta.env.DEV) {
        console.log('💾 Guardando usuario en localStorage:', { ...usuario, email: usuario.email ? '***' : undefined });
      }
      
      guardarUsuarioAutenticado(usuario);
      return usuario;
    }
    
    throw new Error(response?.message || 'No se pudo registrar el usuario');
  } catch (error) {
    // NO hay fallback a datos simulados - el registro debe funcionar con el backend o fallar
    throw error;
  }
}

/**
 * Cerrar sesión (limpia tokens y datos locales)
 */
export function cerrarSesion() {
  apiLogout();
  localCerrarSesion();
}

/**
 * Obtener usuario autenticado (compatibilidad con utils/auth.js)
 */
export function obtenerUsuarioAutenticado() {
  // Usar la función del utils/auth.js que ya maneja localStorage
  return obtenerUsuarioLocal();
}

/**
 * Verificar si hay sesión activa (backend o local)
 */
export function estaAutenticado() {
  return apiIsAuthenticated() || !!obtenerUsuarioAutenticado();
}
