// Tests para funciones CRUD de Usuarios
import { crearUsuario, leerUsuarios, actualizarUsuario } from '../src/datos/datosSimulados.js';

describe('CRUD de Usuarios', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('crearUsuario', () => {
    it('debe crear un nuevo usuario con ID autoincremental', () => {
      const nuevoUsuario = {
        nombre: 'Usuario Test',
        email: 'test@test.com',
        password: 'password123',
        rol: 'cliente'
      };

      const usuarioCreado = crearUsuario(nuevoUsuario);

      expect(usuarioCreado).toBeDefined();
      expect(usuarioCreado.id).toBeDefined();
      expect(usuarioCreado.nombre).toBe('Usuario Test');
      expect(usuarioCreado.email).toBe('test@test.com');
    });

    it('debe guardar el usuario en localStorage', () => {
      const nuevoUsuario = {
        nombre: 'Usuario Test 2',
        email: 'test2@test.com',
        password: 'password123',
        rol: 'cliente'
      };

      crearUsuario(nuevoUsuario);
      const usuarios = leerUsuarios();
      const usuarioEncontrado = usuarios.find(u => u.email === 'test2@test.com');

      expect(usuarioEncontrado).toBeDefined();
      expect(usuarioEncontrado.nombre).toBe('Usuario Test 2');
    });
  });

  describe('leerUsuarios', () => {
    it('debe retornar un array de usuarios', () => {
      const usuarios = leerUsuarios();

      expect(Array.isArray(usuarios)).toBe(true);
    });

    it('debe retornar usuarios con estructura correcta', () => {
      crearUsuario({
        nombre: 'Test',
        email: 'test@test.com',
        password: '123',
        rol: 'cliente'
      });

      const usuarios = leerUsuarios();

      if (usuarios.length > 0) {
        const usuario = usuarios[0];
        expect(usuario).toHaveProperty('id');
        expect(usuario).toHaveProperty('nombre');
        expect(usuario).toHaveProperty('email');
        expect(usuario).toHaveProperty('rol');
      }
    });
  });

  describe('actualizarUsuario', () => {
    it('debe actualizar un usuario existente', () => {
      const nuevoUsuario = crearUsuario({
        nombre: 'Usuario Original',
        email: 'original@test.com',
        password: 'password123',
        rol: 'cliente'
      });

      const cambios = { nombre: 'Usuario Actualizado' };
      const usuarioActualizado = actualizarUsuario(nuevoUsuario.id, cambios);

      expect(usuarioActualizado).toBeDefined();
      expect(usuarioActualizado.nombre).toBe('Usuario Actualizado');
      expect(usuarioActualizado.email).toBe('original@test.com');
    });

    it('debe retornar null si el usuario no existe', () => {
      const resultado = actualizarUsuario(99999, { nombre: 'Test' });

      expect(resultado).toBeNull();
    });
  });
});

