import {
  CAMPUS_CONTAINERS_CATALOG,
  CATEGORY_INFO,
  WASTE_DATABASE,
  WasteItem,
  WasteCategory,
} from "../data/wasteData";
import type { AIClassificationResult } from "./aiClassifier";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "";
const DIRECT_GROQ_KEY = (import.meta.env.VITE_GROQ_API_KEY as string | undefined)?.trim() || "";

export interface GroqVisionResponse {
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
  modelUsed?: string;
}

const DIRECT_PROMPT = `Eres el clasificador de visión artificial de ReCiclo, la aplicación oficial de gestión y separación ambiental del Instituto Tecnológico de Morelia (ITM), Michoacán, México.
Analiza la fotografía del residuo y responde ÚNICAMENTE con un objeto JSON válido con las propiedades:
productName (string), brand (string), wasteType (string), material (string), isRecyclable (boolean),
category ("reciclables" | "organicos" | "no_reciclables" | "manejo_especial"),
binId ("bin-verde" | "bin-azul" | "bin-amarillo" | "bin-negro" | "bin-pilas"),
handlingInstructions (array de 3 strings con pasos breves), whyThisBin (string), degradationTime (string), tip (string), confidence (number entre 0.75 y 0.99).`;

/** Reduce la foto (máx. 800 px) para optimizar el payload y acelerar la respuesta de Groq Vision */
export function downscaleImageToBase64(img: HTMLImageElement, maxSide = 800): string {
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

async function callGroqDirect(base64Image: string, signal: AbortSignal): Promise<GroqVisionResponse> {
  const models = [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3.8-27b",
    "llama-3.2-11b-vision-preview",
  ];

  let lastErr = "Error de conexión con Groq";
  for (const model of models) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIRECT_GROQ_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: DIRECT_PROMPT },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
              },
            ],
          },
        ],
        temperature: 0.15,
        max_completion_tokens: 900,
        response_format: { type: "json_object" },
      }),
      signal,
    });

    if (!res.ok) {
      lastErr = `Groq HTTP ${res.status} (${model})`;
      continue;
    }

    const payload = await res.json();
    const content = payload?.choices?.[0]?.message?.content;
    if (typeof content === "string") {
      const cleaned = content.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      const parsed = JSON.parse(cleaned) as GroqVisionResponse;
      if (parsed?.productName) {
        return { ...parsed, modelUsed: model };
      }
    }
  }
  throw new Error(lastErr);
}

/**
 * Clasifica cualquier residuo o producto mediante Groq Cloud Vision (100% gratuito).
 * Identifica producto, marca, material técnico, contenedor oficial del IT Morelia y pasos de preparación.
 */
export async function classifyWithGroq(img: HTMLImageElement): Promise<AIClassificationResult> {
  const start = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  const base64Image = downscaleImageToBase64(img);

  try {
    let data: GroqVisionResponse | null = null;

    try {
      const res = await fetch(`${API_BASE}/api/groq`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          mimeType: "image/jpeg",
        }),
        signal: controller.signal,
      });

      if (res.ok) {
        data = (await res.json()) as GroqVisionResponse;
      } else if (DIRECT_GROQ_KEY) {
        data = await callGroqDirect(base64Image, controller.signal);
      } else {
        throw new Error(`Groq API respondió con código HTTP ${res.status}`);
      }
    } catch (serverErr) {
      if (DIRECT_GROQ_KEY) {
        data = await callGroqDirect(base64Image, controller.signal);
      } else {
        throw serverErr;
      }
    }

    if (!data || !data.productName) {
      throw new Error("Respuesta inválida de Groq Vision: falta el nombre del producto.");
    }

    const matchedCatalogItem = WASTE_DATABASE.find(
      (w) =>
        w.name.toLowerCase().includes(data.productName.toLowerCase()) ||
        data.productName.toLowerCase().includes(w.name.toLowerCase()) ||
        (data.brand && w.brand && data.brand.toLowerCase() === w.brand.toLowerCase())
    );

    const matchingBin =
      CAMPUS_CONTAINERS_CATALOG.find((b) => b.id === data.binId) ||
      CAMPUS_CONTAINERS_CATALOG.find((b) => {
        if (data.category === "organicos") return b.id === "bin-verde";
        if (data.category === "manejo_especial") return b.id === "bin-pilas";
        if (
          data.material.toLowerCase().includes("pet") ||
          data.material.toLowerCase().includes("plástico") ||
          data.material.toLowerCase().includes("hule")
        )
          return b.id === "bin-azul";
        if (data.category === "reciclables") return b.id === "bin-amarillo";
        return b.id === "bin-negro";
      }) ||
      CAMPUS_CONTAINERS_CATALOG[2];

    const categoryInfo = CATEGORY_INFO[data.category] || CATEGORY_INFO["reciclables"];

    const dynamicWasteItem: WasteItem = {
      id: matchedCatalogItem ? matchedCatalogItem.id : `groq-${Date.now()}`,
      name: data.productName,
      brand: data.brand && data.brand !== "Genérico" ? data.brand : matchedCatalogItem?.brand,
      material: data.material || matchedCatalogItem?.material || "Material identificado por visión IA",
      category: data.category,
      categoryLabel: categoryInfo.name,
      categoryReason:
        data.whyThisBin ||
        matchedCatalogItem?.categoryReason ||
        categoryInfo.normativeBasis,
      recommendedBin: {
        color: matchingBin.colorName,
        label: matchingBin.name,
        description: matchingBin.shortDescription,
      },
      handlingInstructions:
        Array.isArray(data.handlingInstructions) && data.handlingInstructions.length > 0
          ? data.handlingInstructions
          : matchedCatalogItem?.handlingInstructions || matchingBin.preparationRules,
      recommendations3R: matchedCatalogItem?.recommendations3R || {
        reducir:
          data.tip ||
          "Prefiere alternativas reutilizables dentro del campus para reducir la generación de residuos.",
        reutilizar:
          "Verifica si el envase o material puede cumplir un segundo uso seguro antes de desecharlo.",
        reciclar: data.isRecyclable
          ? `Deposítalo limpio y seco en el ${matchingBin.name} para facilitar su valorización.`
          : `Por su composición (${data.material}), debe disponerse en el ${matchingBin.name}.`,
      },
      degradationTime: {
        estimate:
          data.degradationTime || matchedCatalogItem?.degradationTime.estimate || "Variable según exposición",
        isApproximate: true,
        conditionsNote:
          matchedCatalogItem?.degradationTime.conditionsNote ||
          "Estimado bajo condiciones ambientales estándar (SEMARNAT / INEGI).",
      },
      environmentalImpact: matchedCatalogItem?.environmentalImpact || {
        description: data.whyThisBin || matchingBin.shortDescription,
        source: "SEMARNAT / LGPGIR / Sistema de Gestión Ambiental IT Morelia (ITMORELIA-IT-AM-007)",
      },
      examples: matchedCatalogItem?.examples || [data.productName],
    };

    const confidence = Math.max(0.7, Math.min(0.99, Number(data.confidence) || 0.93));

    return {
      wasteItem: dynamicWasteItem,
      rawLabel: data.productName,
      confidence,
      inferenceTimeMs: Math.round(performance.now() - start),
      allPredictions: [{ className: data.productName, probability: confidence }],
      isAiReal: true,
      engine: "groq",
      geminiTip: data.tip,
      notes: data.whyThisBin,
    };
  } finally {
    clearTimeout(timeout);
  }
}
