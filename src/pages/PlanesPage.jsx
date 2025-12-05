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

  useEffect(() => {
    const cargarPlanes = async () => {
      try {
        // Intentar cargar desde el backend real
        const response = await getPlanes();
        if (response.success && response.planes) {
          // Mapear los planes del backend al formato esperado
          const planesMapeados = response.planes.map(plan => ({
            id: plan.id,
            nombre: plan.nombre,
            precio: parseFloat(plan.precioMensual) || 0,
            unidad: 'CLP',
            esFreemium: plan.precioMensual === '0' || plan.precioMensual === 0,
            caracteristicas: [
              plan.descripcion || 'Plan de suscripción',
              `${plan.limiteBodegas || 1} bodega${plan.limiteBodegas > 1 ? 's' : ''}`,
              `${plan.limiteUsuarios || 1} usuario${plan.limiteUsuarios > 1 ? 's' : ''}`,
            ],
          }));
          setPlanes(planesMapeados);
        } else {
          throw new Error('No se pudieron cargar los planes');
        }
      } catch (error) {
        console.warn('Error al cargar planes del backend, usando datos locales:', error);
        // Fallback a datos locales
        setPlanes(leerPlanes());
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


