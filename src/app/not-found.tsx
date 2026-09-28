import React from "react";
import Link from "next/link";
import { Calculator, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100/70 dark:bg-[#1a1b26] p-4 text-center">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#24283b] p-8 shadow-sm space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white shadow-md mx-auto">
          <Calculator className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Página no encontrada
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#9aa5ce] leading-relaxed">
          La ruta que intentas consultar no existe o ha sido movida dentro del sistema <strong>3DPSys</strong>.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white hover:bg-accent-hover shadow-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la Calculadora</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
