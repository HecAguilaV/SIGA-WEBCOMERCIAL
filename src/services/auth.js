// Servicio de autenticación que integra con el backend real
// Mantiene compatibilidad con el sistema de autenticación local existente

import { loginUser, registerUser, logout as apiLogout, isAuthenticated as apiIsAuthenticated } from './api.js';
import { guardarUsuarioAutenticado, obtenerUsuarioAutenticado as obtenerUsuarioLocal, cerrarSesion as localCerrarSesion } from '../utils/auth.js';

function permitirFallbackLocal() {
  try {
    // Solo permitir fallback en desarrollo LOCAL (evita “éxitos” falsos en producción)
    return (
      typeof window !== 'undefined' &&
      import.meta?.env?.DEV &&
      window.location.hostname === 'localhost'
    );
  } catch {
    return false;
  }
}

/**
 * Iniciar sesión con el backend real
 * Si falla, intenta con datos locales como fallback
 */
export async function iniciarSesion(email, password) {
  try {
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

    // Si el backend respondió pero no fue exitoso, NO “silenciar” (en prod debe verse el error real)
    throw new Error(response?.message || 'Credenciales inválidas');
  } catch (error) {
    // En producción NO se permite fallback: necesitamos que la BD sea la fuente de verdad
    if (!permitirFallbackLocal()) {
      throw error;
    }

    console.warn('Error al iniciar sesión con backend, intentando con datos locales:', error);
    
    // Fallback a autenticación local
    const usuariosStr = localStorage.getItem('siga_usuarios');
    if (usuariosStr) {
      const usuarios = JSON.parse(usuariosStr);
      const usuario = usuarios.find((u) => u.email === email && u.password === password);
      
      if (usuario) {
        guardarUsuarioAutenticado(usuario);
        return usuario;
      }
    }
    
    return null;
  }
}

/**
 * Registrar nuevo usuario con el backend real
 * Si falla, intenta con datos locales como fallback
 */
export async function registrarUsuario(userData) {
  try {
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
    // En producción NO se permite fallback: el registro debe persistir en BD o fallar
    if (!permitirFallbackLocal()) {
      throw error;
    }

    console.warn('Error al registrar con backend, usando datos locales:', error);
    
    // Fallback a registro local
    const { crearUsuario } = await import('../datos/datosSimulados.js');
    const nuevoUsuario = crearUsuario({
      nombre: userData.nombre || userData.email.split('@')[0],
      email: userData.email,
      password: userData.password,
      rol: 'cliente',
    });
    
    guardarUsuarioAutenticado(nuevoUsuario);
    return nuevoUsuario;
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

