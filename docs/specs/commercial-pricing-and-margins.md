# Especificación Técnica de Costeo, Amortización y Márgenes Comerciales — 3DPSys

Este documento define la arquitectura y los parámetros oficiales para el costeo y márgenes comerciales en 3DPSys. Sirve como fuente de verdad y memoria técnica para futuras modificaciones rápidas.

---

## 1. Localización Rápida en el Código

Si en el futuro se desean alterar los porcentajes o etiquetas de los márgenes, **se modifica en un único punto centralizado**:

* **Archivo de configuración:** [`src/lib/calculator/costingEngine.ts`](file:///c:/Users/medin/Documents/Proyectos/3DCalc/src/lib/calculator/costingEngine.ts)
* **Objeto de configuración:** `MARGIN_TIER_CONFIG`

```typescript
export const MARGIN_TIER_CONFIG = {
  detal: {
    id: "RETAIL" as const,
    label: "Detal (1-11)",
    percent: 60,
  },
  mayor: {
    id: "WHOLESALE" as const,
    label: "Mayor (12-49)",
    percent: 40,
  },
  volumen: {
    id: "VOLUME" as const,
    label: "Volumen (50-99)",
    percent: 30,
  },
  gran_mayor: {
    id: "BULK" as const,
    label: "Gran Mayor (100+)",
    percent: 25,
  },
} as const;
```

---

## 2. Parámetros de Costeo FDM Oficiales del Taller

### A. Depreciación y Desgaste de Máquina ($0.75 USD / hora)
* **Impresora de referencia:** Creality Sparkx i7 (Valor de adquisición: **$1.000 USD**).
* **Vida útil contable:** 2.000 horas de impresión activa de taller.
* **Amortización de capital:** $\frac{\$1.000}{2.000\text{ h}} = \$0.50/\text{hora}$.
* **Fondo de consumibles y repuestos:** $\$0.25/\text{hora}$ (boquillas bimetálicas, correas GT2, láminas magnéticas PEI, lubricante PTFE).
* **Total Costo Horario de Máquina:** **$0.75 USD / hora**.

### B. Merma Eléctrica y Riesgo de Fallo (15%)
* Factor de protección ante fluctuaciones eléctricas, cortes no programados o fallos de impresión por warping/atascos.
* **Porcentaje oficial:** **15%** sobre la suma de material, electricidad, desgaste de máquina y mano de obra.

### C. Electricidad (Fórmula Oficial CORPOELEC)
* $\text{Consumo (kWh)} = \frac{\text{Potencia (Watts)} \times \text{Horas}}{1000}$.
* Creality Sparkx i7 a 110V: **400 Watts** nominales.
* Tarifa residencial/comercial promedio: **$0.04 USD / kWh**.

### D. Tasa de Cambio Manual
* Por defecto calcula automáticamente: $\text{Dólar BCV} \times 1.16$ (+16% correspondiente al recargo de IVA y brecha bancaria).
* El usuario puede sobreescribir la tasa manualmente en la barra superior en cualquier momento.

---

## 3. Matriz de Márgenes Comerciales Aprobada (60%, 40%, 30%, 25%)

| Nivel | Rango de Piezas | Margen de Beneficio | Propósito Estratégico |
| :--- | :---: | :---: | :--- |
| **Detal** | 1 a 11 piezas | **+60%** | Mantiene la pieza estándar de 4h por debajo de $10 USD ($9.73), cerrando ventas individuales rápidamente con un retorno atractivo ($3.65 limpios). |
| **Mayor** | 12 a 49 piezas | **+40%** | Descuento visible y atractivo para clientes que compran por docenas. |
| **Volumen** | 50 a 99 piezas | **+30%** | Ancla estándar de la industria recomendada por colegas para producción continua en serie. |
| **Gran Mayor** | 100+ piezas | **+25%** | Precio para pedidos industriales a gran escala con alta rotación de inventario. |
