import React from 'react';

// Componente de botón reutilizable, parametrizable por texto, estilos y comportamiento onClick
export default function Boton({ texto, onClick, tipo = 'button', clase = 'btn btn-acento' }) {
  return (
    <button type={tipo} className={clase} onClick={onClick} data-testid="boton-generico">
      {texto}
    </button>
  );
}


