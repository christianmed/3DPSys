import type { Printer, Material, UserSettings } from "@/types";
import { DEFAULT_EXCHANGE_RATES } from "@/lib/currency/exchangeRateService";
import { calculateCostPerGram } from "@/lib/calculator/costingEngine";

export const DEFAULT_PRINTERS: Printer[] = [
  {
    id: "printer-bambu-p1s",
    name: "Bambu Lab P1S / X1C",
    brand: "Bambu Lab",
    power_watts: 160,
    depreciation_hourly_rate: 0.35, // Desgaste de boquilla endurecida, correas, rodamientos y máquina
    is_default: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "printer-ender-3",
    name: "Creality Ender 3 (V2 / V3 / S1)",
    brand: "Creality",
    power_watts: 120,
    depreciation_hourly_rate: 0.2, // Amortización y repuestos
    is_default: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "printer-neptune-4",
    name: "Elegoo Neptune 4 / Pro",
    brand: "Elegoo",
    power_watts: 150,
    depreciation_hourly_rate: 0.25,
    is_default: false,
    created_at: new Date().toISOString(),
  },
];

export const DEFAULT_MATERIALS: Material[] = [
  {
    id: "mat-pla-esun-negro",
    name: "PLA+ eSun (Negro)",
    material_type: "PLA",
    brand: "eSun",
    color: "Negro",
    spool_price_usd: 22.5,
    shipping_cost_usd: 5.0,
    spools_in_shipment: 6, // $0.83 de flete por bobina
    net_weight_grams: 1000,
    cost_per_gram: calculateCostPerGram(22.5, 5.0, 6, 1000), // ~0.0233 $/g ($23.33/kg)
    created_at: new Date().toISOString(),
  },
  {
    id: "mat-petg-sunlu-gris",
    name: "PETG Sunlu (Gris)",
    material_type: "PETG",
    brand: "Sunlu",
    color: "Gris",
    spool_price_usd: 24.0,
    shipping_cost_usd: 5.0,
    spools_in_shipment: 6,
    net_weight_grams: 1000,
    cost_per_gram: calculateCostPerGram(24.0, 5.0, 6, 1000), // ~0.0248 $/g ($24.83/kg)
    created_at: new Date().toISOString(),
  },
  {
    id: "mat-tpu-creality-rojo",
    name: "TPU 95A Creality (Rojo Flexible)",
    material_type: "TPU",
    brand: "Creality",
    color: "Rojo",
    spool_price_usd: 28.0,
    shipping_cost_usd: 5.0,
    spools_in_shipment: 6,
    net_weight_grams: 1000,
    cost_per_gram: calculateCostPerGram(28.0, 5.0, 6, 1000), // ~0.0288 $/g ($28.83/kg)
    created_at: new Date().toISOString(),
  },
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  electricity_kwh_usd: 0.08, // Tarifa comercial/residencial promedio ponderada
  default_failure_risk_percent: 10, // 10% de merma de protección contra cortes y fallas
  default_labor_hourly_rate: 6.0, // $6.00 por hora de trabajo del maker
  default_margin_percent: 40, // 40% margen estándar
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
  business_name: "Taller 3D Venezuela",
  business_phone: "+58 412 123 4567",
};
