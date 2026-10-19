import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Aparece solo cuando requestImmersive() detecta perfTier === "lite".
// No bloquea la elección, solo se asegura de que sea informada.
export function PerformanceWarningDialog() {
    const { pendingPerfWarning, confirmImmersive, cancelPerfWarning, getThemeClasses } = useTheme();
    const reduceMotion = useReducedMotion();
    const panelStyle = getThemeClasses("dropdown");

    return (
        <AnimatePresence>
            {pendingPerfWarning && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="perf-warning-title"
                    aria-describedby="perf-warning-desc"
                >
                    <motion.div
                        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={cancelPerfWarning}
                    />
                    <motion.div
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className={`relative z-10 w-full max-w-sm rounded-[1.5rem] p-6 shadow-2xl ${panelStyle}`}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="shrink-0 w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center">
                                <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <h2 id="perf-warning-title" className="text-base font-semibold text-zinc-900 dark:text-white">
                                Tu dispositivo podría notarlo
                            </h2>
                        </div>

                        <p id="perf-warning-desc" className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-5">
                            Detectamos que tu equipo funciona mejor con menos animaciones y efectos.
                            Activar "Todos los efectos" podría hacer que la interfaz se sienta más lenta.
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={cancelPerfWarning}
                                className="px-4 py-2 text-sm font-medium rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmImmersive}
                                className="px-4 py-2 text-sm font-medium rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:opacity-90 cursor-pointer transition-opacity"
                            >
                                Activar de todas formas
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}