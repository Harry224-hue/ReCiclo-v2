import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  History,
  Trash2,
  Calendar,
  ArrowRight,
  ExternalLink,
  Inbox,
  CloudCheck,
  HardDrive,
  LogIn,
  UserPlus,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getScanHistory,
  clearScanHistory,
  removeScanFromHistory,
  syncAccountHistoryWithCloud,
  ScanHistoryEntry,
} from "../data/historyStorage";
import { CATEGORY_INFO } from "../data/wasteData";
import { WasteVisual } from "../components/WasteVisual";
import { useAuth } from "../context/AuthContext";
import { clearUserScans, deleteScan } from "../firebase";

export default function Historial() {
  const { user, profile, isLoggedIn } = useAuth();
  const [history, setHistory] = useState<ScanHistoryEntry[]>(() => getScanHistory());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const syncLocal = () => setHistory(getScanHistory());
    syncLocal();
    window.addEventListener("reciclo-history-updated", syncLocal);
    return () => window.removeEventListener("reciclo-history-updated", syncLocal);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    let active = true;
    setSyncing(true);
    syncAccountHistoryWithCloud(user.uid)
      .then((merged) => {
        if (active) setHistory(merged);
      })
      .finally(() => {
        if (active) setSyncing(false);
      });
    return () => {
      active = false;
    };
  }, [user?.uid]);

  const handleRemoveEntry = async (entry: ScanHistoryEntry) => {
    setHistory(removeScanFromHistory(entry.id));
    if (user?.uid && entry.cloudId) {
      try {
        await deleteScan(entry.cloudId);
      } catch (err) {
        console.warn("[Historial] No se pudo eliminar de Firestore:", err);
      }
    }
  };

  const handleClear = async () => {
    const confirmMsg = isLoggedIn
      ? "¿Deseas vaciar el historial de residuos de tu cuenta? (Tu nivel y progreso general se conservarán)."
      : "¿Deseas vaciar el historial de residuos identificados en este dispositivo?";
    if (window.confirm(confirmMsg)) {
      clearScanHistory();
      setHistory([]);
      if (user?.uid) {
        try {
          await clearUserScans(user.uid);
        } catch (err) {
          console.warn("[Historial] Advertencia al limpiar registros en Firestore:", err);
        }
      }
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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6"
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/10 border border-zinc-200/80 dark:border-white/15 mb-2">
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
            type="button"
            onClick={handleClear}
            className="min-h-[40px] self-start sm:self-center px-4 py-2 text-xs app-btn-danger"
          >
            <Trash2 className="size-3.5" />
            <span>Vaciar historial</span>
          </button>
        )}
      </motion.div>

      {/* Banner de Estado de Cuenta vs Almacenamiento Local */}
      <div className="mb-6">
        {isLoggedIn ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl p-4 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs">
                {syncing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CloudCheck className="size-4" />
                )}
              </span>
              <div>
                <p className="font-bold">
                  Historial sincronizado con tu cuenta ({profile?.correo || user?.email || "Estudiante ITM"})
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Tus escaneos se guardan automáticamente en la nube de tu cuenta y puedes consultarlos desde cualquier dispositivo.
                </p>
              </div>
            </div>
            <Link
              to="/perfil"
              className="min-h-[38px] px-4 py-1.5 text-xs app-btn-secondary"
            >
              Ver mi perfil
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-300/70 dark:border-amber-900/60 bg-amber-50/75 dark:bg-amber-950/30 p-4 text-amber-950 dark:text-amber-100">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs mt-0.5 sm:mt-0">
                <HardDrive className="size-4" />
              </span>
              <div>
                <p className="text-xs sm:text-sm font-bold">
                  El historial solo se guarda en este dispositivo porque no has iniciado sesión
                </p>
                <p className="mt-0.5 text-xs text-amber-900/85 dark:text-amber-200/80 leading-relaxed">
                  Si borras los datos del navegador o cambias de teléfono, estos registros no estarán disponibles. Inicia sesión para respaldar y sincronizar tu historial en tu cuenta.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <Link
                to="/login"
                className="min-h-[38px] px-4 py-2 text-xs app-btn-primary"
              >
                <LogIn className="size-3.5" />
                <span>Iniciar sesión</span>
              </Link>
              <Link
                to="/registro"
                className="min-h-[38px] px-4 py-2 text-xs app-btn-secondary"
              >
                <UserPlus className="size-3.5" />
                <span>Crear cuenta</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Lista del Historial */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40">
          <Inbox className="size-12 text-zinc-400 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-medium text-zinc-800 dark:text-zinc-200">
            No tienes registros todavía
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-6">
            {isLoggedIn
              ? "Cuando identifiques un residuo en el escáner, se guardará automáticamente en tu cuenta universitaria."
              : "Cuando identifiques un residuo en el escáner, se guardará en este dispositivo (o en tu cuenta si inicias sesión)."}
          </p>
          <Link
            to="/escanear"
            className="min-h-[44px] px-6 py-2.5 text-xs sm:text-sm app-btn-primary"
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
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${catMeta.colorBadge}`}
                      >
                        {entry.categoryLabel}
                      </span>
                      {entry.syncedToCloud ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                          <CloudCheck className="size-2.5" />
                          En tu cuenta
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
                          <HardDrive className="size-2.5" />
                          Solo en este dispositivo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <strong>Material:</strong> {entry.material}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                      <strong>Disposición:</strong> {entry.recommendedBin}
                    </p>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-800 shrink-0 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <Calendar className="size-3" />
                      <span>{formatDate(entry.timestamp)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEntry(entry)}
                      title="Eliminar registro"
                      aria-label={`Eliminar ${entry.wasteName}`}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <Link
                    to="/mapa"
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
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
