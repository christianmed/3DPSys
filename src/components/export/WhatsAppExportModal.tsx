"use client";

import React, { useState } from "react";
import { MessageSquare, Copy, Check, ExternalLink, X } from "lucide-react";
import type { Quote, PaymentMethodsConfig } from "@/types";
import { formatWhatsAppQuoteMessage } from "@/lib/export/whatsappFormatter";

interface WhatsAppExportModalProps {
  quote: Quote;
  paymentMethods: PaymentMethodsConfig;
  businessName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppExportModal({
  quote,
  paymentMethods,
  businessName,
  isOpen,
  onClose,
}: WhatsAppExportModalProps) {
  const [leadTime, setLeadTime] = useState("2 a 3 días hábiles");
  const [clientPhone, setClientPhone] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formattedMessage = formatWhatsAppQuoteMessage({
    quote,
    paymentMethods,
    businessName: businessName || "Taller 3D",
    leadTimeDays: leadTime,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
    }
  };

  const handleOpenWhatsApp = () => {
    const encodedText = encodeURIComponent(formattedMessage);
    const cleanNumber = clientPhone.replace(/\D/g, "");
    const url = cleanNumber
      ? `https://wa.me/${cleanNumber}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;

    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#1a1b26] p-5 shadow-2xl space-y-4">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#2f3549] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#25D366]">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Presupuesto para WhatsApp
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 dark:text-[#9aa5ce] hover:bg-slate-100 dark:hover:bg-[#24283b] hover:text-slate-900 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Ajustes rápidos previos al envío */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-[#9aa5ce] block mb-1">
              Tiempo estimado de entrega:
            </label>
            <input
              type="text"
              value={leadTime}
              onChange={(e) => setLeadTime(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
              placeholder="ej. 24 a 48 horas"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 dark:text-[#9aa5ce] block mb-1">
              Teléfono cliente (opcional):
            </label>
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
              placeholder="584121234567"
            />
          </div>
        </div>

        {/* Vista previa del mensaje */}
        <div>
          <label className="text-[11px] font-semibold text-slate-600 dark:text-[#9aa5ce] block mb-1.5">
            Vista previa del mensaje a enviar:
          </label>
          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#14151f] p-3 text-xs text-slate-800 dark:text-[#c0caf5] whitespace-pre-wrap font-sans leading-relaxed select-all">
            {formattedMessage}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 dark:bg-[#7aa2f7] hover:bg-blue-700 dark:hover:bg-[#89b4fa] text-white dark:text-[#1a1b26]"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>¡Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copiar Mensaje</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-2.5 px-4 text-xs font-bold text-[#072412] shadow-sm transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Abrir en WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
