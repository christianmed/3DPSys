"use client";

import React, { useState } from "react";
import { RefreshCw, Edit3, Check, DollarSign } from "lucide-react";
import type { ExchangeRateData, ExchangeRateType } from "@/types";

interface CurrencyBarProps {
  rates: ExchangeRateData;
  onRateChange: (updatedRates: ExchangeRateData) => void;
  onRefreshLiveRates: () => Promise<void>;
  isLoadingRates?: boolean;
}

export function CurrencyBar({
  rates,
  onRateChange,
  onRefreshLiveRates,
  isLoadingRates = false,
}: CurrencyBarProps) {
  const [isEditingManual, setIsEditingManual] = useState(false);
  const [manualInputValue, setManualInputValue] = useState(rates.custom_rate.toString());

  const handleSelectType = (type: ExchangeRateType) => {
    let activeVal = rates.bcv_euro;
    if (type === "BCV_USD") activeVal = rates.bcv_usd;
    else if (type === "BINANCE_USDT") activeVal = rates.binance_usdt;
    else if (type === "MANUAL") activeVal = rates.custom_rate;

    onRateChange({
      ...rates,
      active_type: type,
      active_value: activeVal,
    });
  };

  const handleSaveManual = () => {
    const val = parseFloat(manualInputValue);
    if (!isNaN(val) && val > 0) {
      onRateChange({
        ...rates,
        custom_rate: val,
        active_type: "MANUAL",
        active_value: val,
      });
    }
    setIsEditingManual(false);
  };

  return (
    <div className="w-full border-b border-slate-200 dark:border-[#2f3549] bg-slate-50/90 dark:bg-[#1f2335]/70 py-2.5 transition-colors">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Etiqueta e Indicador */}
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-100 text-cyan-700 dark:bg-[#2ac3de]/15 dark:text-[#2ac3de]">
            <DollarSign className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9aa5ce]">
            Tasa en Bs. (VES):
          </span>
        </div>

        {/* Selector de Tasas */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Euro BCV */}
          <button
            type="button"
            onClick={() => handleSelectType("BCV_EURO")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              rates.active_type === "BCV_EURO"
                ? "bg-accent text-white shadow-sm font-semibold"
                : "bg-white dark:bg-[#24283b] text-slate-700 dark:text-[#c0caf5] border border-slate-200 dark:border-[#2f3549] hover:border-slate-300 dark:hover:border-[#3b4261]"
            }`}
          >
            <span>Euro BCV:</span>
            <span className="font-mono font-bold">{rates.bcv_euro.toFixed(2)}</span>
          </button>

          {/* Dólar BCV */}
          <button
            type="button"
            onClick={() => handleSelectType("BCV_USD")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              rates.active_type === "BCV_USD"
                ? "bg-accent text-white shadow-sm font-semibold"
                : "bg-white dark:bg-[#24283b] text-slate-700 dark:text-[#c0caf5] border border-slate-200 dark:border-[#2f3549] hover:border-slate-300 dark:hover:border-[#3b4261]"
            }`}
          >
            <span>USD BCV:</span>
            <span className="font-mono font-bold">{rates.bcv_usd.toFixed(2)}</span>
          </button>

          {/* Binance / Paralelo */}
          <button
            type="button"
            onClick={() => handleSelectType("BINANCE_USDT")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              rates.active_type === "BINANCE_USDT"
                ? "bg-accent text-white shadow-sm font-semibold"
                : "bg-white dark:bg-[#24283b] text-slate-700 dark:text-[#c0caf5] border border-slate-200 dark:border-[#2f3549] hover:border-slate-300 dark:hover:border-[#3b4261]"
            }`}
          >
            <span>Binance P2P:</span>
            <span className="font-mono font-bold">{rates.binance_usdt.toFixed(2)}</span>
          </button>

          {/* Tasa Manual / Personalizada */}
          {isEditingManual ? (
            <div className="flex items-center gap-1 rounded-lg border border-blue-500 dark:border-[#7aa2f7] bg-white dark:bg-[#24283b] px-1.5 py-0.5">
              <input
                type="number"
                step="0.01"
                min="1"
                value={manualInputValue}
                onChange={(e) => setManualInputValue(e.target.value)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => e.key === "Enter" && handleSaveManual()}
                className="w-16 bg-transparent text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveManual}
                className="rounded p-0.5 text-cyan-600 dark:text-[#2ac3de] hover:bg-slate-100 dark:hover:bg-[#7aa2f7]/20"
                title="Guardar tasa manual"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                handleSelectType("MANUAL");
                setIsEditingManual(true);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                rates.active_type === "MANUAL"
                  ? "bg-cyan-600 text-white dark:bg-[#2ac3de] dark:text-[#1a1b26] font-semibold"
                  : "bg-white dark:bg-[#24283b] text-slate-700 dark:text-[#c0caf5] border border-slate-200 dark:border-[#2f3549] hover:border-slate-300 dark:hover:border-[#3b4261]"
              }`}
              title="Haz clic para escribir una tasa personalizada a mano"
            >
              <Edit3 className="h-3 w-3" />
              <span>Manual:</span>
              <span className="font-mono font-bold">{rates.custom_rate.toFixed(2)}</span>
            </button>
          )}

          {/* Botón de Refrescar API */}
          <button
            type="button"
            onClick={onRefreshLiveRates}
            disabled={isLoadingRates}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] text-slate-600 dark:text-[#9aa5ce] hover:border-slate-300 dark:hover:border-[#3b4261] hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50"
            title="Actualizar tasas en vivo"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoadingRates ? "animate-spin text-accent" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
