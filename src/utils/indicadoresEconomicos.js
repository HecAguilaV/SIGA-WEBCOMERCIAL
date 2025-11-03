// Servicio para obtener indicadores económicos de Chile (UF y USD)
// Utiliza la API pública gratuita de mindicador.cl
// La UF se actualiza diariamente y es ideal para mantener precios estables

const API_BASE = 'https://mindicador.cl/api';

// Cache simple para evitar demasiadas peticiones
let cache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene los valores actuales de UF y USD desde la API de mindicador.cl
 * @returns {Promise<{uf: number, usd: number, fecha: string}>}
 */
export async function obtenerIndicadoresEconomicos() {
  // Verificar cache
  if (cache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cache;
  }

  try {
    // Hacer petición a la API
    const response = await fetch(API_BASE);
    
    if (!response.ok) {
      throw new Error('Error al obtener indicadores económicos');
    }

    const data = await response.json();
    
    // Extraer valores de UF y USD
    const uf = data.uf?.valor || 0;
    const usd = data.dolar?.valor || 0;
    const fecha = data.uf?.fecha || data.dolar?.fecha || new Date().toISOString();

    const resultado = {
      uf,
      usd,
      fecha,
    };

    // Guardar en cache
    cache = resultado;
    cacheTimestamp = Date.now();

    return resultado;
  } catch (error) {
    console.error('Error al obtener indicadores económicos:', error);
    
    // Retornar valores por defecto si falla la API
    // Estos son valores aproximados de referencia (actualizar manualmente si es necesario)
    return {
      uf: 38000, // Valor aproximado de UF en CLP
      usd: 950, // Valor aproximado de USD en CLP
      fecha: new Date().toISOString(),
    };
  }
}

/**
 * Convierte un precio en UF a CLP
 * @param {number} precioUF - Precio en UF
 * @returns {Promise<number>} Precio en CLP
 */
export async function convertirUFaCLP(precioUF) {
  const indicadores = await obtenerIndicadoresEconomicos();
  return Math.round(precioUF * indicadores.uf);
}

/**
 * Convierte un precio en USD a CLP
 * @param {number} precioUSD - Precio en USD
 * @returns {Promise<number>} Precio en CLP
 */
export async function convertirUSDaCLP(precioUSD) {
  const indicadores = await obtenerIndicadoresEconomicos();
  return Math.round(precioUSD * indicadores.usd);
}

/**
 * Formatea un número como precio en CLP
 * @param {number} precio - Precio en CLP
 * @returns {string} Precio formateado (ej: "$38.000")
 */
export function formatearPrecioCLP(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}

