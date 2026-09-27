/**
 * 3DCalc Venezuela - Modelos de Datos de Dominio
 * Diseñados para compatibilidad directa 1:1 con tablas PostgreSQL / Supabase
 */

export type FilamentType = "PLA" | "PETG" | "ABS" | "ASA" | "TPU" | "NYLON" | "OTHER";

export type ExchangeRateType = "BCV_EURO" | "BCV_USD" | "BINANCE_USDT" | "MANUAL";

export type MarginTier = "COMPETITIVE" | "STANDARD" | "PREMIUM" | "LUXURY" | "CUSTOM";

/**
 * Perfil de Impresora 3D
 */
export interface Printer {
  id: string;
  user_id?: string;
  name: string;
  brand?: string;
  power_watts: number; // Consumo promedio en Watts (ej: 150)
  depreciation_hourly_rate: number; // Costo por hora de amortización/mantenimiento en USD (ej: 0.25)
  is_default?: boolean;
  created_at?: string;
}

/**
 * Bobina de Filamento
 */
export interface Material {
  id: string;
  user_id?: string;
  name: string; // ej: "PLA+ eSun Negro"
  material_type: FilamentType;
  brand: string;
  color?: string;
  spool_price_usd: number; // Precio base de la bobina
  shipping_cost_usd: number; // Costo del flete total
  spools_in_shipment: number; // Cantidad de bobinas para prorratear el flete
  net_weight_grams: number; // Usualmente 1000g
  cost_per_gram: number; // Calculado: (spool_price_usd + shipping_cost_usd / spools_in_shipment) / net_weight_grams
  created_at?: string;
}

/**
 * Desglose detallado de costos de una impresión
 */
export interface CostBreakdown {
  material_cost: number;
  electricity_cost: number;
  machine_cost: number;
  failure_risk_cost: number; // Merma / contingencia eléctrica
  labor_cost: number;
  hardware_cost: number;
  packaging_cost: number;
  subtotal_cost: number; // Costo de fabricación neto sin beneficio
  profit_amount: number; // Monto de ganancia
  total_price_usd: number; // Precio de venta final en USD
  total_price_ves: number; // Precio de venta final en Bolívares (VES)
}

/**
 * Parámetros de entrada para calcular una cotización
 */
export interface CostingInput {
  part_name: string;
  weight_grams: number;
  cost_per_gram: number;
  print_hours: number;
  print_minutes: number;
  power_watts: number;
  electricity_kwh_rate: number;
  machine_hourly_rate: number;
  failure_risk_percent: number; // % de merma eléctrica (ej: 10)
  labor_minutes: number;
  labor_hourly_rate: number;
  hardware_cost_usd: number;
  packaging_cost_usd: number;
  margin_percent: number; // % margen de beneficio (ej: 40)
  exchange_rate: number; // Tasa en VES por USD
}

/**
 * Cotización guardada
 */
export interface Quote {
  id: string;
  user_id?: string;
  part_name: string;
  client_name?: string;
  client_phone?: string;
  printer_id?: string;
  printer_name?: string;
  material_id?: string;
  material_name?: string;
  weight_grams: number;
  print_time_formatted: string;
  margin_percent: number;
  exchange_rate_used: number;
  exchange_rate_type: ExchangeRateType;
  cost_breakdown: CostBreakdown;
  final_price_usd: number;
  final_price_ves: number;
  notes?: string;
  created_at: string;
}

/**
 * Configuración de Métodos de Pago en Venezuela
 */
export interface PaymentMethodsConfig {
  pago_movil: {
    enabled: boolean;
    bank: string;
    phone: string;
    id_number: string;
    account_holder: string;
  };
  zelle: {
    enabled: boolean;
    email: string;
    account_holder: string;
  };
  binance: {
    enabled: boolean;
    pay_id: string;
    nickname?: string;
  };
  efectivo_usd: {
    enabled: boolean;
    instructions: string;
  };
}

/**
 * Estado y Caché de Tasas de Cambio
 */
export interface ExchangeRateData {
  bcv_euro: number;
  bcv_usd: number;
  binance_usdt: number;
  custom_rate: number;
  active_type: ExchangeRateType;
  active_value: number;
  last_updated: string;
}

/**
 * Configuración general del usuario
 */
export interface UserSettings {
  electricity_kwh_usd: number;
  default_failure_risk_percent: number;
  default_labor_hourly_rate: number;
  default_margin_percent: number;
  exchange_rates: ExchangeRateData;
  payment_methods: PaymentMethodsConfig;
  business_name?: string;
  business_phone?: string;
}
