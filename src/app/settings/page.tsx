"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { storageService } from "@/lib/storage/localStorageRepository";
import type { UserSettings } from "@/types";
import {
  Settings,
  ArrowLeft,
  Save,
  CreditCard,
  Building,
  CheckCircle2,
  Download,
  Upload,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await storageService.getUserSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    await storageService.saveUserSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExportBackup = async () => {
    const [printers, materials, quotes, currentSettings] = await Promise.all([
      storageService.getPrinters(),
      storageService.getMaterials(),
      storageService.getQuotes(),
      storageService.getUserSettings(),
    ]);

    const backup = {
      version: 1,
      date: new Date().toISOString(),
      printers,
      materials,
      quotes,
      settings: currentSettings,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `3DCalc_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  if (!settings) return null;

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors">
      <Header darkMode={darkMode} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#2f3549] pb-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#7aa2f7] hover:text-[#89b4fa] mb-2 font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver a la Calculadora</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-[#7aa2f7]" />
              Ajustes del Taller
            </h1>
            <p className="text-xs text-[#9aa5ce] mt-1">
              Configura tus datos de contacto y cuentas bancarias para WhatsApp y PDFs
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 rounded-xl border border-[#2f3549] bg-[#24283b] px-3 py-2 text-xs font-semibold text-[#c0caf5] hover:border-[#3b4261] hover:text-white transition-colors"
            title="Descargar copia de seguridad en JSON"
          >
            <Download className="h-4 w-4 text-[#7aa2f7]" />
            <span className="hidden sm:inline">Respaldar Datos</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-[#9ece6a] px-4 py-3 text-xs font-bold text-[#1a1b26] shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span>¡Configuración guardada exitosamente!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identificación del Negocio */}
          <div className="rounded-2xl border border-[#2f3549] bg-[#24283b] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-[#7aa2f7]" />
              Datos del Taller / Maker
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#9aa5ce] block mb-1">
                  Nombre del Taller o Marca
                </label>
                <input
                  type="text"
                  value={settings.business_name || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, business_name: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#2f3549] bg-[#1a1b26] p-2.5 text-xs text-white focus:outline-none"
                  placeholder="ej. Caracas 3D Print Lab"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#9aa5ce] block mb-1">
                  Teléfono / WhatsApp de Contacto
                </label>
                <input
                  type="text"
                  value={settings.business_phone || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, business_phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#2f3549] bg-[#1a1b26] p-2.5 text-xs text-white focus:outline-none"
                  placeholder="+58 412 000 0000"
                />
              </div>
            </div>
          </div>

          {/* Cuentas de Pago Venezolanas */}
          <div className="rounded-2xl border border-[#2f3549] bg-[#24283b] p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#2ac3de]" />
              Métodos de Pago para Cotizaciones
            </h3>

            {/* Pago Móvil */}
            <div className="rounded-xl border border-[#2f3549] bg-[#1a1b26] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Pago Móvil (Bolívares)</span>
                <label className="flex items-center gap-2 text-xs text-[#9aa5ce] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.payment_methods.pago_movil.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment_methods: {
                          ...settings.payment_methods,
                          pago_movil: {
                            ...settings.payment_methods.pago_movil,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="accent-[#7aa2f7]"
                  />
                  <span>Habilitado</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Banco (ej. Banesco 0134)"
                  value={settings.payment_methods.pago_movil.bank}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        pago_movil: {
                          ...settings.payment_methods.pago_movil,
                          bank: e.target.value,
                        },
                      },
                    })
                  }
                  className="rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Teléfono (ej. 0412-1234567)"
                  value={settings.payment_methods.pago_movil.phone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        pago_movil: {
                          ...settings.payment_methods.pago_movil,
                          phone: e.target.value,
                        },
                      },
                    })
                  }
                  className="rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Cédula / RIF (ej. V-12345678)"
                  value={settings.payment_methods.pago_movil.id_number}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        pago_movil: {
                          ...settings.payment_methods.pago_movil,
                          id_number: e.target.value,
                        },
                      },
                    })
                  }
                  className="rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Titular de la cuenta"
                  value={settings.payment_methods.pago_movil.account_holder}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        pago_movil: {
                          ...settings.payment_methods.pago_movil,
                          account_holder: e.target.value,
                        },
                      },
                    })
                  }
                  className="rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-white"
                />
              </div>
            </div>

            {/* Zelle */}
            <div className="rounded-xl border border-[#2f3549] bg-[#1a1b26] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Zelle (USD)</span>
                <label className="flex items-center gap-2 text-xs text-[#9aa5ce] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.payment_methods.zelle.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment_methods: {
                          ...settings.payment_methods,
                          zelle: {
                            ...settings.payment_methods.zelle,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="accent-[#7aa2f7]"
                  />
                  <span>Habilitado</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="email"
                  placeholder="Correo Zelle"
                  value={settings.payment_methods.zelle.email}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        zelle: {
                          ...settings.payment_methods.zelle,
                          email: e.target.value,
                        },
                      },
                    })
                  }
                  className="rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Titular de la cuenta"
                  value={settings.payment_methods.zelle.account_holder}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        zelle: {
                          ...settings.payment_methods.zelle,
                          account_holder: e.target.value,
                        },
                      },
                    })
                  }
                  className="rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-white"
                />
              </div>
            </div>

            {/* Binance Pay */}
            <div className="rounded-xl border border-[#2f3549] bg-[#1a1b26] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Binance Pay (USDT)</span>
                <label className="flex items-center gap-2 text-xs text-[#9aa5ce] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.payment_methods.binance.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment_methods: {
                          ...settings.payment_methods,
                          binance: {
                            ...settings.payment_methods.binance,
                            enabled: e.target.checked,
                          },
                        },
                      })
                    }
                    className="accent-[#7aa2f7]"
                  />
                  <span>Habilitado</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Binance Pay ID (ej. 123456789)"
                  value={settings.payment_methods.binance.pay_id}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        binance: {
                          ...settings.payment_methods.binance,
                          pay_id: e.target.value,
                        },
                      },
                    })
                  }
                  className="rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-white"
                />
                <input
                  type="text"
                  placeholder="Apodo / Nickname Binance (opcional)"
                  value={settings.payment_methods.binance.nickname || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      payment_methods: {
                        ...settings.payment_methods,
                        binance: {
                          ...settings.payment_methods.binance,
                          nickname: e.target.value,
                        },
                      },
                    })
                  }
                  className="rounded-lg border border-[#2f3549] bg-[#24283b] p-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#7aa2f7] hover:bg-[#89b4fa] px-6 py-3 text-xs font-bold text-[#1a1b26] shadow-lg shadow-[#7aa2f7]/20 transition-all active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
