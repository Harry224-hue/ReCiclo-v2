import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, ImageIcon, RefreshCw, Info } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Escanear() {
    const { getThemeClasses } = useTheme();
    const glassCard = getThemeClasses("dropdown");
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    return (
        <section className="min-h-[100dvh] w-full flex flex-col pt-24 pb-32 md:pt-32 md:pb-10 px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                    <Info size={13} />
                    <span>Previsualizador Ligero de Fotos (v1.3)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-100">
                    Escaner de Residuos
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base max-w-xl mx-auto md:mx-0">
                    Carga una fotografia para comprobar el encuadre. La clasificacion por catalogo se activa en la version 1.4.
                </p>
            </motion.div>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <div className="flex-1 w-full flex flex-col md:flex-row gap-6">
                <div className={`flex-1 rounded-[2rem] border overflow-hidden flex flex-col items-center justify-center p-6 relative min-h-[350px] ${glassCard}`}>
                    {preview ? (
                        <div className="relative w-full h-full max-h-[420px] flex items-center justify-center rounded-xl overflow-hidden">
                            <img src={preview} alt="Vista previa del residuo" className="max-h-full max-w-full object-contain rounded-xl" />
                            <div className="absolute inset-4 border-2 border-emerald-400/80 rounded-xl pointer-events-none animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                            <ImageIcon size={56} className="text-zinc-400 mb-4" />
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">Sin fotografia cargada</p>
                            <p className="text-xs text-zinc-400 max-w-xs mb-6">Selecciona una imagen desde tus archivos para verificar el encuadre.</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
                            >
                                <Upload size={16} /> Seleccionar imagen
                            </button>
                        </div>
                    )}

                    {preview && (
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 rounded-full bg-zinc-800 text-zinc-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer hover:bg-zinc-700"
                            >
                                <RefreshCw size={13} /> Cambiar foto
                            </button>
                        </div>
                    )}
                </div>

                <div className={`w-full md:w-80 rounded-[2rem] border p-6 flex flex-col justify-between ${glassCard}`}>
                    <div>
                        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-3">Guia de Botes IT Morelia</h3>
                        <div className="space-y-2.5 text-xs">
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <strong>Verde:</strong> Residuos organicos (frutas, comida).
                            </div>
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                <strong>Amarillo:</strong> Papel, carton y latas de metal.
                            </div>
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <strong>Azul:</strong> Plasticos y botellas PET.
                            </div>
                            <div className="p-3 rounded-xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-400">
                                <strong>Negro:</strong> No reciclables (envolturas, desechables).
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-4 text-center">
                        Procesamiento heuristico disponible en la version v1.4.
                    </p>
                </div>
            </div>
        </section>
    );
}
