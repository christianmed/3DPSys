import type { Quote, PaymentMethodsConfig } from "@/types";

export interface WhatsAppMessageOptions {
  quote: Quote;
  paymentMethods?: PaymentMethodsConfig;
  businessName?: string;
  leadTimeDays?: string; // ej: "2 a 3 días hábiles"
}

/**
 * Genera un mensaje sobrio y profesional para WhatsApp, sin emojis,
 * utilizando formato nativo (negritas, listas, citas y código monoespaciado para datos de pago).
 */
export function formatWhatsAppQuoteMessage(options: WhatsAppMessageOptions): string {
  const { quote, paymentMethods, businessName = "Taller 3D", leadTimeDays = "2 a 3 días hábiles" } = options;

  const lines: string[] = [];
  const HEADER_DIVIDER = "==============================";
  const SECTION_DIVIDER = "------------------------------";

  // Encabezado
  lines.push(HEADER_DIVIDER);
  lines.push(`*PRESUPUESTO DE IMPRESIÓN 3D*`);
  lines.push(`*${businessName}*`);
  lines.push(`_Fecha: ${new Date(quote.created_at).toLocaleDateString("es-VE")}_`);
  lines.push(HEADER_DIVIDER);
  lines.push(``);

  // Detalles de la Pieza (lista nativa con guión)
  lines.push(SECTION_DIVIDER);
  lines.push(`*DETALLE DEL PROYECTO*`);
  lines.push(SECTION_DIVIDER);
  lines.push(`- *Pieza:* ${quote.part_name || "Pieza en 3D"}`);
  if (quote.material_name) {
    lines.push(`- *Material:* ${quote.material_name}`);
  }
  lines.push(`- *Peso neto:* ~${quote.weight_grams} g`);
  if (quote.print_time_formatted) {
    lines.push(`- *Tiempo estimado:* ${quote.print_time_formatted}`);
  }
  lines.push(`- *Tiempo de entrega:* ${leadTimeDays}`);
  lines.push(``);

  // Inversión / Precios (Priorizando Bolívares y oferta especial en divisas con bloque de cita)
  lines.push(SECTION_DIVIDER);
  lines.push(`*TOTAL A INVERTIR*`);
  lines.push(SECTION_DIVIDER);
  lines.push(
    `> *Total en Bolívares:* *${quote.final_price_ves.toLocaleString("es-VE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} Bs.*`
  );
  lines.push(`> *Precio especial en divisas:* *$${quote.final_price_usd.toFixed(2)} USD*`);
  lines.push(``);

  // Métodos de Pago
  if (paymentMethods) {
    const activePayments: string[] = [];

    if (paymentMethods.pago_movil?.enabled) {
      activePayments.push(
        `*Pago Móvil:*\n- Banco: \`${paymentMethods.pago_movil.bank}\`\n- Teléfono: \`${paymentMethods.pago_movil.phone}\`\n- C.I./RIF: \`${paymentMethods.pago_movil.id_number}\`\n- Titular: ${paymentMethods.pago_movil.account_holder}`
      );
    }

    if (paymentMethods.zelle?.enabled) {
      activePayments.push(
        `*Zelle:*\n- Correo: \`${paymentMethods.zelle.email}\`\n- Titular: ${paymentMethods.zelle.account_holder}`
      );
    }

    if (paymentMethods.binance?.enabled) {
      activePayments.push(
        `*Binance Pay (USDT):*\n- Pay ID: \`${paymentMethods.binance.pay_id}\`${
          paymentMethods.binance.nickname ? `\n- Titular: ${paymentMethods.binance.nickname}` : ""
        }`
      );
    }

    if (paymentMethods.efectivo_usd?.enabled) {
      activePayments.push(`*Efectivo Divisas:*\n- Detalle: ${paymentMethods.efectivo_usd.instructions}`);
    }

    if (activePayments.length > 0) {
      lines.push(SECTION_DIVIDER);
      lines.push(`*MÉTODOS DE PAGO ACEPTADOS*`);
      lines.push(SECTION_DIVIDER);
      lines.push(activePayments.join("\n\n"));
      lines.push(``);
    }
  }

  // Cierre profesional
  lines.push(HEADER_DIVIDER);
  lines.push(`_Presupuesto válido por 48 horas. ¿Confirmamos para comenzar con la fabricación?_`);
  lines.push(HEADER_DIVIDER);

  return lines.join("\n");
}
