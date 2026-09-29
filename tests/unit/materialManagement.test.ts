import { describe, it, expect } from "vitest";
import { calculateCostPerGram } from "@/lib/calculator/costingEngine";
import type { Material } from "@/types";

describe("Gestión de Materiales y Prorrateo de Flete", () => {
  it("calcula correctamente el costo por gramo con flete prorrateado de 6 bobinas", () => {
    // Bobina de $22.50 + ($5 flete / 6 bobinas = $0.8333) = $23.3333 por 1000g -> $0.0233/g
    const costPerGram = calculateCostPerGram(22.5, 5.0, 6, 1000);
    expect(costPerGram).toBeCloseTo(0.023333, 4);
    expect(costPerGram * 1000).toBeCloseTo(23.33, 2);
  });

  it("calcula correctamente sin flete cuando es compra local", () => {
    const costPerGram = calculateCostPerGram(18.0, 0, 1, 1000);
    expect(costPerGram).toBe(0.018);
    expect(costPerGram * 1000).toBe(18.0);
  });

  it("permite clonar/duplicar un perfil de filamento para crear una variante de color preservando el flete", () => {
    const originalMaterial: Material = {
      id: "mat-pla-esun-negro",
      name: "PLA eSun (Negro)",
      material_type: "PLA",
      brand: "eSun",
      color: "Negro",
      spool_price_usd: 22.5,
      shipping_cost_usd: 5.0,
      spools_in_shipment: 6,
      net_weight_grams: 1000,
      cost_per_gram: calculateCostPerGram(22.5, 5.0, 6, 1000),
    };

    // Crear variante (ej. Blanco)
    const clonedMaterial: Material = {
      ...originalMaterial,
      id: `mat-${Date.now()}`,
      color: "Blanco",
      name: `PLA eSun (Blanco)`,
    };

    expect(clonedMaterial.cost_per_gram).toBe(originalMaterial.cost_per_gram);
    expect(clonedMaterial.color).toBe("Blanco");
    expect(clonedMaterial.brand).toBe("eSun");
    expect(clonedMaterial.id).not.toBe(originalMaterial.id);
  });

  it("permite actualizar el flete y recalcular automáticamente el costo por gramo", () => {
    const material: Material = {
      id: "mat-1",
      name: "PETG Sunlu",
      material_type: "PETG",
      brand: "Sunlu",
      spool_price_usd: 20.0,
      shipping_cost_usd: 4.0,
      spools_in_shipment: 4,
      net_weight_grams: 1000,
      cost_per_gram: calculateCostPerGram(20.0, 4.0, 4, 1000), // $21.00 / 1000g = 0.0210
    };

    expect(material.cost_per_gram).toBe(0.021);

    // Si el flete aumenta a $8.00 para las 4 bobinas ($2 adicionales por bobina):
    const newShipping = 8.0;
    const updatedCostPerGram = calculateCostPerGram(
      material.spool_price_usd,
      newShipping,
      material.spools_in_shipment,
      material.net_weight_grams
    );

    expect(updatedCostPerGram).toBe(0.022); // ($20 + $2) / 1000g = 0.0220
  });

  it("verifica los 10 perfiles oficiales de filamento del taller (FilaVen y Creality)", async () => {
    const { DEFAULT_MATERIALS } = await import("@/lib/storage/defaultData");
    expect(DEFAULT_MATERIALS.length).toBe(10);

    // Verificar Negro FilaVen sin flete
    const negro = DEFAULT_MATERIALS.find((m) => m.name.includes("Negro"));
    expect(negro).toBeDefined();
    expect(negro?.brand).toBe("FilaVen");
    expect(negro?.spool_price_usd).toBe(20);
    expect(negro?.shipping_cost_usd).toBe(0);
    expect(negro?.cost_per_gram).toBe(0.02);

    // Verificar Azul FilaVen con $1 flete
    const azul = DEFAULT_MATERIALS.find((m) => m.name.includes("Azul"));
    expect(azul).toBeDefined();
    expect(azul?.shipping_cost_usd).toBe(1);
    expect(azul?.cost_per_gram).toBe(0.021);

    // Verificar TPU Creality Verde
    const tpu = DEFAULT_MATERIALS.find((m) => m.material_type === "TPU");
    expect(tpu).toBeDefined();
    expect(tpu?.brand).toBe("Creality");
    expect(tpu?.spool_price_usd).toBe(25);
    expect(tpu?.shipping_cost_usd).toBe(1);
    expect(tpu?.cost_per_gram).toBe(0.026);
  });

  it("verifica que solamente existen 2 perfiles de impresora oficiales: Sparkx i7 y Bambu P1S", async () => {
    const { DEFAULT_PRINTERS } = await import("@/lib/storage/defaultData");
    expect(DEFAULT_PRINTERS.length).toBe(2);

    const sparkx = DEFAULT_PRINTERS[0];
    expect(sparkx.id).toBe("printer-creality-sparkx-i7");
    expect(sparkx.name).toContain("Creality Sparkx i7");
    expect(sparkx.power_watts).toBe(400); // 400W nominal a 110V
    expect(sparkx.is_default).toBe(true);

    const bambu = DEFAULT_PRINTERS[1];
    expect(bambu.id).toBe("printer-bambu-p1s");
    expect(bambu.name).toContain("Bambu Lab P1S");
    expect(bambu.power_watts).toBe(350);
    expect(bambu.is_default).toBe(false);
  });

  it("verifica que el margen de beneficio por defecto es 60% (Detal) y la merma de fallo es 15%", async () => {
    const { DEFAULT_USER_SETTINGS } = await import("@/lib/storage/defaultData");
    expect(DEFAULT_USER_SETTINGS.default_margin_percent).toBe(60);
    expect(DEFAULT_USER_SETTINGS.default_failure_risk_percent).toBe(15);
  });
});
