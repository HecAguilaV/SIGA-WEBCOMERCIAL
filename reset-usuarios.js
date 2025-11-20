// Script para resetear datos y crear usuarios por defecto
// Ejecutar esto en la consola del navegador (F12 -> Console)

console.log('🔄 Reseteando datos de SIGA...');

// Limpiar todo el localStorage
localStorage.clear();

// Crear usuarios por defecto
const usuariosPorDefecto = [
    {
        id: 1,
        nombre: 'Administrador SIGA',
        email: 'admin@siga.com',
        password: 'admin123',
        rol: 'admin',
        planId: null
    },
    {
        id: 2,
        nombre: 'Héctor',
        email: 'hector@siga.com',
        password: 'hector123',
        rol: 'cliente',
        planId: 1 // Plan Kiosco
    }
];

// Guardar usuarios en localStorage
localStorage.setItem('siga_usuarios', JSON.stringify(usuariosPorDefecto));

console.log('✅ Usuarios creados:');
console.log('👤 Admin: admin@siga.com / admin123');
console.log('👤 Cliente: hector@siga.com / hector123');
console.log('');
console.log('🔄 Recarga la página (F5) para aplicar los cambios');
