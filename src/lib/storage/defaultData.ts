import type { Printer, Material, UserSettings } from "@/types";
import { DEFAULT_EXCHANGE_RATES } from "@/lib/currency/exchangeRateService";

export const DEFAULT_PRINTERS: Printer[] = [
  {
    id: "printer-creality-sparkx-i7",
    name: "Creality Sparkx i7 (110V)",
    brand: "Creality",
    power_watts: 400, // 400W nominal a 110V (700W a 220V)
    depreciation_hourly_rate: 0.75, // Escenario B: Amortización técnica ($1.000 / 2.000h) + fondo repuestos ($0.25/h)
    is_default: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "printer-bambu-p1s",
    name: "Bambu Lab P1S / X1C",
    brand: "Bambu Lab",
    power_watts: 350,
    depreciation_hourly_rate: 0.75,
    is_default: false,
    created_at: new Date().toISOString(),
  },
];

// Perfiles de filamentos oficiales del taller FilaVen y Creality
export const DEFAULT_MATERIALS: Material[] = [
  {
    id: "mat-filaven-pla-negro",
    name: "PLA FilaVen (Negro)",
    material_type: "PLA",
    brand: "FilaVen",
    color: "Negro",
    spool_price_usd: 20,
    shipping_cost_usd: 0,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.02,
  },
  {
    id: "mat-filaven-pla-gris",
    name: "PLA FilaVen (Gris)",
    material_type: "PLA",
    brand: "FilaVen",
    color: "Gris",
    spool_price_usd: 20,
    shipping_cost_usd: 0,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.02,
  },
  {
    id: "mat-filaven-pla-blanco",
    name: "PLA FilaVen (Blanco)",
    material_type: "PLA",
    brand: "FilaVen",
    color: "Blanco",
    spool_price_usd: 20,
    shipping_cost_usd: 0,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.02,
  },
  {
    id: "mat-filaven-pla-azul",
    name: "PLA FilaVen (Azul)",
    material_type: "PLA",
    brand: "FilaVen",
    color: "Azul",
    spool_price_usd: 20,
    shipping_cost_usd: 1,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.021,
  },
  {
    id: "mat-filaven-pla-rojo-satinado",
    name: "PLA FilaVen (Rojo Satinado)",
    material_type: "PLA",
    brand: "FilaVen",
    color: "Rojo Satinado",
    spool_price_usd: 25,
    shipping_cost_usd: 1,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.026,
  },
  {
    id: "mat-filaven-pla-verde",
    name: "PLA FilaVen (Verde)",
    material_type: "PLA",
    brand: "FilaVen",
    color: "Verde",
    spool_price_usd: 20,
    shipping_cost_usd: 1,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.021,
  },
  {
    id: "mat-filaven-pla-amarillo",
    name: "PLA FilaVen (Amarillo)",
    material_type: "PLA",
    brand: "FilaVen",
    color: "Amarillo",
    spool_price_usd: 20,
    shipping_cost_usd: 1,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.021,
  },
  {
    id: "mat-filaven-pla-dorado",
    name: "PLA FilaVen (Dorado)",
    material_type: "PLA",
    brand: "FilaVen",
    color: "Dorado",
    spool_price_usd: 25,
    shipping_cost_usd: 1,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.026,
  },
  {
    id: "mat-filaven-pla-rosado",
    name: "PLA FilaVen (Rosado)",
    material_type: "PLA",
    brand: "FilaVen",
    color: "Rosado",
    spool_price_usd: 20,
    shipping_cost_usd: 1,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.021,
  },
  {
    id: "mat-creality-tpu-verde",
    name: "TPU Creality (Verde)",
    material_type: "TPU",
    brand: "Creality",
    color: "Verde",
    spool_price_usd: 25,
    shipping_cost_usd: 1,
    spools_in_shipment: 1,
    net_weight_grams: 1000,
    cost_per_gram: 0.026,
  },
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  electricity_kwh_usd: 0.04, // Tarifa Corpoelec promedio residencial/comercial en Venezuela (~$3-$5 mensuales)
  default_failure_risk_percent: 15, // 15% de merma de protección contra cortes y fallas
  default_labor_hourly_rate: 5.0, // $5.00 por hora de mano de obra
  default_margin_percent: 80, // 80% margen predeterminado (Detal 1-11 piezas)
  exchange_rates: DEFAULT_EXCHANGE_RATES,
  payment_methods: {
    pago_movil: {
      enabled: true,
      bank: "Banesco (0134)",
      phone: "0412-1234567",
      id_number: "V-12345678",
      account_holder: "Maker 3D",
    },
    zelle: {
      enabled: true,
      email: "taller3d@ejemplo.com",
      account_holder: "Nombre del Taller",
    },
    binance: {
      enabled: true,
      pay_id: "123456789",
      nickname: "Taller3D_Vzla",
    },
    efectivo_usd: {
      enabled: true,
      instructions: "Billetes en buen estado, sin roturas ni marcas.",
    },
  },
};
