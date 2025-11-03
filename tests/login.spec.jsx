import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage.jsx';
import { crearUsuario } from '../src/datos/datosSimulados.js';

describe('LoginPage.jsx', () => {
  let contenedor;
  let root;

  beforeEach(() => {
    contenedor = document.createElement('div');
    document.body.appendChild(contenedor);
    root = createRoot(contenedor);
  });

  afterEach(() => {
    root.unmount();
    contenedor.remove();
    localStorage.clear();
  });

  it('cambia estado al escribir en inputs y valida email inválido', () => {
    root.render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    const form = contenedor.querySelector('[data-testid="form-login"]');
    const [inputEmail, inputPassword] = form.querySelectorAll('input');
    inputEmail.value = 'correo-invalido';
    inputEmail.dispatchEvent(new Event('input', { bubbles: true }));
    inputPassword.value = 'clave';
    inputPassword.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    const alerta = contenedor.querySelector('.alert-danger');
    expect(alerta).not.toBeNull();
    expect(alerta.textContent).toContain('email válido');
  });

  it('permite login con usuario existente', () => {
    // Garantizar un usuario válido en datos simulados
    const usuario = crearUsuario({ nombre: 'Test', email: 'test@ejemplo.com', password: '123456', rol: 'cliente' });
    expect(usuario.id).toBeGreaterThan(0);

    root.render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    const form = contenedor.querySelector('[data-testid="form-login"]');
    const [inputEmail, inputPassword] = form.querySelectorAll('input');
    inputEmail.value = 'test@ejemplo.com';
    inputEmail.dispatchEvent(new Event('input', { bubbles: true }));
    inputPassword.value = '123456';
    inputPassword.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true }));
    const alerta = contenedor.querySelector('.alert-danger');
    expect(alerta).toBeNull();
  });
});


