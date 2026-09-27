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
      netWeightGrams: newNetWeight,
      cost_per_gram: calculatedNewCostPerGram,
    } as any;

    onSaveNewMaterial(newMaterial);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#9aa5ce] flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-[#7aa2f7]" />
          Filamento / Material
        </label>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#7aa2f7] hover:text-[#89b4fa] transition-colors"
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
                  ? "border-[#7aa2f7] bg-[#7aa2f7]/10 text-white shadow-sm ring-1 ring-[#7aa2f7]"
                  : "border-[#2f3549] bg-[#24283b] text-[#c0caf5] hover:border-[#3b4261]"
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold">{mat.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-[#7aa2f7]" />}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-[#9aa5ce]">
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
      <div className="flex items-center justify-between rounded-lg bg-[#1f2335] px-3 py-2 text-xs border border-[#2f3549]">
        <span className="text-[#9aa5ce]">Costo por gramo en cálculo:</span>
        <div className="flex items-center gap-1">
          <span className="font-mono text-white">$</span>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={costPerGram}
            onChange={(e) => onCustomCostChange(parseFloat(e.target.value) || 0)}
            className="w-24 rounded bg-[#24283b] px-2 py-1 text-right font-mono font-bold text-[#7aa2f7] border border-[#3b4261] focus:border-[#7aa2f7] focus:outline-none"
          />
          <span className="text-[#9aa5ce]">/g</span>
        </div>
      </div>

      {/* Modal / Drawer para Registrar Nueva Bobina */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#2f3549] bg-[#1a1b26] p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Registrar Nueva Bobina con Flete</h3>
            <form onSubmit={handleCreateSpool} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#9aa5ce]">Tipo de Filamento</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as FilamentType)}
                    className="w-full rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-xs text-white focus:outline-none"
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
                  <label className="text-[11px] text-[#9aa5ce]">Marca</label>
                  <input
                    type="text"
                    placeholder="eSun, Sunlu, Bambu..."
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#9aa5ce]">Color</label>
                <input
                  type="text"
                  placeholder="Negro, Blanco, Gris, etc."
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-full rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-[#2f3549] bg-[#24283b] p-3 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7aa2f7]">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Cálculo de Flete Prorrateado
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#9aa5ce]">Precio Bobina ($)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newSpoolPrice}
                      onChange={(e) => setNewSpoolPrice(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-[#3b4261] bg-[#1a1b26] p-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#9aa5ce]">Flete Total Pedido ($)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newShippingCost}
                      onChange={(e) => setNewShippingCost(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-[#3b4261] bg-[#1a1b26] p-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#9aa5ce]">Bobinas en el pedido</label>
                    <input
                      type="number"
                      min="1"
                      value={newSpoolsCount}
                      onChange={(e) => setNewSpoolsCount(parseInt(e.target.value) || 1)}
                      className="w-full rounded-lg border border-[#3b4261] bg-[#1a1b26] p-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#9aa5ce]">Peso neto (g)</label>
                    <input
                      type="number"
                      value={newNetWeight}
                      onChange={(e) => setNewNetWeight(parseInt(e.target.value) || 1000)}
                      className="w-full rounded-lg border border-[#3b4261] bg-[#1a1b26] p-1.5 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#3b4261] flex items-center justify-between text-xs">
                  <span className="text-[#9aa5ce]">Costo real en taller:</span>
                  <span className="font-mono font-bold text-[#2ac3de]">
                    ${calculatedNewCostPerGram.toFixed(4)} / gramo (${(calculatedNewCostPerGram * 1000).toFixed(2)}/kg)
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-[#2f3549] py-2 text-xs font-semibold text-[#9aa5ce] hover:bg-[#24283b]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#7aa2f7] py-2 text-xs font-semibold text-[#1a1b26] hover:bg-[#89b4fa] transition-colors"
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
