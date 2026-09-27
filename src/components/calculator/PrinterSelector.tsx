"use client";

import React from "react";
import { Cpu, Zap, Wrench } from "lucide-react";
import type { Printer } from "@/types";

interface PrinterSelectorProps {
  printers: Printer[];
  selectedPrinterId: string;
  powerWatts: number;
  machineHourlyRate: number;
  onSelectPrinter: (printer: Printer) => void;
  onPowerWattsChange: (watts: number) => void;
  onMachineRateChange: (rate: number) => void;
}

export function PrinterSelector({
  printers,
  selectedPrinterId,
  powerWatts,
  machineHourlyRate,
  onSelectPrinter,
  onPowerWattsChange,
  onMachineRateChange,
}: PrinterSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#9aa5ce] flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-[#2ac3de]" />
          Perfil de Impresora
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {printers.map((printer) => {
          const isSelected = printer.id === selectedPrinterId;
          return (
            <button
              key={printer.id}
              type="button"
              onClick={() => onSelectPrinter(printer)}
              className={`rounded-xl p-3 text-left transition-all border ${
                isSelected
                  ? "border-[#2ac3de] bg-[#2ac3de]/10 text-white shadow-sm ring-1 ring-[#2ac3de]"
                  : "border-[#2f3549] bg-[#24283b] text-[#c0caf5] hover:border-[#3b4261]"
              }`}
            >
              <div className="text-xs font-semibold truncate">{printer.name}</div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-[#9aa5ce]">
                <span>{printer.power_watts} W</span>
                <span>${printer.depreciation_hourly_rate.toFixed(2)}/h</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Ajustes directos de la máquina seleccionada */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[#1f2335] p-2.5 border border-[#2f3549]">
          <div className="flex items-center justify-between text-[11px] text-[#9aa5ce] mb-1">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-[#ff9e64]" />
              Consumo
            </span>
            <span className="font-mono">{powerWatts} Watts</span>
          </div>
          <input
            type="number"
            min="0"
            step="10"
            value={powerWatts}
            onChange={(e) => onPowerWattsChange(parseFloat(e.target.value) || 0)}
            className="w-full rounded bg-[#24283b] px-2 py-1 text-xs font-mono font-bold text-white border border-[#3b4261] focus:outline-none"
          />
        </div>

        <div className="rounded-lg bg-[#1f2335] p-2.5 border border-[#2f3549]">
          <div className="flex items-center justify-between text-[11px] text-[#9aa5ce] mb-1">
            <span className="flex items-center gap-1">
              <span className="text-xs">⚙️</span>
              Desgaste/Hora
            </span>
            <span className="font-mono">${machineHourlyRate.toFixed(2)}/h</span>
          </div>
          <input
            type="number"
            min="0"
            step="0.05"
            value={machineHourlyRate}
            onChange={(e) => onMachineRateChange(parseFloat(e.target.value) || 0)}
            className="w-full rounded bg-[#24283b] px-2 py-1 text-xs font-mono font-bold text-white border border-[#3b4261] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
