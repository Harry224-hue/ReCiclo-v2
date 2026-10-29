import { Zap } from "lucide-react";
import type { PerfSource, PerfTier } from "../hooks/useAdaptivePerformance.ts";

interface LiteModeBadgeProps {
    tier: PerfTier;
    source: PerfSource;
    onRequestFull: () => void;
}

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:focus-visible:ring-white/50";

// Solo aparece cuando el propio sitio bajó la fidelidad visual por su cuenta (source === "auto").
// Si la persona ya lo eligió a mano desde el menú, no hace falta recordárselo en cada carga:
// esa decisión ya la tomó conscientemente.
export function LiteModeBadge({ tier, source, onRequestFull }: LiteModeBadgeProps) {
    if (tier !== "lite" || source !== "auto") return null;

    return (
        <button
            type="button"
            onClick={onRequestFull}
            title="Tu dispositivo está usando la versión optimizada de ReCiclo. Toca para intentar activar todos los efectos."
            aria-label="Modo ligero activado automáticamente para tu dispositivo. Toca para intentar activar todos los efectos visuales."
            className={`flex items-center gap-1 pl-1.5 pr-2 py-1 rounded-full text-[11px] font-medium text-zinc-600 dark:text-zinc-300 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 border border-black/5 dark:border-white/10 cursor-pointer transition-colors active:scale-95 ${FOCUS_RING}`}
        >
            <Zap size={12} aria-hidden="true" />
            Ligero
        </button>
    );
}