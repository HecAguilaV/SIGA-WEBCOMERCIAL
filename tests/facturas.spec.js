import {
  crearFactura,
  obtenerFacturasDelUsuario,
  obtenerFacturaPorNumero,
  buscarFacturaPorId,
  obtenerTodasLasFacturas
} from '../src/datos/datosSimulados.js';

describe('Sistema de Facturas', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  describe('crearFactura', () => {
    it('debe crear una factura con número único', () => {
      const factura = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precio: 0,
        metodoPago: 'tarjeta'
      });

      expect(factura).toBeDefined();
      expect(factura.numero).toMatch(/^FAC-\d{8}-\d{4}$/);
      expect(factura.usuarioId).toBe(1);
      expect(factura.planNombre).toBe('Kiosco');
    });

    it('debe generar números de factura únicos', () => {
      const factura1 = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precio: 0,
        metodoPago: 'tarjeta'
      });

      const factura2 = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precio: 0,
        metodoPago: 'tarjeta'
      });

      expect(factura1.numero).not.toBe(factura2.numero);
    });
  });

  describe('obtenerFacturasDelUsuario', () => {
    it('debe retornar todas las facturas de un usuario', () => {
      crearFactura({
        usuarioId: 1,
        usuarioNombre: 'User 1',
        usuarioEmail: 'user1@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precio: 0,
        metodoPago: 'tarjeta'
      });

      crearFactura({
        usuarioId: 2,
        usuarioNombre: 'User 2',
        usuarioEmail: 'user2@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precio: 0,
        metodoPago: 'tarjeta'
      });

      const facturasUsuario1 = obtenerFacturasDelUsuario(1);
      expect(facturasUsuario1.length).toBe(1);
      expect(facturasUsuario1[0].usuarioId).toBe(1);
    });

    it('debe retornar array vacío si el usuario no tiene facturas', () => {
      const facturas = obtenerFacturasDelUsuario(999);
      expect(facturas).toEqual([]);
    });
  });

  describe('obtenerFacturaPorNumero', () => {
    it('debe encontrar una factura por su número', () => {
      const factura = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precio: 0,
        metodoPago: 'tarjeta'
      });

      const encontrada = obtenerFacturaPorNumero(factura.numero);
      expect(encontrada).toBeDefined();
      expect(encontrada.id).toBe(factura.id);
      expect(encontrada.numero).toBe(factura.numero);
    });

    it('debe retornar null si la factura no existe', () => {
      const encontrada = obtenerFacturaPorNumero('FAC-20241201-0000');
      expect(encontrada).toBeNull();
    });
  });

  describe('buscarFacturaPorId', () => {
    it('debe encontrar una factura por su ID', () => {
      const factura = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precio: 0,
        metodoPago: 'tarjeta'
      });

      const encontrada = buscarFacturaPorId(factura.id);
      expect(encontrada).toBeDefined();
      expect(encontrada.id).toBe(factura.id);
    });

    it('debe retornar null si la factura no existe', () => {
      const encontrada = buscarFacturaPorId('id-inexistente');
      expect(encontrada).toBeNull();
    });
  });

  describe('obtenerTodasLasFacturas', () => {
    it('debe retornar todas las facturas del sistema', () => {
      crearFactura({
        usuarioId: 1,
        usuarioNombre: 'User 1',
        usuarioEmail: 'user1@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precio: 0,
        metodoPago: 'tarjeta'
      });

      crearFactura({
        usuarioId: 2,
        usuarioNombre: 'User 2',
        usuarioEmail: 'user2@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precio: 0,
        metodoPago: 'tarjeta'
      });

      const todas = obtenerTodasLasFacturas();
      expect(todas.length).toBeGreaterThanOrEqual(2);
    });

    it('debe retornar array vacío si no hay facturas', () => {
      localStorage.clear();
      const todas = obtenerTodasLasFacturas();
      expect(todas).toEqual([]);
    });
  });
});

