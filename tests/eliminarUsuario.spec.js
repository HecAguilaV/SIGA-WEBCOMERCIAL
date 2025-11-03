import { crearUsuario, leerUsuarios, eliminarUsuario } from '../src/datos/datosSimulados.js';

describe('CRUD eliminarUsuario', () => {
  it('elimina un usuario existente del arreglo', () => {
    const nuevo = crearUsuario({ nombre: 'Eliminar', email: 'eliminar@siga.com', password: 'abc123', rol: 'cliente' });
    const antes = leerUsuarios().length;
    const ok = eliminarUsuario(nuevo.id);
    const despues = leerUsuarios().length;
    expect(ok).toBeTrue();
    expect(despues).toBe(antes - 1);
    expect(leerUsuarios().some(u => u.id === nuevo.id)).toBeFalse();
  });
});


