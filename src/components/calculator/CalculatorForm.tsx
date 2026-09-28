"use client";

import React from "react";
import { Clock, Hammer, ShieldAlert } from "lucide-react";
import type { CostingInput, Material, Printer } from "@/types";
import { MaterialSelector } from "./MaterialSelector";
import { PrinterSelector } from "./PrinterSelector";
import { NumericInput } from "@/components/ui/NumericInput";

interface CalculatorFormProps {
  input: CostingInput;
  materials: Material[];
  printers: Printer[];
  selectedMaterialId: string;
  selectedPrinterId: string;
  onInputChange: (updates: Partial<CostingInput>) => void;
  onSelectMaterial: (material: Material) => void;
  onSelectPrinter: (printer: Printer) => void;
  onSaveNewMaterial: (material: Material) => void;
  onUpdateMaterial?: (material: Material) => void;
  onDeleteMaterial?: (id: string) => void;
}

export function CalculatorForm({
  input,
  materials,
  printers,
  selectedMaterialId,
  selectedPrinterId,
  onInputChange,
  onSelectMaterial,
  onSelectPrinter,
  onSaveNewMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
}: CalculatorFormProps) {
  return (
    <div className="space-y-4">
      {/* TARJETA 1: IDENTIFICACIÓN DE LA PIEZA Y FILAMENTO */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] p-4 sm:p-5 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9aa5ce] block mb-1.5">
            Nombre de la Pieza o Proyecto
          </label>
          <input
            type="text"
            placeholder="ej. Engranaje Reductor, Soporte de Celular, Figura Coleccionable..."
            value={input.part_name}
            onChange={(e) => onInputChange({ part_name: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#565f89] focus:border-accent focus:outline-none"
          />
        </div>

        {/* Selector y Gestor Avanzado de Material con Flete Prorrateado */}
        <MaterialSelector
          materials={materials}
          selectedMaterialId={selectedMaterialId}
          costPerGram={input.cost_per_gram}
          onSelectMaterial={onSelectMaterial}
          onCustomCostChange={(cost) => onInputChange({ cost_per_gram: cost })}
          onSaveNewMaterial={onSaveNewMaterial}
          onUpdateMaterial={onUpdateMaterial}
          onDeleteMaterial={onDeleteMaterial}
        />

        {/* Peso en gramos */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9aa5ce]">
              Peso estimado por el Laminador (Gramos)
            </label>
            <span className="text-[11px] text-accent font-mono">
              Orca / Bambu / Cura / PrusaSlicer
            </span>
          </div>
          <div className="relative">
            <NumericInput
              value={input.weight_grams}
              onChange={(val) => onInputChange({ weight_grams: val })}
              placeholder="0"
              step="1"
              min={0}
              className="w-full rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] p-3 pr-10 text-base font-mono font-bold text-slate-900 dark:text-white focus:border-accent focus:outline-none"
            />
            <span className="absolute right-3.5 top-3.5 text-xs font-semibold text-slate-400 dark:text-[#9aa5ce]">
              g
            </span>
          </div>
        </div>
      </div>

      {/* TARJETA 2: IMPRESORA Y TIEMPO DE IMPRESIÓN */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] p-4 sm:p-5 shadow-sm space-y-4">
        <PrinterSelector
          printers={printers}
          selectedPrinterId={selectedPrinterId}
          powerWatts={input.power_watts}
          machineHourlyRate={input.machine_hourly_rate}
          electricityKwhRate={input.electricity_kwh_rate}
          onSelectPrinter={onSelectPrinter}
          onPowerWattsChange={(watts) => onInputChange({ power_watts: watts })}
          onMachineRateChange={(rate) => onInputChange({ machine_hourly_rate: rate })}
          onElectricityRateChange={(rate) => onInputChange({ electricity_kwh_rate: rate })}
        />

        {/* Tiempo de Impresión */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9aa5ce] flex items-center gap-1.5 mb-2">
            <Clock className="h-3.5 w-3.5 text-amber-500 dark:text-[#ff9e64]" />
            Tiempo de Impresión
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <NumericInput
                value={input.print_hours}
                onChange={(val) => onInputChange({ print_hours: val })}
                isInteger
                min={0}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] p-3 pr-12 text-sm font-mono font-bold text-slate-900 dark:text-white focus:border-accent focus:outline-none"
              />
              <span className="absolute right-3 top-3.5 text-xs text-slate-400 dark:text-[#9aa5ce]">
                Horas
              </span>
            </div>
            <div className="relative">
              <NumericInput
                value={input.print_minutes}
                onChange={(val) => onInputChange({ print_minutes: val })}
                isInteger
                min={0}
                max={59}
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] p-3 pr-12 text-sm font-mono font-bold text-slate-900 dark:text-white focus:border-accent focus:outline-none"
              />
              <span className="absolute right-3 top-3.5 text-xs text-slate-400 dark:text-[#9aa5ce]">
                Minutos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TARJETA 3: FACTOR DE MERMA / RIESGO ELÉCTRICO */}
      <div className="rounded-2xl border border-rose-200 dark:border-[#f7768e]/30 bg-rose-50/40 dark:bg-[#24283b] p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-[#f7768e] flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" />
            Merma Eléctrica y Riesgo de Fallo
          </label>
          <span className="font-mono font-bold text-rose-600 dark:text-[#f7768e] text-sm">
            {input.failure_risk_percent}%
          </span>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-[#9aa5ce] leading-relaxed">
          Colchón de seguridad para cubrir piezas perdidas por cortes o bajones de luz, despegues de cama o atascos, evitando que el costo salga de tu ganancia personal.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={input.failure_risk_percent}
            onChange={(e) => onInputChange({ failure_risk_percent: parseInt(e.target.value) || 0 })}
            className="w-full accent-rose-500 dark:accent-[#f7768e] cursor-pointer"
          />
        </div>
      </div>

      {/* TARJETA 4: MANO DE OBRA, HARDWARE Y EMPAQUE */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] p-4 sm:p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9aa5ce] flex items-center gap-1.5">
          <Hammer className="h-3.5 w-3.5 text-emerald-600 dark:text-[#9ece6a]" />
          Mano de Obra y Componentes Extras
        </h4>

        {/* Mano de obra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-600 dark:text-[#9aa5ce] block mb-1">
              Tiempo Mano de Obra (Minutos)
            </label>
            <NumericInput
              value={input.labor_minutes}
              onChange={(val) => onInputChange({ labor_minutes: val })}
              isInteger
              step="5"
              min={0}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-600 dark:text-[#9aa5ce] block mb-1">
              Tarifa de Mano de Obra ($/Hora)
            </label>
            <NumericInput
              value={input.labor_hourly_rate}
              onChange={(val) => onInputChange({ labor_hourly_rate: val })}
              step="0.5"
              min={0}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Hardware y Empaque */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-600 dark:text-[#9aa5ce] block mb-1">
              Hardware Extra (Tornillos, insertos, imanes) ($)
            </label>
            <NumericInput
              value={input.hardware_cost_usd}
              onChange={(val) => onInputChange({ hardware_cost_usd: val })}
              step="0.25"
              min={0}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-600 dark:text-[#9aa5ce] block mb-1">
              Embalaje (Caja, bolsa ziploc, etiqueta) ($)
            </label>
            <NumericInput
              value={input.packaging_cost_usd}
              onChange={(val) => onInputChange({ packaging_cost_usd: val })}
              step="0.25"
              min={0}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] p-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
