"use client";

import React, { useState } from "react";
import { Cpu, Zap, Wrench, Info, ChevronDown, ChevronUp } from "lucide-react";
import type { Printer } from "@/types";
import { NumericInput } from "@/components/ui/NumericInput";

interface PrinterSelectorProps {
  printers: Printer[];
  selectedPrinterId: string;
  powerWatts: number;
  machineHourlyRate: number;
  electricityKwhRate?: number;
  onSelectPrinter: (printer: Printer) => void;
  onPowerWattsChange: (watts: number) => void;
  onMachineRateChange: (rate: number) => void;
  onElectricityRateChange?: (rate: number) => void;
}

export function PrinterSelector({
  printers,
  selectedPrinterId,
  powerWatts,
  machineHourlyRate,
  electricityKwhRate = 0.04,
  onSelectPrinter,
  onPowerWattsChange,
  onMachineRateChange,
  onElectricityRateChange,
}: PrinterSelectorProps) {
  const [showCorpoelecFormula, setShowCorpoelecFormula] = useState(false);

  const selectedPrinter = printers.find((p) => p.id === selectedPrinterId);
  const isSparkx = selectedPrinter?.id === "printer-creality-sparkx-i7";
  const isBambu = selectedPrinter?.id === "printer-bambu-p1s";

  // Estimación mensual de referencia (8h/día, 30 días)
  const monthlyKwh = ((powerWatts || 400) * 8 * 30) / 1000;
  const monthlyCostUsd = monthlyKwh * electricityKwhRate;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9aa5ce] flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-cyan-600 dark:text-[#2ac3de]" />
          <span>Perfil de Impresora 3D</span>
        </label>
        {isSparkx && (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-[#9ece6a] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
            Perfil Activo: Sparkx i7
          </span>
        )}
        {isBambu && (
          <span className="text-[11px] font-semibold text-cyan-600 dark:text-[#2ac3de] bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800/50">
            Perfil Activo: Bambu P1S
          </span>
        )}
        {!selectedPrinterId && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#9aa5ce] bg-slate-100 dark:bg-[#1f2335] px-2 py-0.5 rounded-full border border-slate-200 dark:border-[#2f3549]">
            Parámetros Manuales
          </span>
        )}
      </div>

      {/* Grid de 2 impresoras oficiales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {printers.map((printer) => {
          const isSelected = printer.id === selectedPrinterId;
          return (
            <button
              key={printer.id}
              type="button"
              onClick={() => onSelectPrinter(printer)}
              className={`rounded-xl p-3 text-left transition-all border ${
                isSelected
                  ? "border-accent bg-accent-surface text-slate-900 dark:text-white shadow-xs ring-1 ring-accent"
                  : "border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] text-slate-700 dark:text-[#c0caf5] hover:border-slate-300 dark:hover:border-[#3b4261]"
              }`}
            >
              <div className="text-xs font-semibold truncate flex items-center justify-between">
                <span>{printer.name}</span>
                {printer.is_default && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-accent/15 text-accent px-1.5 py-0.5 rounded">
                    Taller
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#9aa5ce]">
                <span>{printer.power_watts} W</span>
                <span>${printer.depreciation_hourly_rate.toFixed(2)}/h</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Switch de voltaje para Creality Sparkx i7 */}
      {isSparkx && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl border border-cyan-200/80 dark:border-cyan-800/40 bg-cyan-50/50 dark:bg-[#1f2335]/70">
          <div className="text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-cyan-600 dark:text-[#2ac3de]" />
            <span>Voltaje de Alimentación (Sparkx i7):</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPowerWattsChange(400)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                powerWatts === 400
                  ? "bg-cyan-600 dark:bg-[#2ac3de] text-white dark:text-slate-900 shadow-xs"
                  : "bg-white dark:bg-[#24283b] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2f3549]"
              }`}
            >
              110V (400W nominal)
            </button>
            <button
              type="button"
              onClick={() => onPowerWattsChange(700)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                powerWatts === 700
                  ? "bg-cyan-600 dark:bg-[#2ac3de] text-white dark:text-slate-900 shadow-xs"
                  : "bg-white dark:bg-[#24283b] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2f3549]"
              }`}
            >
              220V (700W)
            </button>
          </div>
        </div>
      )}

      {/* Ajustes directos de la máquina seleccionada (Consumo y Desgaste) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="rounded-xl bg-slate-50 dark:bg-[#1f2335] p-2.5 border border-slate-200 dark:border-[#2f3549]">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#9aa5ce] mb-1">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500 dark:text-[#ff9e64]" />
              Consumo Nominal
            </span>
            <span className="font-mono">{powerWatts} Watts</span>
          </div>
          <div className="relative">
            <NumericInput
              value={powerWatts}
              onChange={onPowerWattsChange}
              step="10"
              min={0}
              placeholder="0"
              className="w-full rounded-lg bg-white dark:bg-[#24283b] p-2 pr-12 text-xs font-mono font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-[#3b4261] focus:border-accent focus:outline-none"
            />
            <span className="absolute right-2.5 top-2 text-xs text-slate-400 dark:text-[#9aa5ce]">
              W
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-[#1f2335] p-2.5 border border-slate-200 dark:border-[#2f3549]">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#9aa5ce] mb-1">
            <span className="flex items-center gap-1">
              <Wrench className="h-3 w-3 text-blue-500 dark:text-[#7aa2f7]" />
              Depreciación / Desgaste
            </span>
            <span className="font-mono">${machineHourlyRate.toFixed(2)}/h</span>
          </div>
          <div className="relative">
            <NumericInput
              value={machineHourlyRate}
              onChange={onMachineRateChange}
              step="0.05"
              min={0}
              placeholder="0.00"
              className="w-full rounded-lg bg-white dark:bg-[#24283b] p-2 pr-12 text-xs font-mono font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-[#3b4261] focus:border-accent focus:outline-none"
            />
            <span className="absolute right-2.5 top-2 text-xs text-slate-400 dark:text-[#9aa5ce]">
              $/hora
            </span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Fórmula Oficial CORPOELEC */}
      <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/40 dark:bg-[#1f2335]/70 p-3 space-y-2">
        <button
          type="button"
          onClick={() => setShowCorpoelecFormula(!showCorpoelecFormula)}
          className="w-full flex items-center justify-between text-left text-xs font-semibold text-amber-700 dark:text-amber-300"
        >
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Fórmula Oficial CORPOELEC (Consumo en kWh)</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] font-normal text-amber-600/80 dark:text-amber-400/80">
            {showCorpoelecFormula ? "Ocultar" : "Ver fórmula"}
            {showCorpoelecFormula ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </span>
        </button>

        {showCorpoelecFormula && (
          <div className="pt-1.5 space-y-2.5 text-xs text-slate-700 dark:text-slate-300 border-t border-amber-200/60 dark:border-amber-900/40">
            <div className="p-2.5 rounded-lg bg-white/80 dark:bg-[#1a1b26] border border-amber-200 dark:border-amber-900/50 font-mono text-center text-xs text-amber-800 dark:text-amber-200">
              Consumo (kWh) = [ Potencia (W) × Horas de uso ] ÷ 1000
            </div>

            <p className="text-[11px] leading-relaxed text-slate-600 dark:text-[#9aa5ce]">
              Esta es la fórmula reglamentaria de <strong>CORPOELEC</strong> para calcular el consumo exacto de energía de cualquier equipo eléctrico en Venezuela. El costo final de cada impresión se obtiene multiplicando los <strong>kWh consumidos</strong> por tu tarifa residencial o comercial.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="rounded-lg bg-white dark:bg-[#24283b] p-2 border border-slate-200 dark:border-[#2f3549]">
                <div className="text-slate-500 dark:text-[#9aa5ce]">Tarifa aplicada:</div>
                <div className="font-mono font-bold text-slate-800 dark:text-white mt-0.5 flex items-center justify-between">
                  <span>${electricityKwhRate.toFixed(4)} USD / kWh</span>
                  {onElectricityRateChange && (
                    <span className="text-[10px] text-accent">Configurable</span>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-white dark:bg-[#24283b] p-2 border border-slate-200 dark:border-[#2f3549]">
                <div className="text-slate-500 dark:text-[#9aa5ce]">Impacto mensual en tu recibo:</div>
                <div className="font-mono font-bold text-emerald-600 dark:text-[#9ece6a] mt-0.5">
                  ~${monthlyCostUsd.toFixed(2)} USD / mes
                  <span className="text-[10px] font-normal text-slate-500 dark:text-[#9aa5ce] ml-1">
                    (8h/día, {monthlyKwh.toFixed(0)} kWh)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
