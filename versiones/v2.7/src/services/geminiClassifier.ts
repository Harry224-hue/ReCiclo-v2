import { 
  CAMPUS_CONTAINERS_CATALOG, 
  CATEGORY_INFO, 
  WASTE_DATABASE, 
  WasteItem, 
  WasteCategory 
} from "../data/wasteData";
import type { AIClassificationResult } from "./aiClassifier";

// En la web (Vercel) se usa la ruta relativa, o la variable VITE_API_BASE_URL si existe
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";

export interface GeminiVisionResponse {
  productName: string;
  brand?: string;
  wasteType?: string;
  material: string;
  isRecyclable: boolean;
  category: WasteCategory;
  binId: string;
  handlingInstructions: string[];
  whyThisBin: string;
  degradationTime: string;
  tip: string;
  confidence?: number;
}

/** Reduce la foto (máx. 800 px) para optimizar el payload y acelerar la respuesta de Gemini */
function downscaleToBase64(img: HTMLImageElement, maxSide = 800): string {
  const scale = Math.min(1, maxSide / Math.max(img.naturalWidth || 800, img.naturalHeight || 600));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round((img.naturalWidth || 800) * scale);
  canvas.height = Math.round((img.naturalHeight || 600) * scale);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
  return canvas.toDataURL("image/jpeg", 0.85).split(",")[1];
}

/**
 * Clasifica cualquier producto real mediante la API Multimodal de Google Gemini
 * Identifica marca, producto específico, material exacto, contenedor del IT Morelia y pasos de preparación.
 */
export async function classifyWithGemini(img: HTMLImageElement): Promise<AIClassificationResult> {
  const start = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(`${API_BASE}/api/gemini`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        image: downscaleToBase64(img), 
        mimeType: "image/jpeg" 
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Gemini API respondió con código HTTP ${res.status}`);
    }

    const data = (await res.json()) as GeminiVisionResponse;

    if (!data.productName) {
      throw new Error("Respuesta inválida de Gemini: falta el nombre del producto.");
    }

    // Buscar si coincide con algún producto del catálogo local para reutilizar metadatos adicionales
    const matchedCatalogItem = WASTE_DATABASE.find(
      (w) =>
        w.name.toLowerCase().includes(data.productName.toLowerCase()) ||
        data.productName.toLowerCase().includes(w.name.toLowerCase()) ||
        (data.brand && w.brand && data.brand.toLowerCase() === w.brand.toLowerCase())
    );

    // Contenedor oficial en el campus del ITM (únicamente los 4 del documento oficial)
    const matchingBin =
      CAMPUS_CONTAINERS_CATALOG.find((b) => b.id === data.binId) ||
      CAMPUS_CONTAINERS_CATALOG.find((b) => {
        if (data.category === "organicos") return b.id === "bin-verde";
        if (data.category === "manejo_especial") return b.id === "bin-pilas";
        if (data.material.toLowerCase().includes("pet") || data.material.toLowerCase().includes("plástico") || data.material.toLowerCase().includes("hule")) return b.id === "bin-azul";
        if (data.category === "reciclables") return b.id === "bin-amarillo";
        return b.id === "bin-negro";
      }) ||
      CAMPUS_CONTAINERS_CATALOG[2];

    const categoryInfo = CATEGORY_INFO[data.category] || CATEGORY_INFO["reciclables"];

    // Generar el ítem de residuo real dinámicamente con la información exacta del producto
    const dynamicWasteItem: WasteItem = {
      id: matchedCatalogItem ? matchedCatalogItem.id : `gemini-${Date.now()}`,
      name: data.productName,
      brand: data.brand && data.brand !== "Genérico" ? data.brand : matchedCatalogItem?.brand,
      material: data.material || matchedCatalogItem?.material || "Material mixto identificado por visión",
      category: data.category,
      categoryLabel: categoryInfo.name,
      categoryReason: data.whyThisBin,
      recommendedBin: {
        color: matchingBin.colorName,
        label: matchingBin.name,
        description: matchingBin.shortDescription,
      },
      handlingInstructions:
        data.handlingInstructions && data.handlingInstructions.length > 0
          ? data.handlingInstructions
          : matchingBin.preparationRules,
      recommendations3R: {
        reducir: data.tip || "Evita comprar empaques desechables de un solo uso en la cafetería del campus.",
        reutilizar: matchedCatalogItem?.recommendations3R?.reutilizar || "Aprovechar el envase si está limpio antes de descartarlo.",
        reciclar: data.isRecyclable
          ? `Depositar en el ${matchingBin.name} para su transformación y reciclaje.`
          : "Residuo no reciclable en la región: depositar en el contenedor correspondiente para disposición final.",
      },
      degradationTime: {
        estimate: data.degradationTime || "Variable según condiciones ambientales",
        isApproximate: true,
        conditionsNote: "Estimación calculada por el modelo de IA según la composición física del residuo y su exposición en vertedero.",
      },
      environmentalImpact: {
        description: data.whyThisBin,
        source: "Análisis Multimodal de Google Gemini · SEMARNAT / LGPGIR",
      },
      examples: [data.productName],
    };

    const confidenceScore = Math.min(0.99, Math.max(0.75, data.confidence || 0.94));

    return {
      wasteItem: dynamicWasteItem,
      rawLabel: data.productName,
      confidence: confidenceScore,
      inferenceTimeMs: Math.round(performance.now() - start),
      allPredictions: [{ className: data.productName, probability: confidenceScore }],
      isAiReal: true,
      engine: "gemini",
      geminiTip: data.tip,
    };
  } finally {
    clearTimeout(timeout);
  }
}
