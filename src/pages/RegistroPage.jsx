import React, { useState } from 'react';
import { registrarUsuario } from '../services/auth.js';
import { useNavigate } from 'react-router-dom';

// Formulario de registro de usuario (rol por defecto: cliente)
// Integrado con backend real con fallback a datos locales
export default function RegistroPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (valor) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(valor);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!nombre.trim()) {
      setError('El nombre es requerido.');
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

    try {
      const nuevo = await registrarUsuario({ nombre, email, password });
      if (nuevo) {
        // Redirigir al perfil después del registro exitoso
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
        <form onSubmit={manejarSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-acento w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}


