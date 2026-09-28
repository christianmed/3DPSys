"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  Settings,
  Moon,
  Sun,
  LayoutGrid,
  Check,
  Calculator,
  ChevronDown,
} from "lucide-react";
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

  // Estado para el menú desplegable colapsado de acento en móviles
  const [isAccentMenuOpen, setIsAccentMenuOpen] = useState(false);
  const accentMenuRef = useRef<HTMLDivElement>(null);

  // Cerrar el popover al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accentMenuRef.current && !accentMenuRef.current.contains(event.target as Node)) {
        setIsAccentMenuOpen(false);
      }
    };

    if (isAccentMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccentMenuOpen]);

  // Color de acento activo actual
  const activeColorObj =
    ACCENT_COLORS.find((c) => c.id === theme.accentColor) || ACCENT_COLORS[0];
  const activeHex = isDark ? activeColorObj.darkHex : activeColorObj.lightHex;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-[#2f3549] bg-white/95 dark:bg-[#1a1b26]/95 backdrop-blur-md transition-colors shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* LADO IZQUIERDO: Marca 3DPSys con Avatar Squircle e icono de calculadora */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            {/* Avatar Squircle con color de acento dinámico e icono de calculadora */}
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-accent text-white shadow-md transition-all group-hover:scale-105 active:scale-95">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            {/* Identificador del Proyecto 3DPSys */}
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-[#1f2335] px-2.5 sm:px-3 py-1 sm:py-1.5 border border-slate-200 dark:border-[#2f3549] text-slate-800 dark:text-white font-bold text-xs sm:text-sm shadow-xs transition-colors">
              <span className="font-extrabold tracking-tight">3DPSys</span>
            </div>
          </Link>
        </div>

        {/* CENTRO: Barra de navegación modular armónica (rounded-xl con tabs rounded-lg) */}
        <nav className="flex items-center rounded-xl bg-slate-100 dark:bg-[#1f2335] p-1 border border-slate-200 dark:border-[#2f3549] shadow-inner">
          <Link
            href="/"
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
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
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
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
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
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
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* 1. MÓVIL: Selector Colapsado con Popover Flotante (sm:hidden) */}
          <div className="relative sm:hidden" ref={accentMenuRef}>
            <button
              type="button"
              onClick={() => setIsAccentMenuOpen((prev) => !prev)}
              className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-[#1f2335] p-1.5 px-2 border border-slate-200 dark:border-[#2f3549] shadow-inner transition-colors hover:border-accent active:scale-95"
              title="Cambiar color de acento"
              aria-label="Selector de color de acento"
            >
              <span
                className="h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-accent ring-offset-1 dark:ring-offset-[#1f2335] shadow-xs"
                style={{ backgroundColor: activeHex }}
              >
                <Check className="h-2.5 w-2.5 text-white stroke-[3.5]" />
              </span>
              <ChevronDown
                className={`h-3 w-3 text-slate-500 dark:text-[#9aa5ce] transition-transform duration-200 ${
                  isAccentMenuOpen ? "rotate-180 text-accent" : ""
                }`}
              />
            </button>

            {/* Pestaña / Menú flotante desplegable */}
            {isAccentMenuOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 min-w-[130px] rounded-2xl border border-slate-200 dark:border-[#2f3549] bg-white dark:bg-[#1f2335] p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#565f89] px-2 py-1 mb-1 border-b border-slate-100 dark:border-[#2f3549]">
                  Color de Acento
                </div>
                <div className="space-y-1">
                  {ACCENT_COLORS.map((col) => {
                    const isSelected = theme.accentColor === col.id;
                    const bgHex = isDark ? col.darkHex : col.lightHex;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          theme.setAccentColor(col.id);
                          setIsAccentMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-accent-surface text-accent-text"
                            : "text-slate-700 dark:text-[#c0caf5] hover:bg-slate-100 dark:hover:bg-[#24283b]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3.5 w-3.5 rounded-full shadow-xs flex-shrink-0"
                            style={{ backgroundColor: bgHex }}
                          />
                          <span>{col.name}</span>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-accent stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. ESCRITORIO: Barra Completa de Acentos (hidden sm:flex) */}
          <div
            className="hidden sm:flex items-center gap-2.5 rounded-xl bg-slate-100 dark:bg-[#1f2335] p-1.5 px-3 border border-slate-200 dark:border-[#2f3549] shadow-inner"
            title="Seleccionar color de acento de la aplicación"
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
                  className={`h-5 w-5 rounded-full transition-all duration-150 flex items-center justify-center relative ${
                    isSelected
                      ? "ring-2 ring-accent ring-offset-1 dark:ring-offset-[#1f2335] shadow-xs"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                  style={{ backgroundColor: bgHex }}
                >
                  {isSelected && (
                    <Check className="h-3 w-3 text-white stroke-[3.5] drop-shadow-xs" />
                  )}
                </button>
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
