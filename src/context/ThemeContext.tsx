"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AccentColor = "emerald" | "orange" | "purple" | "blue";

export interface AccentColorOption {
  id: AccentColor;
  name: string;
  lightHex: string;
  darkHex: string;
  ringClass: string;
}

export const ACCENT_COLORS: AccentColorOption[] = [
  {
    id: "emerald",
    name: "Verde Esmeralda (Rifas)",
    lightHex: "#00b87c",
    darkHex: "#10b981",
    ringClass: "ring-emerald-500",
  },
  {
    id: "orange",
    name: "Naranja Moderno",
    lightHex: "#f97316",
    darkHex: "#ff9e64",
    ringClass: "ring-orange-500",
  },
  {
    id: "purple",
    name: "Púrpura Vibrante",
    lightHex: "#8b5cf6",
    darkHex: "#bb9af7",
    ringClass: "ring-purple-500",
  },
  {
    id: "blue",
    name: "Azul Tecnológico",
    lightHex: "#2563eb",
    darkHex: "#7aa2f7",
    ringClass: "ring-blue-500",
  },
];

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [accentColor, setAccentColorState] = useState<AccentColor>("emerald");

  useEffect(() => {
    // 1. Cargar Modo Oscuro / Claro
    const savedTheme = localStorage.getItem("3dcalc_theme");
    const isDark = savedTheme ? savedTheme === "dark" : true;
    setDarkMode(isDark);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }

    // 2. Cargar Color de Acento (default: emerald verde de rifas)
    const savedAccent = localStorage.getItem("3dcalc_accent_color") as AccentColor | null;
    const initialAccent: AccentColor =
      savedAccent && ["emerald", "orange", "purple", "blue"].includes(savedAccent)
        ? savedAccent
        : "emerald";

    setAccentColorState(initialAccent);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-accent", initialAccent);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("3dcalc_theme", nextTheme ? "dark" : "light");
      document.documentElement.classList.toggle("dark", nextTheme);
    }
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    if (typeof window !== "undefined") {
      localStorage.setItem("3dcalc_accent_color", color);
      document.documentElement.setAttribute("data-accent", color);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
}
