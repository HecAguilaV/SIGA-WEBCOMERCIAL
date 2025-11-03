import React, { useState, useEffect } from 'react';
import Boton from './Boton.jsx';
import { convertirUFaCLP, formatearPrecioCLP } from '../utils/indicadoresEconomicos.js';

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

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-primario">{plan.nombre}</h5>
          <div className="mb-3">
            <p className="card-text mb-1">
              <span className="fs-3 fw-bold text-primario">{plan.precio}</span>
              <span className="ms-1">{plan.unidad}/mes</span>
            </p>
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
          <ul className="list-unstyled flex-grow-1">
            {plan.caracteristicas.map((c, i) => (
              <li key={i} className="mb-1">• {c}</li>
            ))}
          </ul>
          <Boton texto="Seleccionar Plan" onClick={() => onSeleccionar(plan)} clase="btn btn-acento mt-auto" />
        </div>
      </div>
    </div>
  );
}


