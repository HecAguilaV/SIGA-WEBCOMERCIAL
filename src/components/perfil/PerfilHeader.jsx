import React from 'react';
import { HandWaving } from 'phosphor-react';

export default function PerfilHeader({ usuario }) {
    return (
        <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center">
                <h1 className="display-5 fw-bold text-primario mb-3">
                    ¡Bienvenido, {usuario.nombre}! <HandWaving size={32} weight="fill" className="text-acento" style={{ verticalAlign: 'middle' }} />
                </h1>
                <p className="lead text-muted">
                    Tu portal personal de SIGA. Accede a tu aplicación y gestiona tu cuenta.
                </p>
            </div>
        </div>
    );
}
