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
    files: [
      { pattern: 'src/**/*.jsx', watched: true },
      { pattern: 'src/**/*.js', watched: true },
      { pattern: 'tests/**/*.spec.jsx', watched: true },
      { pattern: 'tests/**/*.spec.js', watched: true },
    ],
    
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
        ],
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
    
    // Navegador para ejecutar los tests (ChromeHeadless = sin interfaz gráfica)
    browsers: ['ChromeHeadless'],
    singleRun: false,
    
    // Configuración del cliente Jasmine
    client: {
      jasmine: {
        random: false, // Ejecutar tests en orden determinístico
      },
      clearContext: false,
    },
  });
};


