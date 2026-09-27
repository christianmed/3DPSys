import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  parseExchangeRatesFromApi,
  getActiveRateValue,
  DEFAULT_EXCHANGE_RATES,
} from "@/lib/currency/exchangeRateService";
import type { ExchangeRateData } from "@/types";

describe("exchangeRateService - Servicio de Tasas Cambiarias para Venezuela", () => {
  describe("parseExchangeRatesFromApi", () => {
    it("debe extraer correctamente las tasas de Euro BCV, Dólar BCV y Paralelo/Binance desde la API", () => {
      // Mock de respuesta de API venezolana (dolarapi o similar)
      const mockApiResponse = [
        { fuente: "oficial", promedio: 65.5, fechaActualizacion: "2026-09-27T12:00:00.000Z" },
        { fuente: "paralelo", promedio: 72.0, fechaActualizacion: "2026-09-27T12:00:00.000Z" },
        { fuente: "euro", promedio: 71.2, fechaActualizacion: "2026-09-27T12:00:00.000Z" },
      ];

      const rates = parseExchangeRatesFromApi(mockApiResponse);

      expect(rates.bcv_usd).toBe(65.5);
      expect(rates.bcv_euro).toBe(71.2);
      expect(rates.binance_usdt).toBe(72.0);
    });

    it("debe conservar valores por defecto si el payload es inválido o está vacío", () => {
      const fallback = parseExchangeRatesFromApi(null);
      expect(fallback.bcv_usd).toBeGreaterThan(0);
      expect(fallback.bcv_euro).toBeGreaterThan(0);
      expect(fallback.binance_usdt).toBeGreaterThan(0);
    });
  });

  describe("getActiveRateValue", () => {
    const currentRates: ExchangeRateData = {
      bcv_euro: 70.0,
      bcv_usd: 65.0,
      binance_usdt: 73.0,
      custom_rate: 68.0,
      active_type: "BCV_EURO",
      active_value: 70.0,
      last_updated: "2026-09-27",
    };

    it("debe retornar la tasa de Euro BCV cuando está seleccionada", () => {
      const rate = getActiveRateValue({ ...currentRates, active_type: "BCV_EURO" });
      expect(rate).toBe(70.0);
    });

    it("debe retornar la tasa de Binance USDT cuando está seleccionada", () => {
      const rate = getActiveRateValue({ ...currentRates, active_type: "BINANCE_USDT" });
      expect(rate).toBe(73.0);
    });

    it("debe retornar la tasa personalizada cuando está seleccionada MANUAL", () => {
      const rate = getActiveRateValue({
        ...currentRates,
        active_type: "MANUAL",
        custom_rate: 68.0,
      });
      expect(rate).toBe(68.0);
    });
  });
});
