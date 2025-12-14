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

// Bandera para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false;
let refreshPromise = null;

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
 * Evita múltiples intentos simultáneos
 */
async function refreshAccessToken() {
  // Si ya hay un refresh en curso, esperar a que termine
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  
  isRefreshing = true;
  refreshPromise = (async () => {
    try {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No hay refresh token disponible');
  }

      const response = await fetch(`${API_URL}/comercial/auth/refresh`, {
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
        saveTokens(data.accessToken, data.refreshToken || refreshToken);
      return data.accessToken;
    }

    throw new Error('Error al renovar token');
  } catch (error) {
    clearTokens();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
  }
  })();
  
  return refreshPromise;
}

/**
 * Realiza una petición a la API con manejo automático de autenticación y refresh tokens
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = getAccessToken();
  
  // Log de debugging SIEMPRE para diagnosticar problemas
  console.log(`🔍 API Request: ${options.method || 'GET'} ${url}`);
  console.log(`📍 Endpoint: ${endpoint}`);
  
  // Verificar que el endpoint sea correcto (especialmente para suscripciones)
  if (endpoint.includes('suscripcion') && !endpoint.includes('suscripciones')) {
    console.error('❌ ERROR CRÍTICO: Endpoint incorrecto detectado!');
    console.error('❌ Debe ser /comercial/suscripciones (plural)');
    console.error('❌ Endpoint recibido:', endpoint);
  }
  
  if (token && !options.skipAuth) {
    console.log('🔑 Token presente:', token.substring(0, 20) + '...');
  } else if (!options.skipAuth) {
    console.warn('⚠️ No hay token disponible para esta petición');
  }

  // Configurar headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Agregar token de autenticación si existe
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (!options.skipAuth) {
    console.warn('⚠️ Petición requiere autenticación pero no hay token disponible');
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

    // Si el token expiró (401), intentar renovarlo (solo una vez)
    if (response.status === 401 && !options.skipAuth && !options.skipRefresh) {
      try {
        const newToken = await refreshAccessToken();
        // Reintentar la petición con el nuevo token (solo una vez)
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, { 
          ...requestOptions, 
          headers,
          skipRefresh: true // Evitar bucle infinito
        });
        const retryText = await retryResponse.text();
        let retryData = {};
        try {
          retryData = JSON.parse(retryText);
        } catch (e) {
          retryData = { message: retryText };
        }
        
        if (!retryResponse.ok) {
          // Si el retry también falla, no intentar de nuevo
          const errorMsg = retryData.message || 'Error en la solicitud';
          throw new Error(errorMsg);
        }
        
        return retryData;
      } catch (refreshError) {
        // Si el refresh falla, ya se redirigió a login o limpió tokens
        throw refreshError;
      }
    }

    if (!response.ok) {
      // Log de error SIEMPRE para diagnosticar problemas
      console.error(`❌ API Error: ${response.status} ${response.statusText}`, {
        endpoint,
        url,
        fullUrl: url,
        responseData: data,
        hasToken: !!token,
        method: options.method || 'GET',
        requestBody: options.body ? JSON.parse(options.body) : null
      });
      
      // Si es 404, verificar si es un error de recurso no encontrado (válido para usuarios nuevos)
      if (response.status === 404) {
        // Para endpoints que pueden retornar 404 cuando no hay datos (facturas, suscripciones)
        // No lanzar error, retornar respuesta con success: false para que el componente lo maneje
        if (endpoint.includes('/facturas') || endpoint.includes('/suscripciones')) {
          return { success: false, facturas: [], suscripciones: [], message: 'No se encontraron datos' };
        }
        // Para otros endpoints, lanzar error
        throw new Error(`Endpoint no encontrado (404): ${url}. Verifica que el endpoint exista en el backend.`);
      }
      
      // Manejar errores específicos según las instrucciones del backend
      if (response.status === 401) {
        // Puede ser token inválido o contraseña incorrecta
        const errorMsg = data.message || 'No autenticado o contraseña incorrecta';
        throw new Error(errorMsg);
      }
      
      if (response.status === 403) {
        // Forbidden - Usuario no tiene permisos o falta validación
        let errorMsg = data.message || 'No tienes permisos para realizar esta acción';
        
        // Mensajes más específicos según el contexto
        if (endpoint.includes('/suscripciones')) {
          errorMsg = data.message || 'No tienes permisos para crear suscripciones. Verifica que tu cuenta esté activa y que tengas un email registrado.';
        } else if (endpoint.includes('/facturas')) {
          errorMsg = data.message || 'No tienes permisos para crear facturas. Verifica que tu cuenta esté activa y que tengas un email registrado.';
        }
        
        console.error('❌ Error 403 (Forbidden):', {
          endpoint,
          message: errorMsg,
          responseData: data
        });
        
        throw new Error(errorMsg);
      }
      
      if (response.status === 409) {
        // Email ya en uso
        const errorMsg = data.message || 'El email ya está en uso por otro usuario';
        throw new Error(errorMsg);
      }
      
      if (response.status === 400) {
        // Email igual al actual u otro error de validación
        const errorMsg = data.message || 'El nuevo email es igual al actual';
        throw new Error(errorMsg);
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
      
      // Otros errores: usar mensaje del backend si está disponible
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
  // Log de debugging para ver qué se envía al backend
  console.log('📤 Enviando datos de registro al backend:', {
    nombre: userData.nombre,
    email: userData.email,
    nombreEmpresa: userData.nombreEmpresa,
    tienePassword: !!userData.password
  });
  
  const response = await apiRequest('/comercial/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true,
  });
  
  // Log de respuesta del backend
  // Log sanitizado (sin tokens) solo en desarrollo
  if (import.meta.env.DEV) {
    const responseSanitized = { ...response };
    if (responseSanitized.accessToken) delete responseSanitized.accessToken;
    if (responseSanitized.refreshToken) delete responseSanitized.refreshToken;
    if (responseSanitized.token) delete responseSanitized.token;
    console.log('📥 Respuesta del backend en registerUser (sanitizada):', responseSanitized);
  }
  
  return response;
}

/**
 * Iniciar sesión (comercial)
 */
export async function loginUser(email, password) {
  const data = await apiRequest('/comercial/auth/login', {
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

/**
 * Actualizar perfil del usuario autenticado
 * Permite actualizar: nombre, apellido, rut, telefono, nombreEmpresa
 * Todos los campos son opcionales
 * Requiere autenticación (JWT token)
 */
export async function updatePerfil(perfilData) {
  return apiRequest('/comercial/auth/perfil', {
    method: 'PUT',
    body: JSON.stringify(perfilData),
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
  // IMPORTANTE: El endpoint correcto es /comercial/suscripciones (plural)
  const endpoint = '/comercial/suscripciones';
  console.log('📤 createSuscripcion llamado:', { planId, periodo, endpoint });
  
  return apiRequest(endpoint, {
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

