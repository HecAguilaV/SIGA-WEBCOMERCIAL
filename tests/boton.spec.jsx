import React from 'react';
import { render } from 'react-dom';
import Boton from '../src/components/Boton.jsx';

describe('Componente Boton', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('debe renderizar el botón con el texto proporcionado', () => {
    render(<Boton texto="Click me" />, container);
    const boton = container.querySelector('button');
    expect(boton).not.toBeNull();
    expect(boton.textContent).toContain('Click me');
  });

  it('debe ejecutar la función onClick cuando se hace clic', () => {
    const handleClick = jasmine.createSpy('handleClick');
    render(<Boton texto="Click me" onClick={handleClick} />, container);
    
    const boton = container.querySelector('button');
    boton.click();
    
    expect(handleClick).toHaveBeenCalled();
  });

  it('debe aplicar las clases CSS correctas', () => {
    render(<Boton texto="Click me" clase="btn btn-primario" />, container);
    const boton = container.querySelector('button');
    expect(boton.className).toContain('btn-primario');
  });

  it('debe usar la clase por defecto si no se especifica', () => {
    render(<Boton texto="Click me" />, container);
    const boton = container.querySelector('button');
    expect(boton.className).toContain('btn-acento');
  });
});
