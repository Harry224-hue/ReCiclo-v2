import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, ShieldCheck, Clock, RotateCw, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AI_SAMPLES = [
    {
        id: "tetrapak",
        name: "Envase Multicapa (Tetra Pak)",
        brand: "Jugo comercial 250ml",
        material: "75% Carton, 20% Polietileno, 5% Aluminio",
        bin: "Amarillo (Inorganicos Reciclables)",
        binColor: "bg-amber-500",
        degradation: "30 a 35 anos",
        prep: "Desplegar las esquinas, enjuagar el interior y aplastar completamente.",
        badge: "Diagnóstico Asistido del Residuo",
    },
    {
        id: "pet_label",
        name: "Botella PET con Etiqueta y Tapa",
        brand: "Agua purificada 1L",
        material: "Cuerpo: PET (1) | Tapa: Polipropileno (5) | Etiqueta: PVC/BOPP",
        bin: "Azul (Plasticos y PET)",
        binColor: "bg-blue-500",
        degradation: "100 a 450 anos",
        prep: "La tapa debe ir enroscada para evitar que se pierda en la planta de separacion.",
        badge: "Diagnóstico Asistido del Residuo",
    },
    {
        id: "pila",
        name: "Pila Alcalina AA",
        brand: "Pila cilindrica de consumo domestico",
        material: "Dioxido de manganeso, zinc e hidroxido de potasio",
        bin: "Contenedor Oficial de Pilas y RAEE (Edificio A y Cafeteria)",
        binColor: "bg-red-500",
        degradation: "500 a 1000 anos",
        prep: "Colocar cinta adhesiva transparente en ambos polos antes de depositar.",
        badge: "Manejo Especial ITM",
    },
];

export default function Escanear() {
    const { getThemeClasses } = useTheme();
    const glassCard = getThemeClasses("dropdown");
    const [selected, setSelected] = useState(AI_SAMPLES[0]);
    const [analyzing, setAnalyzing] = useState(false);

    const handleSelect = (s: typeof AI_SAMPLES[0]) => {
        setAnalyzing(true);
        setTimeout(() => {
            setSelected(s);
            setAnalyzing(false);
        }, 800);
    };

    return (
        <section className="min-h-[100dvh] w-full flex flex-col pt-24 pb-32 md:pt-32 md:pb-10 px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
                    <Sparkles size={13} />
                    <span>Asistente de IA Multimodal + Mapa Campus 1 (v1.6)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-100">
                    Escaner con Asistente de IA
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base max-w-xl mx-auto md:mx-0">
                    Demostracion de analisis inteligente con vision artificial generativa para el IT Morelia.
                </p>
            </motion.div>

            <div className="flex flex-wrap gap-2.5 mb-6">
                {AI_SAMPLES.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => handleSelect(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            selected.id === s.id
                                ? "bg-purple-600 text-white font-semibold shadow-lg"
                                : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80"
                        }`}
                    >
                        {s.name}
                    </button>
                ))}
            </div>

            <div className={`rounded-[2rem] border p-8 max-w-2xl relative overflow-hidden ${glassCard}`}>
                <AnimatePresence mode="wait">
                    {analyzing ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-64 flex flex-col items-center justify-center text-center gap-3"
                        >
                            <RotateCw size={32} className="text-purple-400 animate-spin" />
                            <p className="text-sm font-medium text-zinc-300">Desglosando materiales y capas de residuo...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                    <Bot size={12} /> {selected.badge}
                                </span>
                                <span className="text-xs text-zinc-400">{selected.brand}</span>
                            </div>

                            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-3">{selected.name}</h2>
                            <p className="text-xs text-zinc-400 mb-6 font-mono">{selected.material}</p>

                            <div className="space-y-3.5 text-sm">
                                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-3">
                                    <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <strong className="text-white block text-xs uppercase tracking-wider mb-1">Contenedor Reglamentario ITM:</strong>
                                        <span className="text-emerald-400 font-semibold">{selected.bin}</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-3">
                                    <Clock className="text-amber-400 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <strong className="text-white block text-xs uppercase tracking-wider mb-1">Tiempo de Degradacion:</strong>
                                        <span className="text-zinc-300">{selected.degradation}</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 text-xs leading-relaxed text-zinc-400">
                                    <strong className="text-zinc-200 block mb-1">Recomendacion de separacion:</strong>
                                    {selected.prep}
                                </div>

                                <div className="pt-2">
                                    <Link
                                        to="/mapa"
                                        className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                                    >
                                        <MapPin size={15} /> Explorar estaciones en el nuevo Mapa del Campus (v1.6) <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
