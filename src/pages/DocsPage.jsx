import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

// Página de documentación API con Swagger UI
// Accesible en /docs
export default function DocsPage() {
  const [spec, setSpec] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOpenAPISpec = async () => {
      try {
        // En producción siempre cargar desde GitHub para tener la versión más actualizada
        // En desarrollo, intentar local primero, luego GitHub como fallback
        const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
        const githubUrl = 'https://raw.githubusercontent.com/HecAguilaV/SIGA-WEBCOMERCIAL/main/docs/api/openapi.yaml';
        
        if (isProduction) {
          // Producción: siempre desde GitHub
          const githubResponse = await fetch(githubUrl);
          if (!githubResponse.ok) {
            throw new Error(`Error al cargar desde GitHub: ${githubResponse.status}`);
          }
          setSpec(githubUrl);
          setLoading(false);
        } else {
          // Desarrollo: intentar local primero, luego GitHub
          try {
            const localResponse = await fetch('/docs/api/openapi.yaml');
            if (localResponse.ok) {
              setSpec('/docs/api/openapi.yaml');
              setLoading(false);
              return;
            }
          } catch (localError) {
            console.log('No se pudo cargar archivo local, usando GitHub como fallback');
          }

          // Fallback a GitHub en desarrollo
          const githubResponse = await fetch(githubUrl);
          if (!githubResponse.ok) {
            throw new Error(`Error al cargar desde GitHub: ${githubResponse.status}`);
          }
          setSpec(githubUrl);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error cargando especificación OpenAPI:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadOpenAPISpec();
  }, []);

  if (loading) {
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

  if (error) {
    return (
      <div className="py-5">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error al cargar documentación</h4>
            <p>No se pudo cargar la especificación OpenAPI: {error}</p>
            <hr />
            <p className="mb-0">
              Puedes ver la documentación directamente en:{' '}
              <a 
                href="https://editor.swagger.io/?url=https://raw.githubusercontent.com/HecAguilaV/SIGA-WEBCOMERCIAL/main/docs/api/openapi.yaml"
                target="_blank"
                rel="noopener noreferrer"
                className="alert-link"
              >
                Swagger Editor Online
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!spec) {
    return null;
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
          tryItOutEnabled={true}
        />
      </div>
    </div>
  );
}
