import { crearFactura, obtenerFacturasDelUsuario, obtenerFacturaPorNumero, obtenerFacturaPorId } from '../src/datos/datosSimulados.js';

/**
 * Tests para las funciones de gestión de facturas
 * 
 * Estas pruebas verifican que las funciones CRUD de facturas funcionen correctamente:
 * - Creación de facturas con número único
 * - Obtención de facturas por usuario
 * - Búsqueda de facturas por ID y número
 * - Validación de formato de número de factura
 */
describe('Funciones de Facturas', () => {
  // Limpiar localStorage antes de cada test para evitar interferencias
  beforeEach(() => {
    localStorage.clear();
  });

  // Limpiar localStorage después de cada test
  afterEach(() => {
    localStorage.clear();
  });

  describe('crearFactura', () => {
    it('debe crear una factura con número único', () => {
      // Datos de prueba para crear una factura
      const datosFactura = {
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@ejemplo.com',
        planId: 2,
        planNombre: 'Emprendedor Pro',
        precioUF: 0.9,
        precioCLP: 34140.81,
        unidad: 'UF',
        metodoPago: 'Tarjeta de crédito',
        ultimos4Digitos: '4242',
      };

      // Crear la factura
      const factura = crearFactura(datosFactura);

      // Verificar que la factura se creó correctamente
      expect(factura).not.toBeNull();
      expect(factura.id).toBeGreaterThan(0);
      expect(factura.numeroFactura).toMatch(/^FAC-\d{8}-\d{4}$/); // Formato FAC-YYYYMMDD-XXXX
      expect(factura.usuarioId).toBe(1);
      expect(factura.planNombre).toBe('Emprendedor Pro');
      expect(factura.estado).toBe('pagada');
      expect(factura.fechaCompra).toBeDefined();
    });

    it('debe generar números de factura únicos para múltiples facturas', () => {
      const datosFactura = {
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@ejemplo.com',
        planId: 2,
        planNombre: 'Emprendedor Pro',
        precioUF: 0.9,
        unidad: 'UF',
      };

      // Crear dos facturas
      const factura1 = crearFactura(datosFactura);
      const factura2 = crearFactura(datosFactura);

      // Verificar que tienen números diferentes
      expect(factura1.numeroFactura).not.toBe(factura2.numeroFactura);
      expect(factura1.id).not.toBe(factura2.id);
    });

    it('debe incluir fecha de vencimiento si se proporciona', () => {
      const fechaVencimiento = new Date();
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);

      const datosFactura = {
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@ejemplo.com',
        planId: 2,
        planNombre: 'Emprendedor Pro',
        precioUF: 0.9,
        unidad: 'UF',
        fechaVencimiento: fechaVencimiento.toISOString(),
      };

      const factura = crearFactura(datosFactura);
      expect(factura.fechaVencimiento).toBe(fechaVencimiento.toISOString());
    });
  });

  describe('obtenerFacturasDelUsuario', () => {
    it('debe retornar todas las facturas de un usuario específico', () => {
      // Crear facturas para diferentes usuarios
      crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Usuario 1',
        usuarioEmail: 'usuario1@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precioUF: 0,
        unidad: 'UF',
      });

      crearFactura({
        usuarioId: 2,
        usuarioNombre: 'Usuario 2',
        usuarioEmail: 'usuario2@test.com',
        planId: 2,
        planNombre: 'Emprendedor Pro',
        precioUF: 0.9,
        unidad: 'UF',
      });

      crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Usuario 1',
        usuarioEmail: 'usuario1@test.com',
        planId: 2,
        planNombre: 'Emprendedor Pro',
        precioUF: 0.9,
        unidad: 'UF',
      });

      // Obtener facturas del usuario 1
      const facturasUsuario1 = obtenerFacturasDelUsuario(1);

      // Verificar que solo retorna las facturas del usuario 1
      expect(facturasUsuario1.length).toBe(2);
      expect(facturasUsuario1.every(f => f.usuarioId === 1)).toBeTrue();
    });

    it('debe retornar facturas ordenadas por fecha (más reciente primero)', () => {
      // Crear facturas con diferentes fechas
      const factura1 = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Usuario 1',
        usuarioEmail: 'usuario1@test.com',
        planId: 1,
        planNombre: 'Kiosco',
        precioUF: 0,
        unidad: 'UF',
      });

      // Esperar un momento para que la segunda factura tenga fecha diferente
      const factura2 = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Usuario 1',
        usuarioEmail: 'usuario1@test.com',
        planId: 2,
        planNombre: 'Emprendedor Pro',
        precioUF: 0.9,
        unidad: 'UF',
      });

      const facturas = obtenerFacturasDelUsuario(1);

      // Verificar que están ordenadas (más reciente primero)
      expect(facturas.length).toBe(2);
      expect(new Date(facturas[0].fechaCompra).getTime()).toBeGreaterThanOrEqual(
        new Date(facturas[1].fechaCompra).getTime()
      );
    });

    it('debe retornar array vacío si el usuario no tiene facturas', () => {
      const facturas = obtenerFacturasDelUsuario(999);
      expect(facturas).toEqual([]);
      expect(facturas.length).toBe(0);
    });
  });

  describe('obtenerFacturaPorId', () => {
    it('debe retornar una factura existente por su ID', () => {
      const factura = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@ejemplo.com',
        planId: 2,
        planNombre: 'Emprendedor Pro',
        precioUF: 0.9,
        unidad: 'UF',
      });

      const facturaEncontrada = obtenerFacturaPorId(factura.id);

      expect(facturaEncontrada).not.toBeNull();
      expect(facturaEncontrada.id).toBe(factura.id);
      expect(facturaEncontrada.numeroFactura).toBe(factura.numeroFactura);
    });

    it('debe retornar null si la factura no existe', () => {
      const factura = obtenerFacturaPorId(9999);
      expect(factura).toBeNull();
    });
  });

  describe('obtenerFacturaPorNumero', () => {
    it('debe retornar una factura existente por su número', () => {
      const factura = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@ejemplo.com',
        planId: 2,
        planNombre: 'Emprendedor Pro',
        precioUF: 0.9,
        unidad: 'UF',
      });

      const facturaEncontrada = obtenerFacturaPorNumero(factura.numeroFactura);

      expect(facturaEncontrada).not.toBeNull();
      expect(facturaEncontrada.numeroFactura).toBe(factura.numeroFactura);
      expect(facturaEncontrada.id).toBe(factura.id);
    });

    it('debe retornar null si la factura no existe', () => {
      const factura = obtenerFacturaPorNumero('FAC-20241201-9999');
      expect(factura).toBeNull();
    });

    it('debe validar el formato del número de factura', () => {
      // Crear una factura y verificar que el número tiene el formato correcto
      const factura = crearFactura({
        usuarioId: 1,
        usuarioNombre: 'Test User',
        usuarioEmail: 'test@ejemplo.com',
        planId: 2,
        planNombre: 'Emprendedor Pro',
        precioUF: 0.9,
        unidad: 'UF',
      });

      // El formato debe ser FAC-YYYYMMDD-XXXX
      const regex = /^FAC-\d{8}-\d{4}$/;
      expect(factura.numeroFactura).toMatch(regex);
    });
  });
});

