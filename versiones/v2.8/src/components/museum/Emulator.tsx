import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Laptop,
    Maximize2,
    Minimize2,
    Minus,
    RotateCw,
    Smartphone,
    X,
} from "lucide-react";
import { formatMuseumDate, museumRunUrl, type MuseumVersion } from "../../data/museum";
import "./museum-motion.css";
import { useStorageGuard } from "./useStorageGuard";

type Cutout = "none" | "notch" | "island" | "punch";

interface DevicePreset {
    id: string;
    name: string;
    /** Tamaño de viewport en px CSS, igual que en las herramientas de desarrollo. */
    width: number;
    height: number;
    /** Radio de las esquinas de la pantalla. */
    radius: number;
    /** Grosor del marco. */
    bezel: number;
    cutout: Cutout;
    kind: "phone" | "tablet";
}

const DEVICES: DevicePreset[] = [
    { id: "iphone-se", name: "iPhone SE", width: 375, height: 667, radius: 22, bezel: 14, cutout: "none", kind: "phone" },
    { id: "iphone-xr", name: "iPhone XR", width: 414, height: 896, radius: 38, bezel: 11, cutout: "notch", kind: "phone" },
    { id: "iphone-12-pro", name: "iPhone 12 Pro", width: 390, height: 844, radius: 44, bezel: 11, cutout: "notch", kind: "phone" },
    { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", width: 430, height: 932, radius: 52, bezel: 11, cutout: "island", kind: "phone" },
    { id: "pixel-7", name: "Pixel 7", width: 412, height: 915, radius: 36, bezel: 10, cutout: "punch", kind: "phone" },
    { id: "galaxy-s8-plus", name: "Samsung Galaxy S8+", width: 360, height: 740, radius: 30, bezel: 10, cutout: "none", kind: "phone" },
    { id: "galaxy-s20-ultra", name: "Samsung Galaxy S20 Ultra", width: 412, height: 915, radius: 30, bezel: 10, cutout: "punch", kind: "phone" },
    { id: "ipad-mini", name: "iPad Mini", width: 768, height: 1024, radius: 24, bezel: 16, cutout: "none", kind: "tablet" },
    { id: "ipad-air", name: "iPad Air", width: 820, height: 1180, radius: 24, bezel: 16, cutout: "none", kind: "tablet" },
];

/** true mientras la media query coincida. */
function useMediaQuery(query: string) {
    const [matches, setMatches] = useState(() =>
        typeof window === "undefined" ? false : window.matchMedia(query).matches
    );
    useEffect(() => {
        const mq = window.matchMedia(query);
        const onChange = () => setMatches(mq.matches);
        onChange();
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, [query]);
    return matches;
}

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
    const [deviceId, setDeviceId] = useState(DEVICES[2].id);
    const [landscape, setLandscape] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [maximized, setMaximized] = useState(false);
    const [stage, setStage] = useState({ w: 0, h: 0 });
    const exitRef = useRef<HTMLButtonElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const stageRef = useRef<HTMLElement>(null);
    const isMdUp = useMediaQuery("(min-width: 768px)");

    // Pase lo que pase dentro de la demo, el tema y los ajustes reales del proyecto se conservan.
    useStorageGuard(version !== null);

    const device = DEVICES.find((d) => d.id === deviceId) ?? DEVICES[2];
    const viewW = landscape ? device.height : device.width;
    const viewH = landscape ? device.width : device.height;
    const framed = isMdUp && deviceMode === "mobile";
    const outerW = viewW + device.bezel * 2;
    const outerH = viewH + device.bezel * 2;
    // Escala solo hacia abajo: el iframe conserva su tamaño real (media queries correctas).
    const scale = stage.w
        ? Math.min(1, (stage.w - 48) / outerW, (stage.h - 48) / outerH)
        : 1;

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const update = () => setStage({ w: el.clientWidth, h: el.clientHeight });
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [version]);

    useEffect(() => {
        if (version) {
            setLoading(true);
            setMinimized(false);
            setMaximized(false);
        }
    }, [version]);

    useEffect(() => {
        if (!version) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const raf = window.requestAnimationFrame(() => exitRef.current?.focus());

        const onKey = (event: KeyboardEvent) => {
            // No robar las flechas al selector de dispositivo
            if ((event.target as HTMLElement | null)?.tagName === "SELECT") return;
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

    const iframe = (
        <iframe
            ref={iframeRef}
            src={museumRunUrl(version.id)}
            title={`ReCiclo ${version.id} en vivo`}
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            style={framed ? { width: viewW, height: viewH } : undefined}
            className={`block border-0 bg-white ${framed ? "" : "min-h-0 w-full flex-1"}`}
        />
    );

    return (
        <div
            className="museum-pop fixed inset-0 z-[100] flex flex-col bg-[#07080b] text-zinc-100 select-none"
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
                        title="Simular un dispositivo móvil a tamaño real"
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

            {/* Barra de dispositivo (como las herramientas de desarrollo): solo en modo móvil de escritorio */}
            {framed && (
                <div className="flex h-12 shrink-0 items-center justify-center gap-3 border-b border-zinc-800 bg-[#0b0e13] px-4 text-xs text-zinc-300">
                    <label htmlFor="museum-device-select" className="sr-only">
                        Dispositivo
                    </label>
                    <select
                        id="museum-device-select"
                        value={deviceId}
                        onChange={(e) => setDeviceId(e.target.value)}
                        className="min-h-[32px] cursor-pointer rounded-md border border-zinc-700 bg-zinc-900 px-2.5 text-xs font-medium text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                        <optgroup label="Teléfonos">
                            {DEVICES.filter((d) => d.kind === "phone").map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} ({d.width}×{d.height})
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Tabletas">
                            {DEVICES.filter((d) => d.kind === "tablet").map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} ({d.width}×{d.height})
                                </option>
                            ))}
                        </optgroup>
                    </select>

                    <span className="tabular-nums text-zinc-400" title="Tamaño real del viewport en píxeles CSS">
                        {viewW} × {viewH}
                    </span>
                    <span className="tabular-nums text-zinc-500" title="Escala de ajuste a tu pantalla">
                        {Math.round(scale * 100)}%
                    </span>

                    <button
                        type="button"
                        onClick={() => setLandscape((prev) => !prev)}
                        aria-pressed={landscape}
                        title="Girar dispositivo"
                        className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-md border px-2.5 font-medium transition-colors ${
                            landscape
                                ? "border-zinc-500 bg-zinc-800 text-white"
                                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        }`}
                    >
                        <RotateCw size={13} />
                        <span>Girar</span>
                    </button>
                </div>
            )}

            {/* Contenedor del emulador (iframe aislado con sandbox) */}
            <main
                ref={stageRef}
                className="relative flex-1 bg-[#090b0e] overflow-hidden flex items-center justify-center"
            >
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

                {/* Resplandor ambiental con el acento del proyecto (solo md+) */}
                <div
                    aria-hidden="true"
                    className="museum-aura pointer-events-none absolute inset-0 hidden opacity-60 md:block"
                />

                {/* Marco de visualización: en teléfonos reales es pantalla completa sin marcos ficticios.
                    En md+ se muestra una ventana de navegador (escritorio) o un teléfono (móvil). */}
                {framed ? (
                    /* Dispositivo a tamaño real: el iframe mide exactamente width × height del modelo
                       y el conjunto se reduce con transform solo si no cabe en la pantalla. */
                    <div
                        key={`${version.id}-framed`}
                        className="museum-pop relative shrink-0"
                        style={{ width: outerW * scale, height: outerH * scale }}
                    >
                        <div
                            className="relative border border-zinc-600/70 bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
                            style={{
                                width: outerW,
                                height: outerH,
                                padding: device.bezel,
                                borderRadius: device.radius + device.bezel,
                                transform: `scale(${scale})`,
                                transformOrigin: "top left",
                                transition: "width .35s ease, height .35s ease, border-radius .35s ease",
                            }}
                        >
                            {/* Botones laterales */}
                            {device.kind === "phone" && (
                                <>
                                    <span aria-hidden="true" className="absolute -left-[3px] top-[18%] h-10 w-[3px] rounded-l bg-zinc-600" />
                                    <span aria-hidden="true" className="absolute -left-[3px] top-[26%] h-10 w-[3px] rounded-l bg-zinc-600" />
                                    <span aria-hidden="true" className="absolute -right-[3px] top-[22%] h-16 w-[3px] rounded-r bg-zinc-600" />
                                </>
                            )}

                            <div
                                className="relative overflow-hidden bg-black"
                                style={{ width: viewW, height: viewH, borderRadius: device.radius }}
                            >
                                {/* Recortes de pantalla (solo en vertical) */}
                                {!landscape && device.cutout === "notch" && (
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-1/2 top-0 z-10 h-6 w-[38%] -translate-x-1/2 rounded-b-2xl bg-black"
                                    />
                                )}
                                {!landscape && device.cutout === "island" && (
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-1/2 top-2.5 z-10 h-[28px] w-[104px] -translate-x-1/2 rounded-full bg-black"
                                    />
                                )}
                                {!landscape && device.cutout === "punch" && (
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute left-1/2 top-2.5 z-10 size-3.5 -translate-x-1/2 rounded-full bg-black"
                                    />
                                )}

                                {iframe}
                            </div>
                        </div>
                    </div>
                ) : (
                <div
                    aria-hidden={minimized}
                    className={`flex h-full w-full items-center justify-center origin-bottom transition-[opacity,transform,visibility] duration-300 ease-out ${
                        minimized ? "invisible translate-y-[40%] scale-[0.25] opacity-0" : "visible"
                    }`}
                >
                <div
                    key={`${version.id}-${deviceMode}`}
                    className={`museum-pop relative flex h-full w-full flex-col bg-white transition-[width,height,border-radius] duration-300 ease-out md:bg-zinc-950 md:overflow-hidden ${
                        maximized
                            ? "md:h-full md:w-full md:max-w-none md:rounded-none md:border-0"
                            : "md:h-[calc(100%-2.5rem)] md:w-[calc(100%-3rem)] md:max-w-[1500px] md:rounded-xl md:border md:border-zinc-700 md:shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
                    }`}
                >
                    {/* Barra de navegador simulada (escritorio) */}
                    {deviceMode === "desktop" && (
                        <div
                            onDoubleClick={() => setMaximized((prev) => !prev)}
                            className="hidden h-10 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-3 md:flex"
                        >
                            <div className="group/lights flex items-center gap-2" onDoubleClick={(e) => e.stopPropagation()}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Cerrar y volver al archivo"
                                    title="Cerrar"
                                    className="flex size-3 items-center justify-center rounded-full bg-red-500 text-red-950 transition-transform hover:brightness-110 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                >
                                    <X size={8} strokeWidth={3.5} className="opacity-0 transition-opacity group-hover/lights:opacity-100" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMinimized(true)}
                                    aria-label="Minimizar ventana"
                                    title="Minimizar"
                                    className="flex size-3 items-center justify-center rounded-full bg-amber-400 text-amber-950 transition-transform hover:brightness-110 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                >
                                    <Minus size={8} strokeWidth={3.5} className="opacity-0 transition-opacity group-hover/lights:opacity-100" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMaximized((prev) => !prev)}
                                    aria-label={maximized ? "Restaurar tamaño de ventana" : "Maximizar ventana"}
                                    aria-pressed={maximized}
                                    title={maximized ? "Restaurar tamaño" : "Maximizar"}
                                    className="flex size-3 items-center justify-center rounded-full bg-emerald-500 text-emerald-950 transition-transform hover:brightness-110 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                >
                                    {maximized ? (
                                        <Minimize2 size={7} strokeWidth={3.5} className="opacity-0 transition-opacity group-hover/lights:opacity-100" />
                                    ) : (
                                        <Maximize2 size={7} strokeWidth={3.5} className="opacity-0 transition-opacity group-hover/lights:opacity-100" />
                                    )}
                                </button>
                            </div>
                            <div className="mx-auto flex h-6 w-full max-w-md items-center justify-center gap-2 rounded-md bg-zinc-800/80 px-3 text-[11px] text-zinc-400">
                                <span className="truncate">reciclo · {version.id} · modo demostración</span>
                            </div>
                            <span className="w-[54px]" aria-hidden="true" />
                        </div>
                    )}

                    {iframe}
                </div>
                </div>
                )}

                {/* Ventana minimizada: se restaura desde aquí */}
                {minimized && !framed && (
                    <button
                        type="button"
                        onClick={() => setMinimized(false)}
                        className="museum-pop absolute bottom-5 left-1/2 z-30 inline-flex min-h-[44px] -translate-x-1/2 items-center gap-2.5 rounded-full border border-zinc-700 bg-zinc-900/95 px-4 text-xs font-semibold text-zinc-100 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                        <span
                            aria-hidden="true"
                            className="size-2 rounded-full"
                            style={{ backgroundColor: "var(--accent-color)" }}
                        />
                        <span>ReCiclo {version.id} · Restaurar ventana</span>
                    </button>
                )}
            </main>
        </div>
    );
}