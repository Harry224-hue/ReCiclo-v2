import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, History, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Escanear() {
    const { getThemeClasses } = useTheme();
    const glassCard = getThemeClasses("dropdown");
    const [simulated, setSimulated] = useState<string | null>(null);

    const handleSimulate = (name: string) => {
        setSimulated(name);
        setTimeout(() => setSimulated(null), 3500);
    };

    return (
        <section className="min-h-[100dvh] w-full flex flex-col pt-24 pb-32 md:pt-32 md:pb-10 px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3">
                    <History size={13} />
                    <span>Conexión Conceptual con Historial (v1.2)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-100">
                    Escaner de Residuos
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base max-w-xl mx-auto md:mx-0">
                    Boceto interactivo. Puedes probar el envío conceptual de muestras a la nueva bitácora temporal de la versión 1.2.
                </p>
            </motion.div>

            <div className="flex-1 w-full flex flex-col md:flex-row gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex-1 w-full relative rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed border-zinc-300 dark:border-zinc-700/60 ${glassCard}`}
                >
                    <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                        <Camera size={40} className="animate-pulse" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold text-zinc-800 dark:text-zinc-100 text-center mb-2">
                        Visor en Preparación
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-md text-sm mb-6">
                        La carga real de imágenes se implementa en la versión 1.3. Prueba a simular una lectura de residuo a continuación:
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                        <button
                            onClick={() => handleSimulate("Botella PET 600ml")}
                            className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium hover:bg-blue-500/20 transition-all cursor-pointer"
                        >
                            Simular: Botella PET
                        </button>
                        <button
                            onClick={() => handleSimulate("Lata de Refresco")}
                            className="px-4 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-xs font-medium hover:bg-amber-500/20 transition-all cursor-pointer"
                        >
                            Simular: Lata de Aluminio
                        </button>
                    </div>

                    {simulated && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs md:text-sm text-center max-w-md flex flex-col items-center gap-2"
                        >
                            <div className="flex items-center gap-2 font-medium">
                                <CheckCircle2 size={16} />
                                <span>Lectura simulada: {simulated}</span>
                            </div>
                            <Link to="/historial" className="text-xs font-semibold underline flex items-center gap-1">
                                Ver la bitácora temporal en Historial <ArrowRight size={12} />
                            </Link>
                        </motion.div>
                    )}
                </motion.div>

                <div className="w-full md:w-80 flex flex-col gap-4">
                    <div className={`p-6 rounded-[2rem] border ${glassCard}`}>
                        <div className="flex items-center gap-2 font-medium text-sm text-zinc-800 dark:text-zinc-200 mb-2">
                            <History size={16} className="text-amber-500" />
                            <span>Bitácora Temporal v1.2</span>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                            En esta versión se evalúa el flujo de datos entre la captura y el historial antes de activar almacenamiento permanente.
                        </p>
                        <Link
                            to="/historial"
                            className="w-full py-2.5 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 shadow"
                        >
                            Abrir pantalla de Historial <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
