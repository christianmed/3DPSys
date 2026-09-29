"use client";

import React, { useState } from "react";
import { MessageSquare, FileDown, BookmarkCheck, TrendingUp } from "lucide-react";
import type { CostBreakdown, MarginTier } from "@/types";
import { getSuggestedPrices, MARGIN_TIER_CONFIG } from "@/lib/calculator/costingEngine";
import { NumericInput } from "@/components/ui/NumericInput";

interface PriceSummaryProps {
  breakdown: CostBreakdown;
  marginPercent: number;
  exchangeRate: number;
  onMarginChange: (margin: number) => void;
  onOpenWhatsAppModal: () => void;
  onGeneratePdf: () => void;
  onSaveQuote: () => void;
}

export function PriceSummary({
  breakdown,
  marginPercent,
  exchangeRate,
  onMarginChange,
  onOpenWhatsAppModal,
  onGeneratePdf,
  onSaveQuote,
}: PriceSummaryProps) {
  const [selectedTier, setSelectedTier] = useState<MarginTier | "NONE">("NONE");

  const tiers = getSuggestedPrices(breakdown.subtotal_cost, marginPercent, exchangeRate);

  const handleSelectTier = (tier: MarginTier, percent: number) => {
    setSelectedTier(tier);
    onMarginChange(percent);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] p-5 shadow-sm space-y-5">
      {/* Selector de Margen de Ganancia */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9aa5ce] flex items-center justify-between mb-2.5">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-[#9ece6a]" />
            Margen de Beneficio
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-[#9ece6a]">+{marginPercent}%</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
          {/* Detal (1-11 piezas) */}
          <button
            type="button"
            onClick={() => handleSelectTier(MARGIN_TIER_CONFIG.detal.id, MARGIN_TIER_CONFIG.detal.percent)}
            className={`rounded-xl p-2 text-center transition-all border ${
              selectedTier === MARGIN_TIER_CONFIG.detal.id || (selectedTier === "NONE" && marginPercent === MARGIN_TIER_CONFIG.detal.percent)
                ? "border-accent bg-accent-surface text-slate-900 dark:text-white font-bold shadow-xs ring-1 ring-accent"
                : "border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] text-slate-600 dark:text-[#9aa5ce] hover:border-slate-300 dark:hover:text-white"
            }`}
          >
            <div className="text-[10px] uppercase font-semibold">{MARGIN_TIER_CONFIG.detal.label}</div>
            <div className="text-xs font-mono font-bold mt-0.5">+{MARGIN_TIER_CONFIG.detal.percent}%</div>
            <div className="text-[11px] text-accent font-mono mt-0.5">
              ${tiers.detal.price_usd.toFixed(2)}
            </div>
          </button>

          {/* Mayor (12-49 piezas) */}
          <button
            type="button"
            onClick={() => handleSelectTier(MARGIN_TIER_CONFIG.mayor.id, MARGIN_TIER_CONFIG.mayor.percent)}
            className={`rounded-xl p-2 text-center transition-all border ${
              selectedTier === MARGIN_TIER_CONFIG.mayor.id || (selectedTier === "NONE" && marginPercent === MARGIN_TIER_CONFIG.mayor.percent)
                ? "border-accent bg-accent-surface text-slate-900 dark:text-white font-bold shadow-xs ring-1 ring-accent"
                : "border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] text-slate-600 dark:text-[#9aa5ce] hover:border-slate-300 dark:hover:text-white"
            }`}
          >
            <div className="text-[10px] uppercase font-semibold">{MARGIN_TIER_CONFIG.mayor.label}</div>
            <div className="text-xs font-mono font-bold mt-0.5">+{MARGIN_TIER_CONFIG.mayor.percent}%</div>
            <div className="text-[11px] text-accent font-mono mt-0.5">
              ${tiers.mayor.price_usd.toFixed(2)}
            </div>
          </button>

          {/* Volumen (50-99 piezas) */}
          <button
            type="button"
            onClick={() => handleSelectTier(MARGIN_TIER_CONFIG.volumen.id, MARGIN_TIER_CONFIG.volumen.percent)}
            className={`rounded-xl p-2 text-center transition-all border ${
              selectedTier === MARGIN_TIER_CONFIG.volumen.id || (selectedTier === "NONE" && marginPercent === MARGIN_TIER_CONFIG.volumen.percent)
                ? "border-accent bg-accent-surface text-slate-900 dark:text-white font-bold shadow-xs ring-1 ring-accent"
                : "border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] text-slate-600 dark:text-[#9aa5ce] hover:border-slate-300 dark:hover:text-white"
            }`}
          >
            <div className="text-[10px] uppercase font-semibold">{MARGIN_TIER_CONFIG.volumen.label}</div>
            <div className="text-xs font-mono font-bold mt-0.5">+{MARGIN_TIER_CONFIG.volumen.percent}%</div>
            <div className="text-[11px] text-accent font-mono mt-0.5">
              ${tiers.volumen.price_usd.toFixed(2)}
            </div>
          </button>

          {/* Gran Mayor (100+ piezas) */}
          <button
            type="button"
            onClick={() => handleSelectTier(MARGIN_TIER_CONFIG.gran_mayor.id, MARGIN_TIER_CONFIG.gran_mayor.percent)}
            className={`rounded-xl p-2 text-center transition-all border ${
              selectedTier === MARGIN_TIER_CONFIG.gran_mayor.id || (selectedTier === "NONE" && marginPercent === MARGIN_TIER_CONFIG.gran_mayor.percent)
                ? "border-accent bg-accent-surface text-slate-900 dark:text-white font-bold shadow-xs ring-1 ring-accent"
                : "border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] text-slate-600 dark:text-[#9aa5ce] hover:border-slate-300 dark:hover:text-white"
            }`}
          >
            <div className="text-[10px] uppercase font-semibold">{MARGIN_TIER_CONFIG.gran_mayor.label}</div>
            <div className="text-xs font-mono font-bold mt-0.5">+{MARGIN_TIER_CONFIG.gran_mayor.percent}%</div>
            <div className="text-[11px] text-accent font-mono mt-0.5">
              ${tiers.gran_mayor.price_usd.toFixed(2)}
            </div>
          </button>
        </div>

        {/* Slider o Input de Margen Personalizado */}
        <div className="mt-3 flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="200"
            step="5"
            value={marginPercent}
            onChange={(e) => {
              setSelectedTier("CUSTOM");
              onMarginChange(parseInt(e.target.value) || 0);
            }}
            className="w-full accent-[var(--accent-primary)] cursor-pointer"
          />
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#3b4261] bg-slate-50 dark:bg-[#1a1b26] px-2 py-1">
            <NumericInput
              value={marginPercent}
              onChange={(val) => {
                setSelectedTier("CUSTOM");
                onMarginChange(val);
              }}
              isInteger
              min={0}
              max={500}
              placeholder="0"
              className="w-12 bg-transparent text-right font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            />
            <span className="text-xs text-slate-400 dark:text-[#9aa5ce]">%</span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Precios Finales en USD y Bolívares */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-[#1a1b26] dark:to-[#1f2335] text-white p-5 border border-slate-800 dark:border-[#3b4261] shadow-lg space-y-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-[#9aa5ce]">
            Precio de Venta Sugerido
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                ${breakdown.total_price_usd.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-accent">USD</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 dark:text-[#9aa5ce] block">Ganancia neta</span>
              <span className="text-sm font-mono font-bold text-emerald-400 dark:text-[#9ece6a]">
                +${breakdown.profit_amount.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/60 dark:border-[#2f3549] pt-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-[#9aa5ce] block">
              En Bolívares (a {exchangeRate.toFixed(2)} Bs/$)
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 dark:text-[#2ac3de]">
                {breakdown.total_price_ves.toLocaleString("es-VE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-xs font-semibold text-slate-300 dark:text-[#9aa5ce]">Bs.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onOpenWhatsAppModal}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3 px-4 text-sm font-bold text-[#072412] shadow-md shadow-[#25D366]/20 transition-all active:scale-[0.98]"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Enviar o Copiar para WhatsApp</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onGeneratePdf}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] hover:border-slate-300 dark:hover:border-[#3b4261] hover:bg-slate-100 dark:hover:bg-[#2f3549] py-2.5 px-3 text-xs font-semibold text-slate-700 dark:text-white transition-colors"
          >
            <FileDown className="h-4 w-4 text-accent" />
            <span>Descargar PDF</span>
          </button>

          <button
            type="button"
            onClick={onSaveQuote}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] hover:border-slate-300 dark:hover:border-[#3b4261] hover:bg-slate-100 dark:hover:bg-[#2f3549] py-2.5 px-3 text-xs font-semibold text-slate-700 dark:text-white transition-colors"
          >
            <BookmarkCheck className="h-4 w-4 text-cyan-600 dark:text-[#2ac3de]" />
            <span>Guardar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
