import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Maximize2, Pause, Play } from "lucide-react";
import {
    MUSEUM_CAPTURE_WIDTH,
    formatMuseumDate,
    museumAnchor,
    museumShotUrl,
    type MuseumVersion,
} from "../../data/museum";

interface VersionFrameProps {
    version: MuseumVersion;
    index: number;
    total: number;
    onTry: (version: MuseumVersion) => void;
    onOpen: (version: MuseumVersion) => void;
    isHighlighted?: boolean;
}

/**
 * Cuadro de versión en la línea vertical de exhibición.
 * Presenta cada versión dentro de un marco de ventana sobrio y contemporáneo,
 * con auto-scroll fluido, captura de escritorio en PC y captura móvil en teléfonos,
 * perfectamente integrado en modo claro y oscuro.
 */
export function VersionFrame({
    version,
    index,
    total,
    onTry,
    onOpen,
    isHighlighted = false,
}: VersionFrameProps) {
    const stageRef = useRef<HTMLDivElement>(null);
    const shotRef = useRef<HTMLImageElement>(null);
    const [shotLoaded, setShotLoaded] = useState(false);
    const [previewing, setPreviewing] = useState(false);
    const [visible, setVisible] = useState(false);
    const articleRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (shotRef.current?.complete) setShotLoaded(true);
    }, []);

    // Aparición suave al entrar en pantalla
    useEffect(() => {
        const el = articleRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const stage = stageRef.current;
        const shot = shotRef.current;
        if (!stage || !shot) return;

        const update = () => {
            const distance = Math.max(0, shot.offsetHeight - stage.clientHeight);
            const duration = Math.min(16, Math.max(7, distance / 160));
            stage.style.setProperty("--museum-shift", `-${Math.round(distance)}px`);
            stage.style.setProperty("--museum-duration", `${duration.toFixed(1)}s`);
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(stage);
        observer.observe(shot);
        return () => observer.disconnect();
    }, []);

    const date = formatMuseumDate(version.date);
    const titleId = `${version.slug}-title`;
    // En pantallas grandes el dispositivo alterna de lado para dar ritmo a la lectura
    const flip = index % 2 === 1;

    return (
        <article
            ref={articleRef}
            data-visible={visible}
            id={museumAnchor(version.id)}
            aria-labelledby={titleId}
            style={
                isHighlighted
                    ? {
                          borderColor: "var(--accent-color)",
                          boxShadow: "0 0 35px var(--accent-glow)",
                          outline: "3px solid color-mix(in srgb, var(--accent-color) 40%, transparent)",
                      }
                    : undefined
            }
            className={`museum-reveal group relative overflow-hidden scroll-mt-28 rounded-2xl bg-white dark:bg-[#10131a] p-5 sm:p-7 lg:p-8 ${
                isHighlighted
                    ? "border-2 shadow-2xl"
                    : "border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
        >
            {/* Marca de agua tipográfica con el número de versión */}
            <span
                aria-hidden="true"
                className={`pointer-events-none absolute -top-6 hidden select-none font-black sm:block leading-none tracking-tighter text-zinc-900/[0.04] dark:text-white/[0.04] text-[7rem] sm:text-[10rem] lg:text-[13rem] ${
                    flip ? "-left-4" : "-right-4"
                }`}
            >
                {version.id.replace("v", "")}
            </span>

            {/* Cabecera de la Cédula: Número de catálogo, versión, etapa y fecha */}
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Badge de Versión */}
                    <span
                        className="rounded-lg px-2.5 py-1 text-xs font-black tracking-wide text-white shadow-xs"
                        style={{ backgroundColor: "var(--accent-color)" }}
                    >
                        {version.id}
                    </span>

                    {/* Etapa del Proyecto */}
                    <span
                        className={`rounded-md px-2.5 py-0.5 text-xs font-semibold border ${
                            version.phase === "v0"
                                ? "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800/60"
                                : version.phase === "v1"
                                ? "bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950/40 dark:text-sky-200 dark:border-sky-800/60"
                                : "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800/60"
                        }`}
                    >
                        {version.phase === "v0"
                            ? "Etapa 0 · Prototipo"
                            : version.phase === "v1"
                            ? "Etapa 1 · Campus ITM"
                            : "Etapa 2 · ReCiclo 2.0"}
                    </span>

                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {date}
                    </span>
                </div>

                <div className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">
                    Catálogo {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </div>
            </header>

            {/* Título de la Entrega */}
            <h3
                id={titleId}
                className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white"
            >
                {version.title}
            </h3>

            {/* Estructura Asimétrica de Exhibición: Visual a la izquierda / Cédula a la derecha */}
            <div className="mt-6 grid grid-cols-1 gap-8 items-start lg:grid-cols-12">
                {/* Columna Izquierda: Vitrina de la Captura (7 cols) */}
                <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
                    <div className="group/stage relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 shadow-md">
                        {/* Escenario interactivo con soporte de scroll vertical fluido */}
                        <div
                            ref={stageRef}
                            onClick={() => onTry(version)}
                            className={`museum-stage cursor-pointer ${
                                previewing ? "museum-previewing" : ""
                            }`}
                            title="Haz clic para probar esta versión interactiva en vivo"
                        >
                            {!shotLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-zinc-400">
                                    Cargando captura histórica...
                                </div>
                            )}

                            <picture>
                                <source
                                    media="(max-width: 640px)"
                                    srcSet={museumShotUrl(version.screenshot, true)}
                                />
                                <img
                                    ref={shotRef}
                                    src={museumShotUrl(version.screenshot)}
                                    alt={`Captura histórica de ReCiclo ${version.id}, ${date}`}
                                    width={MUSEUM_CAPTURE_WIDTH}
                                    height={version.height}
                                    loading="lazy"
                                    decoding="async"
                                    draggable={false}
                                    onLoad={() => setShotLoaded(true)}
                                    className={`museum-shot w-full select-none ${
                                        shotLoaded ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                            </picture>

                            {/* Línea de progreso reactiva en hover */}
                            <span className="museum-progress" aria-hidden="true" />

                            {/* Indicador de ayuda no invasivo */}
                            <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden rounded-md bg-black/80 px-2.5 py-1 text-[11px] font-medium text-zinc-200 backdrop-blur-sm sm:block">
                                Desplaza el cursor para recorrer la interfaz ↕
                            </div>

                            {/* Control táctil para móviles */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewing((prev) => !prev);
                                }}
                                aria-label={`${previewing ? "Pausar" : "Reproducir"} auto-scroll de ReCiclo ${version.id}`}
                                className="absolute right-3 top-3 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/20 bg-black/75 text-zinc-100 transition-transform active:scale-95 md:hidden"
                            >
                                {previewing ? <Pause size={15} /> : <Play size={15} />}
                            </button>
                        </div>
                    </div>

                    {/* Barra inferior del marco */}
                    <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Captura original archivada · {version.id}</span>
                        <button
                            type="button"
                            onClick={() => onOpen(version)}
                            className="inline-flex items-center gap-1.5 font-medium hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                            <Maximize2 size={13} />
                            <span>Ver en pantalla completa</span>
                        </button>
                    </div>
                </div>

                {/* Columna Derecha: Cédula Histórica y Editorial (5 cols) */}
                <div className={`flex flex-col justify-between lg:col-span-5 h-full space-y-6 ${flip ? "lg:order-1" : ""}`}>
                    <div className="space-y-6">
                        {/* 1. Contexto y Propósito */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                                Propósito del hito
                            </h4>
                            <p className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 font-normal">
                                {version.why}
                            </p>
                        </div>

                        {/* 2. Novedades para la comunidad estudiantil */}
                        {version.added.length > 0 && (
                            <div>
                                <h4
                                    className="text-xs font-bold uppercase tracking-wider mb-2.5 transition-colors duration-300"
                                    style={{ color: "var(--accent-color)" }}
                                >
                                    Novedades de la versión
                                </h4>
                                <ul className="space-y-2 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
                                    {version.added.map((item) => (
                                        <li key={item} className="flex items-start gap-2.5">
                                            <span
                                                className="mt-1.5 size-1.5 shrink-0 rounded-full"
                                                style={{ backgroundColor: "var(--accent-color)" }}
                                            />
                                            <span className="leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 3. Cambios o simplificaciones */}
                        {version.removed.length > 0 && (
                            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                                    Ajustes y simplificaciones
                                </h4>
                                <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                                    {version.removed.map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <span className="mt-1 size-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Acciones principales al pie de la cédula */}
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            type="button"
                            onClick={() => onTry(version)}
                            className="group relative inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-md focus-visible:outline-none focus-visible:ring-2 cursor-pointer"
                            style={{
                                backgroundColor: "var(--accent-color)",
                                boxShadow: "0 4px 18px var(--accent-glow)",
                            }}
                        >
                            <Play size={15} fill="currentColor" />
                            <span>Probar {version.id} en vivo</span>
                            <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}