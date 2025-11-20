import React from 'react';
import { Link } from 'react-router-dom';
import { leerUsuarios, leerPlanes } from '../../datos/datosSimulados.js';
import { Users, User, Package, Lock, CheckCircle, Warning, ClipboardText, Lightning, Lightbulb, House } from 'phosphor-react';

// Dashboard del administrador con métricas completas del portal comercial SIGA
export default function AdminDashboardPage() {
  const usuarios = leerUsuarios();
  const planes = leerPlanes();
  
  // Cálculos de métricas
  const totalUsuarios = usuarios.length;
  const totalClientes = usuarios.filter(u => u.rol === 'cliente').length;
  const totalAdmins = usuarios.filter(u => u.rol === 'admin').length;
  const totalPlanes = planes.length;
  
  // Planes más populares (simulación - en producción vendría de datos de ventas)
  const planesPopulares = planes.slice(0, 3);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primario mb-0">Dashboard Administrativo</h2>
        <span className="badge bg-acento text-white px-3 py-2">Portal Comercial SIGA</span>
      </div>

      {/* Tarjetas de métricas principales */}
      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="mb-2">
                <Users size={48} weight="fill" className="text-primario" />
              </div>
              <div className="fw-bold text-muted mb-2">Total Usuarios</div>
              <div className="display-4 fw-bold text-primario">{totalUsuarios}</div>
              <small className="text-muted">
                {totalClientes} clientes, {totalAdmins} administradores
              </small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="mb-2">
                <User size={48} weight="fill" className="text-secundario" />
              </div>
              <div className="fw-bold text-muted mb-2">Clientes Activos</div>
              <div className="display-4 fw-bold text-secundario">{totalClientes}</div>
              <small className="text-muted">Usuarios con rol cliente</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="mb-2">
                <Package size={48} weight="fill" className="text-acento" />
              </div>
              <div className="fw-bold text-muted mb-2">Planes Disponibles</div>
              <div className="display-4 fw-bold text-acento">{totalPlanes}</div>
              <small className="text-muted">Suscripciones configuradas</small>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center">
              <div className="mb-2">
                <Lock size={48} weight="fill" className="text-primario" />
              </div>
              <div className="fw-bold text-muted mb-2">Administradores</div>
              <div className="display-4 fw-bold text-primario">{totalAdmins}</div>
              <small className="text-muted">Usuarios con permisos admin</small>
            </div>
          </div>
        </div>
      </div>

      {/* Información de suscripciones */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <CheckCircle size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                Suscripciones Activas
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                Usuarios que han comprado un plan:
              </p>
              <div className="display-6 fw-bold text-success mb-2">
                {usuarios.filter((u) => u.planId !== null && u.rol === 'cliente').length}
              </div>
              <Link to="/admin/suscripciones" className="btn btn-sm btn-outline-success">
                Ver todas las suscripciones →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">
                <Warning size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                Clientes sin Plan
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                Usuarios registrados sin suscripción activa:
              </p>
              <div className="display-6 fw-bold text-warning mb-2">
                {usuarios.filter((u) => u.planId === null && u.rol === 'cliente').length}
              </div>
              <Link to="/admin/suscripciones" className="btn btn-sm btn-outline-warning">
                Ver detalles →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Información de planes disponibles */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primario text-white">
              <h5 className="mb-0">
                <ClipboardText size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                Planes de Suscripción
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">Planes disponibles en el portal:</p>
              <div className="list-group list-group-flush">
                {planes.map((plan) => (
                  <div key={plan.id} className="list-group-item border-0 px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-bold text-primario">{plan.nombre}</h6>
                        <small className="text-muted">
                          {plan.precio} {plan.unidad}/mes
                        </small>
                      </div>
                      <span className="badge bg-light text-dark">
                        {plan.caracteristicas.length} características
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/planes" className="btn btn-sm btn-outline-primary mt-3 w-100">
                Gestionar Planes →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-secundario text-white">
              <h5 className="mb-0">
                <Lightning size={20} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                Acciones Rápidas
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">Gestiona el portal desde aquí:</p>
              <div className="d-grid gap-2">
                <Link to="/admin/usuarios" className="btn btn-outline-primary">
                  <Users size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                  Gestionar Usuarios
                </Link>
                <Link to="/admin/suscripciones" className="btn btn-outline-success">
                  <CheckCircle size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                  Ver Suscripciones
                </Link>
                <Link to="/admin/planes" className="btn btn-outline-info">
                  <Package size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                  Gestionar Planes
                </Link>
                <Link to="/" className="btn btn-outline-secondary">
                  <House size={18} weight="fill" className="me-2" style={{ verticalAlign: 'middle' }} />
                  Ir al Portal Comercial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="alert alert-info mt-4" role="alert">
        <strong>
          <Lightbulb size={18} weight="fill" className="me-1" style={{ verticalAlign: 'middle' }} />
          Nota:
        </strong> Este dashboard muestra métricas básicas basadas en datos simulados. 
        En producción, se conectaría con una base de datos real para mostrar estadísticas de ventas, 
        suscripciones activas, ingresos y más.
      </div>
    </div>
  );
}


