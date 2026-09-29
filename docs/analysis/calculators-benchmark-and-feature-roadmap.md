# INFORME TÉCNICO COMPARATIVO: CALCULADORAS DE COSTEO 3D Y ROADMAP ESTRATÉGICO 3DPSYS

**Fecha:** 29 de Septiembre de 2026  
**Autor:** Antigravity AI & Equipo de Ingeniería 3DPSys  
**Estado:** Documento de Referencia Técnica y Arquitectura de Producto  
**Objetivo:** Analizar las fortalezas, fallos matemáticos y limitaciones operativas de las calculadoras de 3Dfils y Prusa3D frente a 3DPSys, estableciendo la especificación funcional para la siguiente fase de desarrollo.

---

## 1. CUADRO COMPARATIVO ESTRUCTURAL

| Característica / Dimensión | Calculadora Prusa3D | Calculadora 3Dfils | 3DPSys (Nuestra Plataforma) |
| :--- | :--- | :--- | :--- |
| **Público Objetivo** | Makers internacionales / Comunidad RepRap | Clientes y talleres España / Europa (Euros) | Talleres y Granjas 3D en Latinoamérica / Vzla |
| **Carga de Archivo (G-Code)** | ✅ Sí (.gcode, .bgcode) con extracción de tiempo/peso | ❌ No (entrada 100% manual) | ⏳ Planificado en Roadmap (actualmente manual) |
| **Soporte Multimoneda** | 🟡 Lista amplia de divisas, pero cálculo en 1 sola divisa | ❌ Solo Euros (€) | ✅ **Nativo Bimonetario simultáneo** (USD, BCV, Paralelo, Manual con margen de protección) |
| **Cálculo de Desgaste / Amortización** | ✅ Basado en años retorno, horas diarias y reparaciones | ✅ Coste por hora (Precio / Horas vida útil) | ✅ **Cálculo exacto por hora calibrado** ($0.75/h en Sparkx i7, Bambu P1S) |
| **Modelo Eléctrico** | 🟡 W / 1000 * h * $/kWh | 🟡 W / 1000 * h * €/kWh | ✅ **Fórmula CORPOELEC + 15% Merma por cortes/inestabilidad** |
| **Margen de Ganancia Comercial** | ❌ **Grave confusión**: Solo tiene markup de material para fallos | ✅ Margen de beneficio sobre coste total | ✅ **Escala de 4 niveles centralizada**: Detal (+60%), Mayor (+40%), Volumen (+30%), Gran Mayor (+25%) |
| **Mano de Obra y Postprocesado** | ✅ Preparación + Postprocesado divididos | ✅ Tiempo de preparación y postproceso | ⏳ Absorbibles actualmente en margen comercial o personalizable |
| **Gastos Fijos / Mínimo por Pedido** | ❌ No tiene | ✅ Precio mínimo y comisiones (fijas/%) | ⏳ Planificado en perfiles de taller |
| **Persistencia de Datos / Perfiles** | ❌ No (solo comparte link con nonce web) | ❌ No (formulario volátil de Shopify) | ✅ **Persistencia reactiva en localStorage v4** con catálogo oficial FilaVen/Creality |
| **Exportación a Clientes** | 🟡 Imprimir HTML / Copiar enlace web | ❌ Ninguna | ✅ **Generador de mensaje WhatsApp sobrio** con monoespaciado para bancos y sin fricción de tasa |
| **Diseño y Ergonomía UI/UX** | Clásico WordPress / Bootstrap | Tienda online Shopify genérica | **Dashboard moderno React 19**, Dark/Light mode, paletas dinámicas, responsive móvil |

---

## 2. AUDITORÍA TÉCNICA DETALLADA DE CADA PLATAFORMA

### 2.1. Calculadora Prusa3D (blog.prusa3d.com)

#### A. Características y Fortalezas
1. **Lector de G-Code en Cliente:** Permite arrastrar archivos `.gcode` o `.bgcode` y utiliza JavaScript en el navegador para parsear los comentarios generados por PrusaSlicer, extrayendo instantáneamente los gramos de filamento y la duración de la impresión.
2. **Desglose de Mano de Obra en Dos Fases:** Separa con criterio técnico el tiempo de laminado/preparación (`print-preparation-time`) del tiempo de remoción de soportes y acabados (`postprocessing-time`).
3. **Fórmula de Amortización Dinámica:**
   $$\text{Horas Vida Útil} = \text{Años} \times 365 \times \text{Horas/Día}$$
   $$\text{Coste Hora Máquina} = \frac{\text{Precio Impresora} \times (1 + \frac{\%\text{Reparaciones}}{100})}{\text{Horas Vida Útil}}$$
   Esto educa al usuario sobre la necesidad de reinvertir en boquillas, correas y rodamientos.

#### B. Fallos Críticos y Limitaciones Operativas
1. **Confusión Matemática Fatal (Markup vs. Profit Margin):** Prusa titula el slider como *"Margen"*, pero en el tooltip y en el código se aplica **únicamente como porcentaje de descarte sobre el filamento** (spaghetti, boquillas obstruidas). Si el usuario no activa la mano de obra con una tarifa inflada, el trabajo se vende **a precio de costo de fábrica sin utilidad neta**.
2. **Ausencia de Capa Comercial B2B/B2C:** No tiene concepto de descuentos por volumen, ni cotizaciones formales para clientes finales.
3. **Monodivisa Aislada:** Permite seleccionar "VEF" o "USD", pero no hace conversiones cambiarias dinámicas; asume economías estables con tipo de cambio unitario.
4. **Sin Guardado de Flota ni Inventario:** Si tienes 3 impresoras distintas o 10 materiales, debes reescribir los valores en cada consulta.

---

### 2.2. Calculadora 3Dfils (3dfils.com)

#### A. Características y Fortalezas
1. **Separación Conceptual de Riesgo y Margen:**
   - Campo para **Riesgo / Descarte** (purgas, soportes, piezas fallidas).
   - Campo explícito para **Margen Comercial (%)** aplicado al costo total acumulado.
2. **Precio Mínimo de Pedido:** Factor vital para no perder dinero imprimiendo piezas de 2 gramos que toman 10 minutos de atención al cliente y embalaje.
3. **Gastos de Plataforma y Comisiones:** Permite ingresar comisiones porcentuales (ej. pasarelas de pago 3-5%) y costos fijos por transacción.

#### B. Fallos Críticos y Limitaciones Operativas
1. **Embudo de Marketing Cerrado:** La herramienta está embebida en un entorno Shopify con el fin principal de vender filamentos de su marca.
2. **Cálculo 100% Manual:** No parsea archivos, no ofrece presets de impresoras reales del mercado (Ender, Bambu Lab, Sparkx).
3. **Cero Integración Comercial con el Cliente:** No genera comprobantes, ni links interactivos, ni cotizaciones para canales de mensajería (WhatsApp/Telegram).
4. **Incompatibilidad con Economías Multidivisa:** Todo su modelo asume liquidación en Euros (€) con IVA estándar español.

---

### 2.3. 3DPSys (Nuestra Plataforma)

#### A. Ventajas Competitivas Exclusivas
1. **Motor Cambiario Adaptativo (BCV + Paralelo + Manual):** Conexión en vivo con el Banco Central de Venezuela y dólar monitor, con una tasa manual configurable por defecto a `BCV * 1.16` para absorber diferenciales cambiarios y costos de reposición.
2. **Escala Comercial Inteligente de 4 Niveles:** Centralizada en `MARGIN_TIER_CONFIG`:
   - Detal (1-11 piezas): **+60%**
   - Mayor (12-49 piezas): **+40%**
   - Volumen (50-99 piezas): **+30%** *(Ancla recomendada de taller)*
   - Gran Mayor (100+ piezas): **+25%**
3. **Merma Eléctrica Venezolana Integrada:** Además del consumo por Watts de la máquina, incorpora un 15% de merma por riesgo de microcortes, fluctuaciones y fallos de suministro.
4. **Amortización Específica de Flota:** Costeo horario exacto pre-calibrado ($0.75/h para Creality Sparkx i7 y $0.70/h para Bambu P1S) que contempla compra en 2.000h + reposición de consumibles calientes.
5. **Generador de Mensaje WhatsApp de Ingeniería:** Formato sin emojis, con separadores limpios, datos de pago móvil/banca monoespaciados para copiado en un toque y total con cita resaltada.

#### B. Oportunidades de Mejora Inmediatas
1. Implementar la asignación de **múltiples filamentos por proyecto (Multicolor / AMS)**.
2. Incorporar el visor y almacenamiento de **imágenes de referencia de la pieza**.
3. Ampliar el control de **bobinas e inventario restante vinculado al estado de cotizaciones**.
4. Automatizar la lectura de tiempos y pesos mediante un **parser de G-Code en el navegador**.

---

## 3. ESPECIFICACIÓN Y ROADMAP TÉCNICO: 7 NUEVAS FEATURES

A continuación se detalla la planificación arquitectónica, matemática y de interfaz de usuario para las 7 funcionalidades solicitadas por el taller.

---

### FEATURE 1: Sistema Multicolor / Multimaterial (Multi-Filamento por Proyecto)

#### 1. Justificación y Caso de Uso
Impresiones modernas en máquinas con sistemas multi-color (ej. Bambu AMS, Anycubic ACE, o cambios manuales de filamento en capas específicas) requieren combinar 2, 3 o 4 materiales distintos (ej. llavero negro con letras blancas y borde dorado), cada uno con diferente costo por bobina, densidad y merma por purga.

#### 2. Arquitectura de Datos
Actualmente, el tipo `Quote` almacena un solo `material_id` y `material_name`. Se extenderá hacia un arreglo:

```typescript
export interface ProjectMaterialSlot {
  id: string; // uuid
  material_id: string; // id del catálogo
  material_name: string; // ej. "PLA Sunlu Negro"
  color_hex?: string; // ej. "#111111"
  weight_grams: number; // consumo neto en la pieza
  purge_waste_grams: number; // torre de purga o descarte
  cost_usd: number; // costo calculado automáticamente
}
```

#### 3. Fórmula Matemática Ampliada
$$\text{Costo Material Proyecto} = \sum_{i=1}^{n} \left[ \frac{\text{Peso Neto}_i + \text{Purga}_i}{\text{Peso Bobina}_i} \times \text{Precio Bobina}_i \right]$$

#### 4. Diseño UI/UX
- En la tarjeta de **Material**, un interruptor: `[ Modo Unicolor ] | [ Modo Multicolor ]`.
- En modo multicolor, se despliega una lista de ranuras de material (Slots 1 a 4).
- Cada fila tiene:
  - Selector de material del catálogo.
  - Indicador visual de color (círculo cromático).
  - Campo numérico de gramos.
  - Opción de "Torre de purga estimada" (porcentaje o gramos fijos).
  - Botón sutil `+ Agregar Color` y botón `Eliminar`.

---

### FEATURE 2: Imagen del Producto en Cotizaciones e Historial

#### 1. Caso de Uso
El cliente solicita cotizar una pieza enviando una foto o render 3D. El taller necesita asociar esa imagen a la cotización para que al revisar el historial dentro de 2 meses recuerde exactamente qué pieza era sin tener que abrir el slicer.

#### 2. Estrategia Técnica de Implementación
- **Fase 1 (Frontend Local sin Backend):**
  - Carga de archivo (`image/png`, `image/jpeg`, `image/webp`).
  - Redimensionamiento y compresión en el cliente mediante HTML5 Canvas (máximo 600x600 px, calidad 80%) para mantener el peso menor a 60KB.
  - Almacenamiento en `IndexedDB` (o base64 en `localStorage` con cuota controlada).
- **Fase 2 (Con Base de Datos y Auth):**
  - Subida directa a almacenamiento de objetos (AWS S3, Cloudinary o Supabase Storage).
  - Guardado de la URL segura en la tabla `quotes.image_url`.

#### 3. Experiencia de Usuario (UI/UX)
- Zona de arrastre compacta (Drag & Drop) dentro de la tarjeta de "Parámetros de la Pieza".
- Miniatura previa con botón para cambiar o eliminar.
- En el modal de WhatsApp: opción de incluir texto descriptivo o recordatorio para adjuntar la foto al chat.

---

### FEATURE 3: Inventario Dinámico con Estados de Cotización y Vida Útil de Bobinas

#### 1. Flujo de Estados de la Cotización
Una cotización no debe restar material de inmediato, sino pasar por un ciclo de vida:

```
[ BORRADOR ] ──> [ COTIZADO ] ──> [ APROBADO ] ──> [ EN IMPRESIÓN ] ──> [ FINALIZADO ]
                                         │
                                         └──> [ RECHAZADO ] / [ CANCELADO ]
```

#### 2. Lógica de Inventario
- Cada filamento en el catálogo tiene:
  - `initial_weight_grams` (ej. 1.000 g).
  - `current_weight_grams` (peso disponible real).
  - `reserved_weight_grams` (apartado para pedidos aprobados en cola).
- **Transiciones:**
  - Al pasar a `APROBADO`: `reserved_weight_grams += peso_proyecto`.
  - Si el material disponible es menor al requerido, el sistema arroja una alerta: *"Atención: Te quedan 120g de PETG Gris y este proyecto requiere 180g. Requiere reposición de bobina"*.
  - Al pasar a `FINALIZADO`: `current_weight_grams -= peso_proyecto` y se descuenta de la reserva.
- **Métricas del Taller:**
  - Bobinas vaciadas en el mes.
  - Tasa de consumo por tipo de filamento (PLA vs PETG vs TPU).

---

### FEATURE 4: Métodos de Pago Dinámicos Multi-Cuenta por Perfil

#### 1. Necesidad Operativa
En talleres reales de Venezuela y Latinoamérica, un usuario suele tener:
- 2 números de Pago Móvil (uno Banesco personal, uno Mercantil empresa).
- 2 cuentas bancarias en Bolívares.
- 1 Zelle del taller y 1 Zelle de respaldo de un familiar.
- 1 Binance Pay personal y una wallet USDT secundaria.

#### 2. Modelo de Datos Extensible
Reemplazar el objeto plano `PaymentMethodsConfig` por colecciones tipadas:

```typescript
export interface BankAccountItem {
  id: string;
  category: "PAGO_MOVIL" | "TRANSFERENCIA" | "ZELLE" | "BINANCE" | "EFECTIVO";
  title: string; // ej. "Pago Móvil Banesco Principal"
  enabled: boolean;
  fields: Record<string, string>; // { bank: "Banesco", phone: "...", id: "...", holder: "..." }
}
```

#### 3. UX de Control
- En la sección de configuración de pagos:
  - Cada categoría tiene su bloque colapsable.
  - Botón `+ Agregar Cuenta` debajo de cada método.
  - Interruptor maestro de categoría (ej. apagar todos los Pago Móvil hoy).
  - Interruptor individual por cada cuenta registrada.
  - Al generar el mensaje de WhatsApp, solo se agregan las cuentas activas con su formato monoespaciado para copiado rápido.

---

### FEATURE 5: Logotipo de Empresa y Generador de Presupuestos en PDF

#### 1. Caso de Uso
Clientes corporativos, empresas e instituciones exigen un documento PDF formal con membrete, RIF, número de presupuesto, desglose de cotización y condiciones comerciales.

#### 2. Implementación Técnica
- Carga de logotipo en Ajustes de Empresa (`business_logo_url` o base64).
- Integración de biblioteca de generación de PDFs en cliente (como `@react-pdf/renderer` o `pdfmake/jspdf`).
- Plantilla vectorial limpia de 1 página:
  - Cabecera: Logo de la empresa a la izquierda, datos fiscales y fecha a la derecha.
  - Datos del Cliente: Nombre, teléfono, empresa.
  - Tabla de Conceptos: Pieza, material, tecnología, cantidad, precio unitario y total.
  - Caja de Inversión: Total en Bs. y equivalente en USD referencial.
  - Pie de página: Métodos de pago y cláusula de validez (48h).

---

### FEATURE 6: Módulo B2B de Revendedores / Distribuidores

#### 1. Concepto de Negocio
Un taller puede afiliar a revendedores (tiendas de anime, talleres mecánicos, diseñadores industriales) que captan pedidos de clientes finales.
- El administrador produce las piezas a un **costo base de taller** o con un margen preferencial de distribuidor (+25% / +30%).
- El revendedor accede a su vista restringida donde define su propio precio al cliente final (+50% o +70%) y ve su ganancia neta estimada por pieza.

#### 2. Matriz de Roles y Seguridad
- **ROL ADMIN (Dueño del Taller):**
  - Ve costos reales de máquina, material, electricidad, amortización y ganancias del taller.
  - Asigna la tarifa base a la que le vende al revendedor.
- **ROL RESELLER (Revendedor):**
  - **No ve** el costo de desgaste de la máquina, ni la merma eléctrica, ni la fórmula interna.
  - Solo ve: *Costo Taller* (su costo de compra) + *Precio Venta al Cliente* = *Su Ganancia Líquida*.
  - Puede emitir la cotización con su propia marca o logo sin que el cliente sepa quién es el fabricante.

---

### FEATURE 7: Modelo de Negocio para Alquiler de Máquina ("Print-as-a-Service")

#### 1. Problemática del Alquiler de Impresoras 3D
Alquilar una impresora 3D por horas a un usuario externo conlleva riesgos operativos:
- El cliente puede usar filamento de mala calidad que tape el hotend.
- Puede configurar temperaturas erróneas que dañen la base PEI o la boquilla.
- El tiempo desatendido puede provocar atascos que bloqueen el extrusor.

#### 2. Esquemas de Rentabilidad Recomendados para 3DPSys

##### Modalidad A: Renta por Horas de Máquina (En Taller / Con Operador)
El cliente lleva su archivo G-code o STL ya laminado. El taller supervisa la máquina y suministra la energía y el mantenimiento.
$$\text{Precio/Hora Alquiler} = (\text{Desgaste/h} + \text{Electricidad/h}) \times (1 + \text{Margen Taller 100\%-150\%})$$
- *Ejemplo en Sparkx i7:*
  - Desgaste: $0.75/h
  - Electricidad + Merma: $0.05/h
  - Costo base: $0.80/h
  - **Tarifa al público sugerida:** **$2.00 a $2.50 USD por hora de máquina**.

##### Modalidad B: Renta con Filamento del Taller Incluido
Se cobra la tarifa horaria de máquina ($2.00/h) + el gramo de filamento consumido al costo + 25% de merma.

##### Modalidad C: Bloques o Turnos (Turno Nocturno / Día Completo)
- Turno de 8 horas: $15 USD.
- Turno de 24 horas: $40 USD.
- Se exige un depósito de garantía o póliza de boquilla ($10 USD) reembolsable si la máquina finaliza limpia y sin colisiones en la cama.

---

## 4. CONCLUSIONES Y PRÓXIMOS PASOS

1. **Ventaja de 3DPSys:** Frente a Prusa3D y 3Dfils, 3DPSys ya es la herramienta más ajustada y realista para talleres que operan en mercados con alta volatilidad económica y ventas directas vía mensajería móvil.
2. **Priorización Inmediata:**
   - La funcionalidad de **Multicolor (Feature 1)** y la **Imagen del Producto (Feature 2)** representan la evolución lógica de mayor impacto visual y operativo a corto plazo.
   - La arquitectura modular existente en `src/lib/calculator/costingEngine.ts` y `src/types/index.ts` permite integrar estas capacidades de manera limpia y sin romper la compatibilidad actual.
