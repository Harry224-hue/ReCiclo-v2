import { Zap } from "lucide-react";
import type { PerfSource, PerfTier } from "../hooks/useAdaptivePerformance.ts";

interface LiteModeBadgeProps {
    tier: PerfTier;
    source?: PerfSource;
    onRequestFull: () => void;
}

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40 dark:focus-visible:ring-white/50";

// Solo aparece cuando el propio sitio bajó la fidelidad visual por su cuenta (source === "auto").
// Si la persona ya lo eligió a mano desde el menú, no hace falta recordárselo en cada carga:
// esa decisión ya la tomó conscientemente.
export function LiteModeBadge({ tier, onRequestFull }: LiteModeBadgeProps) {
    if (tier !== "lite") return null;

    return (
        <button
            type="button"
            onClick={onRequestFull}
            title="Tu dispositivo está usando el Modo Ligero (optimizado). Haz clic para intentar activar todos los efectos."
            aria-label="Modo ligero activado. Haz clic para intentar activar todos los efectos visuales."
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 cursor-pointer transition-all active:scale-95 shadow-xs ${FOCUS_RING}`}
        >
            <Zap size={12} className="text-amber-600 dark:text-amber-400 fill-amber-500" aria-hidden="true" />
            <span>Modo Ligero</span>
        </button>
    );
}