// Servicio centralizado para todas las llamadas a la API del backend
// Maneja autenticación, refresh tokens y errores de forma consistente

// Configuración de URLs
// Manejo de variables de entorno compatible con Vite y Karma
let API_BASE_URL = 'http://localhost:8080';
try {
  // Verificar si estamos en un entorno con import.meta (Vite)
  // En Vite, import.meta.env está disponible directamente
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  }
} catch (e) {
  // En entorno de tests o si import.meta no está disponible, usar valor por defecto
  API_BASE_URL = 'http://localhost:8080';
}

// Log para debugging (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔧 API_BASE_URL configurada:', API_BASE_URL);
  console.log('🔧 VITE_API_BASE_URL desde env:', import.meta.env.VITE_API_BASE_URL);
}

const API_URL = `${API_BASE_URL}/api`;

/**
 * Obtiene el token de acceso desde localStorage
 */
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

/**
 * Obtiene el refresh token desde localStorage
 */
function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

/**
 * Guarda los tokens en localStorage
 */
function saveTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
}

/**
 * Elimina los tokens de localStorage
 */
function clearTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/**
 * Renueva el token de acceso usando el refresh token
 */
async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No hay refresh token disponible');
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si el refresh falla, limpiar tokens y redirigir a login
      clearTokens();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error(data.message || 'Error al renovar token');
    }

    if (data.success && data.accessToken) {
      saveTokens(data.accessToken, null); // No actualizar refreshToken
      return data.accessToken;
    }

    throw new Error('Error al renovar token');
  } catch (error) {
    clearTokens();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw error;
  }
}

/**
 * Realiza una petición a la API con manejo automático de autenticación y refresh tokens
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = getAccessToken();

  // Configurar headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Agregar token de autenticación si existe
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Configurar opciones de la petición
  const requestOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    // Si el token expiró (401), intentar renovarlo
    if (response.status === 401 && !options.skipAuth) {
      try {
        const newToken = await refreshAccessToken();
        // Reintentar la petición con el nuevo token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, { ...requestOptions, headers });
        const retryData = await retryResponse.json();
        
        if (!retryResponse.ok) {
          throw new Error(retryData.message || 'Error en la solicitud');
        }
        
        return retryData;
      } catch (refreshError) {
        // Si el refresh falla, ya se redirigió a login
        throw refreshError;
      }
    }

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Error en petición API:', error);
    
    // Mejorar mensajes de error para diferentes tipos de fallos
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      // Error de red: CORS, conexión rechazada, servidor no disponible
      const esCors = error.message.includes('CORS') || error.message.includes('cors');
      
      // Detectar si es probablemente CORS (el backend responde pero bloquea por origen)
      const mensaje = esCors 
        ? `Error de CORS: El backend en ${API_BASE_URL} no permite conexiones desde este origen (${window.location.origin}). El equipo backend debe configurar CORS para permitir este dominio.`
        : `Error de conexión: No se pudo conectar con el servidor en ${API_BASE_URL}. Verifica que el backend esté funcionando y que la URL sea correcta.`;
      
      throw new Error(mensaje);
    }
    
    // Si el error ya tiene un mensaje descriptivo, mantenerlo
    if (error.message && !error.message.includes('Failed to fetch')) {
      throw error;
    }
    
    // Error genérico
    throw new Error(error.message || 'Error al conectar con el servidor');
  }
}

// ========== ENDPOINTS PÚBLICOS ==========

/**
 * Registrar nuevo usuario
 */
export async function registerUser(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true,
  });
}

/**
 * Iniciar sesión
 */
export async function loginUser(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });

  // Guardar tokens si el login fue exitoso
  if (data.success && data.accessToken) {
    saveTokens(data.accessToken, data.refreshToken);
  }

  return data;
}

/**
 * Obtener todos los planes disponibles
 */
export async function getPlanes() {
  return apiRequest('/comercial/planes', {
    skipAuth: true,
  });
}

/**
 * Obtener un plan específico por ID
 */
export async function getPlanById(planId) {
  return apiRequest(`/comercial/planes/${planId}`, {
    skipAuth: true,
  });
}

/**
 * Chat con el asistente comercial
 */
export async function chatComercial(message) {
  return apiRequest('/comercial/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    skipAuth: true,
  });
}

// ========== ENDPOINTS PROTEGIDOS ==========

/**
 * Obtener suscripciones del usuario autenticado
 */
export async function getSuscripciones() {
  return apiRequest('/comercial/suscripciones');
}

/**
 * Crear nueva suscripción
 */
export async function createSuscripcion(planId, periodo = 'MENSUAL') {
  return apiRequest('/comercial/suscripciones', {
    method: 'POST',
    body: JSON.stringify({ planId, periodo }),
  });
}

/**
 * Obtener token operativo para acceso a WebApp (SSO)
 * Intercambia el token comercial por un token operativo
 * @returns {Promise<{success: boolean, data?: {accessToken: string, webAppUrl?: string}, message?: string}>}
 */
export async function obtenerTokenOperativo() {
  return apiRequest('/comercial/auth/obtener-token-operativo', {
    method: 'POST',
    // El token comercial se envía automáticamente en el header Authorization
  });
}

// ========== FACTURAS ==========

/**
 * Crear una nueva factura
 */
export async function createFactura(facturaData) {
  return apiRequest('/comercial/facturas', {
    method: 'POST',
    body: JSON.stringify(facturaData),
  });
}

/**
 * Obtener todas las facturas del usuario autenticado
 */
export async function getFacturas() {
  return apiRequest('/comercial/facturas');
}

/**
 * Obtener una factura específica por ID
 */
export async function getFacturaById(facturaId) {
  return apiRequest(`/comercial/facturas/${facturaId}`);
}

/**
 * Obtener una factura por número de factura
 */
export async function getFacturaByNumero(numeroFactura) {
  return apiRequest(`/comercial/facturas/numero/${numeroFactura}`);
}

/**
 * Cerrar sesión (limpiar tokens)
 */
export function logout() {
  clearTokens();
}

/**
 * Verificar si el usuario está autenticado
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

// Exportar funciones de utilidad para uso avanzado
export { apiRequest, refreshAccessToken, getAccessToken, saveTokens, clearTokens };

