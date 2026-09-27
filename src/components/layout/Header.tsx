"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Settings, Moon, Sun, LayoutGrid } from "lucide-react";
import { useTheme, ACCENT_COLORS } from "@/context/ThemeContext";

interface HeaderProps {
  darkMode?: boolean;
  onToggleTheme?: () => void;
}

export function Header({ darkMode: propDarkMode, onToggleTheme: propToggleTheme }: HeaderProps) {
  const pathname = usePathname();
  const theme = useTheme();

  // Compatibilidad si se pasan por props o se leen del contexto
  const isDark = propDarkMode !== undefined ? propDarkMode : theme.darkMode;
  const handleToggle = propToggleTheme || theme.toggleTheme;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-[#2f3549] bg-white/95 dark:bg-[#1a1b26]/95 backdrop-blur-md transition-colors shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* LADO IZQUIERDO: Marca con Avatar Squircle redondeado y badge coherente */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Avatar Squircle con color de acento dinámico y texto blanco nítido */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white font-black text-sm shadow-md transition-all group-hover:scale-105 active:scale-95">
              <span className="font-extrabold tracking-tight">3D</span>
            </div>

            {/* Identificador del Proyecto con borde redondeado armónico */}
            <div className="hidden min-[420px]:flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-[#1f2335] px-3 py-1.5 border border-slate-200 dark:border-[#2f3549] text-slate-800 dark:text-white font-bold text-xs sm:text-sm shadow-xs transition-colors">
              <span>3DCalc VZLA</span>
              <span className="rounded-md bg-accent-surface text-accent-text border border-accent-border px-1.5 py-0.5 text-[10px] font-bold">
                🇻🇪 FDM
              </span>
            </div>
          </Link>
        </div>

        {/* CENTRO: Barra de navegación modular armónica (rounded-xl con tabs rounded-lg) */}
        <nav className="flex items-center rounded-xl bg-slate-100 dark:bg-[#1f2335] p-1 border border-slate-200 dark:border-[#2f3549] shadow-inner">
          <Link
            href="/"
            className={`flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
              pathname === "/"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 dark:text-[#9aa5ce] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#24283b]"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Calculadora</span>
          </Link>

          <Link
            href="/history"
            className={`flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
              pathname === "/history"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 dark:text-[#9aa5ce] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#24283b]"
            }`}
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historial</span>
          </Link>

          <Link
            href="/settings"
            className={`flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
              pathname === "/settings"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-600 dark:text-[#9aa5ce] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#24283b]"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Ajustes</span>
          </Link>
        </nav>

        {/* LADO DERECHO: Selector de Paleta de Acentos + Toggle Modo Oscuro/Claro */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Selector de color de acento rápido */}
          <div
            className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-[#1f2335] p-1 px-1.5 sm:px-2 border border-slate-200 dark:border-[#2f3549] shadow-inner"
            title="Seleccionar color de acento"
          >
            {ACCENT_COLORS.map((col) => {
              const isSelected = theme.accentColor === col.id;
              const bgHex = isDark ? col.darkHex : col.lightHex;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => theme.setAccentColor(col.id)}
                  aria-label={col.name}
                  title={`${col.name}${isSelected ? " (Activo)" : ""}`}
                  className={`h-4 w-4 sm:h-5 sm:w-5 rounded-full transition-all duration-150 flex items-center justify-center ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-accent dark:ring-offset-[#1f2335] scale-110 shadow-sm"
                      : "opacity-60 hover:opacity-100 hover:scale-110"
                  }`}
                  style={{ backgroundColor: bgHex }}
                />
              );
            })}
          </div>

          {/* Toggle de tema Claro / Oscuro */}
          <button
            onClick={handleToggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-[#2f3549] bg-slate-100 dark:bg-[#24283b] text-slate-600 dark:text-[#9aa5ce] hover:border-slate-300 dark:hover:border-[#3b4261] hover:text-slate-900 dark:hover:text-white transition-all hover:scale-105 active:scale-95"
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            aria-label="Alternar tema"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-[#ff9e64]" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
