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

// Log para debugging (siempre, para identificar problemas en producción)
console.log('🔧 API_BASE_URL configurada:', API_BASE_URL);
console.log('🔧 VITE_API_BASE_URL desde env:', import.meta.env.VITE_API_BASE_URL);
console.log('🔧 Entorno:', import.meta.env.MODE, import.meta.env.PROD ? '(PRODUCCIÓN)' : '(DESARROLLO)');

// Advertencia si estamos en producción pero usando localhost
if (import.meta.env.PROD && API_BASE_URL.includes('localhost')) {
  console.error('⚠️ ADVERTENCIA: Estás en PRODUCCIÓN pero usando localhost. Configura VITE_API_BASE_URL en Vercel.');
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
  
  // Log de debugging en desarrollo
  if (import.meta.env.DEV) {
    console.log(`🔍 API Request: ${options.method || 'GET'} ${url}`);
  }

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
    
    // Intentar parsear JSON, pero manejar errores de parseo
    let data = {};
    let responseText = '';
    try {
      responseText = await response.text();
      if (responseText) {
        data = JSON.parse(responseText);
      }
    } catch (parseError) {
      // Si no se puede parsear JSON, usar el texto como mensaje
      console.warn('No se pudo parsear respuesta JSON:', parseError);
      if (responseText) {
        data = { message: responseText };
      }
    }

    // Si el token expiró (401), intentar renovarlo
    if (response.status === 401 && !options.skipAuth) {
      try {
        const newToken = await refreshAccessToken();
        // Reintentar la petición con el nuevo token
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, { ...requestOptions, headers });
        const retryText = await retryResponse.text();
        let retryData = {};
        try {
          retryData = JSON.parse(retryText);
        } catch (e) {
          retryData = { message: retryText };
        }
        
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
      // Si es 404, dar mensaje más específico
      if (response.status === 404) {
        throw new Error(`Endpoint no encontrado (404): ${url}. Verifica que el endpoint exista en el backend.`);
      }
      
      // Para errores 500, intentar extraer mensaje más descriptivo
      if (response.status === 500) {
        let errorMsg = data.message || responseText || `Error del servidor (500): ${response.statusText}`;
        
        // Si el mensaje contiene información sobre campos faltantes, hacerlo más claro
        if (errorMsg.includes('usuarioEmail') || errorMsg.includes('usuario email') || errorMsg.includes('usuarioEmail due to missing')) {
          errorMsg = 'Error: El email del usuario es requerido pero no está disponible. Por favor, actualiza tu perfil con un email válido.';
        } else if (errorMsg.includes('JSON parse error')) {
          // Extraer información del error de parseo si está disponible
          const match = errorMsg.match(/JSON property (\w+) due to missing/);
          if (match) {
            errorMsg = `Error de validación: El campo '${match[1]}' es requerido pero no fue proporcionado.`;
          }
        }
        
        throw new Error(errorMsg);
      }
      
      throw new Error(data.message || responseText || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Error en petición API:', error);
    
    // Mejorar mensajes de error para diferentes tipos de fallos
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      // Error de red: CORS, conexión rechazada, servidor no disponible
      const esCors = error.message.includes('CORS') || error.message.includes('cors');
      const esLocalhost = API_BASE_URL.includes('localhost');
      const esProduccion = import.meta.env.PROD;
      
      let mensaje = '';
      
      // Si estamos en producción pero usando localhost, el problema es la variable de entorno
      if (esProduccion && esLocalhost) {
        mensaje = `⚠️ Variable de entorno faltante: VITE_API_BASE_URL no está configurada en Vercel. El frontend está intentando conectarse a ${API_BASE_URL} en lugar de la URL de producción. Ve a Vercel Dashboard → Settings → Environment Variables y agrega VITE_API_BASE_URL=https://siga-backend-production.up.railway.app`;
      } else if (esCors) {
        mensaje = `Error de CORS: El backend en ${API_BASE_URL} no permite conexiones desde este origen (${window.location.origin}). El equipo backend debe configurar CORS para permitir este dominio.`;
      } else {
        mensaje = `Error de conexión: No se pudo conectar con el servidor en ${API_BASE_URL}. Verifica que el backend esté funcionando y que la URL sea correcta.`;
      }
      
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
  return apiRequest('/comercial/auth/register', {
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

/**
 * Solicitar reset de contraseña
 */
export async function solicitarResetPassword(email) {
  return apiRequest('/comercial/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

/**
 * Cambiar contraseña con token de reset
 */
export async function cambiarPasswordConToken(token, newPassword) {
  return apiRequest('/comercial/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
    skipAuth: true,
  });
}

/**
 * Actualizar email del usuario autenticado
 * Requiere autenticación (JWT token)
 */
export async function updateEmail(newEmail, password) {
  return apiRequest('/comercial/auth/update-email', {
    method: 'PUT',
    body: JSON.stringify({ newEmail, password }),
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

