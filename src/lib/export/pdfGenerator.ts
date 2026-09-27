import type { Quote, PaymentMethodsConfig } from "@/types";

export interface PdfDocumentOptions {
  quote: Quote;
  paymentMethods?: PaymentMethodsConfig;
  businessName?: string;
  businessPhone?: string;
}

/**
 * Genera una ventana emergente de impresión con hoja de presupuesto formal estilizada
 * que el navegador renderiza nativamente para guardar como PDF o imprimir.
 */
export function printQuotePdf(options: PdfDocumentOptions): void {
  const { quote, paymentMethods, businessName = "Taller de Fabricación 3D", businessPhone = "" } = options;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Por favor habilita las ventanas emergentes (pop-ups) para descargar el PDF.");
    return;
  }

  const quoteDate = new Date(quote.created_at).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const quoteId = `3DC-${quote.id.slice(-6).toUpperCase()}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Presupuesto_${quoteId}_${quote.part_name || "Pieza3D"}</title>
  <style>
    @page {
      size: letter;
      margin: 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 20px;
      line-height: 1.5;
      font-size: 13px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    .quote-meta {
      text-align: right;
    }
    .quote-badge {
      display: inline-block;
      background: #eff6ff;
      color: #2563eb;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 6px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 20px;
      margin-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
    }
    th {
      background-color: #f8fafc;
      color: #475569;
      font-weight: 600;
      font-size: 12px;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      border-bottom: 1px solid #f1f5f9;
    }
    .text-right {
      text-align: right;
    }
    .font-mono {
      font-family: ui-monospace, Menlo, Consolas, monospace;
    }
    .total-box {
      margin-left: auto;
      width: 280px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      margin-top: 15px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 13px;
    }
    .total-final {
      border-top: 2px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 8px;
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }
    .payment-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 20px;
      font-size: 12px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">${businessName}</h1>
      <div class="brand-subtitle">Servicios Profesionales de Fabricación e Impresión 3D</div>
      ${businessPhone ? `<div class="brand-subtitle">Contacto: ${businessPhone}</div>` : ""}
    </div>
    <div class="quote-meta">
      <div class="quote-badge">COTIZACIÓN ${quoteId}</div>
      <div style="font-size: 12px; color: #64748b;">Fecha: ${quoteDate}</div>
      <div style="font-size: 12px; color: #64748b;">Válido por: 48 horas</div>
    </div>
  </div>

  <div class="section-title">Especificaciones del Trabajo</div>
  <table>
    <thead>
      <tr>
        <th>Descripción de la Pieza</th>
        <th>Material / Tecnología</th>
        <th class="text-right">Peso Neto</th>
        <th class="text-right">Tiempo de Fabricación</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: 600;">${quote.part_name || "Pieza en 3D"}</td>
        <td>${quote.material_name || "Filamento Termoplástico FDM"}</td>
        <td class="text-right font-mono">${quote.weight_grams} g</td>
        <td class="text-right font-mono">${quote.print_time_formatted || "N/A"}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-box">
    <div class="total-row">
      <span style="color: #64748b;">Moneda Base:</span>
      <span class="font-mono" style="font-weight: 600;">$${quote.final_price_usd.toFixed(2)} USD</span>
    </div>
    <div class="total-row">
      <span style="color: #64748b;">Tasa de Referencia:</span>
      <span class="font-mono">${quote.exchange_rate_used.toFixed(2)} Bs/$</span>
    </div>
    <div class="total-row total-final">
      <span>Total en Bs.:</span>
      <span class="font-mono" style="color: #2563eb;">
        ${quote.final_price_ves.toLocaleString("es-VE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} Bs.
      </span>
    </div>
  </div>

  ${
    paymentMethods
      ? `
  <div class="section-title">Datos Bancarios para Pago</div>
  <div class="payment-box">
    ${
      paymentMethods.pago_movil?.enabled
        ? `<div><strong>Pago Móvil:</strong> ${paymentMethods.pago_movil.bank} | Tel: ${paymentMethods.pago_movil.phone} | C.I./RIF: ${paymentMethods.pago_movil.id_number} | ${paymentMethods.pago_movil.account_holder}</div>`
        : ""
    }
    ${
      paymentMethods.zelle?.enabled
        ? `<div style="margin-top: 4px;"><strong>Zelle:</strong> ${paymentMethods.zelle.email} (${paymentMethods.zelle.account_holder})</div>`
        : ""
    }
    ${
      paymentMethods.binance?.enabled
        ? `<div style="margin-top: 4px;"><strong>Binance Pay USDT:</strong> Pay ID ${paymentMethods.binance.pay_id}</div>`
        : ""
    }
  </div>
  `
      : ""
  }

  <div class="footer">
    Documento generado electrónicamente por 3DCalc Venezuela. Los presupuestos en Bolívares se calculan a la tasa convenida a la fecha de emisión.
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
