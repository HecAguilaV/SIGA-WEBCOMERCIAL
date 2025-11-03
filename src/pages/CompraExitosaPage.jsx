import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerUsuarioAutenticado } from '../utils/auth.js';
import { obtenerFacturaPorNumero } from '../datos/datosSimulados.js';
import FacturaComponent from '../components/FacturaComponent.jsx';

// Página de confirmación de compra que muestra la factura generada
export default function CompraExitosaPage() {
  const navigate = useNavigate();
  const usuario = obtenerUsuarioAutenticado();
  const [factura, setFactura] = useState(null);
  const [mostrarFactura, setMostrarFactura] = useState(true);

  // Cargar la factura generada al montar el componente
  useEffect(() => {
    // Obtener el número de factura guardado en localStorage
    const numeroFactura = localStorage.getItem('siga_factura_actual');
    
    if (numeroFactura) {
      // Buscar la factura por su número
      const facturaEncontrada = obtenerFacturaPorNumero(numeroFactura);
      setFactura(facturaEncontrada);
      
      // Limpiar el número de factura del localStorage después de cargarlo
      // (opcional: puedes mantenerlo si quieres que persista)
      // localStorage.removeItem('siga_factura_actual');
    }
  }, []);

  // Función para manejar la impresión de la factura
  const manejarImprimir = () => {
    window.print();
  };

  return (
    <section className="py-5">
      <div className="container">
        {/* Mensaje de éxito */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8 text-center">
            <div className="mb-4">
              <div className="display-1 mb-3">✅</div>
              <h2 className="text-success mb-3">¡Compra exitosa!</h2>
              <p className="lead">
                Gracias por suscribirte a SIGA. Tu plan ha sido activado correctamente.
              </p>
              <p className="text-muted">
                Tu factura ha sido generada y está disponible a continuación para su descarga o impresión.
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
              <Link to="/perfil" className="btn btn-acento btn-lg">
                Ver mi Plan
              </Link>
              <Link to="/app" className="btn btn-outline-primary btn-lg">
                Ir a SIGA
              </Link>
              <Link to="/" className="btn btn-outline-secondary btn-lg">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        {/* Componente de factura */}
        {factura && mostrarFactura && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 text-primario">📄 Factura de Compra</h4>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setMostrarFactura(!mostrarFactura)}
                  >
                    {mostrarFactura ? 'Ocultar Factura' : 'Mostrar Factura'}
                  </button>
                </div>
                <div className="card-body">
                  <FacturaComponent factura={factura} onImprimir={manejarImprimir} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje si no hay factura (por si acaso) */}
        {!factura && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="alert alert-info text-center">
                <p className="mb-0">
                  Tu compra se ha procesado correctamente. 
                  Puedes ver tus facturas en tu{' '}
                  <Link to="/perfil" className="alert-link">
                    panel de usuario
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


