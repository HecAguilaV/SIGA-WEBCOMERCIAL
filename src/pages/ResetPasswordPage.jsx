import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cambiarPasswordConToken } from '../services/api.js';

/**
 * Página para cambiar contraseña con token de reset
 * Accesible mediante: /reset-password?token=...
 */
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const manejarCambio = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!token) {
      setError('Token de reset no válido o faltante');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const response = await cambiarPasswordConToken(token, newPassword);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña. El token puede haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-danger">
              Token de reset no válido o faltante. Por favor solicita un nuevo reset de contraseña.
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-success text-center">
              <h4>✅ Contraseña actualizada exitosamente</h4>
              <p>Serás redirigido al login en unos segundos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">Cambiar Contraseña</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={manejarCambio}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    required
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn btn-primario w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Cambiando contraseña...
                    </>
                  ) : (
                    'Cambiar Contraseña'
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <button 
                  type="button" 
                  className="btn btn-link text-decoration-none"
                  onClick={() => navigate('/login')}
                >
                  Volver al Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
