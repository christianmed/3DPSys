import { describe, it, expect } from "vitest";
import {
  calculateCostPerGram,
  calculateCostBreakdown,
  getSuggestedPrices,
} from "@/lib/calculator/costingEngine";
import type { CostingInput } from "@/types";

describe("costingEngine - Motor de Costeo 3D FDM", () => {
  describe("calculateCostPerGram (Costo real con flete prorrateado)", () => {
    it("debe calcular exactamente el costo por gramo con flete prorrateado (Caso BDD 1)", () => {
      // 6 bobinas por $135 ($22.50 c/u) con flete total de $5 repartido entre las 6
      const spoolPrice = 22.5;
      const totalShipping = 5.0;
      const spoolsCount = 6;
      const netWeight = 1000; // 1000g

      const costPerGram = calculateCostPerGram(
        spoolPrice,
        totalShipping,
        spoolsCount,
        netWeight
      );

      // (22.50 + 5 / 6) / 1000 = (22.50 + 0.833333) / 1000 = 0.0233333...
      expect(costPerGram).toBeCloseTo(0.023333, 5);
    });

    it("debe calcular el costo sin flete correctamente", () => {
      const costPerGram = calculateCostPerGram(20, 0, 1, 1000);
      expect(costPerGram).toBe(0.02);
    });

    it("debe manejar con seguridad entradas inválidas retornando 0", () => {
      expect(calculateCostPerGram(-10, 0, 1, 1000)).toBe(0);
      expect(calculateCostPerGram(20, 0, 0, 1000)).toBe(0.02); // 0 flete si count es 0
      expect(calculateCostPerGram(20, 0, 1, 0)).toBe(0);
    });
  });

  describe("calculateCostBreakdown (Desglose integral de costos)", () => {
    it("debe calcular el costo de material exacto para 150g", () => {
      const input: CostingInput = {
        part_name: "Soporte de Cámara",
        weight_grams: 150,
        cost_per_gram: 0.0233333,
        print_hours: 0,
        print_minutes: 0,
        power_watts: 0,
        electricity_kwh_rate: 0,
        machine_hourly_rate: 0,
        failure_risk_percent: 0,
        labor_minutes: 0,
        labor_hourly_rate: 0,
        hardware_cost_usd: 0,
        packaging_cost_usd: 0,
        margin_percent: 0,
        exchange_rate: 60,
      };

      const breakdown = calculateCostBreakdown(input);
      // 150 * 0.0233333 = 3.50
      expect(breakdown.material_cost).toBeCloseTo(3.5, 2);
      expect(breakdown.subtotal_cost).toBeCloseTo(3.5, 2);
      expect(breakdown.total_price_usd).toBeCloseTo(3.5, 2);
    });

    it("debe calcular la merma eléctrica sobre costos de producción (Caso BDD 2)", () => {
      const input: CostingInput = {
        part_name: "Pieza Funcional",
        weight_grams: 100, // a 0.035 $/g = $3.50
        cost_per_gram: 0.035,
        print_hours: 2, // 2h a 200W = 0.4 kWh a 0.50 $/kWh = $0.20
        print_minutes: 0,
        power_watts: 200,
        electricity_kwh_rate: 0.5,
        machine_hourly_rate: 0.4, // 2h * 0.40 $/h = $0.80
        failure_risk_percent: 10, // 10% de ($3.50 + $0.20 + $0.80 = $4.50) = $0.45
        labor_minutes: 0,
        labor_hourly_rate: 0,
        hardware_cost_usd: 0,
        packaging_cost_usd: 0,
        margin_percent: 0,
        exchange_rate: 65,
      };

      const breakdown = calculateCostBreakdown(input);

      expect(breakdown.material_cost).toBeCloseTo(3.5, 2);
      expect(breakdown.electricity_cost).toBeCloseTo(0.2, 2);
      expect(breakdown.machine_cost).toBeCloseTo(0.8, 2);
      expect(breakdown.failure_risk_cost).toBeCloseTo(0.45, 2);
      expect(breakdown.subtotal_cost).toBeCloseTo(4.95, 2);
    });

    it("debe calcular mano de obra, hardware, embalaje, margen de ganancia y conversión a VES", () => {
      const input: CostingInput = {
        part_name: "Carcasa Drone",
        weight_grams: 100,
        cost_per_gram: 0.025, // $2.50
        print_hours: 4,
        print_minutes: 30, // 4.5 horas
        power_watts: 150, // 4.5 * 0.150 kW = 0.675 kWh
        electricity_kwh_rate: 0.1, // $0.0675
        machine_hourly_rate: 0.3, // 4.5 * 0.3 = $1.35
        failure_risk_percent: 10, // 10% de ($2.50 + $0.0675 + $1.35 = $3.9175) = $0.39175
        labor_minutes: 30, // 0.5 horas
        labor_hourly_rate: 10, // $5.00
        hardware_cost_usd: 1.5, // 4 tornillos M3 + tuercas
        packaging_cost_usd: 0.8, // caja + bolsa burbuja
        margin_percent: 50, // +50% ganancia
        exchange_rate: 65.0, // 65 VES por USD
      };

      const breakdown = calculateCostBreakdown(input);

      // Subtotal base = 2.50 + 0.0675 + 1.35 + 0.39175 + 5.00 + 1.50 + 0.80 = 11.60925
      expect(breakdown.subtotal_cost).toBeCloseTo(11.61, 2);

      // Margen +50%: beneficio = 11.60925 * 0.5 = 5.804625
      expect(breakdown.profit_amount).toBeCloseTo(5.8, 2);

      // Precio venta USD: 11.60925 * 1.5 = 17.413875 -> 17.41
      expect(breakdown.total_price_usd).toBeCloseTo(17.41, 2);

      // Precio venta VES: 17.413875 * 65 = 1131.90
      expect(breakdown.total_price_ves).toBeCloseTo(1131.9, 1);
    });
  });

  describe("getSuggestedPrices (Niveles de margen de ganancia - Opción A)", () => {
    it("debe calcular los 4 tiers comerciales (Detal, Mayor, Volumen, Gran Mayor) y el personalizado correctamente", () => {
      const subtotal = 10.0;
      const customMargin = 35;
      const rate = 65.0;

      const tiers = getSuggestedPrices(subtotal, customMargin, rate);

      // Gran Mayor (25%) -> 10 * 1.25 = 12.50 USD
      expect(tiers.gran_mayor.margin_percent).toBe(25);
      expect(tiers.gran_mayor.price_usd).toBe(12.5);
      expect(tiers.gran_mayor.price_ves).toBe(812.5);

      // Volumen (30%) -> 10 * 1.30 = 13.00 USD
      expect(tiers.volumen.margin_percent).toBe(30);
      expect(tiers.volumen.price_usd).toBe(13.0);
      expect(tiers.volumen.price_ves).toBe(845.0);

      // Mayor (60%) -> 10 * 1.60 = 16.00 USD
      expect(tiers.mayor.margin_percent).toBe(60);
      expect(tiers.mayor.price_usd).toBe(16.0);
      expect(tiers.mayor.price_ves).toBe(1040.0);

      // Detal (80%) -> 10 * 1.80 = 18.00 USD
      expect(tiers.detal.margin_percent).toBe(80);
      expect(tiers.detal.price_usd).toBe(18.0);
      expect(tiers.detal.price_ves).toBe(1170.0);

      // Personalizado (35%) -> 10 * 1.35 = 13.50 USD
      expect(tiers.custom.margin_percent).toBe(35);
      expect(tiers.custom.price_usd).toBe(13.5);
      expect(tiers.custom.price_ves).toBe(877.5);
    });
  });

  describe("Fórmula Oficial CORPOELEC y Creality Sparkx i7", () => {
    it("debe calcular el consumo eléctrico con la fórmula oficial (400W nominal a 110V para Sparkx i7)", () => {
      // Consumo (kWh) = [ Potencia (W) * Horas ] / 1000
      // 400W durante 2 horas y 30 min (2.5 horas) = (400 * 2.5) / 1000 = 1.0 kWh
      // Tarifa Corpoelec = $0.04 USD/kWh -> Costo = $0.04 USD
      const input: CostingInput = {
        part_name: "Prototipo Sparkx i7",
        weight_grams: 50,
        cost_per_gram: 0.02,
        print_hours: 2,
        print_minutes: 30,
        power_watts: 400, // Creality Sparkx i7 (110V)
        electricity_kwh_rate: 0.04, // Tarifa Corpoelec
        machine_hourly_rate: 0.35,
        failure_risk_percent: 0,
        labor_minutes: 0,
        labor_hourly_rate: 0,
        hardware_cost_usd: 0,
        packaging_cost_usd: 0,
        margin_percent: 0,
        exchange_rate: 70.0,
      };

      const breakdown = calculateCostBreakdown(input);
      expect(breakdown.electricity_cost).toBe(0.04);
      expect(breakdown.machine_cost).toBe(0.88); // 2.5 * 0.35 = 0.875 redondeado a 0.88 USD
    });

    it("debe calcular correctamente el consumo con Sparkx i7 conectada a 220V (700W)", () => {
      // 700W durante 3 horas = (700 * 3) / 1000 = 2.1 kWh
      // Tarifa $0.04 USD/kWh -> Costo = 2.1 * 0.04 = $0.084 USD -> redondeado a $0.08 USD
      const input: CostingInput = {
        part_name: "Prototipo Sparkx i7 220V",
        weight_grams: 80,
        cost_per_gram: 0.025,
        print_hours: 3,
        print_minutes: 0,
        power_watts: 700, // Creality Sparkx i7 (220V)
        electricity_kwh_rate: 0.04,
        machine_hourly_rate: 0.35,
        failure_risk_percent: 0,
        labor_minutes: 0,
        labor_hourly_rate: 0,
        hardware_cost_usd: 0,
        packaging_cost_usd: 0,
        margin_percent: 0,
        exchange_rate: 70.0,
      };

      const breakdown = calculateCostBreakdown(input);
      expect(breakdown.electricity_cost).toBe(0.08); // 0.084 redondeado a 2 decimales de moneda
    });
  });
});
