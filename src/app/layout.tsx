import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3DCalc Venezuela - Calculadora de Costos de Impresión 3D",
  description:
    "Herramienta profesional para calcular costos reales de impresión 3D en Venezuela en USD y Bolívares con tasas BCV y Binance.",
  applicationName: "3DCalc",
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
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[#7aa2f7]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
