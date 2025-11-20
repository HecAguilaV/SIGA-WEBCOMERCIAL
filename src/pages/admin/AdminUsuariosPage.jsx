import React, { useState } from 'react';
import { leerUsuarios, leerPlanes, eliminarUsuario, actualizarUsuario, resetearPasswordUsuario } from '../../datos/datosSimulados.js';

// Gestión de usuarios del portal web - CRUD completo para el administrador del sitio
// El admin puede ver todos los usuarios registrados, editarlos y eliminarlos
// Las contraseñas NO se muestran por seguridad, pero se pueden resetear
export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState(leerUsuarios());
  const [edicion, setEdicion] = useState(null); // id del usuario en edición
  const [reseteo, setReseteo] = useState(null); // id del usuario cuyo password se está reseteando
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'cliente' });
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [passwordReseteado, setPasswordReseteado] = useState(null);

  const iniciarEdicion = (usuario) => {
    setEdicion(usuario.id);
    setForm({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
  };

  const cancelarEdicion = () => {
    setEdicion(null);
    setForm({ nombre: '', email: '', rol: 'cliente' });
  };

  const confirmarEdicion = () => {
    actualizarUsuario(edicion, form);
    setUsuarios(leerUsuarios());
    cancelarEdicion();
  };

  const borrarUsuario = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      eliminarUsuario(id);
      setUsuarios(leerUsuarios());
    }
  };

  const iniciarReseteo = (usuario) => {
    setReseteo(usuario.id);
    setNuevaPassword('');
    setPasswordReseteado(null);
  };

  const cancelarReseteo = () => {
    setReseteo(null);
    setNuevaPassword('');
    setPasswordReseteado(null);
  };

  const confirmarReseteo = () => {
    if (!nuevaPassword || nuevaPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    resetearPasswordUsuario(reseteo, nuevaPassword);
    setPasswordReseteado(reseteo);
    setUsuarios(leerUsuarios());
    setTimeout(() => {
      cancelarReseteo();
    }, 3000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primario mb-0">Gestión de Usuarios</h2>
        <span className="badge bg-info text-dark">Total: {usuarios.length} usuarios</span>
      </div>

      {/* Alerta sobre seguridad de contraseñas */}
      <div className="alert alert-warning mb-4" role="alert">
        <strong>🔒 Seguridad:</strong> Las contraseñas no se muestran por razones de seguridad. 
        Puedes resetear la contraseña de cualquier usuario desde las acciones.
      </div>

      {/* Información de usuarios por defecto */}
      <div className="alert alert-info mb-4" role="alert">
        <strong>👤 Usuarios por defecto:</strong>
        <ul className="mb-0 mt-2">
          <li><strong>Admin:</strong> admin@siga.com / admin123</li>
          <li><strong>Hector (Cliente):</strong> hector@siga.com / hector123</li>
        </ul>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Plan</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const planes = leerPlanes();
              const planUsuario = u.planId ? planes.find((p) => p.id === u.planId) : null;
              
              return (
                <React.Fragment key={u.id}>
                  <tr>
                    <td>{u.id}</td>
                    <td>
                      {edicion === u.id ? (
                        <input className="form-control" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                      ) : (
                        u.nombre
                      )}
                    </td>
                    <td>
                      {edicion === u.id ? (
                        <input className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      ) : (
                        u.email
                      )}
                    </td>
                    <td>
                      {edicion === u.id ? (
                        <select className="form-select" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                          <option value="cliente">cliente</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        <span className="badge bg-info text-dark">{u.rol}</span>
                      )}
                    </td>
                    <td>
                      {planUsuario ? (
                        <span className="badge bg-success">{planUsuario.nombre}</span>
                      ) : (
                        <span className="badge bg-secondary">Sin plan</span>
                      )}
                    </td>
                    <td>
                      {reseteo === u.id ? (
                        <div className="d-flex gap-2 align-items-center">
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            style={{ width: '150px' }}
                            placeholder="Nueva contraseña"
                            value={nuevaPassword}
                            onChange={(e) => setNuevaPassword(e.target.value)}
                          />
                          <button className="btn btn-sm btn-success" onClick={confirmarReseteo}>
                            ✓
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={cancelarReseteo}>
                            ✕
                          </button>
                        </div>
                      ) : passwordReseteado === u.id ? (
                        <span className="text-success small">✓ Contraseña reseteada</span>
                      ) : (
                        <span className="text-muted small">••••••••</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        {edicion === u.id ? (
                          <>
                            <button className="btn btn-sm btn-success" onClick={confirmarEdicion}>Guardar</button>
                            <button className="btn btn-sm btn-secondary" onClick={cancelarEdicion}>Cancelar</button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => iniciarEdicion(u)}>✏️ Editar</button>
                            <button className="btn btn-sm btn-outline-warning" onClick={() => iniciarReseteo(u)}>🔑 Resetear</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => borrarUsuario(u.id)}>🗑️ Eliminar</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}


