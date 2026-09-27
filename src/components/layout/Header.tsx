"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, History, Settings, Moon, Sun } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export function Header({ darkMode, onToggleTheme }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-[#2f3549] bg-white/90 dark:bg-[#1a1b26]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white dark:from-[#7aa2f7] dark:to-[#2ac3de] dark:text-[#1a1b26] shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Calculator className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                3DCalc
              </span>
              <span className="rounded-md bg-blue-50 dark:bg-[#7aa2f7]/15 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-[#7aa2f7] border border-blue-200 dark:border-[#7aa2f7]/30">
                VZLA 🇻🇪
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-[#9aa5ce]">
              Costos de Impresión 3D
            </p>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-slate-100 dark:bg-[#24283b] text-blue-600 dark:text-[#7aa2f7] border border-slate-300 dark:border-[#3b4261]"
                  : "text-slate-600 dark:text-[#9aa5ce] hover:bg-slate-100 dark:hover:bg-[#24283b]/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculadora</span>
            </Link>

            <Link
              href="/history"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                pathname === "/history"
                  ? "bg-slate-100 dark:bg-[#24283b] text-blue-600 dark:text-[#7aa2f7] border border-slate-300 dark:border-[#3b4261]"
                  : "text-slate-600 dark:text-[#9aa5ce] hover:bg-slate-100 dark:hover:bg-[#24283b]/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historial</span>
            </Link>

            <Link
              href="/settings"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                pathname === "/settings"
                  ? "bg-slate-100 dark:bg-[#24283b] text-blue-600 dark:text-[#7aa2f7] border border-slate-300 dark:border-[#3b4261]"
                  : "text-slate-600 dark:text-[#9aa5ce] hover:bg-slate-100 dark:hover:bg-[#24283b]/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Ajustes</span>
            </Link>
          </nav>

          <div className="h-5 w-px bg-slate-200 dark:bg-[#2f3549]" />

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-[#2f3549] bg-slate-50 dark:bg-[#24283b] text-slate-600 dark:text-[#9aa5ce] hover:border-slate-300 dark:hover:border-[#3b4261] hover:text-slate-900 dark:hover:text-white transition-colors"
            title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            aria-label="Alternar tema"
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-[#ff9e64]" />
            ) : (
              <Moon className="h-4 w-4 text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
