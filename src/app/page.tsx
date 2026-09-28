"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { CurrencyBar } from "@/components/currency/CurrencyBar";
import { CalculatorForm } from "@/components/calculator/CalculatorForm";
import { CostBreakdownCard } from "@/components/calculator/CostBreakdownCard";
import { PriceSummary } from "@/components/calculator/PriceSummary";
import { WhatsAppExportModal } from "@/components/export/WhatsAppExportModal";

import type {
  CostingInput,
  Material,
  Printer,
  ExchangeRateData,
  Quote,
  UserSettings,
} from "@/types";

import { calculateCostBreakdown } from "@/lib/calculator/costingEngine";

import {
  loadCachedExchangeRates,
  fetchLiveExchangeRates,
} from "@/lib/currency/exchangeRateService";

import { storageService } from "@/lib/storage/localStorageRepository";
import { printQuotePdf } from "@/lib/export/pdfGenerator";
import { CheckCircle2 } from "lucide-react";

export default function CalculatorPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Estados de Configuración y Datos Maestros
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  // Tasas de Cambio
  const [rates, setRates] = useState<ExchangeRateData>(loadCachedExchangeRates());
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // Estado del Formulario de Costeo
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>("");

  const [input, setInput] = useState<CostingInput>({
    part_name: "",
    weight_grams: 0,
    cost_per_gram: 0,
    print_hours: 0,
    print_minutes: 0,
    power_watts: 400, // Creality Sparkx i7 (110V)
    electricity_kwh_rate: 0.04, // Tarifa promedio Corpoelec
    machine_hourly_rate: 0.35,
    failure_risk_percent: 10,
    labor_minutes: 0,
    labor_hourly_rate: 5.0,
    hardware_cost_usd: 0,
    packaging_cost_usd: 0,
    margin_percent: 30, // Margen predeterminado 30%
    exchange_rate: 72.5,
  });

  // Modales y Feedback
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // Carga inicial en cliente
  useEffect(() => {
    setIsClient(true);

    // Leer tema previo de localStorage o default dark
    const savedTheme = localStorage.getItem("3dcalc_theme");
    const isDark = savedTheme ? savedTheme === "dark" : true;
    setDarkMode(isDark);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }

    async function loadInitialData() {
      try {
        const [loadedPrinters, loadedMaterials, loadedSettings] = await Promise.all([
          storageService.getPrinters(),
          storageService.getMaterials(),
          storageService.getUserSettings(),
        ]);

        setPrinters(loadedPrinters);
        setMaterials(loadedMaterials);
        setUserSettings(loadedSettings);

        // Seleccionar material inicial si existen en catálogo
        const initialMat = loadedMaterials[0];
        if (initialMat) {
          setSelectedMaterialId(initialMat.id);
          setInput((prev) => ({
            ...prev,
            cost_per_gram: initialMat.cost_per_gram,
          }));
        } else {
          setSelectedMaterialId("");
          setInput((prev) => ({
            ...prev,
            cost_per_gram: 0,
          }));
        }

        // Seleccionar impresora inicial (Sparkx i7 como predeterminada)
        const initialPrinter =
          loadedPrinters.find((p) => p.is_default) || loadedPrinters[0];
        if (initialPrinter) {
          setSelectedPrinterId(initialPrinter.id);
          setInput((prev) => ({
            ...prev,
            power_watts: initialPrinter.power_watts,
            machine_hourly_rate: initialPrinter.depreciation_hourly_rate,
          }));
        }

        // Configuración de usuario
        if (loadedSettings) {
          setInput((prev) => ({
            ...prev,
            electricity_kwh_rate: loadedSettings.electricity_kwh_usd,
            failure_risk_percent: loadedSettings.default_failure_risk_percent,
            labor_hourly_rate: loadedSettings.default_labor_hourly_rate,
            margin_percent: loadedSettings.default_margin_percent || 30,
          }));
        }

        // Intentar actualizar tasas de cambio en segundo plano
        fetchLiveExchangeRates().then((updated) => {
          setRates(updated);
          setInput((prev) => ({
            ...prev,
            exchange_rate: updated.active_value,
          }));
        });
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err);
      }
    }

    loadInitialData();
  }, []);

  // Recálculo del desglose en tiempo real
  const breakdown = useMemo(() => {
    return calculateCostBreakdown(input);
  }, [input]);

  // Manejo de actualización de tasas
  const handleRateChange = (updatedRates: ExchangeRateData) => {
    setRates(updatedRates);
    setInput((prev) => ({
      ...prev,
      exchange_rate: updatedRates.active_value,
    }));
  };

  const handleRefreshLiveRates = async () => {
    setIsLoadingRates(true);
    try {
      const updated = await fetchLiveExchangeRates();
      handleRateChange(updated);
    } finally {
      setIsLoadingRates(false);
    }
  };

  // Manejo de cambios en el formulario con deselección automática de impresora si cambian Watts o Desgaste
  const handleInputChange = (updates: Partial<CostingInput>) => {
    setInput((prev) => {
      const next = { ...prev, ...updates };

      if (selectedPrinterId && ("power_watts" in updates || "machine_hourly_rate" in updates)) {
        const currentPrinter = printers.find((p) => p.id === selectedPrinterId);
        if (currentPrinter) {
          const nextWatts = "power_watts" in updates ? updates.power_watts : next.power_watts;
          const nextRate = "machine_hourly_rate" in updates ? updates.machine_hourly_rate : next.machine_hourly_rate;
          if (nextWatts !== currentPrinter.power_watts || nextRate !== currentPrinter.depreciation_hourly_rate) {
            setSelectedPrinterId("");
          }
        }
      }

      return next;
    });
  };

  const handleSelectMaterial = (mat: Material) => {
    setSelectedMaterialId(mat.id);
    setInput((prev) => ({
      ...prev,
      cost_per_gram: mat.cost_per_gram,
    }));
  };

  const handleSelectPrinter = (printer: Printer) => {
    setSelectedPrinterId(printer.id);
    setInput((prev) => ({
      ...prev,
      power_watts: printer.power_watts,
      machine_hourly_rate: printer.depreciation_hourly_rate,
    }));
  };

  const handleSaveNewMaterial = async (newMat: Material) => {
    await storageService.saveMaterial(newMat);
    const updated = await storageService.getMaterials();
    setMaterials(updated);
    handleSelectMaterial(newMat);
  };

  const handleUpdateMaterial = async (updatedMat: Material) => {
    await storageService.saveMaterial(updatedMat);
    const updated = await storageService.getMaterials();
    setMaterials(updated);
    handleSelectMaterial(updatedMat);
  };

  const handleDeleteMaterial = async (id: string) => {
    await storageService.deleteMaterial(id);
    const updated = await storageService.getMaterials();
    setMaterials(updated);
    if (selectedMaterialId === id) {
      if (updated.length > 0) {
        handleSelectMaterial(updated[0]);
      } else {
        setSelectedMaterialId("");
        setInput((prev) => ({ ...prev, cost_per_gram: 0 }));
      }
    }
  };

  // Construir objeto Quote actual
  const currentQuote: Quote = useMemo(() => {
    const hours = input.print_hours;
    const mins = input.print_minutes;
    const timeFormatted = `${hours > 0 ? `${hours}h ` : ""}${mins}m`;

    const selectedMat = materials.find((m) => m.id === selectedMaterialId);
    const selectedPrint = printers.find((p) => p.id === selectedPrinterId);

    return {
      id: `quote-${Date.now()}`,
      part_name: input.part_name || "Pieza en 3D",
      technology: "FDM",
      printer_id: selectedPrinterId,
      printer_name: selectedPrint?.name,
      material_id: selectedMaterialId,
      material_name: selectedMat?.name,
      weight_grams: input.weight_grams,
      print_time_formatted: timeFormatted,
      margin_percent: input.margin_percent,
      exchange_rate_used: input.exchange_rate,
      exchange_rate_type: rates.active_type,
      cost_breakdown: breakdown,
      final_price_usd: breakdown.total_price_usd,
      final_price_ves: breakdown.total_price_ves,
      created_at: new Date().toISOString(),
    };
  }, [input, breakdown, materials, printers, selectedMaterialId, selectedPrinterId, rates.active_type]);

  // Guardar cotización en historial
  const handleSaveQuote = async () => {
    await storageService.saveQuote(currentQuote);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  // Descargar / Imprimir PDF
  const handleGeneratePdf = () => {
    printQuotePdf({
      quote: currentQuote,
      paymentMethods: userSettings?.payment_methods,
      businessName: userSettings?.business_name || "Taller 3D Venezuela",
      businessPhone: userSettings?.business_phone,
    });
  };

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    localStorage.setItem("3dcalc_theme", nextTheme ? "dark" : "light");
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", nextTheme);
    }
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#1a1b26] text-blue-600 dark:text-[#7aa2f7]">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 dark:border-[#7aa2f7] border-t-transparent mx-auto" />
          <p className="text-xs font-semibold text-slate-700 dark:text-[#c0caf5]">
            Cargando 3DPSys...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#1a1b26] transition-colors">
      {/* Header con navegación estilo cápsula, selector de acento y tema */}
      <Header />

      {/* Barra de Tasas Cambiarias (BCV Euro, Dólar, Binance USDT) */}
      <CurrencyBar
        rates={rates}
        onRateChange={handleRateChange}
        onRefreshLiveRates={handleRefreshLiveRates}
        isLoadingRates={isLoadingRates}
      />

      {/* Notificación de guardado exitoso */}
      {saveSuccessMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4" />
          <span>¡Cotización guardada exitosamente en tu historial!</span>
        </div>
      )}

      {/* Contenedor Principal: Layout Responsivo Móvil & Laptop (2 Columnas estilo 3DPCC) */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* COLUMNA IZQUIERDA: Formulario Modular (7 columnas en desktop) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Parámetros de Impresión
              </h2>
            </div>

            <CalculatorForm
              input={input}
              materials={materials}
              printers={printers}
              selectedMaterialId={selectedMaterialId}
              selectedPrinterId={selectedPrinterId}
              onInputChange={handleInputChange}
              onSelectMaterial={handleSelectMaterial}
              onSelectPrinter={handleSelectPrinter}
              onSaveNewMaterial={handleSaveNewMaterial}
              onUpdateMaterial={handleUpdateMaterial}
              onDeleteMaterial={handleDeleteMaterial}
            />
          </div>

          {/* COLUMNA DERECHA: Resultados, Desglose y Acciones (5 columnas en desktop, STICKY unificado) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            {/* Encabezado simétrico para nivelar la altura con la columna izquierda */}
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Margen y Beneficio
              </h2>
            </div>

            {/* Panel de Precios y Acciones (WhatsApp / PDF / Guardar) */}
            <PriceSummary
              breakdown={breakdown}
              marginPercent={input.margin_percent}
              exchangeRate={input.exchange_rate}
              onMarginChange={(margin) => handleInputChange({ margin_percent: margin })}
              onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
              onGeneratePdf={handleGeneratePdf}
              onSaveQuote={handleSaveQuote}
            />

            {/* Desglose visual de costos estilo 3DPCC */}
            <CostBreakdownCard
              breakdown={breakdown}
              failureRiskPercent={input.failure_risk_percent}
            />
          </div>
        </div>
      </main>

      {/* Modal de exportación a WhatsApp */}
      {userSettings && (
        <WhatsAppExportModal
          quote={currentQuote}
          paymentMethods={userSettings.payment_methods}
          businessName={userSettings.business_name}
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
        />
      )}
    </div>
  );
}
