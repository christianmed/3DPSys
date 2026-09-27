import type { CostBreakdown, CostingInput } from "@/types";

/**
 * Calcula el costo real por gramo de filamento considerando el precio de la bobina
 * más el flete o delivery prorrateado entre las bobinas del pedido.
 *
 * @param spoolPriceUsd Precio pagado por cada bobina en USD
 * @param totalShippingUsd Flete total del pedido en USD
 * @param spoolsCount Cantidad total de bobinas sobre las que se reparte el flete
 * @param netWeightGrams Peso neto de filamento en gramos (ej. 1000g)
 * @returns Costo por gramo en USD
 */
export function calculateCostPerGram(
  spoolPriceUsd: number,
  totalShippingUsd: number = 0,
  spoolsCount: number = 1,
  netWeightGrams: number = 1000
): number {
  if (spoolPriceUsd < 0 || netWeightGrams <= 0) {
    return 0;
  }

  const shippingPerSpool =
    spoolsCount > 0 && totalShippingUsd > 0 ? totalShippingUsd / spoolsCount : 0;
  const totalSpoolCost = spoolPriceUsd + shippingPerSpool;

  return totalSpoolCost / netWeightGrams;
}

/**
 * Calcula el desglose detallado de costos de una pieza impresa en 3D (FDM),
 * incorporando material, energía, máquina, merma por riesgo eléctrico,
 * mano de obra, hardware, empaque, margen y conversión cambiaria.
 */
export function calculateCostBreakdown(input: CostingInput): CostBreakdown {
  // 1. Costo de Material
  const materialCost = Math.max(0, input.weight_grams * input.cost_per_gram);

  // 2. Horas de impresión
  const totalPrintHours = Math.max(
    0,
    input.print_hours + input.print_minutes / 60
  );

  // 3. Costo Eléctrico: (Watts / 1000) * Horas * Tarifa kWh
  const electricityKwh = (Math.max(0, input.power_watts) / 1000) * totalPrintHours;
  const electricityCost = electricityKwh * Math.max(0, input.electricity_kwh_rate);

  // 4. Costo de Máquina: Horas * Tarifa de amortización y repuestos
  const machineCost = totalPrintHours * Math.max(0, input.machine_hourly_rate);

  // 5. Merma Eléctrica / Contingencia de Fallo: % aplicado a los costos directos de máquina/material
  const failureRiskPercent = Math.max(0, input.failure_risk_percent);
  const failureRiskCost =
    (materialCost + electricityCost + machineCost) * (failureRiskPercent / 100);

  // 6. Costo de Mano de Obra: (Minutos / 60) * Tarifa por hora
  const laborHours = Math.max(0, input.labor_minutes) / 60;
  const laborCost = laborHours * Math.max(0, input.labor_hourly_rate);

  // 7. Insumos extras
  const hardwareCost = Math.max(0, input.hardware_cost_usd);
  const packagingCost = Math.max(0, input.packaging_cost_usd);

  // 8. Costo Total de Fabricación (Subtotal)
  const subtotalCost =
    materialCost +
    electricityCost +
    machineCost +
    failureRiskCost +
    laborCost +
    hardwareCost +
    packagingCost;

  // 9. Margen de Ganancia
  const marginPercent = Math.max(0, input.margin_percent);
  const profitAmount = subtotalCost * (marginPercent / 100);
  const totalPriceUsd = subtotalCost + profitAmount;

  // 10. Conversión a Bolívares (VES)
  const exchangeRate = Math.max(0, input.exchange_rate);
  const totalPriceVes = totalPriceUsd * exchangeRate;

  return {
    material_cost: roundNumber(materialCost),
    electricity_cost: roundNumber(electricityCost),
    machine_cost: roundNumber(machineCost),
    failure_risk_cost: roundNumber(failureRiskCost),
    labor_cost: roundNumber(laborCost),
    hardware_cost: roundNumber(hardwareCost),
    packaging_cost: roundNumber(packagingCost),
    subtotal_cost: roundNumber(subtotalCost),
    profit_amount: roundNumber(profitAmount),
    total_price_usd: roundNumber(totalPriceUsd),
    total_price_ves: roundNumber(totalPriceVes),
  };
}

export interface SuggestedTier {
  name: string;
  margin_percent: number;
  price_usd: number;
  price_ves: number;
}

export interface SuggestedPrices {
  competitive: SuggestedTier;
  standard: SuggestedTier;
  premium: SuggestedTier;
  luxury: SuggestedTier;
  custom: SuggestedTier;
}

/**
 * Genera la matriz de precios sugeridos basada en los 4 niveles de la industria
 * más el margen personalizado del maker.
 */
export function getSuggestedPrices(
  subtotalCost: number,
  customMarginPercent: number = 40,
  exchangeRate: number = 1
): SuggestedPrices {
  const calculateTier = (name: string, margin: number): SuggestedTier => {
    const priceUsd = subtotalCost * (1 + margin / 100);
    const priceVes = priceUsd * exchangeRate;
    return {
      name,
      margin_percent: margin,
      price_usd: roundNumber(priceUsd),
      price_ves: roundNumber(priceVes),
    };
  };

  return {
    competitive: calculateTier("Competitivo", 25),
    standard: calculateTier("Estándar", 40),
    premium: calculateTier("Premium", 60),
    luxury: calculateTier("Lujo", 80),
    custom: calculateTier("Personalizado", Math.max(0, customMarginPercent)),
  };
}

/**
 * Función utilitaria para redondear a 2 decimales sin problemas de flotantes
 */
function roundNumber(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
