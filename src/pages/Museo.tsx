import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    ArrowUp,
    ArrowUpDown,
    Moon,
    Settings,
    Sun,
} from "lucide-react";
import "../components/museum/museum-motion.css";
import { useTheme } from "../context/ThemeContext";
import { SettingsModal } from "../components/settings-modal";
import { Emulator } from "../components/museum/Emulator";
import { VersionDialog } from "../components/museum/VersionDialog";
import { VersionFrame } from "../components/museum/VersionFrame";
import { MUSEUM_COUNT, MUSEUM_VERSIONS, museumAnchor, type MuseumVersion } from "../data/museum";

type SeriesFilter = "all" | "v0" | "v1" | "v2";
type OrderMode = "asc" | "desc";

export default function Museo() {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [active, setActive] = useState<MuseumVersion | null>(null);
    const [running, setRunning] = useState<MuseumVersion | null>(null);
    const [activeSeries, setActiveSeries] = useState<SeriesFilter>("all");
    const [orderMode, setOrderMode] = useState<OrderMode>("asc");
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const lastOpenedVersionRef = useRef<string | null>(null);
    const [progress, setProgress] = useState(0);

    // Progreso de scroll para la barra superior
    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    // Filtrar y ordenar versiones
    const displayedVersions = useMemo(() => {
        const filtered = MUSEUM_VERSIONS.filter((v) => {
            if (activeSeries === "all") return true;
            return v.phase === activeSeries;
        });

        if (orderMode === "desc") {
            return [...filtered].reverse();
        }
        return filtered;
    }, [activeSeries, orderMode]);

    // Manejar apertura y cierre del emulador
    const handleOpenEmulator = useCallback((version: MuseumVersion) => {
        lastOpenedVersionRef.current = version.id;
        setRunning(version);
    }, []);

    const handleCloseEmulator = useCallback(() => {
        const closedId = lastOpenedVersionRef.current;
        setRunning(null);

        if (closedId) {
            window.requestAnimationFrame(() => {
                const el = document.getElementById(museumAnchor(closedId));
                if (el) {
                    const navEl = document.querySelector("nav[aria-label='Controles de versión y navegación']");
                    const navHeight = navEl ? navEl.getBoundingClientRect().height : 70;
                    const navOffset = navHeight + 16;
                    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: Math.max(0, elementPosition - navOffset),
                        behavior: "smooth",
                    });
                    const btn = el.querySelector<HTMLButtonElement>("button");
                    btn?.focus();
                }
            });
        }
    }, []);

    // Navegar entre versiones en el emulador
    const runIndex = running ? MUSEUM_VERSIONS.findIndex((v) => v.id === running.id) : -1;

    const moveRunning = useCallback(
        (delta: number) => {
            const next = MUSEUM_VERSIONS[runIndex + delta];
            if (next) {
                lastOpenedVersionRef.current = next.id;
                setRunning(next);
            }
        },
        [runIndex]
    );

    // Salto exacto a una versión manteniendo todas las demás visibles
    const handleJumpToVersion = (versionId: string) => {
        if (!versionId) return;

        // Si la versión pertenece a una serie que no está visible en el filtro actual, conmutar a "all"
        const targetVersion = MUSEUM_VERSIONS.find((v) => v.id === versionId);
        if (targetVersion && activeSeries !== "all" && targetVersion.phase !== activeSeries) {
            setActiveSeries("all");
        }

        // Desplazamiento suave con cálculo dinámico de offset exacto bajo la barra fija
        window.requestAnimationFrame(() => {
            const el = document.getElementById(museumAnchor(versionId));
            if (el) {
                const navEl = document.querySelector("nav[aria-label='Controles de versión y navegación']");
                const navHeight = navEl ? navEl.getBoundingClientRect().height : 70;
                const navOffset = navHeight + 16;
                const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: Math.max(0, elementPosition - navOffset),
                    behavior: "smooth",
                });

                // Resaltado visual transitorio para confirmar la versión alcanzada
                setHighlightedId(versionId);
                setTimeout(() => {
                    setHighlightedId((curr) => (curr === versionId ? null : curr));
                }, 1800);
            }
        });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="museum-hall relative min-h-screen overflow-x-clip bg-slate-50 dark:bg-[#090b0f] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
            {/* Progreso de lectura del archivo */}
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px]">
                <div
                    className="h-full origin-left"
                    style={{
                        transform: `scaleX(${progress})`,
                        backgroundColor: "var(--accent-color)",
                        boxShadow: "0 0 12px var(--accent-glow)",
                    }}
                />
            </div>

            {/* Halo ambiental con el acento del proyecto */}
            <div
                aria-hidden="true"
                className="museum-aura pointer-events-none absolute inset-x-0 top-0 h-[620px]"
            />

            {/* Cabecera Editorial e Institucional del Archivo Histórico */}
            <header className="relative mx-auto max-w-6xl px-4 pt-8 pb-4 sm:px-6 md:pt-12 md:pb-6">
                {/* Barra superior de regreso y controles de personalización */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
                    <Link
                        to="/"
                        className="group inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                        <span>Volver a la portada principal</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            TecNM · Instituto Tecnológico de Morelia
                        </span>

                        <div className="flex items-center gap-1.5 border-l border-zinc-200 dark:border-zinc-800 pl-3">
                            {/* Alternar tema rápido */}
                            <button
                                type="button"
                                onClick={toggleDarkMode}
                                title={`Cambiar a modo ${isDarkMode ? "claro" : "oscuro"}`}
                                aria-label={`Cambiar a modo ${isDarkMode ? "claro" : "oscuro"}`}
                                className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-xs cursor-pointer"
                            >
                                {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-zinc-700" />}
                            </button>

                            {/* Abrir panel de ajustes para seleccionar acento del proyecto */}
                            <button
                                type="button"
                                onClick={() => setIsSettingsOpen(true)}
                                title="Personalizar tema y colores de ReCiclo"
                                aria-label="Abrir panel de ajustes de tema"
                                className="inline-flex size-9 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-xs cursor-pointer"
                            >
                                <Settings size={15} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Titular con presencia editorial */}
                <div className="max-w-3xl">
                    <p
                        className="museum-rise text-xs font-bold uppercase tracking-wider transition-colors duration-300"
                        style={{ color: "var(--accent-color)", animationDelay: "60ms" }}
                    >
                        Memoria Histórica y Documental
                    </p>
                    <h1
                        style={{ animationDelay: "160ms" }}
                        className="museum-rise mt-2.5 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.12]">
                        Archivo de Versiones de ReCiclo
                    </h1>
                    <p style={{ animationDelay: "280ms" }} className="museum-rise mt-4 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 font-normal">
                        Registro cronológico de las veinte entregas del asistente ambiental para el IT Morelia. Desde el primer boceto conceptual del 4 de septiembre hasta la versión registrada en Oxigena tus Ideas el 8 de octubre de 2026.
                    </p>
                </div>

                {/* Métricas del archivo estilo editorial */}
                <div style={{ animationDelay: "420ms" }} className="museum-rise mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-zinc-200/90 dark:border-zinc-800/90 py-4 text-left">
                    <div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">{MUSEUM_COUNT}</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Entregas archivadas</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">55 días</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">4 sep – 28 oct 2026</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">3 Etapas</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Prototipo, v1 y Web Pura</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight">Campus 1 y 2</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Estaciones cartografiadas</div>
                    </div>
                </div>

                {/* Línea de tiempo: acceso directo a cada entrega */}
                <div style={{ animationDelay: "540ms" }} className="museum-rise mt-6">
                    <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                        Línea de tiempo · toca una entrega para ir a ella
                    </p>
                    <div className="no-scrollbar -mx-1 flex items-center overflow-x-auto px-1 py-2">
                        {MUSEUM_VERSIONS.map((v, i) => {
                            const dotColor =
                                v.phase === "v0"
                                    ? "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-900/50"
                                    : v.phase === "v1"
                                    ? "border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 dark:border-sky-800/70 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-900/50"
                                    : "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-900/50";

                            return (
                                <div key={v.id} className="flex items-center">
                                    {i > 0 && (
                                        <span
                                            aria-hidden="true"
                                            className={`h-px w-3 sm:w-4 ${
                                                v.id === "v1.0" || v.id === "v2.0"
                                                    ? "bg-zinc-300 dark:bg-zinc-700"
                                                    : "bg-zinc-200 dark:bg-zinc-800"
                                            }`}
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleJumpToVersion(v.id)}
                                        title={`${v.id} — ${v.title}`}
                                        aria-label={`Ir a ${v.id}: ${v.title}`}
                                        className={`shrink-0 cursor-pointer rounded-full border px-2.5 py-1 font-mono text-[11px] font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${dotColor}`}
                                    >
                                        {v.id.replace("v", "")}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Barra de filtros y salto rápido que permanece PEGADA (sticky) al hacer scroll */}
            <nav
                aria-label="Controles de versión y navegación"
                className="sticky top-2 z-30 mx-auto mb-6 max-w-6xl px-4 sm:top-3 sm:mb-8 sm:px-6"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white/95 dark:bg-[#11141b]/95 p-2.5 shadow-md backdrop-blur-md transition-colors">
                    {/* Botón de regreso a ReCiclo y filtro por etapa */}
                    <div className="flex items-center gap-2 min-w-0">
                        <Link
                            to="/"
                            className="group inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/90 px-2.5 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-white transition-all shrink-0 shadow-2xs cursor-pointer"
                            title="Regresar a la portada principal de ReCiclo"
                            aria-label="Regresar a ReCiclo"
                        >
                            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
                            <span className="hidden sm:inline">Regresar a ReCiclo</span>
                            <span className="sm:hidden">ReCiclo</span>
                        </Link>

                        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700 shrink-0" aria-hidden="true" />

                        {/* Filtro por etapa */}
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
                            <button
                                type="button"
                                onClick={() => setActiveSeries("all")}
                                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    activeSeries === "all"
                                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                Todas ({MUSEUM_COUNT})
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveSeries("v0")}
                                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    activeSeries === "v0"
                                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                Etapa 0 · Prototipos (10)
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveSeries("v1")}
                                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    activeSeries === "v1"
                                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                Etapa 1 · Campus ITM (10)
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveSeries("v2")}
                                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                    activeSeries === "v2"
                                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                Etapa 2 · Web Pura (10)
                            </button>
                        </div>
                    </div>

                    {/* Salto directo y orden */}
                    <div className="flex items-center gap-2 justify-between sm:justify-end">
                        <label htmlFor="jump-version-select" className="sr-only">
                            Saltar a versión
                        </label>
                        <select
                            id="jump-version-select"
                            defaultValue=""
                            onChange={(e) => {
                                handleJumpToVersion(e.target.value);
                                e.target.value = "";
                            }}
                            className="flex-1 sm:flex-initial rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
                        >
                            <option value="" disabled>
                                Saltar a entrega...
                            </option>
                            <optgroup label="Etapa 0 · Prototipos (v0.0 – v0.9)">
                                {MUSEUM_VERSIONS.filter((v) => v.phase === "v0").map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.id} — {v.title}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Etapa 1 · Campus ITM (v1.0 – v1.9)">
                                {MUSEUM_VERSIONS.filter((v) => v.phase === "v1").map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.id} — {v.title}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Etapa 2 · Web Pura (v2.0 – v2.9)">
                                {MUSEUM_VERSIONS.filter((v) => v.phase === "v2").map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.id} — {v.title}
                                    </option>
                                ))}
                            </optgroup>
                        </select>

                        <button
                            type="button"
                            onClick={() => setOrderMode((prev) => (prev === "asc" ? "desc" : "asc"))}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                            title="Alternar orden cronológico"
                        >
                            <ArrowUpDown size={13} />
                            <span className="hidden sm:inline">
                                {orderMode === "asc" ? "sep → oct" : "oct → sep"}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Contenido principal: Todas las versiones con narrativa de capítulos */}
            <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
                <div className="flex flex-col space-y-12">
                    {displayedVersions.map((version, index) => {
                        const showChapter0 =
                            activeSeries === "all" && orderMode === "asc" && version.id === "v0.0";
                        const showChapter1 =
                            activeSeries === "all" && orderMode === "asc" && version.id === "v1.0";

                        return (
                            <div key={version.id} className="space-y-8">
                                {/* Hito de Capítulo 01 */}
                                {showChapter0 && (
                                    <div className="pt-2 pb-6 border-b-2 border-zinc-950 dark:border-white">
                                        <span className="text-xs font-mono font-bold tracking-wider text-amber-700 dark:text-amber-400 uppercase">
                                            Capítulo 01 · 4 al 18 de septiembre de 2026
                                        </span>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white mt-1">
                                            La Génesis del Prototipo
                                        </h2>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
                                            De la primera página básica con el lema ambiental a un prototipo navegable con escáner interactivo, guía de materiales y personalización de temas.
                                        </p>
                                    </div>
                                )}

                                {/* Hito de Capítulo 02 */}
                                {showChapter1 && (
                                    <div className="pt-8 pb-6 border-b-2 border-zinc-950 dark:border-white">
                                        <span className="text-xs font-mono font-bold tracking-wider text-sky-700 dark:text-sky-400 uppercase">
                                            Capítulo 02 · 19 de septiembre al 8 de octubre de 2026
                                        </span>
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white mt-1">
                                            El Despliegue en el Campus ITM
                                        </h2>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
                                            Consolidación oficial en el Tecnológico de Morelia: diagnóstico local de residuos, cartografía de botes en Campus 1 y 2, cámara en tiempo real y entrega final en Oxigena tus Ideas.
                                        </p>
                                    </div>
                                )}

                                <VersionFrame
                                    version={version}
                                    index={index}
                                    total={displayedVersions.length}
                                    onTry={handleOpenEmulator}
                                    onOpen={setActive}
                                    isHighlighted={highlightedId === version.id}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Pie del archivo histórico */}
                <div className="mt-20 flex flex-col items-center justify-center gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-12 text-center">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        Has consultado las {displayedVersions.length} entregas documentadas en la memoria técnica del IT Morelia.
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={scrollToTop}
                            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-xs cursor-pointer"
                        >
                            <ArrowUp size={15} />
                            <span>Volver arriba</span>
                        </button>

                        <Link
                            to="/"
                            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            style={{
                                backgroundColor: "var(--accent-color)",
                                boxShadow: "0 4px 14px var(--accent-glow)",
                            }}
                        >
                            <ArrowLeft size={15} />
                            <span>Regresar a ReCiclo</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Entorno Emulador interactivo a pantalla completa */}
            <Emulator
                version={running}
                hasPrev={runIndex > 0}
                hasNext={runIndex >= 0 && runIndex < MUSEUM_COUNT - 1}
                onClose={handleCloseEmulator}
                onPrev={() => moveRunning(-1)}
                onNext={() => moveRunning(1)}
            />

            {/* Ficha ampliada de alta resolución */}
            <VersionDialog version={active} onClose={() => setActive(null)} />

            {/* Modal de Configuración y Personalización del Proyecto */}
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
}