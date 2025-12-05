// Tests para funciones de carrito
import { guardarPlanEnCarrito, obtenerPlanDelCarrito, vaciarCarrito } from '../src/utils/auth.js';

describe('Gestión de Carrito', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('guardarPlanEnCarrito', () => {
    it('debe guardar un plan en el carrito', () => {
      const plan = {
        id: 1,
        nombre: 'Plan Test',
        precio: 1.5,
        unidad: 'UF'
      };

      guardarPlanEnCarrito(plan);
      const planGuardado = obtenerPlanDelCarrito();

      expect(planGuardado).toBeDefined();
      expect(planGuardado.id).toBe(1);
      expect(planGuardado.nombre).toBe('Plan Test');
    });

    it('debe sobrescribir el plan anterior si ya hay uno en el carrito', () => {
      const plan1 = { id: 1, nombre: 'Plan 1', precio: 1.0, unidad: 'UF' };
      const plan2 = { id: 2, nombre: 'Plan 2', precio: 2.0, unidad: 'UF' };

      guardarPlanEnCarrito(plan1);
      guardarPlanEnCarrito(plan2);

      const planGuardado = obtenerPlanDelCarrito();

      expect(planGuardado.id).toBe(2);
      expect(planGuardado.nombre).toBe('Plan 2');
    });
  });

  describe('obtenerPlanDelCarrito', () => {
    it('debe retornar null si el carrito está vacío', () => {
      const plan = obtenerPlanDelCarrito();

      expect(plan).toBeNull();
    });

    it('debe retornar el plan guardado', () => {
      const plan = { id: 1, nombre: 'Plan Test', precio: 1.5, unidad: 'UF' };

      guardarPlanEnCarrito(plan);
      const planObtenido = obtenerPlanDelCarrito();

      expect(planObtenido).toBeDefined();
      expect(planObtenido.id).toBe(plan.id);
    });
  });

  describe('vaciarCarrito', () => {
    it('debe eliminar el plan del carrito', () => {
      const plan = { id: 1, nombre: 'Plan Test', precio: 1.5, unidad: 'UF' };

      guardarPlanEnCarrito(plan);
      expect(obtenerPlanDelCarrito()).toBeDefined();

      vaciarCarrito();
      expect(obtenerPlanDelCarrito()).toBeNull();
    });

    it('debe funcionar incluso si el carrito ya está vacío', () => {
      expect(() => vaciarCarrito()).not.toThrow();
      expect(obtenerPlanDelCarrito()).toBeNull();
    });
  });
});

