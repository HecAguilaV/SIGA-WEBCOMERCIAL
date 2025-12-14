import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerUsuarioAutenticado } from '../utils/auth.js';
import { getFacturaByNumero } from '../services/api.js';
import FacturaComponent from '../components/FacturaComponent.jsx';
import { CheckCircle, FileText } from 'phosphor-react';

// Página de confirmación de compra que muestra la factura generada
export default function CompraExitosaPage() {
  const navigate = useNavigate();
  const usuario = obtenerUsuarioAutenticado();
  const [factura, setFactura] = useState(null);
  const [mostrarFactura, setMostrarFactura] = useState(true);
  const [errorFactura, setErrorFactura] = useState('');

  // Cargar la factura generada al montar el componente
  useEffect(() => {
    const cargarFactura = async () => {
      // Verificar que haya un usuario autenticado
      if (!usuario || !usuario.id) {
        console.error('❌ No hay usuario autenticado');
        setErrorFactura('Debes iniciar sesión para ver tu factura.');
        return;
      }
      
      // Obtener el número de factura guardado en localStorage
      const numeroFactura = localStorage.getItem('siga_factura_actual');
      
      if (numeroFactura) {
        try {
          // Intentar obtener factura desde el backend
          const response = await getFacturaByNumero(numeroFactura);
          if (response.success && response.factura) {
            // CRÍTICO: Verificar que la factura pertenezca al usuario actual
            const facturaUsuarioId = response.factura.usuarioId || response.factura.userId;
            if (facturaUsuarioId && facturaUsuarioId !== usuario.id) {
              console.error('❌ La factura no pertenece al usuario actual:', {
                facturaUsuarioId,
                usuarioActualId: usuario.id
              });
              setErrorFactura('Esta factura no pertenece a tu cuenta.');
              localStorage.removeItem('siga_factura_actual'); // Limpiar factura incorrecta
              setFactura(null);
              return;
            }
            
            setFactura(response.factura);
          } else {
            throw new Error('Factura no encontrada en backend');
          }
        } catch (error) {
          console.error('Error al cargar factura desde backend:', error);
          setErrorFactura(error?.message || 'No se pudo cargar la factura desde el backend.');
          setFactura(null);
          // Limpiar factura inválida
          localStorage.removeItem('siga_factura_actual');
        }
      } else {
        setErrorFactura('No se encontró información de factura. Puedes ver tus facturas en tu perfil.');
      }
    };
    
    cargarFactura();
  }, [usuario]);

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
              <CheckCircle size={64} weight="fill" className="text-success mb-3" />
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
              <Link 
                to="/perfil" 
                className="btn btn-acento btn-lg"
                onClick={() => {
                  // Forzar actualización del usuario al ir al perfil
                  const usuario = obtenerUsuarioAutenticado();
                  if (usuario) {
                    // Disparar evento personalizado para que PerfilPage se actualice
                    window.dispatchEvent(new CustomEvent('usuarioActualizado'));
                  }
                }}
              >
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
                  <h4 className="mb-0 text-primario">
                    <FileText size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                    Factura de Compra
                  </h4>
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
                {errorFactura && (
                  <p className="mb-0 mt-2 text-danger">
                    {errorFactura}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


