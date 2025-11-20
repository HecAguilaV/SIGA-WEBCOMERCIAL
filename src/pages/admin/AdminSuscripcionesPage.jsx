import React, { useState } from 'react';
import { leerUsuarios } from '../../datos/datosSimulados.js';
import { leerPlanes } from '../../datos/datosSimulados.js';

// Vista de suscripciones activas - usuarios que han comprado planes
export default function AdminSuscripcionesPage() {
  const usuarios = leerUsuarios();
  const planes = leerPlanes();

  // Filtrar solo usuarios que tienen un plan asignado (han comprado)
  const usuariosConPlan = usuarios.filter((u) => u.planId !== null);
  const usuariosSinPlan = usuarios.filter((u) => u.planId === null && u.rol === 'cliente');

  const obtenerPlanPorId = (planId) => {
    return planes.find((p) => p.id === planId);
  };

  return (
    <div>
      <h2 className="text-primario mb-4">Suscripciones Activas</h2>

      {/* Estadísticas rápidas */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <div className="fs-2 mb-2">✅</div>
              <h3 className="h4 mb-0">{usuariosConPlan.length}</h3>
              <small className="text-muted">Suscripciones Activas</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <div className="fs-2 mb-2">👥</div>
              <h3 className="h4 mb-0">{usuariosSinPlan.length}</h3>
              <small className="text-muted">Clientes sin Plan</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <div className="fs-2 mb-2">📦</div>
              <h3 className="h4 mb-0">{planes.length}</h3>
              <small className="text-muted">Planes Disponibles</small>
            </div>
          </div>
        </div>
      </div>

      {/* Usuarios con suscripciones activas */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">✅ Usuarios con Planes Activos</h5>
        </div>
        <div className="card-body">
          {usuariosConPlan.length === 0 ? (
            <p className="text-muted mb-0">No hay usuarios con planes activos aún.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Precio</th>
                    <th>Características</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosConPlan.map((usuario) => {
                    const plan = obtenerPlanPorId(usuario.planId);
                    return (
                      <tr key={usuario.id}>
                        <td>
                          <strong>{usuario.nombre}</strong>
                        </td>
                        <td>{usuario.email}</td>
                        <td>
                          <span className="badge bg-acento text-white">
                            {plan ? plan.nombre : 'Plan no encontrado'}
                          </span>
                        </td>
                        <td>
                          {plan ? (
                            <>
                              {plan.precio} {plan.unidad}/mes
                            </>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          <small className="text-muted">
                            {plan ? plan.caracteristicas.length : 0} características
                          </small>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Usuarios registrados sin plan */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">⚠️ Clientes Registrados sin Plan</h5>
        </div>
        <div className="card-body">
          {usuariosSinPlan.length === 0 ? (
            <p className="text-muted mb-0">
              Todos los clientes registrados tienen un plan activo.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosSinPlan.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>
                        <strong>{usuario.nombre}</strong>
                      </td>
                      <td>{usuario.email}</td>
                      <td>
                        <span className="badge bg-secondary">Sin plan</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

