import { useEffect, useRef, useState } from "react";
import { useDeviceCapabilities, isProbablyMobileDevice } from "./useDeviceCapabilities";

export type PerfTier = "full" | "lite";
export type PerfSource = "auto" | "user";

const STORAGE_KEY = "reciclo:visual-tier-override";
const MEASURE_WINDOW_MS = 500;
const MEASURE_SAMPLES = 2;
const MIN_ACCEPTABLE_FPS = 48;
// Si la primera muestra ya cae muy por debajo del umbral, no hace falta pagar una
// segunda ronda de carga sintética solo para confirmar lo obvio.
const EARLY_EXIT_FPS = MIN_ACCEPTABLE_FPS * 0.7; // ~33fps

function readOverride(): PerfTier | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw === "full" || raw === "lite" ? raw : null;
    } catch {
        return null; // Safari en navegación privada, o almacenamiento bloqueado: no se recuerda la elección, pero no rompe nada
    }
}

// Genera carga real de layout y pintado durante la medición: un puñado de nodos
// ocultos a los que se les fuerza un recálculo de estilo en cada fotograma. Sin esta
// carga casi ningún equipo baja de 60fps, así que la medición nunca detectaría nada.
function createSyntheticLoad(nodeCount = 16) {
    const container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");
    container.style.cssText =
        "position:fixed;top:0;left:0;width:0;height:0;overflow:hidden;pointer-events:none;opacity:0;";

    const nodes: HTMLDivElement[] = [];
    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement("div");
        node.style.cssText =
            "width:24px;height:24px;border-radius:8px;backdrop-filter:blur(3px);transform:translateZ(0);";
        container.appendChild(node);
        nodes.push(node);
    }
    document.body.appendChild(container);

    let phase = 0;
    return {
        tick: () => {
            phase = phase ? 0 : 1;
            for (const node of nodes) {
                node.style.transform = phase
                    ? "translate3d(1px,0,0) scale(1.01)"
                    : "translate3d(0,0,0) scale(1)";
            }
            void container.offsetHeight; // fuerza layout/paint real en este fotograma
        },
        cleanup: () => container.remove(),
    };
}

// Mide fotogramas reales, bajo carga sintética, durante una ventana corta. Resuelve
// null si la pestaña deja de estar visible (rAF se pausa ahí y la medición no sería
// fiable).
function measureFrameHealth(windowMs: number): Promise<number | null> {
    return new Promise((resolve) => {
        if (document.hidden) {
            resolve(null);
            return;
        }
        const load = createSyntheticLoad();
        const finish = (fps: number | null) => {
            load.cleanup();
            resolve(fps);
        };
        let frames = 0;
        let start = 0;
        const tick = (t: number) => {
            if (document.hidden) {
                finish(null);
                return;
            }
            if (!start) start = t;
            load.tick();
            frames++;
            const elapsed = t - start;
            if (elapsed >= windowMs) {
                finish((frames / elapsed) * 1000);
                return;
            }
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
}

// Mide la capacidad real bajo carga. Deliberadamente NO se usa esto para decidir "lite"
// en desktop/laptop: ahí el modo ahorro de energía del sistema puede bajar el
// rendimiento real del CPU sin que el hardware sea de gama baja, y no queremos que un
// equipo capaz en batería quede forzado a "lite" por eso. En teléfonos/tablets, en
// cambio, las specs declaradas (RAM, núcleos) no son confiables — hay equipos con 4GB
// de RAM que igual no aguantan las animaciones — así que ahí sí vale la pena medir de
// verdad en vez de adivinar por specs.
async function measureFrameTier(): Promise<PerfTier> {
    const samples: number[] = [];
    for (let i = 0; i < MEASURE_SAMPLES; i++) {
        const fps = await measureFrameHealth(MEASURE_WINDOW_MS);
        if (fps === null) return "full"; // pestaña no visible; no se puede medir con fiabilidad, no se penaliza
        samples.push(fps);
        if (fps < EARLY_EXIT_FPS) return "lite";
    }
    const worstFps = Math.min(...samples);
    return worstFps < MIN_ACCEPTABLE_FPS ? "lite" : "full";
}

// Difiere una función a un momento en que el hilo principal está libre, para que la
// medición no compita con el primer render ni con el primer paint de la página. Safari
// no soporta requestIdleCallback, así que cae a un setTimeout corto.
function scheduleWhenIdle(fn: () => void) {
    const w = window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
        w.requestIdleCallback(fn, { timeout: 1500 });
    } else {
        setTimeout(fn, 200);
    }
}

export function useAdaptivePerformance() {
    // useDeviceCapabilities cubre las señales fijas (memoria, núcleos, GPU, conexión,
    // prefers-reduced-motion). Esto solo decide si, además, hace falta medir de verdad.
    const { isLowEnd } = useDeviceCapabilities();
    const staticTier: PerfTier = isLowEnd ? "lite" : "full";

    // Si nada de esto aplica, se va a medir el rendimiento real (ver measureFrameTier).
    const willMeasure = !isLowEnd && !readOverride() && isProbablyMobileDevice();

    // isReady=false mientras el resultado no es definitivo. No hay forma honesta de
    // saber en microsegundos si un equipo aguanta o no medir ES observar fotogramas
    // reales durante un rato, eso toma su tiempo—, así que en vez de mostrar un valor
    // provisional que después puede cambiar (y notarse como un parpadeo), se marca
    // explícitamente "todavía no se sabe" para que quien consuma el hook muestre algo
    // neutro mientras tanto, y recién pinte "full" o "lite" cuando ya sea definitivo.
    const [tier, setTierState] = useState<PerfTier>(() => readOverride() ?? staticTier);
    const [source, setSource] = useState<PerfSource>(() => (readOverride() ? "user" : "auto"));
    const [isReady, setIsReady] = useState<boolean>(() => !willMeasure);
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return; // evita que React StrictMode mida dos veces en desarrollo
        ran.current = true;

        if (!willMeasure) return; // ya se resolvió por señal fija, elección manual, o no es móvil

        let cancelled = false;
        scheduleWhenIdle(() => {
            if (cancelled || readOverride()) return;
            measureFrameTier().then((measured) => {
                if (cancelled || readOverride()) return; // pudo elegir manualmente mientras se medía
                setTierState(measured);
                setSource("auto");
                setIsReady(true);
            });
        });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Elección manual: gana siempre, se recuerda entre visitas, y es instantánea —
    // la persona ya decidió, no hay nada que medir.
    const setTier = (next: PerfTier) => {
        setTierState(next);
        setSource("user");
        setIsReady(true);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Sin almacenamiento no se recuerda entre visitas, pero la sesión actual igual respeta la elección
        }
    };

    // Vuelve a dejar que el motor decida (por ejemplo, si se agrega un botón de "restablecer" en Configuración)
    const clearOverride = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // no-op
        }
        setSource("auto");

        if (isLowEnd || !isProbablyMobileDevice()) {
            setTierState(staticTier);
            setIsReady(true);
            return;
        }

        // Mismo criterio que al montar: no se conoce el resultado hasta que termine de
        // medir, así que se marca isReady=false de nuevo en vez de mostrar un valor
        // provisional que luego cambiaría.
        setIsReady(false);
        measureFrameTier().then((measured) => {
            setTierState(measured);
            setIsReady(true);
        });
    };

    return { tier, source, isReady, setTier, clearOverride };
}