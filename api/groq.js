// Vercel Serverless Function: /api/groq
// Clasificador de visión artificial gratuito mediante Groq Cloud (Llama 4 Scout / Qwen Vision / Llama 3.2 Vision).
// La clave GROQ_API_KEY vive en el servidor (Vercel > Settings > Environment Variables) sin requerir tarjeta de crédito.

const FALLBACK_MODELS = [
  process.env.GROQ_MODEL,
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "qwen/qwen3.8-27b",
  "llama-3.2-11b-vision-preview",
  "llama-3.2-90b-vision-preview",
].filter(Boolean);

const PROMPT = `Eres el clasificador de visión artificial de ReCiclo, la aplicación oficial de gestión y separación ambiental del Instituto Tecnológico de Morelia (ITM), Michoacán, México.

Tu tarea es analizar la fotografía del residuo o producto real con máxima precisión y orientar al estudiante universitario.

Responde ÚNICAMENTE con un objeto JSON válido con las siguientes propiedades exactas:
{
  "productName": "Nombre específico y real del producto con su marca y presentación si es visible (ej. 'Botella de Coca-Cola 600ml', 'Bolsa de Sabritas Doritos Nacho', 'Vaso de sopa Maruchan instantánea', 'Lata de Coca-Cola 355ml', 'Envase Tetra Brik de Leche Lala 1L', 'Vaso térmico de unicel de Café Andatti', 'Cáscara de plátano', 'Cuaderno profesional Scribe', 'Pila alcalina Duracell AA')",
  "brand": "Marca comercial reconocida si es visible o deducible (ej. 'Coca-Cola', 'Sabritas', 'Lala', 'Maruchan', 'OXXO Andatti', 'Scribe', 'Bic', 'Gamesa', 'Marinela', 'Bonafont', 'Barcel') o 'Genérico' si es natural o sin marca",
  "wasteType": "Tipo general de residuo (ej. 'Envase de bebida PET', 'Bolsa metalizada de botana', 'Resto de comida orgánica', 'Envase de unicel', 'Lata de aluminio', 'Papel y cartón', 'Pila / Residuo electrónico')",
  "material": "Material técnico exacto (ej. 'Plástico PET #1 con tapa de PP #5', 'Polipropileno metalizado (BOPP)', 'Aluminio 100% reciclable', 'Poliestireno expandido (Unicel EPS #6)', 'Materia orgánica vegetal compostable', 'Envase multicapa Tetra Pak')",
  "isRecyclable": true,
  "category": "reciclables | organicos | no_reciclables | manejo_especial",
  "binId": "bin-verde | bin-azul | bin-amarillo | bin-negro | bin-pilas",
  "handlingInstructions": [
    "1. Primer paso breve y concreto de preparación.",
    "2. Segundo paso breve.",
    "3. Tercer paso breve."
  ],
  "whyThisBin": "Explicación concisa (1-2 oraciones) de por qué va en ese contenedor específico de acuerdo con las normas mexicanas (SEMARNAT / LGPGIR) y el procedimiento ITMORELIA-IT-AM-007 del ITM.",
  "degradationTime": "Estimado realista de biodegradación (ej. 'Entre 100 y 450 años', '2 a 4 semanas', 'Aproximadamente 500 años')",
  "tip": "Consejo ambiental concreto para reducir o reutilizar este producto en el campus universitario (máximo 160 caracteres)",
  "confidence": 0.92
}

Reglas de asignación de contenedor oficial en el IT Morelia (binId):
- "bin-verde": Bote Verde (Orgánicos y restos de comida natural, fruta, verdura, madera).
- "bin-azul": Bote Azul (Plásticos rígidos, botellas PET, envases PEAD/PP limpios y hules).
- "bin-amarillo": Bote Amarillo (Latas de aluminio, metales, vidrio, papel, cartón limpio y seco, Tetra Pak).
- "bin-negro": Bote Negro (Basura común inorgánica no reciclable: bolsas metalizadas de frituras/galletas, unicel, vasos encerados, servilletas sucias, tickets térmicos).
- "bin-pilas": Contenedor Naranja (Pilas alcalinas, baterías, cables y electrónicos de manejo especial).`;

function extractJsonObject(rawText) {
  if (!rawText || typeof rawText !== "string") return null;
  const cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY no configurada en el servidor" });
  }

  const { image, mimeType } = req.body || {};
  if (!image || typeof image !== "string") {
    return res.status(400).json({ error: "Falta la imagen (base64)" });
  }

  const dataUri = image.startsWith("data:")
    ? image
    : `data:${mimeType || "image/jpeg"};base64,${image}`;

  let lastError = null;

  for (const model of FALLBACK_MODELS) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: PROMPT },
                {
                  type: "image_url",
                  image_url: { url: dataUri },
                },
              ],
            },
          ],
          temperature: 0.15,
          max_completion_tokens: 900,
          response_format: { type: "json_object" },
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        lastError = data?.error?.message || `HTTP ${r.status} con modelo ${model}`;
        continue;
      }

      const text = data?.choices?.[0]?.message?.content;
      const parsed = extractJsonObject(text);
      if (parsed && parsed.productName) {
        return res.status(200).json({ ...parsed, modelUsed: model });
      }
      lastError = "Respuesta de Groq sin JSON válido";
    } catch (err) {
      lastError = String(err?.message || err);
    }
  }

  return res.status(502).json({
    error: "No fue posible analizar la imagen con Groq Cloud Vision",
    detail: lastError,
  });
}
