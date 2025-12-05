/**
 * Configuración de Karma + Jasmine con webpack para soportar JSX
 * 
 * Este archivo usa extensión .cjs porque package.json tiene "type": "module"
 * y Karma necesita CommonJS para funcionar correctamente.
 * 
 * IMPORTANTE: La configuración de Babel está incluida aquí en webpack.
 * Babel-loader ya está configurado con @babel/preset-react para transformar JSX.
 */

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    
    // Archivos que Karma debe cargar y observar para cambios
    // Excluir DocsPage.jsx porque usa swagger-ui-react que requiere configuración CSS adicional
    files: [
      // Tests - deben estar incluidos para que se ejecuten
      { pattern: 'tests/**/*.spec.jsx', watched: true, included: true, served: true },
      { pattern: 'tests/**/*.spec.js', watched: true, included: true, served: true },
      // Código fuente - solo para webpack, no incluirlos directamente
      { pattern: 'src/**/*.jsx', watched: true, included: false, served: false },
      { pattern: 'src/**/*.js', watched: true, included: false, served: false },
    ],
    
    // Excluir DocsPage de los tests (no necesita testing)
    exclude: ['src/pages/DocsPage.jsx'],
    
    // Preprocesadores: webpack transforma JSX y JS antes de ejecutar los tests
    preprocessors: {
      'src/**/*.jsx': ['webpack'],
      'src/**/*.js': ['webpack'],
      'tests/**/*.spec.jsx': ['webpack'],
      'tests/**/*.spec.js': ['webpack'],
    },
    
    // Configuración de webpack que incluye Babel para transformar JSX
    webpack: {
      mode: 'development',
      
      // Resolver extensiones .js y .jsx
      resolve: {
        extensions: ['.js', '.jsx'],
      },
      
      // Reglas de módulos: usar babel-loader para transformar JSX
      module: {
        rules: [
          {
            test: /\.jsx?$/, // Aplica a archivos .js y .jsx
            exclude: /node_modules/, // Excluir node_modules (no necesita transformación)
            use: {
              loader: 'babel-loader', // Usar babel-loader para transformar código
              options: {
                // Presets de Babel: @babel/preset-react transforma JSX a JavaScript
                presets: ['@babel/preset-react'],
              },
            },
          },
          {
            // Ignorar archivos CSS en tests (no son necesarios para pruebas unitarias)
            test: /\.css$/,
            use: ['null-loader'],
          },
        ],
      },
      // Resolver fallbacks para módulos que no se usan en tests
      resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
          "fs": false,
          "path": false,
        },
      },
    },
    
    // Reporters: mostrar progreso y coverage (cobertura de código)
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' }, // Reporte HTML en coverage/html
        { type: 'text-summary' }, // Resumen en consola
      ],
      includeAllSources: true,
    },
    
    // Navegador para ejecutar los tests
    // 'Chrome' = con interfaz gráfica para ver los tests en el navegador
    // 'ChromeHeadless' = sin interfaz gráfica (para CI/CD)
    browsers: ['Chrome'],
    singleRun: false, // false para ver la interfaz gráfica y watch mode
    
    // Configuración del cliente Jasmine
    client: {
      jasmine: {
        random: false, // Ejecutar tests en orden determinístico
      },
      clearContext: false, // No limpiar el contexto entre tests (útil para debug)
      captureConsole: true, // Capturar console.log para debug
      runInParent: false,
    },
    
    // Configuración para debugging
    logLevel: config.LOG_INFO, // Mostrar información de debug
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },
  });
};

