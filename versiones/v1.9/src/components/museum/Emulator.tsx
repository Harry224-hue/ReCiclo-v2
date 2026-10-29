import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Laptop, Smartphone, X } from "lucide-react";
import { formatMuseumDate, museumRunUrl, type MuseumVersion } from "../../data/museum";

interface EmulatorProps {
    version: MuseumVersion | null;
    hasPrev: boolean;
    hasNext: boolean;
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

/**
 * Entorno emulador interactivo a pantalla completa.
 * Ejecuta el bundle real compilado de cada versión dentro de un iframe aislado.
 * Diseño sobrio, sereno y funcional con botón destacado para salir al archivo.
 */
export function Emulator({ version, hasPrev, hasNext, onClose, onPrev, onNext }: EmulatorProps) {
    const [loading, setLoading] = useState(true);
    const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
    const exitRef = useRef<HTMLButtonElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (version) setLoading(true);
    }, [version]);

    useEffect(() => {
        if (!version) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const raf = window.requestAnimationFrame(() => exitRef.current?.focus());

        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            } else if (event.key === "ArrowLeft" && hasPrev) {
                onPrev();
            } else if (event.key === "ArrowRight" && hasNext) {
                onNext();
            }
        };

        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.cancelAnimationFrame(raf);
            document.body.style.overflow = prevOverflow;
        };
    }, [version, hasPrev, hasNext, onClose, onPrev, onNext]);

    const handleIframeLoad = () => {
        setLoading(false);
        try {
            const win = iframeRef.current?.contentWindow;
            if (win) {
                win.addEventListener("keydown", (e: KeyboardEvent) => {
                    if (e.key === "Escape") {
                        onClose();
                    } else if (e.key === "ArrowLeft" && hasPrev) {
                        onPrev();
                    } else if (e.key === "ArrowRight" && hasNext) {
                        onNext();
                    }
                });
            }
        } catch {
            /* same-origin guard */
        }
    };

    if (!version) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col bg-[#07080b] text-zinc-100 select-none animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label={`Emulación interactiva de ReCiclo ${version.id}`}
        >
            {/* Barra superior de control y salida intuitiva */}
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 sm:gap-3 border-b border-zinc-800 bg-[#0e1117] px-3 sm:px-4 backdrop-blur-md">
                {/* Lado izquierdo: botón de salida al archivo de versiones */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        ref={exitRef}
                        type="button"
                        onClick={onClose}
                        className="group inline-flex min-h-[44px] items-center gap-1.5 sm:gap-2 rounded-lg border border-zinc-700 bg-zinc-800/90 px-3 sm:px-4 py-2 text-xs font-semibold text-zinc-100 shadow-sm transition-all duration-150 hover:bg-zinc-700 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                        <ArrowLeft size={16} className="text-zinc-300 transition-transform group-hover:-translate-x-0.5" />
                        <span className="hidden sm:inline">Volver al archivo</span>
                        <span className="sm:hidden font-medium">Salir</span>
                        <X size={14} className="ml-0.5 sm:ml-1 text-zinc-400 group-hover:text-zinc-200" />
                    </button>

                    <div className="hidden h-5 w-px bg-zinc-800 sm:block" />

                    <div className="hidden items-center gap-2 md:flex">
                        <span
                            className="rounded-md border px-2.5 py-1 text-xs font-bold"
                            style={{
                                color: "var(--accent-color)",
                                borderColor: "color-mix(in srgb, var(--accent-color) 35%, transparent)",
                                backgroundColor: "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                            }}
                        >
                            {version.id}
                        </span>
                        <span className="text-xs font-medium text-zinc-300 truncate max-w-xs md:max-w-md">
                            {version.title}
                        </span>
                    </div>
                </div>

                {/* Centro en móvil: Versión actual (en móvil ya es un teléfono real, no tiene sentido simularlo) */}
                <div className="flex md:hidden items-center gap-1.5 min-w-0">
                    <span
                        className="rounded-md border px-2 py-0.5 text-xs font-bold shrink-0"
                        style={{
                            color: "var(--accent-color)",
                            borderColor: "color-mix(in srgb, var(--accent-color) 35%, transparent)",
                            backgroundColor: "color-mix(in srgb, var(--accent-color) 15%, transparent)",
                        }}
                    >
                        {version.id}
                    </span>
                    <span className="text-xs font-medium text-zinc-300 truncate max-w-[130px] sm:max-w-[200px]">
                        {version.title}
                    </span>
                </div>

                {/* Centro en escritorio (md+): selector de modo de simulación (Desktop / Móvil) */}
                <div className="hidden md:flex items-center rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5 text-xs">
                    <button
                        type="button"
                        onClick={() => setDeviceMode("desktop")}
                        className={`flex min-h-[36px] items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors ${
                            deviceMode === "desktop"
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                        title="Modo pantalla completa de computadora"
                    >
                        <Laptop size={14} />
                        <span>Escritorio</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setDeviceMode("mobile")}
                        className={`flex min-h-[36px] items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-colors ${
                            deviceMode === "mobile"
                                ? "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-400 hover:text-zinc-200"
                        }`}
                        title="Simular marco de teléfono móvil (375x667)"
                    >
                        <Smartphone size={14} />
                        <span>Móvil</span>
                    </button>
                </div>

                {/* Lado derecho: navegación entre versiones */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="mr-2 hidden text-[11px] text-zinc-400 lg:inline">
                        {formatMuseumDate(version.date)}
                    </span>

                    <button
                        type="button"
                        onClick={onPrev}
                        disabled={!hasPrev}
                        aria-label="Ir a la versión anterior"
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-30 active:scale-95"
                        title="Versión anterior (Flecha Izquierda)"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={!hasNext}
                        aria-label="Ir a la versión siguiente"
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white disabled:pointer-events-none disabled:opacity-30 active:scale-95"
                        title="Versión siguiente (Flecha Derecha)"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </header>

            {/* Contenedor del emulador (iframe aislado con sandbox) */}
            <main className="relative flex-1 bg-[#090b0e] overflow-hidden flex items-center justify-center">
                {/* Indicador de carga */}
                {loading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#090b0e]/90 backdrop-blur-sm">
                        <div
                            className="size-8 animate-spin rounded-full border-2 border-white/10"
                            style={{ borderTopColor: "var(--accent-color)" }}
                        />
                        <span className="text-xs font-medium text-zinc-400">
                            Cargando entorno de {version.id}...
                        </span>
                    </div>
                )}

                {/* Marco de visualización: En pantallas móviles SIEMPRE es pantalla completa nativa sin marcos ficticios. En pantallas grandes (md+) se activa el marco si se elige el modo móvil. */}
                <div
                    className={`h-full w-full transition-all duration-300 ${
                        deviceMode === "mobile"
                            ? "md:my-auto md:w-[375px] md:max-h-[812px] md:rounded-[2.5rem] md:border-[8px] md:border-zinc-800 md:shadow-[0_20px_60px_rgba(0,0,0,0.8)] md:overflow-hidden"
                            : "w-full"
                    }`}
                >
                    <iframe
                        ref={iframeRef}
                        src={museumRunUrl(version.id)}
                        title={`ReCiclo ${version.id} en vivo`}
                        onLoad={handleIframeLoad}
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        className="h-full w-full border-0 bg-white"
                    />
                </div>
            </main>
        </div>
    );
}
