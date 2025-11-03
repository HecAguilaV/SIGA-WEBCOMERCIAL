import React, { useState } from 'react';
import { leerUsuarios } from '../datos/datosSimulados.js';
import { guardarUsuarioAutenticado } from '../utils/auth.js';
import { useNavigate } from 'react-router-dom';

// Formulario de inicio de sesión simple con validación básica
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validarEmail = (valor) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(valor);

  const manejarSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validarEmail(email)) {
      setError('Por favor ingresa un email válido.');
      return;
    }
    const lista = leerUsuarios();
    const usuario = lista.find((u) => u.email === email && u.password === password);
    if (!usuario) {
      setError('Credenciales inválidas.');
      return;
    }
    // Guardar el usuario autenticado en localStorage
    // Esto permite que el usuario permanezca logueado al recargar la página
    guardarUsuarioAutenticado(usuario);
    
    // SISTEMA DE REDIRECCIÓN INTELIGENTE:
    // Si el usuario intentó acceder a una página protegida (ej: /checkout) antes de iniciar sesión,
    // esa página guardó la ruta en localStorage. Ahora lo redirigimos allí.
    
    // Verificar si hay una ruta de redirección guardada
    const redirectPath = localStorage.getItem('siga_redirect_after_login');
    
    if (redirectPath) {
      // Si hay una ruta guardada (ej: '/checkout'):
      // 1. Eliminarla de localStorage (ya no la necesitamos)
      localStorage.removeItem('siga_redirect_after_login');
      // 2. Redirigir al usuario a esa ruta
      //    Ejemplo: Si venía del carrito, lo llevamos al checkout
      navigate(redirectPath);
      return; // Detener la ejecución (no seguir con la lógica de abajo)
    }
    
    // Si NO hay ruta guardada, usar la redirección por defecto según el rol:
    // - Administradores → Panel de administración
    // - Clientes → Página de perfil
    if (usuario.rol === 'admin') {
      navigate('/admin');
    } else {
      navigate('/perfil');
    }
  };

  return (
    <section className="py-5">
      <div className="container" style={{ maxWidth: 480 }}>
        <h2 className="mb-4 text-primario">Iniciar Sesión</h2>
        <form onSubmit={manejarSubmit} data-testid="form-login">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-acento w-100">Entrar</button>
        </form>
      </div>
    </section>
  );
}


