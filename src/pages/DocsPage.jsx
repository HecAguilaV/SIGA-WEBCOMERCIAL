import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

// Página de documentación API con Swagger UI
// Accesible en /docs o /api-docs
export default function DocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Cargar el archivo OpenAPI desde GitHub (URL raw)
    const openApiUrl = 'https://raw.githubusercontent.com/HecAguilaV/FullStackII_ProyectoSemestral/main/docs/api/openapi.yaml';
    setSpec(openApiUrl);
  }, []);

  if (!spec) {
    return (
      <div className="py-5">
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-primario" role="status">
              <span className="visually-hidden">Cargando documentación...</span>
            </div>
            <p className="mt-3 text-muted">Cargando documentación API...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      <div className="container-fluid">
        <div className="mb-4">
          <h1 className="display-5 fw-bold text-primario mb-2">Documentación API</h1>
          <p className="text-muted">
            Documentación completa de la API de SIGA Portal Comercial. Todas las funciones están documentadas como endpoints REST.
          </p>
        </div>
        <SwaggerUI 
          url={spec}
          deepLinking={true}
          displayOperationId={false}
          defaultModelsExpandDepth={1}
          defaultModelExpandDepth={1}
        />
      </div>
    </div>
  );
}
