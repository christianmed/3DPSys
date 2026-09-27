"use client";

import React, { useState } from "react";
import { Plus, Check, Layers, AlertCircle } from "lucide-react";
import type { Material, FilamentType } from "@/types";
import { calculateCostPerGram } from "@/lib/calculator/costingEngine";

interface MaterialSelectorProps {
  materials: Material[];
  selectedMaterialId: string;
  costPerGram: number;
  onSelectMaterial: (material: Material) => void;
  onCustomCostChange: (costPerGram: number) => void;
  onSaveNewMaterial: (newMat: Material) => void;
}

export function MaterialSelector({
  materials,
  selectedMaterialId,
  costPerGram,
  onSelectMaterial,
  onCustomCostChange,
  onSaveNewMaterial,
}: MaterialSelectorProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulario nueva bobina
  const [newBrand, setNewBrand] = useState("");
  const [newType, setNewType] = useState<FilamentType>("PLA");
  const [newColor, setNewColor] = useState("");
  const [newSpoolPrice, setNewSpoolPrice] = useState<number>(22.5);
  const [newShippingCost, setNewShippingCost] = useState<number>(5.0);
  const [newSpoolsCount, setNewSpoolsCount] = useState<number>(6);
  const [newNetWeight, setNewNetWeight] = useState<number>(1000);

  const calculatedNewCostPerGram = calculateCostPerGram(
    newSpoolPrice,
    newShippingCost,
    newSpoolsCount,
    newNetWeight
  );

  const handleCreateSpool = (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${newType} ${newBrand || "Genérico"} ${newColor ? `(${newColor})` : ""}`.trim();
    const newMaterial: Material = {
      id: `mat-${Date.now()}`,
      name,
      material_type: newType,
      brand: newBrand || "Genérico",
      color: newColor || undefined,
      spool_price_usd: newSpoolPrice,
      shipping_cost_usd: newShippingCost,
      spools_in_shipment: newSpoolsCount,
      net_weight_grams: newNetWeight,
      cost_per_gram: calculatedNewCostPerGram,
    };

    onSaveNewMaterial(newMaterial);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9aa5ce] flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-accent" />
          Filamento / Material
        </label>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:opacity-80 transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" />
          Nueva bobina
        </button>
      </div>

      {/* Selector de Chips de Bobinas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {materials.map((mat) => {
          const isSelected = mat.id === selectedMaterialId;
          const costPerKg = (mat.cost_per_gram * 1000).toFixed(2);
          return (
            <button
              key={mat.id}
              type="button"
              onClick={() => onSelectMaterial(mat)}
              className={`flex items-start justify-between rounded-xl p-3 text-left transition-all border ${
                isSelected
                  ? "border-accent bg-accent-surface text-slate-900 dark:text-white shadow-sm ring-1 ring-accent"
                  : "border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] text-slate-700 dark:text-[#c0caf5] hover:border-slate-300 dark:hover:border-[#3b4261]"
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold">{mat.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-accent" />}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#9aa5ce]">
                  <span>${mat.cost_per_gram.toFixed(4)}/g</span>
                  <span>•</span>
                  <span>${costPerKg}/kg (con flete)</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Input de Costo por gramo directo */}
      <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[#1f2335] px-3 py-2 text-xs border border-slate-200 dark:border-[#2f3549]">
        <span className="text-slate-600 dark:text-[#9aa5ce]">Costo por gramo en cálculo:</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-slate-700 dark:text-white">$</span>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={costPerGram}
            onChange={(e) => onCustomCostChange(parseFloat(e.target.value) || 0)}
            className="w-24 rounded-lg bg-white dark:bg-[#24283b] px-2 py-1 text-right font-mono font-bold text-accent border border-slate-300 dark:border-[#3b4261] focus:border-accent focus:outline-none"
          />
          <span className="text-slate-500 dark:text-[#9aa5ce]">/g</span>
        </div>
      </div>

      {/* Modal para Registrar Nueva Bobina */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#1a1b26] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Registrar Nueva Bobina con Flete
            </h3>
            <form onSubmit={handleCreateSpool} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-[#9aa5ce]">Tipo</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as FilamentType)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="PLA">PLA</option>
                    <option value="PETG">PETG</option>
                    <option value="ABS">ABS</option>
                    <option value="ASA">ASA</option>
                    <option value="TPU">TPU</option>
                    <option value="NYLON">Nylon</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-[#9aa5ce]">Marca</label>
                  <input
                    type="text"
                    placeholder="eSun, Sunlu, etc."
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 dark:text-[#9aa5ce]">Color</label>
                <input
                  type="text"
                  placeholder="Negro, Blanco, Gris, etc."
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] p-3 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-[#7aa2f7]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Cálculo de Flete Prorrateado
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-[#9aa5ce]">Precio Bobina ($)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newSpoolPrice}
                      onChange={(e) => setNewSpoolPrice(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-200 dark:border-[#3b4261] bg-white dark:bg-[#1a1b26] p-1.5 text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-[#9aa5ce]">Flete Total Pedido ($)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newShippingCost}
                      onChange={(e) => setNewShippingCost(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-200 dark:border-[#3b4261] bg-white dark:bg-[#1a1b26] p-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-[#9aa5ce]">Bobinas en el pedido</label>
                    <input
                      type="number"
                      min="1"
                      value={newSpoolsCount}
                      onChange={(e) => setNewSpoolsCount(parseInt(e.target.value) || 1)}
                      className="w-full rounded-lg border border-slate-200 dark:border-[#3b4261] bg-white dark:bg-[#1a1b26] p-1.5 text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 dark:text-[#9aa5ce]">Peso neto (g)</label>
                    <input
                      type="number"
                      value={newNetWeight}
                      onChange={(e) => setNewNetWeight(parseInt(e.target.value) || 1000)}
                      className="w-full rounded-lg border border-slate-200 dark:border-[#3b4261] bg-white dark:bg-[#1a1b26] p-1.5 text-xs text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-[#3b4261] flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-[#9aa5ce]">Costo real en taller:</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-[#2ac3de]">
                    ${calculatedNewCostPerGram.toFixed(4)} / gramo (${(calculatedNewCostPerGram * 1000).toFixed(2)}/kg)
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 dark:border-[#2f3549] py-2 text-xs font-semibold text-slate-600 dark:text-[#9aa5ce] hover:bg-slate-100 dark:hover:bg-[#24283b]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-accent py-2 text-xs font-semibold text-white hover:bg-accent-hover transition-colors shadow-sm"
                >
                  Guardar Bobina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
