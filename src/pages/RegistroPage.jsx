import React, { useState } from 'react';
import { registrarUsuario } from '../services/auth.js';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeSlash } from 'phosphor-react';

// Formulario de registro de usuario (rol por defecto: cliente)
// Integrado con backend real con fallback a datos locales
export default function RegistroPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState(''); // ⬅️ NUEVO: Apellido separado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (valor) => /[^@\s]+@[^@\s]+\.[^\s@]+/.test(valor);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!nombre.trim()) {
      setError('El nombre es requerido.');
      setLoading(false);
      return;
    }
    if (!apellido.trim()) { // ⬅️ Validación Apellido
      setError('El apellido es requerido.');
      setLoading(false);
      return;
    }
    if (!validarEmail(email)) {
      setError('Email inválido.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setLoading(false);
      return;
    }
    if (!nombreEmpresa.trim()) { // ⬅️ Validación Empresa Obligatoria
      setError('El nombre de la empresa es obligatorio para fines de facturación.');
      setLoading(false);
      return;
    }

    try {
      const nuevo = await registrarUsuario({
        nombre,
        apellido, // ⬅️ Enviar Apellido
        email,
        password,
        nombreEmpresa: nombreEmpresa.trim() // Obligatorio
      });
      if (nuevo) {
        navigate('/perfil');
      } else {
        setError('Error al registrar usuario. Por favor intenta nuevamente.');
      }
    } catch (err) {
      setError(err.message || 'Error al registrar usuario. El email puede estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 520 }}>
        <h2 className="mb-4 text-primario">Registro</h2>
        <div className="alert alert-info small mb-4">
          <i className="fas fa-info-circle me-2"></i>
          Ingresa los datos del administrador de la cuenta comercial.
        </div>
        <form onSubmit={manejarSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Nombre <span className="text-danger">*</span></label>
              <input
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Apellido <span className="text-danger">*</span></label>
              <input
                className="form-control"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej: Pérez"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email Corporativo <span className="text-danger">*</span></label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña <span className="text-danger">*</span></label>
            <div className="input-group">
              <input
                className="form-control"
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                style={{ borderLeft: 'none' }}
              >
                {mostrarPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Nombre de Empresa <span className="text-danger">*</span>
            </label>
            <input
              className="form-control"
              type="text"
              value={nombreEmpresa}
              onChange={(e) => setNombreEmpresa(e.target.value)}
              placeholder="Razón Social para Facturación"
            />
            <div className="form-text">Este nombre aparecerá en todas las facturas y documentos emitidos.</div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-acento w-100 py-2 fw-bold" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta Comercial'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}


