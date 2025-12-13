import React, { useState, useEffect } from 'react';
import { convertirUFaCLP, formatearPrecioCLP } from '../utils/indicadoresEconomicos.js';
import { CheckCircle } from 'phosphor-react';

// Tarjeta de plan de suscripción, muestra nombre, precio y características
// Muestra el precio en UF y también la conversión aproximada a CLP
export default function CardPlan({ plan, onSeleccionar }) {
  const [precioCLP, setPrecioCLP] = useState(null);
  const [cargandoPrecio, setCargandoPrecio] = useState(true);

  useEffect(() => {
    // Cargar precio en CLP cuando el componente se monte
    const cargarPrecioCLP = async () => {
      setCargandoPrecio(true);
      try {
        const precio = await convertirUFaCLP(plan.precio);
        setPrecioCLP(precio);
      } catch (error) {
        console.error('Error al cargar precio en CLP:', error);
      } finally {
        setCargandoPrecio(false);
      }
    };

    cargarPrecioCLP();
  }, [plan.precio]);

  const isFeatured = plan.nombre === 'Emprendedor Pro';

  return (
    <div className="col-lg-6 col-md-6 mb-4">
      <div className={`plan-card-glass ${isFeatured ? 'featured' : ''}`}>
        {/* Ya no hay planes gratuitos permanentes, solo free trial temporal */}
        
        <h3 className="plan-name">{plan.nombre}</h3>

        <div className="mb-3">
          <div className="plan-price">
            {plan.precio}
            <span className="plan-price-unit"> {plan.unidad}/mes</span>
          </div>
          {!cargandoPrecio && precioCLP && (
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              ≈ {formatearPrecioCLP(precioCLP)}/mes
            </p>
          )}
          {cargandoPrecio && (
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              <span className="spinner-border spinner-border-sm me-1" role="status"></span>
              Calculando precio...
            </p>
          )}
        </div>

        <ul className="plan-features">
          {plan.caracteristicas.map((c, i) => (
            <li key={i}>
              <CheckCircle size={20} weight="fill" color="#00b4d8" />
              <span>{c}</span>
            </li>
          ))}
        </ul>

        <button className="plan-button" onClick={() => onSeleccionar(plan)}>
          Seleccionar Plan
        </button>
      </div>
    </div>
  );
}


