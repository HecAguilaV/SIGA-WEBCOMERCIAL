import React from 'react';
import { leerPlanes } from '../datos/datosSimulados.js';
import { guardarPlanEnCarrito } from '../utils/auth.js';
import CardPlan from '../components/CardPlan.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/PlanesPage.css';

// Página que lista los planes de suscripción desde datos simulados
export default function PlanesPage() {
  const navigate = useNavigate();
  const planes = leerPlanes();

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

        <div className="row">
          {planes.map((plan) => (
            <CardPlan key={plan.id} plan={plan} onSeleccionar={manejarSeleccion} />
          ))}
        </div>
      </div>
    </section>
  );
}


