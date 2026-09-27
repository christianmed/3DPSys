# Implementation Plan: Calculadora de Costos de Impresión 3D (3DCalc Venezuela)

## Overview

Construcción vertical e incremental de una Web Application responsiva (_mobile-first_) en Next.js (App Router) + TypeScript, optimizada para cotizar impresiones 3D FDM en Venezuela en USD y Bolívares. El sistema opera offline-first en v1 con LocalStorage, con abstracción de repositorio lista para Supabase en v2 y despliegue final en Vercel.

## Architecture Decisions

- **Next.js App Router + TypeScript Estricto:** Proporciona renderizado ágil, tipado seguro y compatibilidad nativa con Vercel.
- **TDD en el Motor de Costeo:** Lógica matemática desacoplada de la UI (`src/lib/calculator/costingEngine.ts`) con suite de pruebas unitarias en Vitest antes de escribir componentes visuales.
- **Repository Pattern (`IStorageRepository`):** Permite cambiar de `LocalStorageAdapter` a `SupabaseAdapter` sin alterar una sola línea de la lógica de interfaz de usuario.
- **Mobile-First UX / 3DPCC Aesthetic:** Interfaz táctil ergonómica para celulares (controles de fácil toque, modo oscuro/claro de alto contraste, visualización en tiempo real del desglose de costos).
- **Cero dependencias bloqueantes para cotizar:** Si no hay internet, la app funciona completamente con tasas en caché o ingresadas a mano.

---

## Task List

### Phase 1: Fundaciones y Motor de Costeo (TDD)

- [ ] **Task 1:** Inicialización del proyecto Next.js + TypeScript + Tailwind CSS y configuración de Vitest.
- [ ] **Task 2:** Modelado de tipos de dominio (Printer, Material, Quote, CostBreakdown, Settings) compatibles con Supabase.
- [ ] **Task 3:** Implementación guiada por pruebas (TDD) del motor de costeo FDM (`costingEngine.ts`) cubriendo todas las fórmulas matemáticas y casos de aceptación BDD.

### Checkpoint: Foundation & Core Math

- [ ] Todas las pruebas unitarias pasan al 100% (`npm test`).
- [ ] El motor matemático calcula exactamente casos con flete prorrateado y merma por riesgo eléctrico.

---

### Phase 2: Servicios de Datos y Tasas de Cambio

- [ ] **Task 4:** Implementación del servicio de tasas de cambio (`exchangeRateService.ts`) con consulta a API pública, almacenamiento en caché y sobreescritura manual.
- [ ] **Task 5:** Implementación del repositorio de almacenamiento (`IStorageRepository` + `LocalStorageRepository`) con precarga de impresoras y filamentos comunes.

### Checkpoint: Services

- [ ] Pruebas unitarias de servicios de tasas y persistencia aprobadas.
- [ ] Funcionamiento garantizado con y sin conexión de red.

---

### Phase 3: Interfaz de Usuario Mobile-First (Core UI)

- [ ] **Task 6:** Layout base responsivo, sistema de tokens estéticos (Dark/Light mode) y cabecera con widget de tasa cambiaria (USD/VES editable).
- [ ] **Task 7:** Formulario interactivo de costeo FDM (inputs táctiles, selector de material/impresora y slider de margen de beneficio).
- [ ] **Task 8:** Panel visual de resultados y desglose de costos en tiempo real (estilo 3DPCC, tarjetas en USD y Bs).

### Checkpoint: Interactive Calculator

- [ ] Interfaz completamente interactiva y reactiva en pantalla móvil (<430px).
- [ ] Cambios en cualquier input recalculan el total al instante.

---

### Phase 4: Canales de Salida (WhatsApp & PDF) e Historial

- [ ] **Task 9:** Módulo de exportación a WhatsApp (copiado al portapapeles de mensaje formateado con desglose y métodos de pago).
- [ ] **Task 10:** Módulo de generación de cotización formal descargable en PDF.
- [ ] **Task 11:** Vista y gestión del historial de cotizaciones guardadas (consultar, recargar y eliminar).

### Checkpoint: End-to-End Flow

- [ ] Flujo completo de cotización probado: cálculo -> guardado -> exportación a WhatsApp y PDF.

---

### Phase 5: Calidad, Rendimiento y Revisión en 5 Ejes

- [ ] **Task 12:** Auditoría de calidad de código en 5 ejes (Arquitectura, Seguridad, Rendimiento, Calidad de Pruebas, Mantenibilidad) y preparación PWA.

---

## Risks and Mitigations

| Riesgo                                               | Impacto | Mitigación                                                                                  |
| ---------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------- |
| Fallo o bloqueo de la API pública de tasas de cambio | Alto    | Fallback automático a valores en caché local + permitir siempre tipeo manual con 1 toque    |
| Pérdida de datos locales al limpiar navegador        | Medio   | Botón de "Exportar / Importar respaldo JSON" de configuración y perfiles                    |
| Lentitud en celulares de gama de entrada             | Medio   | State management local liviano (React Hooks puros o Zustand), sin renderizados innecesarios |
