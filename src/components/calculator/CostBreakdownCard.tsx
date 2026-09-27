"use client";

import React from "react";
import { PieChart, ShieldAlert, Cpu, Zap, Hammer, Package } from "lucide-react";
import type { CostBreakdown } from "@/types";

interface CostBreakdownCardProps {
  breakdown: CostBreakdown;
  failureRiskPercent: number;
}

export function CostBreakdownCard({
  breakdown,
  failureRiskPercent,
}: CostBreakdownCardProps) {
  const subtotal = breakdown.subtotal_cost > 0 ? breakdown.subtotal_cost : 1;

  // Porcentajes para la barra proporcional
  const matPct = (breakdown.material_cost / subtotal) * 100;
  const electPct = (breakdown.electricity_cost / subtotal) * 100;
  const machPct = (breakdown.machine_cost / subtotal) * 100;
  const failPct = (breakdown.failure_risk_cost / subtotal) * 100;
  const laborPct = (breakdown.labor_cost / subtotal) * 100;
  const extrasPct = ((breakdown.hardware_cost + breakdown.packaging_cost) / subtotal) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2f3549] pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PieChart className="h-4 w-4 text-accent" />
          Desglose de Costos de Fabricación
        </h3>
        <span className="text-xs font-mono font-bold text-slate-700 dark:text-[#c0caf5]">
          Subtotal: ${breakdown.subtotal_cost.toFixed(2)} USD
        </span>
      </div>

      {/* Barra de Distribución Proporcional Multicolor (Estilo 3DPCC) */}
      <div className="space-y-1.5">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#1a1b26] flex border border-slate-200 dark:border-transparent">
          {matPct > 0 && (
            <div
              style={{ width: `${matPct}%` }}
              className="bg-blue-500 dark:bg-[#7aa2f7] transition-all duration-300"
              title={`Material: ${matPct.toFixed(1)}%`}
            />
          )}
          {machPct > 0 && (
            <div
              style={{ width: `${machPct}%` }}
              className="bg-cyan-500 dark:bg-[#2ac3de] transition-all duration-300"
              title={`Máquina: ${machPct.toFixed(1)}%`}
            />
          )}
          {electPct > 0 && (
            <div
              style={{ width: `${electPct}%` }}
              className="bg-amber-500 dark:bg-[#ff9e64] transition-all duration-300"
              title={`Energía: ${electPct.toFixed(1)}%`}
            />
          )}
          {failPct > 0 && (
            <div
              style={{ width: `${failPct}%` }}
              className="bg-rose-500 dark:bg-[#f7768e] transition-all duration-300"
              title={`Merma Eléctrica: ${failPct.toFixed(1)}%`}
            />
          )}
          {laborPct > 0 && (
            <div
              style={{ width: `${laborPct}%` }}
              className="bg-emerald-500 dark:bg-[#9ece6a] transition-all duration-300"
              title={`Mano de Obra: ${laborPct.toFixed(1)}%`}
            />
          )}
          {extrasPct > 0 && (
            <div
              style={{ width: `${extrasPct}%` }}
              className="bg-purple-500 dark:bg-[#bb9af7] transition-all duration-300"
              title={`Hardware / Empaque: ${extrasPct.toFixed(1)}%`}
            />
          )}
        </div>

        {/* Leyenda de la Barra */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 dark:text-[#9aa5ce] pt-1">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500 dark:bg-[#7aa2f7]" /> Material
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-500 dark:bg-[#2ac3de]" /> Máquina
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500 dark:bg-[#ff9e64]" /> Luz
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500 dark:bg-[#f7768e]" /> Merma
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-[#9ece6a]" /> Mano de Obra
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-purple-500 dark:bg-[#bb9af7]" /> Extras
          </span>
        </div>
      </div>

      {/* Lista detallada de costos en tabla limpia */}
      <div className="space-y-2 text-xs pt-2">
        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#2f3549]/50">
          <span className="text-slate-600 dark:text-[#9aa5ce]">Costo de Filamento</span>
          <span className="font-mono font-medium text-slate-900 dark:text-white">${breakdown.material_cost.toFixed(2)}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#2f3549]/50">
          <span className="text-slate-600 dark:text-[#9aa5ce] flex items-center gap-1">
            <Cpu className="h-3 w-3 text-cyan-600 dark:text-[#2ac3de]" />
            Desgaste y Amortización Máquina
          </span>
          <span className="font-mono font-medium text-slate-900 dark:text-white">${breakdown.machine_cost.toFixed(2)}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#2f3549]/50">
          <span className="text-slate-600 dark:text-[#9aa5ce] flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-500 dark:text-[#ff9e64]" />
            Consumo Eléctrico
          </span>
          <span className="font-mono font-medium text-slate-900 dark:text-white">${breakdown.electricity_cost.toFixed(2)}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#2f3549]/50">
          <span className="text-rose-600 dark:text-[#f7768e] flex items-center gap-1 font-medium">
            <ShieldAlert className="h-3 w-3" />
            Merma Eléctrica / Contingencia ({failureRiskPercent}%)
          </span>
          <span className="font-mono font-semibold text-rose-600 dark:text-[#f7768e]">
            +${breakdown.failure_risk_cost.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#2f3549]/50">
          <span className="text-slate-600 dark:text-[#9aa5ce] flex items-center gap-1">
            <Hammer className="h-3 w-3 text-emerald-600 dark:text-[#9ece6a]" />
            Mano de Obra y Post-Proceso
          </span>
          <span className="font-mono font-medium text-slate-900 dark:text-white">${breakdown.labor_cost.toFixed(2)}</span>
        </div>

        {(breakdown.hardware_cost > 0 || breakdown.packaging_cost > 0) && (
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-[#2f3549]/50">
            <span className="text-slate-600 dark:text-[#9aa5ce] flex items-center gap-1">
              <Package className="h-3 w-3 text-purple-600 dark:text-[#bb9af7]" />
              Hardware y Empaque
            </span>
            <span className="font-mono font-medium text-slate-900 dark:text-white">
              ${(breakdown.hardware_cost + breakdown.packaging_cost).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
