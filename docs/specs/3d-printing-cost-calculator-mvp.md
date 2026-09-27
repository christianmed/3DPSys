# Especificación Técnica: Calculadora de Costos de Impresión 3D (3DCalc Venezuela)

**Documento:** `docs/specs/3d-printing-cost-calculator-mvp.md`  
**Estado:** Propuesta para Aprobación  
**Versión:** 1.0.0 (MVP)  
**Fecha:** 2026-09-27

---

## 1. Contexto y Objetivos de Negocio

### 1.1 Contexto

En Venezuela, los talleres y makers de impresión 3D enfrentan desafíos operativos y financieros que las herramientas internacionales (como 3DPCC, Prusa Calculator o Omni) no resuelven:

1. **Doble moneda y disparidad cambiaria:** Los presupuestos se calculan y preservan en dólares estadounidenses (USD), pero se liquidan frecuentemente en Bolívares (VES) mediante Pago Móvil o transferencia según la tasa del día (Euro BCV para comercios formales, o Binance P2P USDT para reposición de divisas).
2. **Costo de reposición real:** El precio de una bobina de filamento no es solo el valor del plástico, sino el costo puesto en taller (precio de compra + flete/delivery prorrateado).
3. **Merma e inestabilidad eléctrica:** Las fallas de impresión originadas por fluctuaciones eléctricas, despegues térmicos o humedad exigen incorporar un factor de merma porcentual para no erosionar el margen de beneficio.
4. **Cierre de ventas vía WhatsApp:** En el ecosistema comercial venezolano, el canal predominante de atención y cierre de ventas es WhatsApp, requiriendo presupuestos formateados al instante con desglose, tiempos y cuentas bancarias.

### 1.2 Objetivo del Producto

Construir una Web Application moderna, responsiva (_mobile-first_) e instalable como PWA, optimizada para celular, que permita calcular en menos de 1 minuto el costo real de una pieza FDM en USD y Bolívares, exportando la cotización con 1 tap hacia WhatsApp o generando un PDF profesional.

---

## 2. Alcance (Scope)

### 2.1 In-Scope (MVP v1)

- **Motor de Costeo FDM:**
  - Consumo de filamento (gramos $\times$ costo por gramo calculado con flete prorrateado).
  - Consumo eléctrico: Potencia de impresora (W), tiempo de impresión (horas/minutos) y costo kWh.
  - Tarifa horaria de máquina: Desgaste, mantenimiento y amortización.
  - Factor de Merma / Riesgo Eléctrico (% configurable, ej. 5% a 15%).
  - Costos de mano de obra (preparación de archivo, post-procesado, remoción de soportes) a tarifa horaria definida por el maker.
  - Insumos extras de hardware (tornillos, insertos roscados, imanes, etc.).
  - Empaque y embalaje (bolsas, cajas, etiquetas, silica gel).
  - Niveles de margen de ganancia: Competitivo (25%), Estándar (40%), Premium (60%), Lujo (80%) y Personalizado (%).
- **Módulo Cambiario (USD $\leftrightarrow$ VES):**
  - Consulta de tasas del día (Euro BCV, Dólar BCV y Binance P2P / Mercado paralelo) mediante API con respaldo local/offline.
  - Selector activo de tipo de cambio y posibilidad de **edición manual instantánea**.
- **Gestor de Perfiles Locales (Offline First):**
  - Catálogo de impresoras guardadas (nombre, potencia en Watts, tarifa de desgaste/hora).
  - Catálogo de bobinas de filamento (marca, tipo de material: PLA/PETG/ABS/TPU, costo por bobina, peso neto, flete prorrateado).
- **Formatos de Entrega / Exportación:**
  - **WhatsApp:** Generación y copiado al portapapeles de mensaje formateado con negritas, emojis, desglose detallado en USD y Bs, plazo de entrega y datos de pago (Pago Móvil / Zelle / Binance).
  - **PDF:** Generación e impresión/descarga de cotización formal limpia y profesional.
- **Historial de Cotizaciones:** Almacenamiento local de presupuestos realizados con buscador y fecha.
- **Diseño UI/UX:** Interfaz táctil ultra-rápida, estética moderna estilo 3DPCC (Space Grotesk / Inter, paleta neutra oscura/clara, acentos índigo y visualización de barras de desglose de costos en tiempo real).

### 2.2 Out-of-Scope (Fase 2 / Futuro)

- Impresión en Resina (SLA / MSLA / DLP).
- Autenticación de usuarios y login activo en servidor (la arquitectura dejará el contrato listo para Supabase, pero la v1 opera 100% en cliente).
- Pasarelas de cobro automatizado para suscripciones.
- Sincronización multi-dispositivo en la nube.

---

## 3. Arquitectura y Stack Tecnológico

### 3.1 Stack

- **Framework:** Next.js (App Router) + React + TypeScript (Estricto).
- **Estilos:** Tailwind CSS o CSS Modules con variables de diseño personalizadas (tokens para Dark/Light mode, sombras suaves y componentes tipo tarjeta).
- **Almacenamiento (v1):** `LocalStorage` / `IndexedDB` a través de la abstracción `IStorageRepository`.
- **Migración a Supabase (v2):** Tipos TypeScript generados compatibles con las tablas `printers`, `materials`, `quotes`, `settings`.
- **Pruebas:** Vitest + React Testing Library (100% cobertura en lógica matemática y servicios).
- **Despliegue:** Optimizado para **Vercel** y PWA compatible con navegadores móviles (Chrome/Safari en Android/iOS).

### 3.2 Estructura del Proyecto

```text
3DCalc/
├── docs/
│   └── specs/
│       └── 3d-printing-cost-calculator-mvp.md
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Calculadora interactiva principal
│   │   ├── history/page.tsx       # Historial de cotizaciones
│   │   ├── settings/page.tsx      # Configuración de impresoras, filamentos y tasas
│   │   └── globals.css
│   ├── components/
│   │   ├── calculator/            # Inputs, sliders, desglose visual de costos
│   │   ├── currency/              # Widget de tasa cambiaria (BCV / Binance / Manual)
│   │   ├── export/                # Modales y botones de WhatsApp y PDF
│   │   └── ui/                    # Botones, Cards, Dialogs, Badges
│   ├── lib/
│   │   ├── calculator/            # Motor matemático puro (costingEngine.ts)
│   │   ├── currency/              # Adaptador de tasas cambiarias (exchangeRateService.ts)
│   │   ├── storage/               # Interfaz IStorageRepository + LocalStorageAdapter
│   │   └── export/                # Formateador WhatsApp + Plantilla PDF
│   └── types/                     # Modelos de datos (Printer, Material, Quote, CostBreakdown)
└── tests/
    └── unit/
        ├── calculator.test.ts
        └── currency.test.ts
```

---

## 4. Fórmulas Matemáticas del Motor de Costeo

$$Costo_{Total} = Costo_{Material} + Costo_{Energía} + Costo_{Máquina} + Costo_{ManoObra} + Costo_{Hardware} + Costo_{Empaque} + Margen_{Merma}$$

1. **Costo Real del Filamento por Gramo ($C_g$):**
   $$C_g = \frac{Precio_{Bobina} + Flete_{Prorrateado}}{Peso_{Neto\ Bobina\ en\ gramos}}$$
   $$Costo_{Material} = Peso_{Pieza\ (g)} \times C_g$$

2. **Costo Eléctrico ($C_E$):**
   $$C_E = \left( \frac{Potencia\ (Watts)}{1000} \right) \times Horas_{Impresión} \times Tarifa_{kWh}$$

3. **Costo de Máquina / Desgaste ($C_M$):**
   $$C_M = Horas_{Impresión} \times Tarifa_{Hora\ Máquina}$$

4. **Margen de Merma / Riesgo Eléctrico ($M_R$):**
   $$M_R = (Costo_{Material} + Costo_{Energía} + Costo_{Máquina}) \times \left( \frac{\%\ Merma}{100} \right)$$

5. **Costo de Mano de Obra ($C_L$):**
   $$C_L = \left( \frac{Minutos_{Preparación} + Minutos_{PostProceso}}{60} \right) \times Tarifa_{Hora\ ManoObra}$$

6. **Precio Sugerido según Margen de Beneficio ($P_V$):**
   $$Subtotal = Costo_{Total}$$
   $$P_V = Subtotal \times \left( 1 + \frac{\%\ Margen}{100} \right)$$

7. **Conversión a Bolívares (VES):**
   $$Total_{VES} = P_V \times Tasa_{Seleccionada}$$

---

## 5. Casos de Prueba de Aceptación (BDD)

### Caso 1: Cálculo exacto de costo de filamento con flete prorrateado

- **Given:** Una bobina de PLA de $135 por 6 unidades ($22.50 c/u) con flete de $5 repartido entre las 6 ($0.833 de flete por bobina). Costo unitario bobina = $23.333 por 1000 g.
- **When:** Se ingresa una pieza que consume 150 gramos.
- **Then:** El costo de material debe ser exactamente $3.50 USD ($23.333 / 1000 \* 150).

### Caso 2: Aplicación del factor de merma por riesgo eléctrico

- **Given:** Una pieza con costo base de material ($3.50), energía ($0.20) y máquina ($0.80), sumando $4.50.
- **When:** El usuario tiene configurado un 10% de merma eléctrica/riesgo.
- **Then:** El sistema calcula $0.45 de merma y el costo operativo total base resulta en $4.95 USD antes de mano de obra y márgenes.

### Caso 3: Generación del mensaje para WhatsApp con doble moneda

- **Given:** Una cotización finalizada con un precio de venta de $12.00 USD y una tasa seleccionada de 65.00 VES/USD.
- **When:** El usuario presiona el botón "Copiar para WhatsApp".
- **Then:** El portapapeles recibe un texto formateado que incluye:
  - Nombre de la pieza y especificaciones técnicas (material, color, tiempo).
  - Precio en USD: **$12.00**.
  - Precio en Bolívares: **780.00 Bs.** (calculado con la tasa de 65.00).
  - Métodos de pago aceptados configurados por el usuario.

### Caso 4: Selección y edición manual de la tasa de cambio

- **Given:** La app obtiene de la API una tasa Euro BCV de 58.00 VES.
- **When:** El usuario pulsa sobre la tasa y escribe manualmente 62.50 VES.
- **Then:** El cálculo en Bolívares se recalcula instantáneamente con 62.50 sin bloquearse ni esperar reconsultas a la red.

---

## 6. Consideraciones de Seguridad y Rendimiento

- **Rendimiento Móvil:**
  - Bundle size mínimo; sin librerías pesadas innecesarias.
  - Los cálculos matemáticos son puramente reactivos y síncronos en memoria (<5 ms de tiempo de respuesta).
  - Caché de tasas en `localStorage` con TTL de 30 minutos para garantizar funcionamiento inmediato incluso con conectividad inestable.
- **Seguridad de Datos:**
  - Todos los datos del usuario (perfiles, precios de costo, datos de cuentas bancarias) se almacenan localmente en el dispositivo. No hay fuga de datos de clientes ni de costos hacia servidores externos.
  - Sanitización estricta de entradas de texto al renderizar PDFs o exportar a WhatsApp.

---

## 7. Límites y Reglas de Desarrollo (Boundaries)

- **Always:**
  - Mantener tipado estricto en TypeScript sin `any`.
  - Desarrollar primero las pruebas unitarias para el motor de costeo antes de enlazar la interfaz (TDD).
  - Diseñar una arquitectura UI responsiva con doble experiencia:
    * **Móvil (360px a 430px CSS viewport):** Flujo ergonómico vertical para pulgar con barra flotante de totales.
    * **Laptop/Desktop (≥1024px):** Layout de 2 columnas estilo 3DPCC (formulario modular a la izquierda + panel de cotización/desglose sticky a la derecha).
  - Modo oscuro premium basado en tono carbón azulado (Slate Navy `#1a1b26` según referencia del usuario, superficies `#24283b` y acentos contrastantes) evitando el negro plano `#000000`.
- **Ask First:**
  - Modificar dependencias del proyecto o cambiar la interfaz del repositorio de datos.
  - Añadir campos obligatorios que alteren la fórmula principal de costeo.
- **Never:**
  - Forzar inicio de sesión o bloquear la calculadora si el usuario no tiene internet.
  - Almacenar contraseñas o claves privadas de servicios de pago en el código.
