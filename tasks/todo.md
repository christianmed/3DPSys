# Task List: Calculadora de Costos de Impresión 3D (3DCalc Venezuela)

- [x] **Task 1: Setup inicial del proyecto Next.js y entorno de pruebas**
  - **Acceptance:** Proyecto Next.js configurado con TypeScript, Tailwind CSS y Vitest ejecutando pruebas unitarias.
  - **Verify:** `npm test` y `npm run build` ejecutan sin errores.
  - **Files:** `package.json`, `tsconfig.json`, `vitest.config.ts`, `src/app/layout.tsx`.

- [x] **Task 2: Modelado de tipos de dominio (compatible con Supabase)**
  - **Acceptance:** Interfaces y tipos TypeScript definidos para `Printer`, `Material`, `Quote`, `CostBreakdown`, `UserSettings` y `ExchangeRate`.
  - **Verify:** `npx tsc --noEmit` valida sin errores de tipos.
  - **Files:** `src/types/index.ts`.

- [x] **Task 3: Implementación con TDD del motor de costeo FDM**
  - **Acceptance:** Lógica matemática completa (flete prorrateado, energía en W, desgaste de máquina, merma eléctrica, mano de obra, márgenes y conversión a Bs) probada con casos BDD.
  - **Verify:** Suite completa de tests unitarios en verde (`npm test tests/unit/costingEngine.test.ts`).
  - **Files:** `src/lib/calculator/costingEngine.ts`, `tests/unit/costingEngine.test.ts`.

- [x] **Checkpoint 1: Foundation & Core Math**
  - [x] Todas las pruebas unitarias pasan al 100%.
  - [x] El motor matemático calcula exactamente casos con flete prorrateado y merma por riesgo eléctrico.

- [x] **Task 4: Servicio de tasas de cambio con caché y edición manual**
  - **Acceptance:** Consulta de tasas Euro BCV, Dólar BCV y Binance USDT con caché local en LocalStorage y opción de sobreescritura manual inmediata.
  - **Verify:** Pruebas unitarias de parsing y caché en verde (`npm test tests/unit/exchangeRateService.test.ts`).
  - **Files:** `src/lib/currency/exchangeRateService.ts`, `tests/unit/exchangeRateService.test.ts`.

- [x] **Task 5: Repositorio de almacenamiento local con datos semilla**
  - **Acceptance:** Implementación de `IStorageRepository` con `LocalStorageRepository` que provee CRUD para impresoras, materiales y cotizaciones, precargando datos por defecto.
  - **Verify:** Pruebas unitarias de almacenamiento en verde.
  - **Files:** `src/lib/storage/types.ts`, `src/lib/storage/localStorageRepository.ts`, `src/lib/storage/defaultData.ts`.

- [x] **Checkpoint 2: Services**
  - [x] Pruebas de integración de servicios en verde.
  - [x] Comportamiento garantizado offline.

- [x] **Task 6: Layout responsivo (Móvil y Laptop/Desktop), tokens de diseño y barra de tasas**
  - **Acceptance:** Sistema de diseño Dark/Light con tema oscuro Slate Navy/Tokyo Night (`#1a1b26`), cabecera con widget interactivo de tasa de cambio y contenedor responsivo (columna única en celular, 2 columnas ergonómicas en laptop estilo 3DPCC).
  - **Verify:** Renderizado adaptable correcto en viewports móviles (390px) y desktop (1280px).
  - **Files:** `src/app/globals.css`, `src/components/layout/Header.tsx`, `src/components/currency/CurrencyBar.tsx`.

- [x] **Task 7: Formulario interactivo de costeo FDM**
  - **Acceptance:** Entradas numéricas táctiles y de teclado rápido, selectores con autocompletado de filamento e impresora, campos de extras/mano de obra/merma, organizados en tarjetas modulares.
  - **Verify:** Interacción reactiva sin latencia en cambios de inputs tanto con toque como con teclado/mouse.
  - **Files:** `src/components/calculator/CalculatorForm.tsx`, `src/components/calculator/MaterialSelector.tsx`, `src/components/calculator/PrinterSelector.tsx`.

- [x] **Task 8: Panel visual de desglose de costos en tiempo real (Sticky en Laptop)**
  - **Acceptance:** Visualización de barras proporcionales de costos (Material, Energía, Máquina, Mano de obra, Extras, Merma), selector de margen de ganancia y tarjetas de precio final en USD y Bs. En laptop se mantiene sticky en la columna derecha.
  - **Verify:** Verificación de correspondencia exacta entre números y gráficos en ambas vistas.
  - **Files:** `src/components/calculator/CostBreakdownCard.tsx`, `src/components/calculator/PriceSummary.tsx`.

- [x] **Checkpoint 3: Interactive Calculator**
  - [x] Calculadora interactiva y reactiva operativa en pantalla móvil.
  - [x] Actualización en tiempo real de todos los costos.

- [x] **Task 9: Generador de mensaje para WhatsApp y configuración de pagos**
  - **Acceptance:** Botón de copiado con un tap que genera texto con formato, emojis, desglose en $ y Bs, y datos bancarios configurables (Pago Móvil, Zelle, Binance).
  - **Verify:** Portapapeles recibe el mensaje con formato correcto y legible.
  - **Files:** `src/lib/export/whatsappFormatter.ts`, `src/components/export/WhatsAppExportModal.tsx`.

- [x] **Task 10: Generador de cotización en PDF**
  - **Acceptance:** Generación de PDF formal con membrete del taller, desglose para cliente y validez de la oferta.
  - **Verify:** Descarga exitosa de PDF visualmente atractivo y alineado.
  - **Files:** `src/lib/export/pdfGenerator.ts`.

- [x] **Task 11: Historial de cotizaciones guardadas**
  - **Acceptance:** Pantalla para listar, buscar, recargar en la calculadora o eliminar cotizaciones pasadas.
  - **Verify:** Guardar una cotización la hace visible en el historial y recargable en el formulario.
  - **Files:** `src/app/history/page.tsx`.

- [x] **Checkpoint 4: End-to-End Flow**
  - [x] Flujo completo verificado: cálculo -> guardado -> exportación WhatsApp y PDF.

- [x] **Task 12: Auditoría en 5 Ejes y configuración PWA**
  - **Acceptance:** Revisión rigurosa en Arquitectura, Seguridad, Rendimiento, Calidad de Pruebas y Mantenibilidad. Manifesto y meta tags para instalación en celular.
  - **Verify:** Build de producción limpio (`npm run build`) y manifest PWA válido.
  - **Files:** `public/manifest.json`, `docs/reviews/audit-5-axes.md`.
