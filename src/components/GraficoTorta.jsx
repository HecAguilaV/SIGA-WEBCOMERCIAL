import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Componente de gráfico de torta para mostrar mermas por categoría
// Usa recharts para renderizar gráficos interactivos
export default function GraficoTorta({ titulo, etiquetas, valores }) {
  // Preparar datos para el gráfico
  const datos = etiquetas.map((etiqueta, index) => ({
    name: etiqueta,
    value: valores[index] || 0,
  }));

  // Colores para las secciones del gráfico
  const COLORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="grafico-torta">
      {titulo && <h5 className="mb-3 fw-bold text-primario">{titulo}</h5>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={datos}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {datos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

