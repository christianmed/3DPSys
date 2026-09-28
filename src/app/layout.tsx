import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "3DPSys - Sistema de Costos de Impresión 3D",
  description:
    "Herramienta profesional para calcular costos reales de impresión 3D en Venezuela en USD y Bolívares con tasas BCV y Binance.",
  applicationName: "3DPSys",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1b26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" data-accent="emerald">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent-primary)]/30 selection:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
