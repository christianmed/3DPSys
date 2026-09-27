import type { Quote, PaymentMethodsConfig } from "@/types";

export interface WhatsAppMessageOptions {
  quote: Quote;
  paymentMethods?: PaymentMethodsConfig;
  businessName?: string;
  leadTimeDays?: string; // ej: "2 a 3 días hábiles"
}

/**
 * Genera un mensaje formateado con estilo visual y emojis listo para enviar por WhatsApp
 */
export function formatWhatsAppQuoteMessage(options: WhatsAppMessageOptions): string {
  const { quote, paymentMethods, businessName = "Taller 3D", leadTimeDays = "2 a 3 días hábiles" } = options;

  const lines: string[] = [];

  // Encabezado
  lines.push(`🖨️ *PRESUPUESTO DE IMPRESIÓN 3D*`);
  lines.push(`*${businessName}*`);
  lines.push(`📅 _Fecha: ${new Date(quote.created_at).toLocaleDateString("es-VE")}_`);
  lines.push(``);

  // Detalles de la Pieza
  lines.push(`📦 *Detalle del Proyecto:*`);
  lines.push(`• *Pieza:* ${quote.part_name || "Pieza en 3D"}`);
  if (quote.material_name) {
    lines.push(`• *Material:* ${quote.material_name}`);
  }
  lines.push(`• *Peso neto:* ~${quote.weight_grams} g`);
  if (quote.print_time_formatted) {
    lines.push(`• *Tiempo estimado:* ${quote.print_time_formatted}`);
  }
  lines.push(`• *Tiempo de entrega:* ${leadTimeDays}`);
  lines.push(``);

  // Inversión / Precios
  lines.push(`💰 *Total a Invertir:*`);
  lines.push(`• *En Divisas:* *$${quote.final_price_usd.toFixed(2)} USD*`);
  lines.push(
    `• *En Bolívares:* *${quote.final_price_ves.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Bs.*`
  );
  lines.push(`_(Tasa aplicada: ${quote.exchange_rate_used.toFixed(2)} Bs/$)_`);
  lines.push(``);

  // Formas de Pago
  if (paymentMethods) {
    const activePayments: string[] = [];

    if (paymentMethods.pago_movil?.enabled) {
      activePayments.push(
        `💳 *Pago Móvil:*\n   Banco: ${paymentMethods.pago_movil.bank}\n   Teléfono: ${paymentMethods.pago_movil.phone}\n   C.I./RIF: ${paymentMethods.pago_movil.id_number}\n   Titular: ${paymentMethods.pago_movil.account_holder}`
      );
    }

    if (paymentMethods.zelle?.enabled) {
      activePayments.push(
        `💵 *Zelle:*\n   Correo: ${paymentMethods.zelle.email}\n   Titular: ${paymentMethods.zelle.account_holder}`
      );
    }

    if (paymentMethods.binance?.enabled) {
      activePayments.push(
        `🪙 *Binance Pay (USDT):*\n   Pay ID: ${paymentMethods.binance.pay_id}${
          paymentMethods.binance.nickname ? ` (${paymentMethods.binance.nickname})` : ""
        }`
      );
    }

    if (paymentMethods.efectivo_usd?.enabled) {
      activePayments.push(`💵 *Efectivo:* ${paymentMethods.efectivo_usd.instructions}`);
    }

    if (activePayments.length > 0) {
      lines.push(`🏦 *Métodos de Pago Aceptados:*`);
      lines.push(activePayments.join("\n\n"));
      lines.push(``);
    }
  }

  lines.push(`_Presupuesto válido por 48 horas. ¿Confirmamos para comenzar con la fabricación?_ 👍`);

  return lines.join("\n");
}
