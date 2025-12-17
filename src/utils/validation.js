/**
 * Utilidades de validación y formateo para SIGA
 */

/**
 * Valida un RUT chileno usando el algoritmo de Módulo 11
 * @param {string} rut - RUT a validar (formato 12345678-k o 12.345.678-k)
 * @returns {boolean} true si es válido
 */
export function validarRut(rut) {
    if (!rut) return false;

    // Limpiar formato (puntos y guión)
    const valor = rut.replace(/\./g, '').replace(/-/g, '');

    // Validar largo mínimo
    if (valor.length < 8) return false;

    // Separar cuerpo y dígito verificador
    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1).toUpperCase();

    // Validar que el cuerpo sean solo números
    if (!/^\d+$/.test(cuerpo)) return false;

    // Calcular DV esperado
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i)) * multiplo;
        if (multiplo < 7) multiplo += 1;
        else multiplo = 2;
    }

    const dvEsperado = 11 - (suma % 11);
    let dvCalculado = '';

    if (dvEsperado === 11) dvCalculado = '0';
    else if (dvEsperado === 10) dvCalculado = 'K';
    else dvCalculado = dvEsperado.toString();

    return dvCalculado === dv;
}

/**
 * Formatea un RUT (agrega puntos y guión)
 * @param {string} rut - RUT limpio o sucio
 * @returns {string} RUT formateado (12.345.678-K)
 */
export function formatearRut(rut) {
    if (!rut) return '';

    // Limpiar
    const valor = rut.replace(/\./g, '').replace(/-/g, '');

    if (valor.length <= 1) return valor;

    // Separar
    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1).toUpperCase();

    // Formatear cuerpo con puntos
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${cuerpoFormateado}-${dv}`;
}

/**
 * Valida un teléfono chileno (9 dígitos)
 * @param {string} telefono - Número de teléfono
 * @returns {boolean} true si es válido (9 dígitos)
 */
export function validarTelefono(telefono) {
    if (!telefono) return false;
    // Solo permitir dígitos y longitud exacta de 9
    return /^\d{9}$/.test(telefono);
}

/**
 * Limpia un teléfono recibiendo input con formato
 * @param {string} telefono 
 * @returns {string} Solo los 9 dígitos
 */
export function limpiarTelefono(telefono) {
    if (!telefono) return '';
    return telefono.replace(/\D/g, '').slice(0, 9);
}
