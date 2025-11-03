import React, { useState } from 'react';
import { crearUsuario, leerUsuarios } from '../datos/datosSimulados.js';
import { guardarUsuarioAutenticado } from '../utils/auth.js';
import { useNavigate } from 'react-router-dom';

// Formulario de registro de usuario (rol por defecto: cliente)
export default function RegistroPage() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validarEmail = (valor) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(valor);

  const manejarSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!nombre.trim()) return setError('El nombre es requerido.');
    if (!validarEmail(email)) return setError('Email inválido.');
    if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
    const existe = leerUsuarios().some((u) => u.email === email);
    if (existe) return setError('El email ya está registrado.');
    const nuevo = crearUsuario({ nombre, email, password, rol: 'cliente' });
    guardarUsuarioAutenticado(nuevo);
    // Redirigir al perfil después del registro exitoso
    navigate('/perfil');
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
          <button type="submit" className="btn btn-acento w-100">Crear cuenta</button>
        </form>
      </div>
    </section>
  );
}


