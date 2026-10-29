import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const SAMPLES = [
    {
        id: "pet",
        name: "Botella de Plastico PET",
        category: "Plastico reciclable",
        bin: "Azul (Plasticos y PET)",
        binColor: "bg-blue-500",
        degradation: "100 a 450 anos",
        prep: "Vaciar el liquido, aplastar y colocar la tapa enroscada.",
    },
    {
        id: "lata",
        name: "Lata de Aluminio",
        category: "Metal reciclable",
        bin: "Amarillo (Inorganicos Reciclables)",
        binColor: "bg-amber-500",
        degradation: "200 a 500 anos",
        prep: "Enjuagar ligeramente y aplastar para optimizar espacio.",
    },
    {
        id: "papel",
        name: "Hojas de Libreta y Papel Bond",
        category: "Papeleria y carton",
        bin: "Amarillo (Inorganicos Reciclables)",
        binColor: "bg-amber-500",
        degradation: "1 ano",
        prep: "Mantener seco, sin grapas ni cinta adhesiva excesiva.",
    },
    {
        id: "manzana",
        name: "Restos de Fruta o Comida",
        category: "Organico biodegradable",
        bin: "Verde (Organicos)",
        binColor: "bg-emerald-500",
        degradation: "2 a 6 semanas",
        prep: "Depositar sin bolsas de plastico ni servilletas cloradas.",
    },
];

export default function Escanear() {
    const { getThemeClasses } = useTheme();
    const glassCard = getThemeClasses("dropdown");
    const [selected, setSelected] = useState(SAMPLES[0]);

    return (
        <section className="min-h-[100dvh] w-full flex flex-col pt-24 pb-32 md:pt-32 md:pb-10 px-4 md:px-8 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center md:text-left mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                    <BookOpen size={13} />
                    <span>Clasificacion Heuristica por Catalogo Ligero (v1.4)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-100">
                    Escaner de Residuos
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base max-w-xl mx-auto md:mx-0">
                    Clasificacion instantanea sin descarga de modelos pesados. Toca una muestra para ver su destino oficial en el IT Morelia.
                </p>
            </motion.div>

            <div className="flex flex-wrap gap-2.5 mb-6">
                {SAMPLES.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setSelected(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                            selected.id === s.id
                                ? "bg-emerald-500 text-zinc-950 font-semibold shadow-lg"
                                : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80"
                        }`}
                    >
                        {s.name}
                    </button>
                ))}
            </div>

            <div className={`rounded-[2rem] border p-8 max-w-2xl ${glassCard}`}>
                <div className="flex items-center gap-3 mb-4">
                    <span className={`size-3 rounded-full ${selected.binColor}`} />
                    <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">{selected.category}</span>
                </div>
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">{selected.name}</h2>

                <div className="space-y-4 text-sm text-zinc-300">
                    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                        <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                        <div>
                            <strong className="text-white block mb-0.5">Contenedor Oficial en Campus:</strong>
                            <span className="text-emerald-400 font-medium">{selected.bin}</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3">
                        <Clock className="text-amber-400 shrink-0 mt-0.5" size={18} />
                        <div>
                            <strong className="text-white block mb-0.5">Tiempo Estimado de Degradacion:</strong>
                            <span className="text-zinc-300">{selected.degradation}</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs leading-relaxed text-zinc-400">
                        <strong className="text-zinc-200 block mb-1">Acondicionamiento previo:</strong>
                        {selected.prep}
                    </div>
                </div>
            </div>
        </section>
    );
}
