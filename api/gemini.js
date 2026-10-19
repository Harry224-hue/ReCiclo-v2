// Vercel Serverless Function: /api/gemini
// La clave GEMINI_API_KEY vive SOLO en el servidor (Vercel > Settings > Environment Variables).
// Nunca se expone al navegador ni al APK de Android.

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const PROMPT = `Eres el clasificador de visión artificial de ReCiclo, la aplicación oficial de gestión y separación ambiental del Instituto Tecnológico de Morelia (ITM), Michoacán, México.

Tu tarea es analizar la fotografía del residuo o producto real con máxima precisión y orientar al estudiante universitario.

Debes identificar:
1. productName: Nombre específico y real del producto con su marca y presentación si es visible (ejemplos reales: "Botella de Coca-Cola 600ml", "Bolsa de Sabritas Doritos Nacho", "Vaso de sopa Maruchan instantánea", "Lata de Coca-Cola 355ml", "Envase Tetra Brik de Leche Lala 1L", "Vaso térmico de unicel de Café Andatti", "Cáscara de plátano", "Caja de pizza Little Caesars con grasa", "Cuaderno profesional Scribe", "Pila alcalina Duracell AA", "Bote de yogurt Danone 1kg", "Bolígrafo Bic Cristal").
2. brand: Marca comercial reconocida si es visible o deducible (ej. "Coca-Cola", "Sabritas", "Lala", "Maruchan", "OXXO Andatti", "Scribe", "Bic", "Gamesa", "Marinela", "Bonafont", "Barcel") o "Genérico" si es natural o sin marca.
3. wasteType: Tipo general de residuo (ej. "Envase de bebida PET", "Bolsa metalizada de botana", "Resto de comida orgánica", "Envase de unicel", "Lata de aluminio", "Papel y cartón", "Pila / Residuo electrónico").
4. material: Material técnico exacto (ej. "Plástico PET #1 con tapa de PP #5", "Polipropileno metalizado (BOPP)", "Aluminio 100% reciclable", "Poliestireno expandido (Unicel EPS #6)", "Materia orgánica vegetal compostable", "Envase multicapa Tetra Pak (cartón + polietileno + aluminio)", "Cartón manchado con grasa").
5. isRecyclable: booleano (true si es técnicamente reciclable en México; false si es unicel sucio, bolsa metalizada, servilleta grasosa o basura general).
6. category: Una de las 4 categorías oficiales:
   - "reciclables" (plásticos limpios PET/PEAD, latas de aluminio, papel y cartón seco)
   - "organicos" (restos de fruta, verdura, cáscaras, café)
   - "no_reciclables" (unicel sucio, bolsas metalizadas de papas/galletas, servilletas usadas, papel térmico)
   - "manejo_especial" (pilas, baterías, cables, electrónicos)
7. binId: El contenedor oficial en los campus 1 y 2 del IT Morelia:
   - "bin-verde" -> Bote Verde (Orgánicos y restos de comida natural)
   - "bin-azul" -> Bote Azul (Plásticos rígidos y botellas PET)
   - "bin-amarillo" -> Bote Amarillo (Latas de aluminio, metales, papel y cartón limpio y seco)
   - "bin-negro" -> Bote Negro (Basura común inorgánica no reciclable: bolsas de frituras, unicel, servilletas sucias)
   - "bin-pilas" -> Contenedor Naranja (Pilas alcalinas, baterías y electrónicos de manejo especial)
8. handlingInstructions: Lista de 3 a 4 pasos breves y concretos de cómo prepararlo antes de tirarlo (ej. ["1. Vaciar el líquido restante al 100%.", "2. Aplastar para reducir volumen al 70%.", "3. Enroscar la tapa para que viaje junta."]).
9. whyThisBin: Explicación concisa (1-2 oraciones) de por qué va en ese contenedor específico de acuerdo con las normas mexicanas (SEMARNAT / LGPGIR) y las facilidades del ITM.
10. degradationTime: Estimado realista de biodegradación (ej. "Entre 100 y 450 años", "2 a 4 semanas", "Aproximadamente 500 años").
11. tip: Consejo ambiental concreto para reducir o reutilizar este producto en el campus universitario (máximo 160 caracteres).
12. confidence: Nivel de certeza de la detección (número entre 0.70 y 0.99).`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY no configurada en el servidor" });

  const { image, mimeType } = req.body || {};
  if (!image || typeof image !== "string") return res.status(400).json({ error: "Falta la imagen (base64)" });

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: PROMPT },
                { inline_data: { mime_type: mimeType || "image/jpeg", data: image } },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.15,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                productName: { type: "STRING" },
                brand: { type: "STRING" },
                wasteType: { type: "STRING" },
                material: { type: "STRING" },
                isRecyclable: { type: "BOOLEAN" },
                category: {
                  type: "STRING",
                  enum: ["organicos", "reciclables", "no_reciclables", "manejo_especial"],
                },
                binId: {
                  type: "STRING",
                  enum: ["bin-verde", "bin-azul", "bin-amarillo", "bin-negro", "bin-pilas"],
                },
                handlingInstructions: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                },
                whyThisBin: { type: "STRING" },
                degradationTime: { type: "STRING" },
                tip: { type: "STRING" },
                confidence: { type: "NUMBER" },
              },
              required: [
                "productName",
                "material",
                "isRecyclable",
                "category",
                "binId",
                "handlingInstructions",
                "whyThisBin",
                "degradationTime",
                "tip",
              ],
            },
          },
        }),
      }
    );

    if (!r.ok) {
      const detail = await r.text();
      console.error("Gemini error", r.status, detail);
      return res.status(502).json({ error: "Error al consultar Gemini", status: r.status, detail });
    }

    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return res.status(502).json({ error: "Respuesta vacía de Gemini" });

    return res.status(200).json(JSON.parse(text));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Fallo interno al clasificar" });
  }
}
