import Anthropic from "@anthropic-ai/sdk";

/**
 * Cliente de Anthropic para soporte auxiliar en analisis sustentable
 * Cumplimiento con el Lineamiento 14.2 del 19º Encuentro Oxigena tus Ideas:
 * El uso de IA se mantiene como herramienta etica, complementaria y de consulta,
 * sin sustituir el analisis ni el criterio analitico del estudiante.
 */
export function getAnthropicClient(apiKey?: string): Anthropic | null {
  const key = apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!key) {
    return null;
  }
  return new Anthropic({
    apiKey: key,
    dangerouslyAllowBrowser: true,
  });
}

export interface WasteAnalysisSuggestion {
  material: string;
  category: "PET" | "PEAD" | "Aluminio" | "Carton" | "Organico" | "No Reciclable";
  confidence: number;
  steps4V: {
    vaciar: string;
    enjuagar: string;
    aplastar: string;
    tapar: string;
  };
  disposalBin: "Verde" | "Azul" | "Gris" | "Especial";
}

export async function getEthicalWasteGuidance(
  description: string,
  apiKey?: string
): Promise<string> {
  const client = getAnthropicClient(apiKey);
  if (!client) {
    return "Cliente de Anthropic listo. Configura VITE_ANTHROPIC_API_KEY para habilitar consultas avanzadas.";
  }

  try {
    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Como asistente ambiental del Instituto Tecnologico de Morelia, sugiere la preparacion con la Regla de las 4V para: ${description}. Se breve y etico.`,
        },
      ],
    });

    const firstBlock = response.content[0];
    if (firstBlock && firstBlock.type === "text") {
      return firstBlock.text;
    }
    return "Sin respuesta de texto.";
  } catch (error) {
    console.error("Error al consultar Anthropic:", error);
    return "Error en la consulta al servicio de Anthropic.";
  }
}
