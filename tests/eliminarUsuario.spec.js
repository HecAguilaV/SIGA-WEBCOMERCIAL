import { eliminarUsuario, leerUsuarios, crearUsuario } from '../src/datos/datosSimulados.js';

describe('Eliminar Usuario', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    
    // Crear usuarios de prueba
    crearUsuario({ nombre: 'Test User 1', email: 'test1@test.com', password: '123', rol: 'cliente' });
    crearUsuario({ nombre: 'Test User 2', email: 'test2@test.com', password: '123', rol: 'cliente' });
  });

  it('debe eliminar un usuario existente', () => {
    const usuariosAntes = leerUsuarios();
    const usuarioId = usuariosAntes[usuariosAntes.length - 1].id;
    
    const eliminado = eliminarUsuario(usuarioId);
    
    expect(eliminado).toBe(true);
    
    const usuariosDespues = leerUsuarios();
    expect(usuariosDespues.length).toBe(usuariosAntes.length - 1);
    expect(usuariosDespues.find(u => u.id === usuarioId)).toBeUndefined();
  });

  it('debe retornar false si el usuario no existe', () => {
    const eliminado = eliminarUsuario(99999);
    expect(eliminado).toBe(false);
  });

  it('no debe eliminar usuarios si el ID es inválido', () => {
    const usuariosAntes = leerUsuarios();
    eliminarUsuario(null);
    eliminarUsuario(undefined);
    
    const usuariosDespues = leerUsuarios();
    expect(usuariosDespues.length).toBe(usuariosAntes.length);
  });
});

