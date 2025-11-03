import React from 'react';
import { formatearPrecioCLP } from '../utils/indicadoresEconomicos.js';
import { Rocket, CheckCircle, ClipboardText, User, Package, CreditCard, Printer } from 'phosphor-react';

/**
 * Componente de Factura que muestra los detalles de una compra
 * Diseñado para ser imprimible con estilos CSS especiales para impresión
 * 
 * @param {object} factura - Objeto con los datos de la factura
 * @param {function} onImprimir - Función que se ejecuta cuando se hace clic en "Imprimir"
 */
export default function FacturaComponent({ factura, onImprimir }) {
  if (!factura) {
    return null;
  }

  // Formatear fecha para mostrar
  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Formatear fecha simple (solo fecha, sin hora)
  const formatearFechaSimple = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Función para imprimir la factura
  const manejarImprimir = () => {
    if (onImprimir) {
      onImprimir();
    } else {
      // Si no hay función personalizada, usar window.print()
      window.print();
    }
  };

  return (
    <div className="factura-container">
      {/* Estilos CSS para impresión - se ocultan elementos no necesarios al imprimir */}
      <style>{`
        @media print {
          /* Ocultar elementos de navegación y botones al imprimir */
          .no-imprimir {
            display: none !important;
          }
          
          /* Configurar márgenes y tamaño de página */
          @page {
            margin: 1.5cm;
          }
          
          /* Estilos para la factura al imprimir */
          .factura-container {
            box-shadow: none !important;
            border: none !important;
          }
          
          /* Asegurar que el fondo sea blanco */
          body {
            background: white !important;
          }
        }
        
        /* Estilos para el componente de factura */
        .factura-container {
          background: white;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border-radius: 8px;
        }
        
        .factura-header {
          border-bottom: 3px solid #03045E;
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .factura-logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #03045E;
          margin-bottom: 0.5rem;
        }
        
        .factura-numero {
          font-size: 1.2rem;
          color: #666;
          font-weight: bold;
        }
        
        .factura-estado {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .estado-pagada {
          background-color: #d4edda;
          color: #155724;
        }
        
        .factura-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .factura-seccion h5 {
          color: #03045E;
          font-weight: bold;
          margin-bottom: 1rem;
          border-bottom: 2px solid #00B4D8;
          padding-bottom: 0.5rem;
        }
        
        .factura-item {
          margin-bottom: 0.75rem;
        }
        
        .factura-item strong {
          color: #03045E;
        }
        
        .factura-detalles {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #eee;
        }
        
        .factura-tabla {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
        }
        
        .factura-tabla th {
          background-color: #03045E;
          color: white;
          padding: 1rem;
          text-align: left;
        }
        
        .factura-tabla td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .factura-tabla tr:last-child td {
          border-bottom: none;
        }
        
        .factura-total {
          text-align: right;
          margin-top: 1rem;
        }
        
        .factura-total .total-label {
          font-size: 1.2rem;
          font-weight: bold;
          color: #03045E;
        }
        
        .factura-total .total-monto {
          font-size: 1.5rem;
          font-weight: bold;
          color: #00B4D8;
          margin-top: 0.5rem;
        }
        
        .factura-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #eee;
          text-align: center;
          color: #666;
          font-size: 0.9rem;
        }
      `}</style>

      {/* Contenedor principal de la factura */}
      <div className="factura-container">
        {/* Encabezado de la factura */}
        <div className="factura-header">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <div className="factura-logo">
                <Rocket size={24} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                SIGA - Sistema Inteligente de Gestión de Activos
              </div>
              <div className="text-muted">Portal Comercial</div>
            </div>
            <div className="text-end">
              <div className="factura-numero">{factura.numeroFactura}</div>
              <div className="factura-estado estado-pagada mt-2">
                <CheckCircle size={16} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
                {factura.estado.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Información del emisor y cliente */}
        <div className="factura-info">
          {/* Información de SIGA (Emisor) */}
          <div className="factura-seccion">
            <h5>
              <ClipboardText size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
              Emisor
            </h5>
            <div className="factura-item">
              <strong>SIGA S.A.</strong>
            </div>
            <div className="factura-item">
              <strong>RUT:</strong> 76.123.456-7
            </div>
            <div className="factura-item">
              <strong>Dirección:</strong> Los Cerezos 21, Puerto Montt, Chile
            </div>
            <div className="factura-item">
              <strong>Email:</strong> facturacion@siga.com
            </div>
            <div className="factura-item">
              <strong>Teléfono:</strong> +56 2 2345 6789
            </div>
          </div>

          {/* Información del cliente */}
          <div className="factura-seccion">
            <h5>
              <User size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
              Cliente
            </h5>
            <div className="factura-item">
              <strong>Nombre:</strong> {factura.usuarioNombre}
            </div>
            <div className="factura-item">
              <strong>Email:</strong> {factura.usuarioEmail}
            </div>
            <div className="factura-item">
              <strong>Fecha de compra:</strong> {formatearFecha(factura.fechaCompra)}
            </div>
            {factura.fechaVencimiento && (
              <div className="factura-item">
                <strong>Próximo pago:</strong> {formatearFechaSimple(factura.fechaVencimiento)}
              </div>
            )}
          </div>
        </div>

        {/* Detalles de la compra */}
        <div className="factura-detalles">
          <h5 className="mb-3" style={{ color: '#03045E', fontWeight: 'bold' }}>
            <Package size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
            Detalles de la Compra
          </h5>
          
          <table className="factura-tabla">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{factura.planNombre}</strong>
                  <br />
                  <small className="text-muted">Suscripción mensual</small>
                </td>
                <td>1</td>
                <td>
                  <strong>{factura.precioUF} {factura.unidad}</strong>
                  {factura.precioCLP && (
                    <div className="text-muted small">
                      ≈ {formatearPrecioCLP(factura.precioCLP)}
                    </div>
                  )}
                </td>
                <td>
                  <strong>{factura.precioUF} {factura.unidad}</strong>
                  {factura.precioCLP && (
                    <div className="text-muted small">
                      ≈ {formatearPrecioCLP(factura.precioCLP)}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="factura-total">
            <div className="total-label">Total a Pagar:</div>
            <div className="total-monto">
              {factura.precioUF} {factura.unidad}
              {factura.precioCLP && (
                <div className="text-muted" style={{ fontSize: '1rem', marginTop: '0.25rem' }}>
                  ≈ {formatearPrecioCLP(factura.precioCLP)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Información de pago */}
        <div className="factura-detalles">
          <h5 className="mb-3" style={{ color: '#03045E', fontWeight: 'bold' }}>
            <CreditCard size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
            Información de Pago
          </h5>
          <div className="factura-item">
            <strong>Método de pago:</strong> {factura.metodoPago}
          </div>
          {factura.ultimos4Digitos && factura.ultimos4Digitos !== '****' && (
            <div className="factura-item">
              <strong>Tarjeta:</strong> •••• {factura.ultimos4Digitos}
            </div>
          )}
          <div className="factura-item">
            <strong>Estado:</strong> <span className="badge bg-success">Pagada</span>
          </div>
        </div>

        {/* Pie de página */}
        <div className="factura-footer">
          <p className="mb-2">
            <strong>Gracias por tu compra</strong>
          </p>
          <p className="mb-0">
            Esta es una factura electrónica válida para efectos tributarios.
            <br />
            Para consultas, contacta a: facturacion@siga.com
            <br />
            <small className="text-muted">
              Factura generada el {formatearFecha(factura.fechaCompra)}
            </small>
          </p>
        </div>

        {/* Botón de imprimir (se oculta al imprimir) */}
        <div className="no-imprimir text-center mt-4">
          <button className="btn btn-acento btn-lg" onClick={manejarImprimir}>
            <Printer size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
            Imprimir Factura
          </button>
        </div>
      </div>
    </div>
  );
}

