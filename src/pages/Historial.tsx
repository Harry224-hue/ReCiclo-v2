import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Trash2, Calendar, ArrowRight, ExternalLink, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { getScanHistory, clearScanHistory, ScanHistoryEntry } from "../data/historyStorage";
import { CATEGORY_INFO } from "../data/wasteData";
import { WasteVisual } from "../components/WasteVisual";

export default function Historial() {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm("¿Deseas vaciar el historial de residuos identificados?")) {
      clearScanHistory();
      setHistory([]);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-28 md:pt-28 md:pb-16 px-4 md:px-8 max-w-5xl mx-auto transition-colors duration-300">
      
      {/* Encabezado */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 mb-2">
            <History className="size-3.5" aria-hidden="true" />
            <span>Registro Práctico de Consultas</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Historial de Residuos
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 font-normal">
            Consulta los materiales que has clasificado para recordar sus indicaciones de manejo y contenedor recomendado.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors"
          >
            <Trash2 className="size-3.5" />
            <span>Vaciar historial</span>
          </button>
        )}
      </motion.div>

      {/* Lista del Historial */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40">
          <Inbox className="size-12 text-zinc-400 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-medium text-zinc-800 dark:text-zinc-200">
            No tienes registros todavía
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
            Cuando identifiques un residuo en el escáner, se guardará aquí su información para que puedas consultarla después sin necesidad de conexión.
          </p>
          <Link
            to="/escanear"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            <span>Ir al Escáner</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((entry, idx) => {
            const catMeta = CATEGORY_INFO[entry.category] || CATEGORY_INFO.reciclables;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <WasteVisual id={entry.wasteId} size="md" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                        {entry.wasteName}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${catMeta.colorBadge}`}>
                        {entry.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <strong>Material:</strong> {entry.material}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                      <strong>Disposición:</strong> {entry.recommendedBin}
                    </p>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-800 shrink-0">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <Calendar className="size-3" />
                    <span>{formatDate(entry.timestamp)}</span>
                  </div>
                  <Link
                    to="/mapa"
                    className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    <span>Ver puntos en campus</span>
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Nota sobre sustentabilidad sin gamificación */}
      <div className="mt-8 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 text-[11px] text-zinc-500 leading-relaxed text-center">
        * Este historial tiene una función exclusivamente práctica y de consulta para reforzar el hábito de separación. No incluye sistemas de puntos ni recompensas artificiales en apego a los criterios de educación y sustentabilidad del proyecto.
      </div>

    </div>
  );
}
