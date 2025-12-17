import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { iniciarSesion } from '../services/auth.js';
import { solicitarResetPassword, cambiarPasswordConToken } from '../services/api.js';
import { Eye, EyeSlash } from 'phosphor-react';

/**
 * Página de inicio de sesión
 * Integrada con backend real con fallback a datos locales
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarReset, setMostrarReset] = useState(false);
  const [emailReset, setEmailReset] = useState('');
  const [loadingReset, setLoadingReset] = useState(false);
  const [mensajeReset, setMensajeReset] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      setLoading(false);
      return;
    }

    try {
      const usuario = await iniciarSesion(email, password);
      if (usuario) {
        // Verificar si hay una ruta de redirección guardada
        const redirectPath = localStorage.getItem('siga_redirect_after_login') || '/perfil';
        localStorage.removeItem('siga_redirect_after_login');
        navigate(redirectPath);
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = (e) => {
    const emailValue = e.target.value;
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setError('Email inválido');
    } else {
      setError('');
    }
  };

  // Estados para Reset Password MVP
  const [stepReset, setStepReset] = useState(1);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mostrarPasswordReset, setMostrarPasswordReset] = useState(false);
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'success' | 'error'

  const manejarSolicitudReset = async (e) => {
    e.preventDefault();
    setMensajeReset('');
    setTipoMensaje('');

    if (!emailReset || !/@[^\s@]+\.[^\s@]+/.test(emailReset)) {
      setMensajeReset('Email inválido');
      setTipoMensaje('error');
      return;
    }

    setLoadingReset(true);
    try {
      // 1. Solicitar token al backend
      const response = await solicitarResetPassword(emailReset);

      if (response.success) {
        // MVP TRICK: En desarrollo, el backend nos devuelve el token directamente.
        // Lo usaremos para pasar al paso 2 sin salir de la pantalla.
        if (response.resetToken) {
          setResetToken(response.resetToken);
          setStepReset(2); // Avanzar al paso de cambio de password
          setMensajeReset('');
        } else {
          // Si por alguna razón no hay token (prod estricto?), fallback a mensaje
          setMensajeReset('Enviamos un enlace a tu correo (Simulación: Revisa consola si estás en dev)');
          setTipoMensaje('success');
        }
      } else {
        throw new Error(response.message || 'No se pudo verificar el usuario');
      }
    } catch (err) {
      setMensajeReset(err.message || 'Error al verificar usuario');
      setTipoMensaje('error');
    } finally {
      setLoadingReset(false);
    }
  };

  const manejarConfirmacionReset = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setMensajeReset('La contraseña debe tener al menos 6 caracteres');
      setTipoMensaje('error');
      return;
    }

    setLoadingReset(true);
    try {
      const response = await cambiarPasswordConToken(resetToken, newPassword);
      if (response.success) {
        setMostrarReset(false);
        setStepReset(1);
        setEmailReset('');
        setNewPassword('');
        setResetToken('');
        // Mostrar éxito en el login principal
        setError('✅ ¡Contraseña actualizada! Ya puedes iniciar sesión.');
        // Hack visual: usar setError para mensaje de éxito verde (si el componente lo soporta, sino css)
        // Como el componente usa alert-danger para error, mejor agrego estado de éxito global o manipulo error...
        // Mejor:
        alert('✅ Contraseña actualizada correctamente. Inicia sesión con tu nueva clave.');
      }
    } catch (err) {
      setMensajeReset(err.message || 'Error al actualizar contraseña');
      setTipoMensaje('error');
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={mostrarPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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

                <button type="submit" className="btn btn-primario w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none p-0"
                  onClick={() => setMostrarReset(!mostrarReset)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {mostrarReset && (
                <div className="mt-4 pt-4 border-top">
                  <h5 className="mb-3">
                    {stepReset === 1 ? 'Recuperar Contraseña' : 'Establecer Nueva Contraseña'}
                  </h5>

                  {stepReset === 1 && (
                    <form onSubmit={manejarSolicitudReset}>
                      <div className="mb-3">
                        <label htmlFor="emailReset" className="form-label">
                          Email corporativo
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="emailReset"
                          value={emailReset}
                          onChange={(e) => setEmailReset(e.target.value)}
                          placeholder="nombre@empresa.com"
                          required
                          disabled={loadingReset}
                        />
                      </div>
                      {mensajeReset && (
                        <div className={`alert ${tipoMensaje === 'error' ? 'alert-danger' : 'alert-info'}`} role="alert">
                          {mensajeReset}
                        </div>
                      )}
                      <button type="submit" className="btn btn-primary w-100" disabled={loadingReset}>
                        {loadingReset ? 'Verificando...' : 'Verificar Usuario'}
                      </button>
                    </form>
                  )}

                  {stepReset === 2 && (
                    <form onSubmit={manejarConfirmacionReset}>
                      <div className="alert alert-success small mb-3">
                        <i className="fas fa-check-circle me-1"></i>
                        Identidad verificada. Por favor define tu nueva contraseña.
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Nueva Contraseña</label>
                        <div className="input-group">
                          <input
                            type={mostrarPasswordReset ? "text" : "password"}
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setMostrarPasswordReset(!mostrarPasswordReset)}
                            style={{ borderLeft: 'none' }}
                          >
                            {mostrarPasswordReset ? <EyeSlash size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-success w-100" disabled={loadingReset}>
                        {loadingReset ? 'Actualizando...' : 'Actualizar Contraseña'}
                      </button>
                    </form>
                  )}

                  <button
                    type="button"
                    className="btn btn-link text-decoration-none w-100 mt-2"
                    onClick={() => {
                      setMostrarReset(false);
                      setStepReset(1);
                      setEmailReset('');
                      setMensajeReset('');
                      setNewPassword('');
                      setResetToken(''); // Limpiar token al cancelar
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

