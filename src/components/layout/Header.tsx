"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, History, Settings, Moon, Sun, Sparkles } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
}

export function Header({ darkMode, onToggleTheme }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2f3549] bg-[#1a1b26]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7aa2f7] to-[#2ac3de] text-[#1a1b26] shadow-md shadow-[#7aa2f7]/20 group-hover:scale-105 transition-transform">
            <Calculator className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">3DCalc</span>
              <span className="rounded-md bg-[#7aa2f7]/15 px-1.5 py-0.5 text-[11px] font-semibold text-[#7aa2f7] border border-[#7aa2f7]/30">
                VZLA 🇻🇪
              </span>
            </div>
            <p className="text-[11px] text-[#9aa5ce]">Costos de Impresión 3D</p>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-[#24283b] text-[#7aa2f7] border border-[#3b4261]"
                  : "text-[#9aa5ce] hover:bg-[#24283b]/60 hover:text-white"
              }`}
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculadora</span>
            </Link>

            <Link
              href="/history"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                pathname === "/history"
                  ? "bg-[#24283b] text-[#7aa2f7] border border-[#3b4261]"
                  : "text-[#9aa5ce] hover:bg-[#24283b]/60 hover:text-white"
              }`}
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historial</span>
            </Link>

            <Link
              href="/settings"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                pathname === "/settings"
                  ? "bg-[#24283b] text-[#7aa2f7] border border-[#3b4261]"
                  : "text-[#9aa5ce] hover:bg-[#24283b]/60 hover:text-white"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Ajustes</span>
            </Link>
          </nav>

          <div className="h-5 w-px bg-[#2f3549]" />

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2f3549] bg-[#24283b] text-[#9aa5ce] hover:border-[#3b4261] hover:text-white transition-colors"
            title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            aria-label="Alternar tema"
          >
            {darkMode ? <Sun className="h-4 w-4 text-[#ff9e64]" /> : <Moon className="h-4 w-4 text-[#7aa2f7]" />}
          </button>
        </div>
      </div>
    </header>
  );
}
