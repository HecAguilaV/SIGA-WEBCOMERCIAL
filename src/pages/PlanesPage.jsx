import React from 'react';
import { leerPlanes } from '../datos/datosSimulados.js';
import { guardarPlanEnCarrito } from '../utils/auth.js';
import CardPlan from '../components/CardPlan.jsx';
import { useNavigate } from 'react-router-dom';

// Página que lista los planes de suscripción desde datos simulados
export default function PlanesPage() {
  const navigate = useNavigate();
  const planes = leerPlanes();

  const manejarSeleccion = (plan) => {
    guardarPlanEnCarrito(plan);
    navigate('/carrito');
  };

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="mb-4 text-primario">Planes de Suscripción</h2>
        <div className="row">
          {planes.map((plan) => (
            <CardPlan key={plan.id} plan={plan} onSeleccionar={manejarSeleccion} />
          ))}
        </div>
      </div>
    </section>
  );
}


