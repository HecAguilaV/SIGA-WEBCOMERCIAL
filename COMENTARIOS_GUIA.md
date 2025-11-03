# INSTRUCCIONES PARA AGREGAR COMENTARIOS EDUCATIVOS

Este documento explica cómo agregar comentarios educativos a cada archivo del proyecto SIGA Portal Comercial.

## Formato de Comentarios Recomendado

Cada archivo debe tener:

1. **Encabezado del archivo:**
```javascript
// ============================================
// ARCHIVO: nombreArchivo.jsx
// DESCRIPCIÓN: Qué hace este archivo
// ============================================
```

2. **Comentarios de importaciones:**
```javascript
// Importación de React y ReactDOM
// React: Librería principal para crear interfaces de usuario
// ReactDOM: Renderiza componentes React en el DOM del navegador
import React from 'react';
import ReactDOM from 'react-dom/client';
```

3. **Comentarios de librerías:**
```javascript
// Bootstrap: Framework CSS que proporciona componentes pre-estilizados
// ¿Por qué Bootstrap? Acelera el desarrollo con componentes listos para usar
import 'bootstrap/dist/css/bootstrap.min.css';
```

4. **Comentarios de funciones:**
```javascript
// ============================================
// FUNCIÓN: nombreFuncion
// DESCRIPCIÓN: Qué hace esta función
// PARÁMETROS: qué recibe
// RETORNA: qué devuelve
// ============================================
```

5. **Comentarios explicativos inline:**
```javascript
// useState: Hook de React para manejar estado local
// [valor, setValor]: valor es el estado actual, setValor es la función para cambiarlo
const [valor, setValor] = useState('');
```

## Archivos Prioritarios para Comentar

1. **main.jsx** - Punto de entrada
2. **App.jsx** - Componente raíz
3. **router.jsx** - Sistema de rutas
4. **utils/auth.js** - Autenticación
5. **utils/indicadoresEconomicos.js** - API externa
6. **datos/datosSimulados.js** - CRUD y localStorage

## Ejemplos de Preguntas del Docente y Respuestas

### ¿Qué librería usaste y para qué?
**React:** Para crear componentes reutilizables de UI
**React Router:** Para navegación entre páginas sin recargar
**Bootstrap:** Para diseño responsive y componentes pre-estilizados

### ¿Qué hace ese código específico?
**useState:** Maneja estado que cambia (ej: valor de input)
**useEffect:** Ejecuta código cuando el componente se monta o cambia
**localStorage:** Guarda datos en el navegador para persistencia

### ¿Cómo funciona el sistema de rutas?
React Router compara la URL con cada Route y muestra el componente correspondiente.

