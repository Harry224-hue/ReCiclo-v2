import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, PlusCircle, Trash2, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface DemoItem {
    id: string;
    wasteName: string;
    material: string;
    categoryLabel: string;
    recommendedBin: string;
    binColor: string;
    timestamp: string;
}

const INITIAL_DEMO: DemoItem[] = [
    {
        id: "demo-1",
        wasteName: "Botella PET Ciel 600ml",
        material: "Plástico PET (1)",
        categoryLabel: "Plásticos y Envases",
        recommendedBin: "Contenedor Azul (PET)",
        binColor: "bg-blue-500",
        timestamp: "Hace 15 minutos",
    },
    {
        id: "demo-2",
        wasteName: "Lata de Jumex 335ml",
        material: "Aluminio reciclable",
        categoryLabel: "Inorgánicos Reciclables",
        recommendedBin: "Contenedor Amarillo (Inorgánicos)",
        binColor: "bg-amber-500",
        timestamp: "Hace 1 hora",
    },
];

const RANDOM_SAMPLES = [
    {
        wasteName: "Hojas de libreta universitaria",
        material: "Papel bond",
        categoryLabel: "Inorgánicos Reciclables",
        recommendedBin: "Contenedor Amarillo (Papel y Cartón)",
        binColor: "bg-amber-500",
    },
    {
        wasteName: "Cáscara de plátano de cafetería",
        material: "Materia orgánica",
        categoryLabel: "Orgánicos",
        recommendedBin: "Contenedor Verde (Orgánicos)",
        binColor: "bg-emerald-500",
    },
    {
        wasteName: "Vaso de café térmico",
        material: "Polipapel encerado",
        categoryLabel: "Inorgánicos No Reciclables",
        recommendedBin: "Contenedor Gris (No Reciclables)",
        binColor: "bg-zinc-500",
    },
];

export default function Historial() {
    const { getThemeClasses } = useTheme();
    const glassCard = getThemeClasses("dropdown");
    const [items, setItems] = useState<DemoItem[]>(INITIAL_DEMO);
    const [addedNotice, setAddedNotice] = useState(false);

    const handleAddManual = () => {
        const sample = RANDOM_SAMPLES[Math.floor(Math.random() * RANDOM_SAMPLES.length)];
        const newItem: DemoItem = {
            id: "demo-" + Date.now(),
            wasteName: sample.wasteName,
            material: sample.material,
            categoryLabel: sample.categoryLabel,
            recommendedBin: sample.recommendedBin,
            binColor: sample.binColor,
            timestamp: "Justo ahora",
        };
        setItems((prev) => [newItem, ...prev]);
        setAddedNotice(true);
        setTimeout(() => setAddedNotice(false), 2500);
    };

    const handleClear = () => {
        setItems([]);
    };

    return (
        <section className="min-h-[100dvh] w-full flex flex-col pt-24 pb-32 md:pt-32 md:pb-10 px-4 md:px-8 max-w-5xl mx-auto">
            {/* Cabecera */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3">
                    <History size={13} />
                    <span>Prototipo en Memoria (v1.2)</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-semibold text-zinc-800 dark:text-zinc-100">
                    Historial de Residuos
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm md:text-base max-w-xl">
                    Primer prototipo de bitácora para evaluar la disposición de tarjetas. Los datos residen en memoria de sesión (se reinician al recargar la página).
                </p>
            </motion.div>

            {/* Banner explicativo */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs md:text-sm mb-6 flex items-start gap-3">
                <Sparkles size={18} className="shrink-0 mt-0.5" />
                <div>
                    <span className="font-semibold block">Nota de desarrollo v1.2:</span>
                    Esta vista valida la estructura visual del historial antes de integrar almacenamiento en disco. En la versión 1.3 se incorporará persistencia real con localStorage.
                </div>
            </div>

            {/* Barra de acciones */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleAddManual}
                        className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-xs font-medium hover:bg-zinc-800 dark:hover:bg-white transition-all flex items-center gap-1.5 shadow cursor-pointer"
                    >
                        <PlusCircle size={14} /> Agregar registro manual de prueba
                    </button>
                    {items.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                            <Trash2 size={14} /> Limpiar lista
                        </button>
                    )}
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {items.length} {items.length === 1 ? "registro temporal" : "registros temporales"}
                </span>
            </div>

            {addedNotice && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2"
                >
                    <CheckCircle2 size={15} />
                    <span>Registro simulado añadido a la memoria de la sesión.</span>
                </motion.div>
            )}

            {/* Lista de tarjetas */}
            {items.length === 0 ? (
                <div className={`p-12 rounded-[2rem] border text-center ${glassCard}`}>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
                        La lista temporal está vacía.
                    </p>
                    <button
                        onClick={handleAddManual}
                        className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-xs font-medium cursor-pointer"
                    >
                        Agregar elemento de prueba
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`p-5 rounded-[2rem] border flex flex-col justify-between ${glassCard}`}
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
                                            {item.categoryLabel}
                                        </span>
                                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                                            <Calendar size={12} />
                                            <span>{item.timestamp}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 text-base mb-1">
                                        {item.wasteName}
                                    </h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                                        Material: {item.material}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                                    <span className="text-zinc-500 dark:text-zinc-400">Destino:</span>
                                    <span className="font-medium text-zinc-700 dark:text-zinc-200 flex items-center gap-1.5">
                                        <span className={`w-2.5 h-2.5 rounded-full ${item.binColor}`}></span>
                                        {item.recommendedBin}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </section>
    );
}
