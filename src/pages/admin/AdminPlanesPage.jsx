import React, { useState } from 'react';
import { leerPlanes, crearPlan, actualizarPlan, eliminarPlan } from '../../datos/datosSimulados.js';

// Gestión CRUD completa de planes de suscripción para el administrador del sitio web
export default function AdminPlanesPage() {
  const [planes, setPlanes] = useState(leerPlanes());
  const [mostrarForm, setMostrarForm] = useState(false);
  const [edicion, setEdicion] = useState(null); // id del plan en edición
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    unidad: 'UF',
    caracteristicas: '',
  });

  const iniciarCrear = () => {
    setEdicion(null);
    setForm({ nombre: '', precio: '', unidad: 'UF', caracteristicas: '' });
    setMostrarForm(true);
  };

  const iniciarEdicion = (plan) => {
    setEdicion(plan.id);
    setForm({
      nombre: plan.nombre,
      precio: plan.precio.toString(),
      unidad: plan.unidad,
      caracteristicas: plan.caracteristicas.join('\n'),
    });
    setMostrarForm(true);
  };

  const cancelarForm = () => {
    setMostrarForm(false);
    setEdicion(null);
    setForm({ nombre: '', precio: '', unidad: 'UF', caracteristicas: '' });
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    const caracteristicas = form.caracteristicas
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (edicion) {
      // Actualizar plan existente
      actualizarPlan(edicion, {
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        unidad: form.unidad,
        caracteristicas,
      });
    } else {
      // Crear nuevo plan
      crearPlan({
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        unidad: form.unidad,
        caracteristicas,
      });
    }

    setPlanes(leerPlanes());
    cancelarForm();
  };

  const borrarPlan = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este plan?')) {
      eliminarPlan(id);
      setPlanes(leerPlanes());
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primario mb-0">Gestión de Planes</h2>
        <button className="btn btn-acento" onClick={iniciarCrear}>
          ➕ Crear Nuevo Plan
        </button>
      </div>

      {/* Formulario de crear/editar */}
      {mostrarForm && (
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-header bg-primario text-white">
            <h5 className="mb-0">{edicion ? '✏️ Editar Plan' : '➕ Crear Nuevo Plan'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={manejarSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre del Plan</label>
                  <input
                    className="form-control"
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Precio</label>
                  <input
                    className="form-control"
                    type="number"
                    step="0.1"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Unidad</label>
                  <select
                    className="form-select"
                    value={form.unidad}
                    onChange={(e) => setForm({ ...form, unidad: e.target.value })}
                  >
                    <option value="UF">UF</option>
                    <option value="USD">USD</option>
                    <option value="CLP">CLP</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">
                    Características (una por línea)
                  </label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={form.caracteristicas}
                    onChange={(e) => setForm({ ...form, caracteristicas: e.target.value })}
                    placeholder="Ejemplo:&#10;Punto de venta básico&#10;Gestión simple de inventario&#10;1 usuario"
                    required
                  />
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-acento">
                  {edicion ? '💾 Guardar Cambios' : '➕ Crear Plan'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={cancelarForm}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de planes */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Características</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planes.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.id}</td>
                <td>
                  <strong className="text-primario">{plan.nombre}</strong>
                </td>
                <td>
                  {plan.precio} {plan.unidad}/mes
                </td>
                <td>
                  <ul className="list-unstyled mb-0">
                    {plan.caracteristicas.slice(0, 2).map((c, i) => (
                      <li key={i} className="small">• {c}</li>
                    ))}
                    {plan.caracteristicas.length > 2 && (
                      <li className="small text-muted">
                        ... y {plan.caracteristicas.length - 2} más
                      </li>
                    )}
                  </ul>
                </td>
                <td className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => iniciarEdicion(plan)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => borrarPlan(plan.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

