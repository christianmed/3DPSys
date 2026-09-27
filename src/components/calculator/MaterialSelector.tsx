"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  Copy,
  Edit2,
  Trash2,
  AlertCircle,
  Check,
  X,
  Truck,
  DollarSign,
} from "lucide-react";
import type { Material, FilamentType } from "@/types";
import { calculateCostPerGram } from "@/lib/calculator/costingEngine";

interface MaterialSelectorProps {
  materials: Material[];
  selectedMaterialId: string;
  costPerGram: number;
  onSelectMaterial: (material: Material) => void;
  onCustomCostChange: (costPerGram: number) => void;
  onSaveNewMaterial: (newMat: Material) => void;
  onUpdateMaterial?: (updatedMat: Material) => void;
  onDeleteMaterial?: (id: string) => void;
}

export function MaterialSelector({
  materials,
  selectedMaterialId,
  costPerGram,
  onSelectMaterial,
  onCustomCostChange,
  onSaveNewMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
}: MaterialSelectorProps) {
  // Modo del formulario integrado en línea: "closed" | "new" | "edit" | "copy"
  const [formMode, setFormMode] = useState<"closed" | "new" | "edit" | "copy">("closed");

  // Campos del formulario
  const [editingId, setEditingId] = useState<string>("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState<FilamentType>("PLA");
  const [color, setColor] = useState("");
  const [spoolPrice, setSpoolPrice] = useState<number>(22.5);
  const [shippingCost, setShippingCost] = useState<number>(5.0);
  const [spoolsCount, setSpoolsCount] = useState<number>(6);
  const [netWeight, setNetWeight] = useState<number>(1000);

  const selectedMaterial =
    materials.find((m) => m.id === selectedMaterialId) || materials[0];

  // Cálculo en vivo para el formulario de alta/edición
  const formCalculatedCostPerGram = calculateCostPerGram(
    spoolPrice,
    shippingCost,
    spoolsCount,
    netWeight
  );

  // Iniciar creación de nuevo material
  const handleStartNew = () => {
    setEditingId("");
    setType("PLA");
    setBrand("");
    setColor("");
    setSpoolPrice(22.5);
    setShippingCost(5.0);
    setSpoolsCount(6);
    setNetWeight(1000);
    setFormMode("new");
  };

  // Iniciar edición del material activo
  const handleStartEdit = () => {
    if (!selectedMaterial) return;
    setEditingId(selectedMaterial.id);
    setType(selectedMaterial.material_type);
    setBrand(selectedMaterial.brand);
    setColor(selectedMaterial.color || "");
    setSpoolPrice(selectedMaterial.spool_price_usd);
    setShippingCost(selectedMaterial.shipping_cost_usd);
    setSpoolsCount(selectedMaterial.spools_in_shipment);
    setNetWeight(selectedMaterial.net_weight_grams);
    setFormMode("edit");
  };

  // Iniciar copia/duplicación del material activo
  const handleStartCopy = () => {
    if (!selectedMaterial) return;
    setEditingId("");
    setType(selectedMaterial.material_type);
    setBrand(selectedMaterial.brand);
    setColor(selectedMaterial.color ? `${selectedMaterial.color} (Copia)` : "Copia");
    setSpoolPrice(selectedMaterial.spool_price_usd);
    setShippingCost(selectedMaterial.shipping_cost_usd);
    setSpoolsCount(selectedMaterial.spools_in_shipment);
    setNetWeight(selectedMaterial.net_weight_grams);
    setFormMode("copy");
  };

  // Guardar material (creación, edición o copia)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const name = `${type} ${brand || "Genérico"} ${color ? `(${color})` : ""}`.trim();

    if (formMode === "edit" && editingId && onUpdateMaterial) {
      const updatedMat: Material = {
        id: editingId,
        name,
        material_type: type,
        brand: brand || "Genérico",
        color: color || undefined,
        spool_price_usd: spoolPrice,
        shipping_cost_usd: shippingCost,
        spools_in_shipment: spoolsCount,
        net_weight_grams: netWeight,
        cost_per_gram: formCalculatedCostPerGram,
      };
      onUpdateMaterial(updatedMat);
    } else {
      const newMat: Material = {
        id: `mat-${Date.now()}`,
        name,
        material_type: type,
        brand: brand || "Genérico",
        color: color || undefined,
        spool_price_usd: spoolPrice,
        shipping_cost_usd: shippingCost,
        spools_in_shipment: spoolsCount,
        net_weight_grams: netWeight,
        cost_per_gram: formCalculatedCostPerGram,
      };
      onSaveNewMaterial(newMat);
    }

    setFormMode("closed");
  };

  // Eliminar material activo
  const handleDeleteCurrent = () => {
    if (!selectedMaterial || !onDeleteMaterial) return;
    if (materials.length <= 1) {
      alert("Debes mantener al menos un filamento en el catálogo.");
      return;
    }
    if (confirm(`¿Eliminar el perfil de filamento "${selectedMaterial.name}"?`)) {
      onDeleteMaterial(selectedMaterial.id);
    }
  };

  return (
    <div className="space-y-3">
      {/* Cabecera y Barra de Acciones de Filamento */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#9aa5ce] flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 text-accent" />
          <span>Filamento / Material</span>
        </label>

        {/* Acciones Rápidas: Nuevo, Copiar, Editar, Eliminar */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleStartNew}
            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-white hover:border-accent hover:text-accent transition-colors shadow-xs"
            title="Registrar un nuevo filamento desde cero"
          >
            <Plus className="h-3.5 w-3.5 text-accent" />
            <span>Nuevo</span>
          </button>

          {selectedMaterial && (
            <>
              <button
                type="button"
                onClick={handleStartCopy}
                className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-white hover:border-accent hover:text-accent transition-colors shadow-xs"
                title="Copiar datos de este filamento para crear una variante (ej. otro color)"
              >
                <Copy className="h-3.5 w-3.5 text-accent" />
                <span>Copiar</span>
              </button>

              <button
                type="button"
                onClick={handleStartEdit}
                className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-white hover:border-accent hover:text-accent transition-colors shadow-xs"
                title="Editar precio de bobina o flete de este filamento"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Editar</span>
              </button>

              {materials.length > 1 && onDeleteMaterial && (
                <button
                  type="button"
                  onClick={handleDeleteCurrent}
                  className="flex items-center justify-center rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                  title="Eliminar este perfil de filamento"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* SELECTOR DESPLEGABLE DIRECTO (1 solo click para cambiar) */}
      <div className="relative">
        <select
          value={selectedMaterialId}
          onChange={(e) => {
            const mat = materials.find((m) => m.id === e.target.value);
            if (mat) onSelectMaterial(mat);
          }}
          className="w-full appearance-none rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] p-3 pr-10 text-sm font-semibold text-slate-900 dark:text-white focus:border-accent focus:outline-none transition-colors"
        >
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} — ${(m.cost_per_gram * 1000).toFixed(2)}/kg (${m.cost_per_gram.toFixed(4)}/g)
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500 dark:text-[#9aa5ce]">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* Ficha Resumen del Filamento Seleccionado con Flete Prorrateado */}
      {selectedMaterial && formMode === "closed" && (
        <div className="rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50/70 dark:bg-[#1f2335]/60 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-[#9aa5ce] flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-cyan-600 dark:text-[#2ac3de]" />
              Flete prorrateado:
            </span>
            <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
              ${(selectedMaterial.shipping_cost_usd / selectedMaterial.spools_in_shipment).toFixed(2)}/bobina
              <span className="text-[10px] text-slate-400 dark:text-[#565f89] ml-1">
                (${selectedMaterial.shipping_cost_usd.toFixed(2)} ÷ {selectedMaterial.spools_in_shipment} uds)
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-[#2f3549]/80 pt-2 text-xs">
            <span className="text-slate-600 dark:text-[#9aa5ce]">Costo real por gramo:</span>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-accent" />
              <input
                type="number"
                step="0.0001"
                min="0"
                value={costPerGram}
                onChange={(e) => onCustomCostChange(parseFloat(e.target.value) || 0)}
                className="w-24 rounded-lg bg-white dark:bg-[#24283b] px-2 py-1 text-right font-mono font-bold text-accent border border-slate-300 dark:border-[#3b4261] focus:border-accent focus:outline-none"
                title="Puedes ajustar directamente el costo por gramo si lo deseas"
              />
              <span className="text-slate-500 dark:text-[#9aa5ce]">/g</span>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO INTEGRADO EN LÍNEA (Expandible, sin modales molestos) */}
      {formMode !== "closed" && (
        <form
          onSubmit={handleSaveForm}
          className="rounded-xl border-2 border-accent/40 bg-white dark:bg-[#1a1b26] p-4 space-y-3.5 shadow-md animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2f3549] pb-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              {formMode === "new" && <Plus className="h-3.5 w-3.5 text-accent" />}
              {formMode === "copy" && <Copy className="h-3.5 w-3.5 text-accent" />}
              {formMode === "edit" && <Edit2 className="h-3.5 w-3.5 text-accent" />}
              <span>
                {formMode === "new" && "Registrar Nuevo Filamento"}
                {formMode === "copy" && "Copiar y Crear Variante de Filamento"}
                {formMode === "edit" && "Editar Perfil de Filamento"}
              </span>
            </h4>
            <button
              type="button"
              onClick={() => setFormMode("closed")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-[#9aa5ce] block mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FilamentType)}
                className="w-full rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] p-2 text-xs text-slate-900 dark:text-white focus:border-accent focus:outline-none"
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
              <label className="text-[11px] font-semibold text-slate-600 dark:text-[#9aa5ce] block mb-1">
                Marca
              </label>
              <input
                type="text"
                placeholder="eSun, Sunlu, Bambu..."
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] p-2 text-xs text-slate-900 dark:text-white focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-[#9aa5ce] block mb-1">
                Color
              </label>
              <input
                type="text"
                placeholder="Negro, Blanco, etc."
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] p-2 text-xs text-slate-900 dark:text-white focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Prorrateo de Flete y Costo de Compra */}
          <div className="rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50/70 dark:bg-[#1f2335]/70 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Cálculo de Flete Prorrateado</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 dark:text-[#9aa5ce] block">
                  Precio Bobina ($)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={spoolPrice}
                  onChange={(e) => setSpoolPrice(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 dark:border-[#3b4261] bg-white dark:bg-[#1a1b26] p-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 dark:text-[#9aa5ce] block">
                  Flete Total Pedido ($)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 dark:border-[#3b4261] bg-white dark:bg-[#1a1b26] p-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 dark:text-[#9aa5ce] block">
                  Bobinas en pedido
                </label>
                <input
                  type="number"
                  min="1"
                  value={spoolsCount}
                  onChange={(e) => setSpoolsCount(parseInt(e.target.value) || 1)}
                  className="w-full rounded-md border border-slate-300 dark:border-[#3b4261] bg-white dark:bg-[#1a1b26] p-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 dark:text-[#9aa5ce] block">
                  Peso Neto (g)
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={netWeight}
                  onChange={(e) => setNetWeight(parseInt(e.target.value) || 1000)}
                  className="w-full rounded-md border border-slate-300 dark:border-[#3b4261] bg-white dark:bg-[#1a1b26] p-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-[#3b4261] flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-[#9aa5ce]">Costo real resultante:</span>
              <span className="font-mono font-bold text-cyan-600 dark:text-[#2ac3de]">
                ${formCalculatedCostPerGram.toFixed(4)} / gramo (${(formCalculatedCostPerGram * 1000).toFixed(2)}/kg)
              </span>
            </div>
          </div>

          {/* Botones Guardar / Cancelar */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setFormMode("closed")}
              className="rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-100 dark:bg-[#24283b] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-[#9aa5ce] hover:bg-slate-200 dark:hover:bg-[#2f3549]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-1.5 text-xs font-bold text-white hover:bg-accent-hover shadow-sm transition-all"
            >
              <Check className="h-3.5 w-3.5" />
              <span>
                {formMode === "edit" ? "Guardar Cambios" : "Guardar Filamento"}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
