import React from 'react';

// Pie de página con identidad visual SIGA
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#03045e',
        color: '#ffffff',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        marginTop: '3rem',
        borderTop: '1px solid #00b4d8'
      }}
    >
      <div className="content">
        <p style={{ margin: '0.5rem 0' }}>
          <strong style={{ color: '#00b4d8' }}>SIGA</strong> - Sistema Inteligente de Gestión de Activos
        </p>
        <p style={{ margin: '0.5rem 0' }}>
          <small style={{ opacity: 0.8 }}>
            © 2025 Todos los derechos reservados
            <br />
            Desarrollado por {'>'} Un Soñador con Poca RAM 👨🏻‍💻
          </small>
        </p>
      </div>
    </footer>
  );
}


