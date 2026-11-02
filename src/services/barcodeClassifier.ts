import {
  CAMPUS_CONTAINERS_CATALOG,
  CATEGORY_INFO,
  WASTE_DATABASE,
  WasteCategory,
  WasteItem,
} from "../data/wasteData";
import type { AIClassificationResult } from "./aiClassifier";

export interface BarcodePreset {
  code: string;
  label: string;
  brand: string;
  wasteId: string;
  customName?: string;
  customMaterial?: string;
}

/**
 * Catálogo instantáneo de códigos de barras reales de productos frecuentes en el IT Morelia
 * para respuesta en 0 ms (incluso sin internet) y pruebas rápidas.
 */
export const CAMPUS_BARCODE_PRESETS: BarcodePreset[] = [
  {
    code: "7501055300075",
    label: "Coca-Cola Original 600 ml",
    brand: "Coca-Cola",
    wasteId: "pet-bottle",
    customName: "Botella de Coca-Cola Original 600 ml",
    customMaterial: "Plástico PET #1 (Tereftalato de polietileno) con tapa PP #5",
  },
  {
    code: "7501055310883",
    label: "Agua Ciel Purificada 1 L",
    brand: "Ciel",
    wasteId: "ciel-agua-pet",
    customName: "Botella de Agua Ciel 1 L",
    customMaterial: "Plástico PET #1 reciclable",
  },
  {
    code: "7501011115613",
    label: "Sabritas Doritos Nacho 58 g",
    brand: "Sabritas / Doritos",
    wasteId: "snack-wrapper",
    customName: "Bolsa de Doritos Nacho Sabritas",
    customMaterial: "Polipropileno biorientado metalizado (BOPP multicapa)",
  },
  {
    code: "7501000266265",
    label: "Takis Fuego Barcel 62 g",
    brand: "Barcel",
    wasteId: "barcel-takis",
    customName: "Envoltura de Takis Fuego Barcel",
    customMaterial: "Empaque plástico laminado metalizado (BOPP)",
  },
  {
    code: "7501020515350",
    label: "Leche Lala Entera Tetra Pak 1 L",
    brand: "Lala",
    wasteId: "tetra-pak",
    customName: "Envase Tetra Brik de Leche Lala 1 L",
    customMaterial: "Envase multicapa Tetra Pak (75% cartón, 20% polietileno, 5% aluminio)",
  },
  {
    code: "7501055302925",
    label: "Coca-Cola Lata 355 ml",
    brand: "Coca-Cola",
    wasteId: "aluminum-can",
    customName: "Lata de Aluminio Coca-Cola 355 ml",
    customMaterial: "Aluminio laminado 100% reciclable",
  },
  {
    code: "0041789001215",
    label: "Sopa Instantánea Maruchan 64 g",
    brand: "Maruchan",
    wasteId: "unicel",
    customName: "Vaso térmico de Sopa Maruchan Instantánea",
    customMaterial: "Poliestireno expandido (Unicel / EPS #6) con restos de alimento",
  },
  {
    code: "7501000111206",
    label: " Pastelito Gansito Marinela 50 g",
    brand: "Marinela",
    wasteId: "gansito-marinela",
    customName: "Envoltura de Gansito Marinela",
    customMaterial: "Película plástica metalizada flexible (BOPP)",
  },
  {
    code: "7501000630363",
    label: "Galletas Emperador Chocolate Gamesa",
    brand: "Gamesa",
    wasteId: "galletas-emperador",
    customName: "Empaque de Galletas Emperador Gamesa",
    customMaterial: "Polipropileno metalizado flexible no reciclable",
  },
  {
    code: "7501125104268",
    label: "Suero Electrolit 625 ml",
    brand: "Electrolit / Pisa",
    wasteId: "electrolit-frasco",
    customName: "Frasco de Electrolit 625 ml",
    customMaterial: "Plástico rígido reciclable (PETG / PEAD) con tapa de polipropileno",
  },
];

interface BarcodeDetectorLike {
  detect(source: ImageBitmapSource): Promise<Array<{ rawValue: string; format?: string }>>;
}

let detectorInstance: BarcodeDetectorLike | null = null;
let detectorLoadingPromise: Promise<BarcodeDetectorLike | null> | null = null;

/**
 * Inicializa el detector de códigos de barras nativo del navegador o carga un polyfill ligero WASM.
 */
export async function getBarcodeDetector(): Promise<BarcodeDetectorLike | null> {
  if (detectorInstance) return detectorInstance;
  if (detectorLoadingPromise) return detectorLoadingPromise;

  detectorLoadingPromise = (async () => {
    const formats = ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39", "qr_code"];
    const win = window as unknown as {
      BarcodeDetector?: new (opts?: { formats?: string[] }) => BarcodeDetectorLike;
    };

    if (typeof win.BarcodeDetector === "function") {
      try {
        detectorInstance = new win.BarcodeDetector({ formats });
        return detectorInstance;
      } catch {
        try {
          detectorInstance = new win.BarcodeDetector();
          return detectorInstance;
        } catch {
          // continúa al polyfill
        }
      }
    }

    // Fallback dinámico para navegadores sin BarcodeDetector nativo (ej. Firefox / Safari)
    try {
      const moduleUrl = "https://fastly.jsdelivr.net/npm/barcode-detector@2/dist/es/pure.min.js";
      const mod = await import(/* @vite-ignore */ moduleUrl);
      const PolyfillClass = mod.BarcodeDetector || mod.default;
      if (PolyfillClass) {
        detectorInstance = new PolyfillClass({ formats });
        return detectorInstance;
      }
    } catch (err) {
      console.warn("[ReCiclo Barcode] No se pudo cargar el detector de códigos:", err);
    }

    return null;
  })();

  return detectorLoadingPromise;
}

/**
 * Detecta un código de barras a partir de un elemento de video, imagen o canvas.
 */
export async function detectBarcodeFromSource(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
): Promise<string | null> {
  const detector = await getBarcodeDetector();
  if (!detector) return null;

  try {
    const results = await detector.detect(source);
    if (results && results.length > 0) {
      const valid = results.find((r) => r.rawValue && r.rawValue.trim().length >= 6);
      return valid ? valid.rawValue.trim() : null;
    }
  } catch {
    // Frame inválido o en transición
  }
  return null;
}

interface OpenFoodFactsProduct {
  product_name?: string;
  product_name_es?: string;
  generic_name?: string;
  generic_name_es?: string;
  brands?: string;
  packaging?: string;
  packaging_text?: string;
  packaging_text_es?: string;
  packaging_materials_tags?: string[];
  categories?: string;
  categories_tags?: string[];
  image_front_small_url?: string;
  image_front_url?: string;
  image_url?: string;
  quantity?: string;
}

interface InferredPackaging {
  wasteId: string;
  binId: string;
  category: WasteCategory;
  material: string;
  inferredByHeuristic: boolean;
  reason: string;
}

function inferPackagingFromOpenFoodFacts(product: OpenFoodFactsProduct, code: string): InferredPackaging {
  const name = (
    product.product_name_es ||
    product.product_name ||
    product.generic_name_es ||
    product.generic_name ||
    ""
  ).toLowerCase();
  const brand = (product.brands || "").toLowerCase();
  const packText = [
    product.packaging || "",
    product.packaging_text_es || "",
    product.packaging_text || "",
    ...(product.packaging_materials_tags || []),
  ]
    .join(" ")
    .toLowerCase();
  const cats = [product.categories || "", ...(product.categories_tags || [])].join(" ").toLowerCase();
  const fullText = `${name} ${brand} ${packText} ${cats}`;

  // 1. Verificar si hay datos explícitos de empaque en Open Food Facts
  const hasExplicitPackaging = packText.trim().length > 2;

  // Unicel / Poliestireno expandido / Sopa en vaso
  if (
    fullText.includes("unicel") ||
    fullText.includes("poliestireno") ||
    fullText.includes("styrofoam") ||
    fullText.includes("eps") ||
    fullText.includes("maruchan") ||
    (fullText.includes("instant") && fullText.includes("vaso"))
  ) {
    return {
      wasteId: "unicel",
      binId: "bin-negro",
      category: "no_reciclables",
      material: "Poliestireno expandido (Unicel / EPS #6)",
      inferredByHeuristic: !hasExplicitPackaging,
      reason:
        "El poliestireno expandido (unicel) impregnado con alimentos no es valorizable y se deposita en el Bote Negro del ITM.",
    };
  }

  // Envolturas metalizadas de botanas, frituras, galletas y pastelitos (BOPP)
  if (
    fullText.includes("sabritas") ||
    fullText.includes("doritos") ||
    fullText.includes("takis") ||
    fullText.includes("barcel") ||
    fullText.includes("ruffles") ||
    fullText.includes("cheetos") ||
    fullText.includes("totis") ||
    fullText.includes("marinela") ||
    fullText.includes("gansito") ||
    fullText.includes("pinguinos") ||
    fullText.includes("chocoroles") ||
    fullText.includes("emperador") ||
    fullText.includes("gamesa") ||
    fullText.includes("oreo") ||
    fullText.includes("principe") ||
    fullText.includes("bimbo") ||
    fullText.includes("tia rosa") ||
    fullText.includes("metalizad") ||
    fullText.includes("bopp") ||
    fullText.includes("wrapper") ||
    fullText.includes("snacks") ||
    fullText.includes("botanas") ||
    fullText.includes("papas fritas") ||
    fullText.includes("biscuits") ||
    fullText.includes("galletas")
  ) {
    let wasteId = "snack-wrapper";
    if (fullText.includes("takis") || fullText.includes("barcel")) wasteId = "barcel-takis";
    else if (fullText.includes("emperador") || fullText.includes("galleta")) wasteId = "galletas-emperador";
    else if (fullText.includes("gansito") || fullText.includes("marinela")) wasteId = "gansito-marinela";

    return {
      wasteId,
      binId: "bin-negro",
      category: "no_reciclables",
      material: "Empaque flexible laminado / Polipropileno metalizado (BOPP)",
      inferredByHeuristic: !hasExplicitPackaging,
      reason:
        "Las envolturas metalizadas multicapa de botanas y galletas no pueden separarse mecánicamente; corresponden al Bote Negro (No reciclables).",
    };
  }

  // Latas de aluminio, hojalata o envases de vidrio
  if (
    fullText.includes("lata") ||
    fullText.includes("aluminio") ||
    fullText.includes("aluminium") ||
    fullText.includes("aluminum") ||
    fullText.includes("can") ||
    fullText.includes("steel") ||
    fullText.includes("acero") ||
    fullText.includes("hojalata") ||
    fullText.includes("atun") ||
    fullText.includes("atún") ||
    fullText.includes("arizona") ||
    fullText.includes("vidrio") ||
    fullText.includes("glass")
  ) {
    let wasteId = "aluminum-can";
    if (fullText.includes("atún") || fullText.includes("atun") || fullText.includes("dolores")) {
      wasteId = "atun-dolores-lata";
    } else if (fullText.includes("arizona")) {
      wasteId = "arizona-lata";
    }
    return {
      wasteId,
      binId: "bin-amarillo",
      category: "reciclables",
      material: fullText.includes("vidrio") || fullText.includes("glass")
        ? "Envase de vidrio reciclable"
        : "Envase metálico / Aluminio 100% reciclable",
      inferredByHeuristic: !hasExplicitPackaging,
      reason:
        "De acuerdo con el procedimiento ITMORELIA-IT-AM-007 (Sección 4.1), los metales, latas y vidrio limpio van en el Bote Amarillo.",
    };
  }

  // Envases Tetra Pak, cartón de leche/jugo o cajas de cartón
  if (
    fullText.includes("tetra") ||
    fullText.includes("brik") ||
    fullText.includes("carton") ||
    fullText.includes("cartón") ||
    fullText.includes("cardboard") ||
    fullText.includes("paperboard") ||
    fullText.includes("lala") ||
    fullText.includes("alpura") ||
    fullText.includes("santa clara") ||
    fullText.includes("boing") ||
    fullText.includes("leche") ||
    fullText.includes("milk") ||
    fullText.includes("cereal")
  ) {
    const wasteId = fullText.includes("boing") ? "boing-triangulo" : "tetra-pak";
    return {
      wasteId,
      binId: "bin-amarillo",
      category: "reciclables",
      material: "Envase multicapa Tetra Pak / Cartón laminado reciclable",
      inferredByHeuristic: !hasExplicitPackaging,
      reason:
        "Los envases de cartón y Tetra Pak limpios, escurridos y aplastados se depositan en el Bote Amarillo del ITM.",
    };
  }

  // Yogurt y botes de polipropileno rígido
  if (
    fullText.includes("yogurt") ||
    fullText.includes("yoghurt") ||
    fullText.includes("danone") ||
    fullText.includes("yoplait") ||
    fullText.includes("yakult")
  ) {
    return {
      wasteId: "yogurt-danone-bote",
      binId: "bin-azul",
      category: "reciclables",
      material: "Plástico rígido Polipropileno (PP #5) / Poliestireno rígido",
      inferredByHeuristic: !hasExplicitPackaging,
      reason:
        "Los envases plásticos rígidos enjuagados y sin restos de alimento corresponden al Bote Azul (Plásticos y PET).",
    };
  }

  // Botellas PET, bebidas, refrescos, agua, jugos embotellados
  if (
    fullText.includes("pet") ||
    fullText.includes("plastic") ||
    fullText.includes("plástico") ||
    fullText.includes("plastico") ||
    fullText.includes("botella") ||
    fullText.includes("bottle") ||
    fullText.includes("hdpe") ||
    fullText.includes("pead") ||
    fullText.includes("coca") ||
    fullText.includes("pepsi") ||
    fullText.includes("ciel") ||
    fullText.includes("bonafont") ||
    fullText.includes("epura") ||
    fullText.includes("electrolit") ||
    fullText.includes("powerade") ||
    fullText.includes("gatorade") ||
    fullText.includes("del valle") ||
    fullText.includes("jumex") ||
    fullText.includes("refresco") ||
    fullText.includes("agua") ||
    fullText.includes("beverage") ||
    fullText.includes("bebida")
  ) {
    let wasteId = "pet-bottle";
    if (fullText.includes("ciel") || fullText.includes("bonafont") || fullText.includes("agua")) {
      wasteId = "ciel-agua-pet";
    } else if (fullText.includes("electrolit")) {
      wasteId = "electrolit-frasco";
    } else if (fullText.includes("del valle") || fullText.includes("jugo")) {
      wasteId = "jugo-del-valle-pet";
    }

    return {
      wasteId,
      binId: "bin-azul",
      category: "reciclables",
      material: "Plástico PET #1 (Tereftalato de polietileno) con tapa de PP #5",
      inferredByHeuristic: !hasExplicitPackaging,
      reason:
        "Las botellas plásticas PET vacías y aplastadas se depositan en el Bote Azul del IT Morelia.",
    };
  }

  // Fallback por defecto para producto comercial con código de barras
  return {
    wasteId: "pet-bottle",
    binId: "bin-azul",
    category: "reciclables",
    material: packText
      ? `Empaque comercial (${packText.slice(0, 65)})`
      : `Envase comercial identificado (EAN ${code})`,
    inferredByHeuristic: true,
    reason:
      "Clasificado por tipo de producto comercial. Si el empaque es una bolsa metalizada o unicel sucio, deposítalo en el Bote Negro.",
  };
}

/**
 * Clasifica un producto mediante su código de barras consultando el catálogo del campus y Open Food Facts.
 */
export async function classifyByBarcode(rawCode: string): Promise<AIClassificationResult> {
  const start = performance.now();
  const cleanCode = rawCode.replace(/\D/g, "").trim();

  if (!cleanCode || cleanCode.length < 6) {
    throw new Error("El código de barras debe contener al menos 6 dígitos numéricos.");
  }

  // 1. Revisar si está en el catálogo instantáneo de productos frecuentes del campus ITM
  const preset = CAMPUS_BARCODE_PRESETS.find((p) => p.code === cleanCode);
  if (preset) {
    const baseWaste =
      WASTE_DATABASE.find((w) => w.id === preset.wasteId) || WASTE_DATABASE[0];

    const customWaste: WasteItem = {
      ...baseWaste,
      name: preset.customName || baseWaste.name,
      brand: preset.brand,
      material: preset.customMaterial || baseWaste.material,
    };

    return {
      wasteItem: customWaste,
      rawLabel: `${customWaste.name} (EAN: ${cleanCode})`,
      confidence: 0.99,
      inferenceTimeMs: Math.max(12, Math.round(performance.now() - start)),
      allPredictions: [{ className: customWaste.name, probability: 0.99 }],
      isAiReal: true,
      engine: "barcode",
      barcode: cleanCode,
      geminiTip: `Código ${cleanCode} verificado en el catálogo de productos del campus ITM (${preset.brand}).`,
    };
  }

  // 2. Consultar Open Food Facts API v2 (100% libre y gratuita)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
      cleanCode
    )}.json?fields=product_name,product_name_es,generic_name,generic_name_es,brands,packaging,packaging_text,packaging_text_es,packaging_materials_tags,categories,categories_tags,image_front_small_url,image_front_url,image_url,quantity`;

    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`No se encontró el código ${cleanCode} en Open Food Facts.`);
    }

    const data = await res.json();
    if (!data || data.status === 0 || !data.product) {
      throw new Error(
        `El código ${cleanCode} no está registrado en Open Food Facts. Usa el modo «Foto con IA» para analizar el residuo visualmente.`
      );
    }

    const product = data.product as OpenFoodFactsProduct;
    const rawName =
      product.product_name_es ||
      product.product_name ||
      product.generic_name_es ||
      product.generic_name ||
      `Producto comercial (${cleanCode})`;
    const brand = product.brands ? product.brands.split(",")[0].trim() : undefined;
    const quantity = product.quantity ? ` ${product.quantity}` : "";
    const fullProductName =
      brand && !rawName.toLowerCase().includes(brand.toLowerCase())
        ? `${rawName} · ${brand}${quantity}`
        : `${rawName}${quantity}`;

    const inferred = inferPackagingFromOpenFoodFacts(product, cleanCode);
    const matchedTemplate =
      WASTE_DATABASE.find((w) => w.id === inferred.wasteId) || WASTE_DATABASE[0];
    const matchingBin =
      CAMPUS_CONTAINERS_CATALOG.find((b) => b.id === inferred.binId) ||
      CAMPUS_CONTAINERS_CATALOG[3];
    const categoryInfo = CATEGORY_INFO[inferred.category];

    const dynamicWaste: WasteItem = {
      ...matchedTemplate,
      id: matchedTemplate.id,
      name: fullProductName,
      brand: brand || matchedTemplate.brand,
      material: inferred.material,
      category: inferred.category,
      categoryLabel: categoryInfo.name,
      categoryReason: inferred.reason,
      recommendedBin: {
        color: matchingBin.colorName,
        label: matchingBin.name,
        description: matchingBin.shortDescription,
      },
    };

    const productImageUrl =
      product.image_front_small_url || product.image_front_url || product.image_url;

    const tipText = inferred.inferredByHeuristic
      ? `Producto identificado en Open Food Facts (EAN ${cleanCode}). Empaque deducido por tipo de producto; si tiene un material distinto, verifícalo con «Foto con IA».`
      : `Empaque verificado en Open Food Facts (EAN ${cleanCode}): ${inferred.material}.`;

    return {
      wasteItem: dynamicWaste,
      rawLabel: `${fullProductName} (${cleanCode})`,
      confidence: inferred.inferredByHeuristic ? 0.91 : 0.98,
      inferenceTimeMs: Math.round(performance.now() - start),
      allPredictions: [{ className: fullProductName, probability: 0.98 }],
      isAiReal: true,
      engine: "barcode",
      barcode: cleanCode,
      productImageUrl,
      geminiTip: tipText,
    };
  } finally {
    clearTimeout(timeout);
  }
}
