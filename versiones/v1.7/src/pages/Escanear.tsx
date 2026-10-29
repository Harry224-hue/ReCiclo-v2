import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ShieldCheck, Clock, MapPin, RotateCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const AI_SAMPLES_V17 = [
    {
        id: "pet_label",
        name: "Botella PET de 600ml",
        brand: "Refresco / Agua purificada",
        material: "Cuerpo: PET (1) | Tapa: Polipropileno (5)",
        bin: "Azul (Plasticos y PET)",
        binCode: "azul",
        degradation: "100 a 450 anos",
    },
    {
        id: "tetrapak",
        name: "Envase Multicapa Tetra Pak",
        brand: "Leche o jugo universitario",
        material: "75% Carton, 20% Polietileno, 5% Aluminio",
        bin: "Amarillo (Inorganicos Reciclables)",
        binCode: "amarillo",
        degradation: "30 a 35 anos",
    },
    {
        id: "manzana",
        name: "Restos de Fruta",
        brand: "Residuo organico de cafeteria",
        material: "Materia organica vegetal",
        bin: "Verde (Organicos)",
        binCode: "verde",
        degradation: "2 a 6 semanas",
    },
];

export default function Escanear() {
    const { getThemeClasses } = useTheme();
    const glassCard = getThemeClasses("dropdown");
    const [selected, setSelected] = useState(AI_SAMPLES_V17[0]);
    const [analyzing, setAnalyzing] = useState(false);

    const handleSelect = (s: typeof AI_SAMPLES_V17[0]) => {
        setAnalyzing(true);
        setTimeout(() => {
            setSelected(s);
            setAnalyzing(false);
        }, 700);
    };

    return (
        <section className="min-h-[100dvh] w-full flex flex-col pt-24 pb-32 md:pt-32 md:pb-10 px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                    <MapPin size={13} />
                    <span>Conexion Directa Escaner a Mapa (v1.7)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-100">
                    Escaner de Residuos
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base max-w-xl mx-auto md:mx-0">
                    Descubre el contenedor reglamentario y salta directamente al mapa del campus para ubicarlo.
                </p>
            </motion.div>

            <div className="flex flex-wrap gap-2.5 mb-6">
                {AI_SAMPLES_V17.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => handleSelect(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            selected.id === s.id
                                ? "bg-emerald-600 text-white font-semibold shadow-lg"
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
                        <div className="h-64 flex flex-col items-center justify-center text-center gap-3">
                            <RotateCw size={32} className="text-emerald-400 animate-spin" />
                            <p className="text-sm font-medium text-zinc-300">Conectando con cartografia del ITM...</p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs text-zinc-400">{selected.brand}</span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                    <Bot size={12} /> Analisis Inteligente
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">{selected.name}</h2>
                            <p className="text-xs text-zinc-400 mb-6 font-mono">{selected.material}</p>

                            <div className="space-y-3.5 text-sm mb-6">
                                <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex items-start gap-3">
                                    <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <strong className="text-white block text-xs uppercase tracking-wider mb-1">Contenedor en Campus:</strong>
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
                            </div>

                            <Link
                                to={`/mapa?bin=${selected.binCode}`}
                                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-sm cursor-pointer"
                            >
                                <MapPin size={18} /> Ver ubicacion del contenedor en el mapa del campus
                            </Link>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
