import { describe, it, expect } from "vitest";
import { formatWhatsAppQuoteMessage } from "@/lib/export/whatsappFormatter";
import type { Quote, PaymentMethodsConfig } from "@/types";

describe("whatsappFormatter - Generador de mensaje para WhatsApp", () => {
  it("debe estructurar el mensaje sin emojis, con separadores, precio en Bs primero, precio especial en divisas y datos bancarios copiables", () => {
    const mockQuote: Quote = {
      id: "quote-1",
      part_name: "Soporte GPS Moto",
      material_name: "PETG Sunlu Gris",
      weight_grams: 85,
      print_time_formatted: "3h 40m",
      margin_percent: 40,
      exchange_rate_used: 65.0,
      exchange_rate_type: "BCV_EURO",
      cost_breakdown: {} as any,
      final_price_usd: 12.5,
      final_price_ves: 812.5,
      created_at: "2026-09-27T10:00:00Z",
    };

    const paymentMethods: PaymentMethodsConfig = {
      pago_movil: {
        enabled: true,
        bank: "Banesco",
        phone: "0412-1112233",
        id_number: "V-19876543",
        account_holder: "Pedro Pérez",
      },
      zelle: { enabled: false, email: "", account_holder: "" },
      binance: { enabled: false, pay_id: "" },
      efectivo_usd: { enabled: false, instructions: "" },
    };

    const message = formatWhatsAppQuoteMessage({
      quote: mockQuote,
      paymentMethods,
      businessName: "Taller Maker 3D",
    });

    // Validar encabezado y separadores
    expect(message).toContain("==============================");
    expect(message).toContain("------------------------------");
    expect(message).toContain("*PRESUPUESTO DE IMPRESIÓN 3D*");
    expect(message).toContain("*Taller Maker 3D*");

    // Validar detalles del proyecto
    expect(message).toContain("Soporte GPS Moto");
    expect(message).toContain("PETG Sunlu Gris");
    expect(message).toContain("~85 g");
    expect(message).toContain("3h 40m");

    // Validar precios (Bolívares primero y divisas como precio especial)
    expect(message).toContain("> *Total en Bolívares:* *812,50 Bs.*");
    expect(message).toContain("> *Precio especial en divisas:* *$12.50 USD*");

    // Validar que NO aparezca la tasa de cambio aplicada
    expect(message).not.toContain("Tasa aplicada");
    expect(message).not.toContain("Bs/$");

    // Validar datos de pago móvil con monoespaciado para fácil copiado
    expect(message).toContain("`Banesco`");
    expect(message).toContain("`0412-1112233`");
    expect(message).toContain("`V-19876543`");
    expect(message).toContain("Pedro Pérez");

    // Validar ausencia de emojis
    expect(message).not.toMatch(/[\u{1F300}-\u{1F9FF}]/u);
  });
});
