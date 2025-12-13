import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { iniciarSesion } from '../services/auth.js';
import { solicitarResetPassword } from '../services/api.js';

/**
 * Página de inicio de sesión
 * Integrada con backend real con fallback a datos locales
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const manejarResetPassword = async (e) => {
    e.preventDefault();
    setMensajeReset('');
    setError('');
    
    if (!emailReset || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailReset)) {
      setMensajeReset('Por favor ingresa un email válido');
      return;
    }

    setLoadingReset(true);
    try {
      const response = await solicitarResetPassword(emailReset);
      if (response.success) {
        setMensajeReset('✅ Revisa tu email para continuar con el cambio de contraseña. En producción recibirás un token por email.');
        // Si estamos en desarrollo y hay token, mostrarlo
        if (response.resetToken && import.meta.env.DEV) {
          console.log('Token de reset (solo en desarrollo):', response.resetToken);
          setMensajeReset(`✅ Token generado. En producción se enviará por email. Token (solo dev): ${response.resetToken.substring(0, 20)}...`);
        }
        setEmailReset('');
        setTimeout(() => {
          setMostrarReset(false);
          setMensajeReset('');
        }, 5000);
      }
    } catch (err) {
      setMensajeReset(err.message || 'Error al solicitar reset de contraseña');
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
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
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
                  <h5 className="mb-3">Recuperar Contraseña</h5>
                  <form onSubmit={manejarResetPassword}>
                    <div className="mb-3">
                      <label htmlFor="emailReset" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="emailReset"
                        value={emailReset}
                        onChange={(e) => setEmailReset(e.target.value)}
                        placeholder="Ingresa tu email"
                        required
                      />
                    </div>
                    {mensajeReset && (
                      <div className={`alert ${mensajeReset.includes('✅') ? 'alert-success' : 'alert-danger'}`} role="alert">
                        {mensajeReset}
                      </div>
                    )}
                    <button type="submit" className="btn btn-outline-primary w-100" disabled={loadingReset}>
                      {loadingReset ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Instrucciones'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-link text-decoration-none w-100 mt-2"
                      onClick={() => {
                        setMostrarReset(false);
                        setEmailReset('');
                        setMensajeReset('');
                      }}
                    >
                      Cancelar
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

