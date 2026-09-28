import type { Printer, Material, UserSettings } from "@/types";
import { DEFAULT_EXCHANGE_RATES } from "@/lib/currency/exchangeRateService";

export const DEFAULT_PRINTERS: Printer[] = [
  {
    id: "printer-creality-sparkx-i7",
    name: "Creality Sparkx i7 (110V)",
    brand: "Creality",
    power_watts: 400, // 400W nominal a 110V (700W a 220V)
    depreciation_hourly_rate: 0.35, // Amortización y desgaste FDM de alta velocidad
    is_default: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "printer-creality-ender-3-v3",
    name: "Creality Ender 3 V3 (KE/SE)",
    brand: "Creality",
    power_watts: 350,
    depreciation_hourly_rate: 0.20,
    is_default: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "printer-bambu-p1s",
    name: "Bambu Lab P1S / X1C",
    brand: "Bambu Lab",
    power_watts: 350,
    depreciation_hourly_rate: 0.35,
    is_default: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "printer-custom",
    name: "Otra / Parámetros Manuales",
    brand: "Genérico",
    power_watts: 350,
    depreciation_hourly_rate: 0.25,
    is_default: false,
    created_at: new Date().toISOString(),
  },
];

// Lista inicial vacía: el usuario registra sus propios filamentos uno a uno
export const DEFAULT_MATERIALS: Material[] = [];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  electricity_kwh_usd: 0.04, // Tarifa Corpoelec promedio residencial/comercial en Venezuela (~$3-$5 mensuales)
  default_failure_risk_percent: 10, // 10% de merma de protección contra cortes y fallas
  default_labor_hourly_rate: 5.0, // $5.00 por hora de mano de obra
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
};
