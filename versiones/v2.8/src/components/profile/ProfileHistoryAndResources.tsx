import { Link } from "react-router-dom";
import {
    Layers,
    BookOpen,
    Globe2,
    History,
    Trash2,
    Search,
    Inbox,
    ScanLine,
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
    { id: "Campus 1 (Principal)", label: "Campus 1", subtitle: "Av. Tecnológico" },
    { id: "Campus 2 (San José de la Huerta)", label: "Campus 2", subtitle: "San José de la Huerta" },
];

// Recorta la imagen a un cuadrado y la comprime en JPEG para no exceder el límite de localStorage o Firestore.
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
    const resources = [
        {
            to: "/tecnologias",
            icon: Layers,
            badge: `${TOTAL_TECH_RESOURCES} recursos`,
            title: "Tecnologías y APIs",
            desc: "Vite 8 (Rolldown), React 19, IA con Gemini 2.5 Flash y MobileNet v2, cartografía Leaflet y normas oficiales.",
            cta: "Consultar ficha técnica",
        },
        {
            to: "/como-funciona",
            icon: BookOpen,
            badge: "Guía práctica",
            title: "Cómo Funciona",
            desc: "Flujo de identificación de residuos, regla de las 4V para envases y código de colores de contenedores ITM.",
            cta: "Abrir guía de separación",
        },
        {
            to: "/impacto",
            icon: Globe2,
            badge: "Agenda 2030 y SGI",
            title: "Fundamento Ambiental",
            desc: "Dimensiones ambiental, social y económica, metas del ODS 12 y procedimiento ITMORELIA-IT-AM-007.",
            cta: "Revisar marco normativo",
        },
    ];

    return (
        <section
            aria-label="Recursos oficiales"
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4"
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <Layers size={18} className={accent.text} aria-hidden="true" />
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                            Documentación y Marco del Proyecto
                        </h2>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                            Referencias técnicas, operativas y normativas del sistema en el Instituto Tecnológico de Morelia.
                        </p>
                    </div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${accent.badge}`}>
                    Documentación ITM
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {resources.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`p-4 sm:p-5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between gap-3 group cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                        >
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <span className={`size-9 rounded-xl flex items-center justify-center ${accent.badge} shrink-0`}>
                                        <Icon size={16} aria-hidden="true" />
                                    </span>
                                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${accent.badge}`}>
                                        {item.badge}
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                            <span className={`text-xs font-semibold ${accent.text} pt-1 group-hover:underline`}>
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
        <section
            aria-label="Historial de residuos"
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <History size={18} className={accent.text} aria-hidden="true" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                Historial de Residuos Clasificados
                            </h2>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold tabular-nums ${accent.badge}`}>
                                {history.length}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                            Registros guardados localmente en este navegador para consultar su contenedor e instrucciones.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        to="/escanear"
                        className={`inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-95 ${accent.btn} focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                    >
                        <ScanLine size={14} aria-hidden="true" />
                        <span>Clasificar residuo</span>
                    </Link>
                    {history.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClearHistory}
                            className="inline-flex items-center gap-1.5 min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                        >
                            <Trash2 size={14} aria-hidden="true" />
                            <span>Vaciar</span>
                        </button>
                    )}
                </div>
            </div>

            {history.length > 0 && (
                <div className="space-y-3 pt-1">
                    <div className="relative">
                        <Search
                            size={15}
                            aria-hidden="true"
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 pointer-events-none"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setVisible(PAGE_SIZE);
                            }}
                            aria-label="Buscar en el historial"
                            placeholder="Buscar por nombre del residuo, material o contenedor recomendado..."
                            className={`${inputCls} min-h-[44px] pl-10 bg-zinc-50 dark:bg-zinc-950/60`}
                        />
                    </div>

                    {categoriesCount > 1 && (
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
                            {[["all", "Todas las categorías"], ...rankedCategories.map(([cat]) => [cat, categoryName(cat)])].map(
                                ([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        aria-pressed={categoryFilter === key}
                                        style={categoryFilter === key ? { backgroundColor: accent.hex } : undefined}
                                        onClick={() => {
                                            setCategoryFilter(key);
                                            setVisible(PAGE_SIZE);
                                        }}
                                        className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring} ${
                                            categoryFilter === key
                                                ? "text-white font-semibold shadow-xs"
                                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/50 border border-dashed border-zinc-300 dark:border-zinc-800">
                    <div className="size-12 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 mb-3">
                        <Inbox size={24} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Tu historial de clasificación está vacío
                    </h3>
                    <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
                        Aún no has registrado residuos en este dispositivo. Usa el escáner con cámara o consulta el catálogo manual para conocer en qué contenedor del campus depositar cada material.
                    </p>
                    <Link
                        to="/escanear"
                        className={`mt-4 inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 ${accent.btn} focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                    >
                        <ScanLine size={15} aria-hidden="true" />
                        <span>Abrir escáner de residuos</span>
                    </Link>
                </div>
            ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center p-8 text-center rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/50 border border-dashed border-zinc-300 dark:border-zinc-800">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        Sin coincidencias para el filtro actual
                    </p>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                        Ningún residuo clasificado coincide con "{query || categoryName(categoryFilter)}".
                    </p>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className={`mt-3 min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300/80 dark:hover:bg-zinc-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                    >
                        Restablecer búsqueda y filtros
                    </button>
                </div>
            ) : (
                <>
                    {hasFilters && (
                        <div className="flex items-center justify-between px-1 text-xs text-zinc-600 dark:text-zinc-400" role="status">
                            <span>
                                Mostrando {filteredHistory.length} de {history.length} registros
                            </span>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className={`font-semibold ${accent.text} hover:underline cursor-pointer`}
                            >
                                Quitar filtros
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {filteredHistory.slice(0, visible).map((entry) => {
                            const catMeta = CATEGORY_INFO[entry.category] || CATEGORY_INFO.reciclables;

                            return (
                                <article
                                    key={entry.id}
                                    className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 flex gap-3.5 items-start justify-between"
                                >
                                    <div className="flex gap-3.5 items-start min-w-0 flex-1">
                                        <div className="shrink-0 size-14 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center border border-zinc-200/70 dark:border-zinc-800">
                                            <WasteVisual id={entry.wasteId} size="md" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                                    {entry.wasteName}
                                                </h3>
                                                <span
                                                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${catMeta.colorBadge}`}
                                                >
                                                    {entry.categoryLabel || catMeta.name}
                                                </span>
                                            </div>

                                            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                                                {entry.recommendedBin}
                                            </p>

                                            <div className="mt-2.5 pt-2 border-t border-zinc-200/70 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                                                <span className="inline-flex items-center gap-1">
                                                    <Calendar size={12} aria-hidden="true" />
                                                    {formatDate(entry.timestamp)}
                                                </span>
                                                <span className={`text-[11px] font-semibold ${accent.text}`}>
                                                    {entry.material}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEntry(entry.id)}
                                        aria-label={`Eliminar ${entry.wasteName} del historial`}
                                        title="Eliminar registro"
                                        className="shrink-0 size-11 rounded-xl inline-flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                                    >
                                        <Trash2 size={15} aria-hidden="true" />
                                    </button>
                                </article>
                            );
                        })}
                    </div>

                    {filteredHistory.length > visible && (
                        <div className="flex justify-center pt-1">
                            <button
                                type="button"
                                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                                className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 ${accent.ring}`}
                            >
                                Mostrar más registros ({filteredHistory.length - visible} restantes)
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
