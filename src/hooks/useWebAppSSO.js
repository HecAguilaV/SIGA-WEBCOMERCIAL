import { useState } from 'react';
import { refreshAccessToken, obtenerTokenOperativo } from '../services/api.js';

/**
 * Hook para manejar la lógica de SSO hacia la WebApp
 * @returns {Object} { loading, error, iniciarSSO }
 */
export function useWebAppSSO() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const iniciarSSO = async (usuario) => {
        setLoading(true);
        setError('');

        try {
            if (!usuario) {
                throw new Error('Usuario no autenticado');
            }

            console.log('🔄 Iniciando SSO...');

            // Paso Crítico: Forzar la renovación del token para asegurar que sea fresco (recién creado)
            // Esto evita el error de "Token Expirado" al llegar a la WebApp
            await refreshAccessToken();

            // Obtener token operativo mediante SSO (ahora con credenciales frescas)
            const ssoResponse = await obtenerTokenOperativo();

            if (!ssoResponse.success) {
                let errorMsg = ssoResponse.message || 'No se pudo obtener acceso a WebApp';

                if (ssoResponse.message?.includes('suscripción') || ssoResponse.message?.includes('suscripcion')) {
                    errorMsg = 'No tienes una suscripción activa. Por favor adquiere un plan primero.';
                } else if (ssoResponse.message?.includes('401') || ssoResponse.message?.includes('No autenticado')) {
                    errorMsg = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
                }

                throw new Error(errorMsg);
            }

            // El accessToken puede estar en ssoResponse.accessToken o ssoResponse.data.accessToken
            const tokenOperativo = ssoResponse.accessToken || ssoResponse.data?.accessToken;

            if (!tokenOperativo) {
                throw new Error('No se recibió token de acceso. Por favor, intenta nuevamente.');
            }

            // URL de WebApp: usar la del backend si viene, sino usar la URL de producción configurada
            // PRIORIDAD: 1. Backend, 2. Variable entorno, 3. Hardcoded (nueva URL)
            const webAppUrl = ssoResponse.webAppUrl ||
                ssoResponse.data?.webAppUrl ||
                import.meta.env.VITE_WEBAPP_URL ||
                'https://siga-webapp.vercel.app/';

            console.log('✅ SSO exitoso. Redirigiendo a:', webAppUrl);

            // Guardar URL del portal comercial para que WebApp pueda redirigir de vuelta si es necesario
            localStorage.setItem('siga_portal_comercial_url', window.location.origin);

            // Redirigir a WebApp con token en URL (Ruta específica /sso)
            const baseUrl = webAppUrl.endsWith('/') ? webAppUrl.slice(0, -1) : webAppUrl;
            window.location.href = `${baseUrl}/sso?token=${tokenOperativo}`;

        } catch (err) {
            console.error('❌ Error en SSO:', err);
            
            // Si es un error de conexión, disparar evento para mostrar página de mantenimiento
            if (err.message?.includes('Failed to fetch') || err.message?.includes('conexión')) {
                window.dispatchEvent(new CustomEvent('backend-connection-error'));
            }
            
            setError(err.message || 'Error al conectar con la aplicación');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, iniciarSSO };
}
