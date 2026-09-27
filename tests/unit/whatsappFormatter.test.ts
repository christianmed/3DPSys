import { describe, it, expect } from "vitest";
import { formatWhatsAppQuoteMessage } from "@/lib/export/whatsappFormatter";
import type { Quote, PaymentMethodsConfig } from "@/types";

describe("whatsappFormatter - Generador de mensaje para WhatsApp", () => {
  it("debe estructurar el mensaje con precio en USD, precio en Bs y datos de pago móvil", () => {
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

    expect(message).toContain("Soporte GPS Moto");
    expect(message).toContain("PETG Sunlu Gris");
    expect(message).toContain("$12.50 USD");
    expect(message).toContain("812,50 Bs.");
    expect(message).toContain("65.00 Bs/$");
    expect(message).toContain("Banesco");
    expect(message).toContain("0412-1112233");
  });
});
