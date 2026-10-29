import { motion } from "framer-motion";
import { Camera, Upload, Image as ImageIcon, MonitorUp } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Escanear() {
    const { getThemeClasses } = useTheme();

    const glassCard = getThemeClasses("dropdown");
    const glassButton = getThemeClasses("dock");

    return (
        <section className="min-h-[100dvh] w-full flex flex-col pt-24 pb-32 md:pt-32 md:pb-10 px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center md:text-left mb-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                    <span>ReCiclo 1.0 Oficial · IT Morelia</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-100 transition-colors">
                    Escáner de Residuos
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base max-w-xl mx-auto md:mx-0 transition-colors">
                    Identifica cómo reciclar correctamente. En móvil usa tu cámara, en computadora sube una imagen.
                </p>
            </motion.div>

            <div className="flex-1 w-full flex flex-col md:flex-row gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`md:hidden flex-1 w-full relative rounded-[2rem] overflow-hidden flex flex-col items-center justify-center border transition-all duration-500 ${glassCard}`}
                >
                    <div className="absolute inset-6 border-2 border-dashed border-zinc-400/50 dark:border-zinc-500/30 rounded-2xl pointer-events-none"></div>

                    <Camera size={48} className="text-zinc-400 dark:text-zinc-500 mb-4 animate-pulse" />
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Activando cámara...</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden flex items-center justify-center gap-6 mt-2"
                >
                    <button className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 border ${glassButton}`}>
                        <ImageIcon size={22} className="text-zinc-600 dark:text-zinc-200 transition-colors" />
                    </button>

                    <button className={`w-20 h-20 rounded-full flex items-center justify-center p-1.5 transition-all duration-500 active:scale-90 border shadow-lg ${glassCard}`}>
                        <div className="w-full h-full bg-zinc-800 dark:bg-zinc-200 rounded-full transition-colors"></div>
                    </button>

                    <button className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 border ${glassButton}`}>
                        <Upload size={22} className="text-zinc-600 dark:text-zinc-200 transition-colors" />
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`hidden md:flex flex-1 w-full rounded-[2.5rem] border-2 border-dashed flex-col items-center justify-center p-12 transition-all duration-500 hover:border-zinc-400 dark:hover:border-zinc-500 shadow-xl ${glassCard}`}
                >
                    <MonitorUp size={64} className="text-zinc-400 dark:text-zinc-500 mb-6" />

                    <h3 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2 transition-colors">
                        Sube la imagen del residuo
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-center mb-8 max-w-md transition-colors">
                        Arrastra y suelta la fotografía aquí, o haz clic para explorar los archivos de tu computadora.
                    </p>

                    <button className="px-8 py-3.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-medium hover:bg-zinc-800 dark:hover:bg-white transition-all active:scale-95 flex items-center gap-2 shadow-lg">
                        <Upload size={18} /> Explorar archivos
                    </button>

                    <div className="mt-8 flex items-center gap-4 w-full max-w-sm opacity-60">
                        <div className="h-px bg-zinc-400 dark:bg-zinc-500 flex-1"></div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-semibold">O también</span>
                        <div className="h-px bg-zinc-400 dark:bg-zinc-500 flex-1"></div>
                    </div>

                    <button className={`mt-8 px-6 py-2.5 rounded-full transition-transform active:scale-95 flex items-center gap-2 text-sm font-medium border text-zinc-700 dark:text-zinc-200 ${glassButton}`}>
                        <Camera size={16} /> Usar cámara web
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
