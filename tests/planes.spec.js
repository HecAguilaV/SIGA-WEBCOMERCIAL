// Tests para funciones CRUD de Planes
import { crearPlan, leerPlanes, actualizarPlan, eliminarPlan } from '../src/datos/datosSimulados.js';

describe('CRUD de Planes', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  describe('crearPlan', () => {
    it('debe crear un nuevo plan con ID autoincremental', () => {
      const nuevoPlan = {
        nombre: 'Plan Test',
        precio: 1.5,
        unidad: 'UF',
        esFreemium: false,
        caracteristicas: ['Característica 1', 'Característica 2']
      };

      const planCreado = crearPlan(nuevoPlan);

      expect(planCreado).toBeDefined();
      expect(planCreado.id).toBeDefined();
      expect(planCreado.nombre).toBe('Plan Test');
      expect(planCreado.precio).toBe(1.5);
    });

    it('debe guardar el plan en localStorage', () => {
      const nuevoPlan = {
        nombre: 'Plan Test 2',
        precio: 2.0,
        unidad: 'UF',
        esFreemium: false,
        caracteristicas: []
      };

      crearPlan(nuevoPlan);
      const planes = leerPlanes();
      const planEncontrado = planes.find(p => p.nombre === 'Plan Test 2');

      expect(planEncontrado).toBeDefined();
      expect(planEncontrado.precio).toBe(2.0);
    });
  });

  describe('leerPlanes', () => {
    it('debe retornar un array de planes', () => {
      const planes = leerPlanes();

      expect(Array.isArray(planes)).toBe(true);
      expect(planes.length).toBeGreaterThan(0);
    });

    it('debe retornar planes con estructura correcta', () => {
      const planes = leerPlanes();

      if (planes.length > 0) {
        const plan = planes[0];
        expect(plan.id).toBeDefined();
        expect(plan.nombre).toBeDefined();
        expect(plan.precio).toBeDefined();
        expect(plan.unidad).toBeDefined();
      }
    });
  });

  describe('actualizarPlan', () => {
    it('debe actualizar un plan existente', () => {
      const planes = leerPlanes();
      if (planes.length === 0) {
        crearPlan({ nombre: 'Plan Test', precio: 1.0, unidad: 'UF', esFreemium: false, caracteristicas: [] });
      }

      const planesActualizados = leerPlanes();
      const planId = planesActualizados[0].id;
      const cambios = { precio: 99.99 };

      const planActualizado = actualizarPlan(planId, cambios);

      expect(planActualizado).toBeDefined();
      expect(planActualizado.precio).toBe(99.99);
    });

    it('debe retornar null si el plan no existe', () => {
      const resultado = actualizarPlan(99999, { precio: 100 });

      expect(resultado).toBeNull();
    });
  });

  describe('eliminarPlan', () => {
    it('debe eliminar un plan existente', () => {
      const nuevoPlan = crearPlan({
        nombre: 'Plan a Eliminar',
        precio: 1.0,
        unidad: 'UF',
        esFreemium: false,
        caracteristicas: []
      });

      const antes = leerPlanes().length;
      const eliminado = eliminarPlan(nuevoPlan.id);
      const despues = leerPlanes().length;

      expect(eliminado).toBe(true);
      expect(despues).toBe(antes - 1);
    });

    it('debe retornar false si el plan no existe', () => {
      const resultado = eliminarPlan(99999);

      expect(resultado).toBe(false);
    });
  });
});

