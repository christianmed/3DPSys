"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { storageService } from "@/lib/storage/localStorageRepository";
import type { Quote, UserSettings } from "@/types";
import { printQuotePdf } from "@/lib/export/pdfGenerator";
import { WhatsAppExportModal } from "@/components/export/WhatsAppExportModal";
import {
  History,
  Search,
  Trash2,
  FileDown,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Layers,
  Clock,
} from "lucide-react";

export default function HistoryPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  // Modal WhatsApp para una cotización del historial
  const [activeQuoteForWs, setActiveQuoteForWs] = useState<Quote | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("3dcalc_theme");
    const isDark = savedTheme ? savedTheme === "dark" : true;
    setDarkMode(isDark);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }

    async function loadData() {
      const [loadedQuotes, loadedSettings] = await Promise.all([
        storageService.getQuotes(),
        storageService.getUserSettings(),
      ]);
      setQuotes(loadedQuotes);
      setUserSettings(loadedSettings);
    }
    loadData();
  }, []);

  const handleDeleteQuote = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta cotización de tu historial?")) {
      await storageService.deleteQuote(id);
      setQuotes((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const filteredQuotes = quotes.filter((q) =>
    (q.part_name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    localStorage.setItem("3dcalc_theme", nextTheme ? "dark" : "light");
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", nextTheme);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-[#1a1b26] transition-colors">
      <Header darkMode={darkMode} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Cabecera de la sección */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-[#2f3549] pb-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-[#7aa2f7] hover:text-blue-700 dark:hover:text-[#89b4fa] mb-2 font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver a la Calculadora</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="h-6 w-6 text-blue-600 dark:text-[#7aa2f7]" />
              Historial de Cotizaciones
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#9aa5ce] mt-1">
              Presupuestos guardados localmente en este dispositivo ({quotes.length} total)
            </p>
          </div>

          {/* Buscador */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-[#565f89]" />
            <input
              type="text"
              placeholder="Buscar por nombre de pieza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#565f89] focus:border-blue-600 dark:focus:border-[#7aa2f7] focus:outline-none"
            />
          </div>
        </div>

        {/* Lista de Cotizaciones */}
        {filteredQuotes.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] p-12 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#1a1b26] text-slate-400 dark:text-[#565f89] mx-auto">
              <History className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No hay cotizaciones guardadas</h3>
            <p className="text-xs text-slate-500 dark:text-[#9aa5ce] max-w-sm mx-auto">
              Cuando calcules una pieza en la calculadora, pulsa el botón &quot;Guardar&quot; para registrarla aquí.
            </p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-blue-600 dark:bg-[#7aa2f7] px-4 py-2 text-xs font-bold text-white dark:text-[#1a1b26] hover:bg-blue-700 dark:hover:bg-[#89b4fa] transition-colors"
            >
              Ir a Cotizar
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] p-4 sm:p-5 hover:border-slate-300 dark:hover:border-[#3b4261] transition-all shadow-sm"
              >
                {/* Info de la pieza */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{quote.part_name}</h3>
                    <span className="rounded-md bg-blue-50 dark:bg-[#7aa2f7]/15 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-700 dark:text-[#7aa2f7]">
                      +{quote.margin_percent}% Margen
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-[#9aa5ce]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-[#565f89]" />
                      {new Date(quote.created_at).toLocaleDateString("es-VE")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-slate-400 dark:text-[#565f89]" />
                      {quote.material_name || "FDM"} ({quote.weight_grams}g)
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-[#565f89]" />
                      {quote.print_time_formatted}
                    </span>
                  </div>
                </div>

                {/* Precios y Acciones */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-[#2f3549]">
                  <div className="text-left sm:text-right">
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-white">
                      ${quote.final_price_usd.toFixed(2)} USD
                    </div>
                    <div className="text-xs font-mono font-semibold text-cyan-600 dark:text-[#2ac3de]">
                      {quote.final_price_ves.toLocaleString("es-VE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      Bs.
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Botón WhatsApp */}
                    <button
                      type="button"
                      onClick={() => setActiveQuoteForWs(quote)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366] hover:bg-[#25D366] hover:text-[#072412] transition-colors"
                      title="Enviar por WhatsApp"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>

                    {/* Botón PDF */}
                    <button
                      type="button"
                      onClick={() =>
                        printQuotePdf({
                          quote,
                          paymentMethods: userSettings?.payment_methods,
                          businessName: userSettings?.business_name,
                          businessPhone: userSettings?.business_phone,
                        })
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#1a1b26] text-blue-600 dark:text-[#7aa2f7] hover:border-blue-500 transition-colors"
                      title="Descargar PDF"
                    >
                      <FileDown className="h-4 w-4" />
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      type="button"
                      onClick={() => handleDeleteQuote(quote.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 dark:border-[#2f3549] bg-rose-50 dark:bg-[#1a1b26] text-rose-600 dark:text-[#f7768e] hover:border-rose-400 hover:bg-rose-100 dark:hover:bg-[#f7768e]/10 transition-colors"
                      title="Eliminar de historial"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal WhatsApp para cotizaciones del historial */}
      {activeQuoteForWs && userSettings && (
        <WhatsAppExportModal
          quote={activeQuoteForWs}
          paymentMethods={userSettings.payment_methods}
          businessName={userSettings.business_name}
          isOpen={true}
          onClose={() => setActiveQuoteForWs(null)}
        />
      )}
    </div>
  );
}
