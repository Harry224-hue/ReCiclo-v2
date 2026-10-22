import { Link } from "react-router-dom";
import {
    Layers,
    BookOpen,
    Sparkles,
    History,
    Trash2,
    Search,
    Inbox,
    ArrowRight,
    Calendar,
} from "lucide-react";
import { type AccentTokens } from "../../context/ThemeContext";
import { type ScanHistoryEntry } from "../../data/historyStorage";
import { CATEGORY_INFO } from "../../data/wasteData";
import { WasteVisual } from "../WasteVisual";
import { TOTAL_TECH_RESOURCES } from "../../data/techCategories";

export const PAGE_SIZE = 8;

export const CARRERAS = [
    "Ing. en Sistemas Computacionales",
    "Ing. en Tecnologías de la Información y Comunicaciones",
    "Ing. en Ciberseguridad",
    "Ing. Industrial",
    "Ing. Electrónica",
    "Ing. Eléctrica",
    "Ing. en Materiales",
    "Ing. Mecánica",
    "Ing. Mecatrónica",
    "Ing. Química",
    "Ing. Bioquímica",
    "Ing. Biomédica",
    "Ing. Civil",
    "Ing. en Gestión Empresarial",
    "Ing. en Semiconductores",
    "Lic. en Contador Público",
    "Lic. en Administración",
];

export const CAMPUSES = [
    { id: "Campus 1 (Principal)", label: "Campus 1" },
    { id: "Campus 2 (San José de la Huerta)", label: "Campus 2" },
];

/** Recorta la imagen a un cuadrado y la reduce para que quepa en localStorage. */
export function fileToAvatar(file: File, size = 256): Promise<string> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const side = Math.min(img.width, img.height);
            const sx = (img.width - side) / 2;
            const sy = (img.height - side) / 2;
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error("canvas"));
                return;
            }
            ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("load"));
        };
        img.src = url;
    });
}

export function saveErrorMessage(err: unknown): string {
    const code = (err as { code?: string })?.code;
    if (code === "permission-denied") {
        return "Firestore rechazó el guardado. Revisa las reglas de seguridad de tu proyecto.";
    }
    if (code === "unavailable") {
        return "Sin conexión. Inténtalo de nuevo cuando vuelvas a tener internet.";
    }
    return "No se pudo guardar. Inténtalo de nuevo.";
}

export function ProfileResourcesSection({ accent }: { accent: AccentTokens }) {
    return (
        <section
            aria-label="Recursos oficiales"
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <Layers size={18} className={accent.text} />
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Recursos y Documentación
                    </h2>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accent.badge}`}>
                    Oficial ITM
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                    {
                        to: "/tecnologias",
                        icon: Layers,
                        badge: `${TOTAL_TECH_RESOURCES} Recursos`,
                        title: "Tecnologías y APIs",
                        desc: "Vite 6, React 19, IA (Gemini y MobileNet), mapas y normas oficiales con enlaces.",
                        cta: "Ver ficha técnica →",
                    },
                    {
                        to: "/como-funciona",
                        icon: BookOpen,
                        badge: "Guía Práctica",
                        title: "Cómo Funciona",
                        desc: "Flujo de clasificación, regla de las 4V y código oficial de contenedores ITM.",
                        cta: "Ver guía de uso →",
                    },
                    {
                        to: "/impacto",
                        icon: Sparkles,
                        badge: "Sustentabilidad y ODS",
                        title: "Fundamento e Impacto",
                        desc: "Dimensiones ambiental, social y económica, ODS 12 y norma ITMORELIA-IT-AM-007.",
                        cta: "Ver marco ambiental →",
                    },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between gap-2 group cursor-pointer"
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className={`p-2 rounded-xl ${accent.badge} shrink-0`}>
                                        <Icon size={16} />
                                    </span>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${accent.badge}`}>
                                        {item.badge}
                                    </span>
                                </div>
                                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    {item.title}
                                </h3>
                                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                            <span className={`text-[11px] font-semibold flex items-center gap-1 ${accent.text} mt-2 group-hover:translate-x-0.5 transition-transform`}>
                                {item.cta}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

interface ProfileScanHistoryProps {
    accent: AccentTokens;
    inputCls: string;
    history: ScanHistoryEntry[];
    filteredHistory: ScanHistoryEntry[];
    query: string;
    setQuery: (q: string) => void;
    categoryFilter: string;
    setCategoryFilter: (cat: string) => void;
    visible: number;
    setVisible: React.Dispatch<React.SetStateAction<number>>;
    hasFilters: boolean;
    clearFilters: () => void;
    handleClearHistory: () => void;
    handleRemoveEntry: (id: string) => void;
    formatDate: (iso: string) => string;
    categoryName: (cat: string) => string;
    categoriesCount: number;
    rankedCategories: [string, number][];
}

export function ProfileScanHistorySection({
    accent,
    inputCls,
    history,
    filteredHistory,
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    visible,
    setVisible,
    hasFilters,
    clearFilters,
    handleClearHistory,
    handleRemoveEntry,
    formatDate,
    categoryName,
    categoriesCount,
    rankedCategories,
}: ProfileScanHistoryProps) {
    return (
        <section aria-label="Historial" className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                    <History size={18} className={accent.text} />
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        Historial de residuos
                    </h2>
                    {history.length > 0 && (
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${accent.badge}`}>
                            {history.length}
                        </span>
                    )}
                </div>

                {history.length > 0 && (
                    <button
                        type="button"
                        onClick={handleClearHistory}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                        <Trash2 size={13} />
                        <span>Vaciar</span>
                    </button>
                )}
            </div>

            {history.length > 0 && (
                <div className="space-y-3">
                    <div className="relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setVisible(PAGE_SIZE);
                            }}
                            aria-label="Buscar en el historial"
                            placeholder="Buscar por residuo, material o contenedor"
                            className={`${inputCls} pl-10 bg-white dark:bg-zinc-900`}
                        />
                    </div>

                    {categoriesCount > 1 && (
                        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por categoría">
                            {[["all", "Todos"], ...rankedCategories.map(([cat]) => [cat, categoryName(cat)])].map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    aria-pressed={categoryFilter === key}
                                    style={categoryFilter === key ? { backgroundColor: accent.hex } : undefined}
                                    onClick={() => {
                                        setCategoryFilter(key);
                                        setVisible(PAGE_SIZE);
                                    }}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                                        categoryFilter === key
                                            ? "text-white"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800">
                    <div className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
                        <Inbox size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Aún no has clasificado ningún residuo
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 max-w-xs leading-relaxed">
                        Escanea un material para saber en qué contenedor va. Aquí quedará tu historial.
                    </p>
                    <Link
                        to="/escanear"
                        className={`mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-all active:scale-95 ${accent.btn}`}
                    >
                        <span>Escanear un residuo</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center p-8 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Sin resultados</p>
                    <p className="mt-1 text-xs text-zinc-500">Ningún registro coincide con tu búsqueda.</p>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-3 px-4 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <>
                    {hasFilters && (
                        <p className="px-1 text-xs text-zinc-500" role="status">
                            Mostrando {filteredHistory.length} de {history.length}
                        </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {filteredHistory.slice(0, visible).map((entry) => {
                            const catMeta = CATEGORY_INFO[entry.category] || CATEGORY_INFO.reciclables;

                            return (
                                <article
                                    key={entry.id}
                                    className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex gap-3.5 items-start"
                                >
                                    <div className="shrink-0 size-14 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-center border border-black/5 dark:border-white/5">
                                        <WasteVisual id={entry.wasteId} size="md" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                                {entry.wasteName}
                                            </h3>
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${catMeta.colorBadge}`}
                                            >
                                                {entry.categoryLabel || catMeta.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveEntry(entry.id)}
                                                aria-label={`Eliminar ${entry.wasteName} del historial`}
                                                title="Eliminar registro"
                                                className="shrink-0 p-1 -mr-1 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>

                                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                                            {entry.recommendedBin}
                                        </p>

                                        <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={11} />
                                                {formatDate(entry.timestamp)}
                                            </span>
                                            <span className={`text-[10px] font-semibold ${accent.text}`}>{entry.material}</span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {filteredHistory.length > visible && (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                                className="px-5 py-2.5 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                            >
                                Ver más ({filteredHistory.length - visible} restantes)
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
