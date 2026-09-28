import type { Printer, Material, Quote, UserSettings } from "@/types";
import type { IStorageRepository } from "./types";
import {
  DEFAULT_PRINTERS,
  DEFAULT_MATERIALS,
  DEFAULT_USER_SETTINGS,
} from "./defaultData";

const KEYS = {
  PRINTERS: "3dcalc_printers_v2",
  MATERIALS: "3dcalc_materials_v2",
  QUOTES: "3dcalc_quotes_v1",
  SETTINGS: "3dcalc_settings_v2",
};

export class LocalStorageRepository implements IStorageRepository {
  private isClient(): boolean {
    return typeof window !== "undefined";
  }

  // --- IMPRESORAS ---
  async getPrinters(): Promise<Printer[]> {
    if (!this.isClient()) return DEFAULT_PRINTERS;

    try {
      const stored = localStorage.getItem(KEYS.PRINTERS);
      if (!stored) {
        // Inicializar con semillas por primera vez
        localStorage.setItem(KEYS.PRINTERS, JSON.stringify(DEFAULT_PRINTERS));
        return DEFAULT_PRINTERS;
      }
      return JSON.parse(stored);
    } catch (err) {
      console.error("Error al obtener impresoras de localStorage:", err);
      return DEFAULT_PRINTERS;
    }
  }

  async savePrinter(printer: Printer): Promise<Printer> {
    const list = await this.getPrinters();
    const existingIndex = list.findIndex((p) => p.id === printer.id);

    if (existingIndex >= 0) {
      list[existingIndex] = { ...printer };
    } else {
      list.push({ ...printer, id: printer.id || `printer-${Date.now()}` });
    }

    if (this.isClient()) {
      localStorage.setItem(KEYS.PRINTERS, JSON.stringify(list));
    }
    return printer;
  }

  async deletePrinter(id: string): Promise<void> {
    const list = await this.getPrinters();
    const filtered = list.filter((p) => p.id !== id);
    if (this.isClient()) {
      localStorage.setItem(KEYS.PRINTERS, JSON.stringify(filtered));
    }
  }

  // --- MATERIALES ---
  async getMaterials(): Promise<Material[]> {
    if (!this.isClient()) return DEFAULT_MATERIALS;

    try {
      const stored = localStorage.getItem(KEYS.MATERIALS);
      if (!stored) {
        localStorage.setItem(KEYS.MATERIALS, JSON.stringify(DEFAULT_MATERIALS));
        return DEFAULT_MATERIALS;
      }
      return JSON.parse(stored);
    } catch (err) {
      console.error("Error al obtener materiales de localStorage:", err);
      return DEFAULT_MATERIALS;
    }
  }

  async saveMaterial(material: Material): Promise<Material> {
    const list = await this.getMaterials();
    const existingIndex = list.findIndex((m) => m.id === material.id);

    if (existingIndex >= 0) {
      list[existingIndex] = { ...material };
    } else {
      list.push({ ...material, id: material.id || `mat-${Date.now()}` });
    }

    if (this.isClient()) {
      localStorage.setItem(KEYS.MATERIALS, JSON.stringify(list));
    }
    return material;
  }

  async deleteMaterial(id: string): Promise<void> {
    const list = await this.getMaterials();
    const filtered = list.filter((m) => m.id !== id);
    if (this.isClient()) {
      localStorage.setItem(KEYS.MATERIALS, JSON.stringify(filtered));
    }
  }

  // --- COTIZACIONES ---
  async getQuotes(): Promise<Quote[]> {
    if (!this.isClient()) return [];

    try {
      const stored = localStorage.getItem(KEYS.QUOTES);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Error al obtener cotizaciones:", err);
      return [];
    }
  }

  async saveQuote(quote: Quote): Promise<Quote> {
    const list = await this.getQuotes();
    const quoteWithId = {
      ...quote,
      id: quote.id || `quote-${Date.now()}`,
      created_at: quote.created_at || new Date().toISOString(),
    };

    const existingIndex = list.findIndex((q) => q.id === quoteWithId.id);
    if (existingIndex >= 0) {
      list[existingIndex] = quoteWithId;
    } else {
      list.unshift(quoteWithId); // Los más recientes primero
    }

    if (this.isClient()) {
      localStorage.setItem(KEYS.QUOTES, JSON.stringify(list));
    }
    return quoteWithId;
  }

  async deleteQuote(id: string): Promise<void> {
    const list = await this.getQuotes();
    const filtered = list.filter((q) => q.id !== id);
    if (this.isClient()) {
      localStorage.setItem(KEYS.QUOTES, JSON.stringify(filtered));
    }
  }

  // --- CONFIGURACIÓN DE USUARIO ---
  async getUserSettings(): Promise<UserSettings> {
    if (!this.isClient()) return DEFAULT_USER_SETTINGS;

    try {
      const stored = localStorage.getItem(KEYS.SETTINGS);
      if (!stored) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_USER_SETTINGS));
        return DEFAULT_USER_SETTINGS;
      }
      return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(stored) };
    } catch (err) {
      console.error("Error al leer configuración:", err);
      return DEFAULT_USER_SETTINGS;
    }
  }

  async saveUserSettings(settings: UserSettings): Promise<UserSettings> {
    if (this.isClient()) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    }
    return settings;
  }
}

// Instancia singleton para el cliente
export const storageService: IStorageRepository = new LocalStorageRepository();
