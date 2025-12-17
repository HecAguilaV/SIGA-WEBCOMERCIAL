# Bitácora de Decisiones y Alineación - SIGA WebComercial

**Fecha:** 16 de Diciembre 2025
**Estado:** ✨ Visualmente Unificado & Filosóficamente Alineado

Este documento preserva el "entendimiento compartido" entre el Desarrollador (Héctor) y el Asistente, para garantizar que la visión nunca se pierda, incluso si se reinicia el entorno.

## 1. Identidad y Filosofía (El "Alma" de SIGA)
> **Fuente de Verdad:** `static/docs/SIGA.md` y `SIGA-BACKEND/docs/VISION_SIGA_ASISTENTE_IA.md`

*   **Mantra Principal:** *"Que el emprendedor nunca se detenga."*
*   **Propuesta de Valor:** *"No gestiones tu inventario, gestiona tu tiempo."*
*   **Definición Operativa:** "SIGA reduce la fricción operativa traduciendo la intención del negocio en acciones automáticas."
*   **Valores Clave:** Menos Fricción • Más Intención • Automatización.

## 2. Sistema de Diseño (Visual "Modern SaaS")
Hemos migrado de un estilo "Bootstrap Genérico" a una identidad propia y premium:

*   **Paleta de Colores:**
    *   **Fondo:** `Deep Blue (#03045e)` con gradientes complejos hacia Cyan. (Adiós al fondo blanco clínico).
    *   **Aentos:** Cyan Vibrante (`#00b4d8`) y Neon (`#80ffdb`).
    *   **Texto:** Blanco predominante para alto contraste en modo oscuro.
*   **Estilo UI:** **Glassmorphism** (Cristal).
    *   Paneles translúcidos con `backdrop-filter: blur(20px)`.
    *   Bordes sutiles `rgba(255,255,255, 0.2)`.
    *   **Cards de Planes:** Fondo casi opaco (`95% white`) para legibilidad, pero manteniendo el borde glass.
*   **Identidad Gráfica:**
    *   **Logo:** Se usa `Logo_SIGA.png` oficial en Navbar y Footer (No más íconos de cohetes genéricos).
    *   **Hero:** Video demostrativo real (`demo-sigaapp.mp4`) enmarcado en un dispositivo "Glass Dashboard".

## 3. Componentes Clave Ajustados

### Asistente Contextual (`AsistenteIA.jsx`)
*   **Estado Anterior:** Estilo "Windows 98" (sin CSS importado), desalineado de la WebApp.
*   **Estado Actual:**
    *   Visualmente idéntico a la WebApp (Panel flotante, Glassmorphism).
    *   Input de chat redondo con micrófono integrado.
    *   Mantiene la lógica de backend (`chatComercial`) pero con la "piel" nueva.

### Home Page (`HomePage.jsx`)
*   Incorpora la **Visión Real** en el banner intermedio.
*   Muestra el **Video Demo** en el Hero.
*   Usa íconos `Phosphor-React` consistentes (`ChartLineUp`, `Storefront`).

## 4. Estrategia de Negocio (Precios)
*   **Decisión:** Precios **PÚBLICOS**.
*   **Razón:** Alineación con "Menos Fricción". Ocultar precios detiene al emprendedor (va en contra del mantra).

---
*Este documento sirve como "Checkpoint" de la personalidad de SIGA.*
