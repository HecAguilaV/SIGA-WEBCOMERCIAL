import React, { useState, useEffect } from 'react';
import { getPlanes } from '../services/api.js';
import { guardarPlanEnCarrito } from '../utils/auth.js';
import CardPlan from '../components/CardPlan.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/PlanesPage.css';

// Página que lista los planes de suscripción
// Integrada con backend real (sin fallbacks en producción)
export default function PlanesPage() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        setError('');
        // Cargar desde el backend real (sin fallbacks en producción)
        const response = await getPlanes();
        if (response.success && response.planes) {
          // Mapear los planes del backend al formato esperado
          const planesMapeados = response.planes.map(plan => ({
            id: plan.id,
            nombre: plan.nombre,
            precio: parseFloat(plan.precio) || 0,
            unidad: plan.unidad || 'UF',
            esFreemium: false, // Ya no hay planes gratuitos permanentes, solo free trial temporal
            caracteristicas: plan.caracteristicas && plan.caracteristicas.length > 0 
              ? plan.caracteristicas
              : [ // Construir características desde otros campos si no vienen del backend
                  plan.descripcion || 'Plan de suscripción',
                  plan.limiteBodegas !== null && plan.limiteBodegas !== undefined
                    ? `${plan.limiteBodegas === -1 ? 'Ilimitadas' : plan.limiteBodegas} bodega${plan.limiteBodegas !== 1 ? 's' : ''}`
                    : 'Bodegas ilimitadas',
                  plan.limiteUsuarios !== null && plan.limiteUsuarios !== undefined
                    ? `${plan.limiteUsuarios === -1 ? 'Ilimitados' : plan.limiteUsuarios} usuario${plan.limiteUsuarios !== 1 ? 's' : ''}`
                    : 'Usuarios ilimitados',
                ],
          }));
          setPlanes(planesMapeados);
        } else {
          throw new Error('No se pudieron cargar los planes desde el backend');
        }
      } catch (error) {
        console.error('Error al cargar planes del backend:', error);
        
        // En producción: mostrar error claro, sin fallbacks
        let mensajeError = 'No se pudieron cargar los planes desde el backend.';
        
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          mensajeError = 'Error de conexión: No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error.message?.includes('CORS')) {
          mensajeError = 'Error de CORS: El servidor no permite la conexión desde este origen.';
        } else if (error.message?.includes('404')) {
          mensajeError = 'Error 404: El endpoint de planes no fue encontrado en el backend.';
        } else if (error.message) {
          mensajeError = `Error: ${error.message}`;
        }
        
        setPlanes([]);
        setError(mensajeError);
      } finally {
        setLoading(false);
      }
    };

    cargarPlanes();
  }, []);

  const manejarSeleccion = (plan) => {
    guardarPlanEnCarrito(plan);
    navigate('/carrito');
  };

  return (
    <section className="planes-section">
      {/* Fondo animado con destellos */}
      <div className="planes-background">
        <div className="planes-glow planes-glow-1"></div>
        <div className="planes-glow planes-glow-2"></div>
      </div>

      <div className="container planes-content">
        <h1 className="planes-title">Planes de Suscripción</h1>
        <p className="planes-subtitle">
          Elige el plan perfecto para tu negocio y comienza a crecer sin límites
        </p>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primario" role="status">
              <span className="visually-hidden">Cargando planes...</span>
            </div>
            <p className="mt-3 text-muted">Cargando planes disponibles...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        ) : planes.length === 0 ? (
          <div className="alert alert-info text-center">
            No hay planes disponibles en este momento.
          </div>
        ) : (
          <div className="row justify-content-center">
            {planes.map((plan) => (
              <CardPlan key={plan.id} plan={plan} onSeleccionar={manejarSeleccion} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
