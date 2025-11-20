import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GraficoLineas({ titulo, etiquetas, valores }) {
    const datos = etiquetas.map((etiqueta, index) => ({
        name: etiqueta,
        value: valores[index] || 0,
    }));

    return (
        <div className="contenedor-grafico" style={{ width: '100%', height: '100%' }}>
            {titulo && <h5 className="mb-3 fw-bold text-primario">{titulo}</h5>}
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#03045E" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
