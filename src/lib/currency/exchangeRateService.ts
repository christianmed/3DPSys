import type { ExchangeRateData, ExchangeRateType } from "@/types";

/**
 * Tasas por defecto razonables y estables en caso de operar completamente offline
 */
export const DEFAULT_EXCHANGE_RATES: ExchangeRateData = {
  bcv_euro: 72.5,
  bcv_usd: 66.8,
  binance_usdt: 73.2,
  custom_rate: Number((66.8 * 1.16).toFixed(2)), // 77.49 (Dólar BCV + 16% por defecto)
  is_custom_manual: false,
  active_type: "BCV_EURO",
  active_value: 72.5,
  last_updated: new Date().toISOString(),
};

const STORAGE_KEY = "3dcalc_exchange_rates_v1";

/**
 * Extrae y normaliza las tasas desde respuestas estándar de APIs cambiarias
 */
export function parseExchangeRatesFromApi(apiData: any): {
  bcv_usd: number;
  bcv_euro: number;
  binance_usdt: number;
} {
  if (!apiData || !Array.isArray(apiData)) {
    return {
      bcv_usd: DEFAULT_EXCHANGE_RATES.bcv_usd,
      bcv_euro: DEFAULT_EXCHANGE_RATES.bcv_euro,
      binance_usdt: DEFAULT_EXCHANGE_RATES.binance_usdt,
    };
  }

  let bcv_usd = DEFAULT_EXCHANGE_RATES.bcv_usd;
  let bcv_euro = DEFAULT_EXCHANGE_RATES.bcv_euro;
  let binance_usdt = DEFAULT_EXCHANGE_RATES.binance_usdt;

  for (const item of apiData) {
    const fuente = (item.fuente || item.nombre || item.id || "").toLowerCase();
    const valor = Number(item.promedio || item.valor || item.price || 0);

    if (valor > 0) {
      if (fuente.includes("oficial") || fuente.includes("bcv") || fuente === "dolar") {
        bcv_usd = valor;
      } else if (fuente.includes("euro")) {
        bcv_euro = valor;
      } else if (
        fuente.includes("paralelo") ||
        fuente.includes("binance") ||
        fuente.includes("enparalelo")
      ) {
        binance_usdt = valor;
      }
    }
  }

  return { bcv_usd, bcv_euro, binance_usdt };
}

/**
 * Obtiene el valor numérico de la tasa activa según el tipo seleccionado
 */
export function getActiveRateValue(rates: ExchangeRateData): number {
  switch (rates.active_type) {
    case "BCV_EURO":
      return rates.bcv_euro > 0 ? rates.bcv_euro : DEFAULT_EXCHANGE_RATES.bcv_euro;
    case "BCV_USD":
      return rates.bcv_usd > 0 ? rates.bcv_usd : DEFAULT_EXCHANGE_RATES.bcv_usd;
    case "BINANCE_USDT":
      return rates.binance_usdt > 0 ? rates.binance_usdt : DEFAULT_EXCHANGE_RATES.binance_usdt;
    case "MANUAL":
      return rates.custom_rate > 0 ? rates.custom_rate : rates.bcv_euro;
    default:
      return rates.bcv_euro;
  }
}

/**
 * Carga las tasas guardadas en localStorage con fallback a valores por defecto
 */
export function loadCachedExchangeRates(): ExchangeRateData {
  if (typeof window === "undefined") {
    return DEFAULT_EXCHANGE_RATES;
  }

  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed: ExchangeRateData = JSON.parse(cached);
      parsed.active_value = getActiveRateValue(parsed);
      return parsed;
    }
  } catch (err) {
    console.error("Error al leer tasas en caché:", err);
  }

  return DEFAULT_EXCHANGE_RATES;
}

/**
 * Guarda las tasas actualizadas en localStorage
 */
export function saveCachedExchangeRates(rates: ExchangeRateData): void {
  if (typeof window === "undefined") return;

  try {
    const toSave: ExchangeRateData = {
      ...rates,
      active_value: getActiveRateValue(rates),
      last_updated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error("Error al persistir tasas en caché:", err);
  }
}

/**
 * Consulta la API pública para refrescar las tasas (usando ve.dolarapi.com)
 */
export async function fetchLiveExchangeRates(): Promise<ExchangeRateData> {
  const current = loadCachedExchangeRates();

  try {
    const response = await fetch("https://ve.dolarapi.com/v1/dolares", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const parsed = parseExchangeRatesFromApi(data);

    // Intentar también buscar euro si está disponible
    try {
      const euroRes = await fetch("https://ve.dolarapi.com/v1/euros", {
        headers: { Accept: "application/json" },
      });
      if (euroRes.ok) {
        const euroData = await euroRes.json();
        if (Array.isArray(euroData) && euroData.length > 0) {
          const euroOficial = euroData.find((e: any) => e.fuente === "oficial");
          if (euroOficial?.promedio) {
            parsed.bcv_euro = euroOficial.promedio;
          }
        }
      }
    } catch {
      // Ignorar fallo secundario de euro
    }

    const autoCustomRate = Number((parsed.bcv_usd * 1.16).toFixed(2));
    const updated: ExchangeRateData = {
      ...current,
      bcv_usd: parsed.bcv_usd,
      bcv_euro: parsed.bcv_euro,
      binance_usdt: parsed.binance_usdt,
      custom_rate: current.is_custom_manual ? current.custom_rate : autoCustomRate,
      last_updated: new Date().toISOString(),
    };

    updated.active_value = getActiveRateValue(updated);
    saveCachedExchangeRates(updated);
    return updated;
  } catch (error) {
    console.warn("No se pudo conectar a la API de tasas, usando caché:", error);
    return current;
  }
}
