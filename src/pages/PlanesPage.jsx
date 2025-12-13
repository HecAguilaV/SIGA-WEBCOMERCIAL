import React, { useState, useEffect } from 'react';
import { getPlanes } from '../services/api.js';
import { leerPlanes } from '../datos/datosSimulados.js';
import { guardarPlanEnCarrito } from '../utils/auth.js';
import CardPlan from '../components/CardPlan.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/PlanesPage.css';

// Página que lista los planes de suscripción
// Integrada con backend real con fallback a datos locales
export default function PlanesPage() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Solo permitir “datos simulados” en desarrollo LOCAL
  const permitirFallbackLocal = import.meta.env.DEV && window.location.hostname === 'localhost';

  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        setError('');
        // Intentar cargar desde el backend real
        const response = await getPlanes();
        if (response.success && response.planes) {
          // Mapear los planes del backend al formato esperado
          const planesMapeados = response.planes.map(plan => ({
            id: plan.id,
            nombre: plan.nombre,
            precio: parseFloat(plan.precio) || 0, // ✅ CORREGIDO: usar 'precio' en lugar de 'precioMensual'
            unidad: plan.unidad || 'UF', // ✅ CORREGIDO: usar unidad del backend (UF)
            esFreemium: plan.esFreemium || plan.precio === 0,
            caracteristicas: plan.caracteristicas && plan.caracteristicas.length > 0 
              ? plan.caracteristicas // ✅ Usar características del backend si existen
              : [ // Fallback: construir características desde otros campos
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
          throw new Error('No se pudieron cargar los planes');
        }
      } catch (error) {
        if (!permitirFallbackLocal) {
          console.error('Error al cargar planes del backend:', error);
          setPlanes([]);
          setError(error?.message || 'No se pudieron cargar los planes desde el backend.');
        } else {
          console.warn('Error al cargar planes del backend, usando datos locales:', error);
          // Fallback a datos locales
          setPlanes(leerPlanes());
        }
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
          <div className="row">
            {planes.map((plan) => (
              <CardPlan key={plan.id} plan={plan} onSeleccionar={manejarSeleccion} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


