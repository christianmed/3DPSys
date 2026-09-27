import type { Printer, Material, Quote, UserSettings } from "@/types";

export interface IStorageRepository {
  // Impresoras
  getPrinters(): Promise<Printer[]>;
  savePrinter(printer: Printer): Promise<Printer>;
  deletePrinter(id: string): Promise<void>;

  // Materiales / Bobinas
  getMaterials(): Promise<Material[]>;
  saveMaterial(material: Material): Promise<Material>;
  deleteMaterial(id: string): Promise<void>;

  // Cotizaciones
  getQuotes(): Promise<Quote[]>;
  saveQuote(quote: Quote): Promise<Quote>;
  deleteQuote(id: string): Promise<void>;

  // Configuración
  getUserSettings(): Promise<UserSettings>;
  saveUserSettings(settings: UserSettings): Promise<UserSettings>;
}
