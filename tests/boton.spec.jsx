import React from 'react';
import { createRoot } from 'react-dom/client';
import Boton from '../src/components/Boton.jsx';

describe('Boton.jsx', () => {
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
  });

  it('renderiza el texto pasado por props', () => {
    root.render(<Boton texto="Hacer clic" onClick={() => {}} />);
    const boton = contenedor.querySelector('[data-testid="boton-generico"]');
    expect(boton).not.toBeNull();
    expect(boton.textContent).toContain('Hacer clic');
  });

  it('ejecuta onClick al simular un clic', () => {
    let ejecutado = false;
    const onClick = () => { ejecutado = true; };
    root.render(<Boton texto="Probar" onClick={onClick} />);
    const boton = contenedor.querySelector('[data-testid="boton-generico"]');
    boton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ejecutado).toBeTrue();
  });
});


