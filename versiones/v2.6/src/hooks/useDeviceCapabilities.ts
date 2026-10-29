import { useState } from "react";

export interface DeviceCapabilities {
    isLowEnd: boolean;
    /** Qué señal(es) dispararon isLowEnd — útil para depurar, no para lógica de producto. */
    reasons: string[];
}

// Memoria/núcleos por debajo de esto son señal fuerte de gama baja cuando el navegador
// las expone. Deliberadamente bajos: deviceMemory se reporta redondeado a la potencia
// de 2 más cercana, y muchos teléfonos económicos ya vienen con 4-8 núcleos y 4-6GB de
// RAM como specs de marketing, aunque el rendimiento real siga siendo pobre — por eso
// esta señal sola no basta (ver hasLowEndGpu más abajo) y solo se usa "<= 2".
const LOW_MEMORY_GB = 2;
const LOW_CORE_COUNT = 2;

// Fragmentos de UNMASKED_RENDERER_WEBGL (en minúsculas) de chips gráficos de gama baja,
// sobre todo en Android económico y equipos viejos. Lista no exhaustiva a propósito:
// mejor perder algún caso raro que arriesgar falsos positivos con un patrón demasiado
// amplio.
const LOW_END_GPU_PATTERNS = [
    "mali-4", // Mali-400/450: común en Android muy económico
    "mali-t72", "mali-t76", // Mali-T720/T760: gama baja/media-baja
    "adreno (tm) 3", "adreno (tm) 4", // Adreno 3xx/4xx: gama baja/media-baja Qualcomm
    "powervr sgx", // GPUs viejas (iPhone 4/5, algunos Android económicos)
    "vivante", // SoCs muy económicos (Amlogic y similares: tablets/smart TV baratas)
];

function hasKnownLowSpec(): boolean {
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    if (typeof memory === "number" && memory <= LOW_MEMORY_GB) return true;

    const cores = navigator.hardwareConcurrency;
    if (typeof cores === "number" && cores <= LOW_CORE_COUNT) return true;

    return false;
}

// La señal más fiable en teléfonos: a diferencia de núcleos o memoria (que las hojas de
// especificaciones suelen inflar), el chip gráfico es lo que de verdad determina si las
// animaciones van a ir fluidas, y no se puede disfrazar con marketing. Es hardware fijo:
// no cambia con el estado de energía, así que no reintroduce el problema de falsos
// "lite" por batería/ahorro que ya se descartó en la versión anterior del hook.
function getGpuRenderer(): string | null {
    try {
        const canvas = document.createElement("canvas");
        const gl = (canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
        if (!gl) return null;

        const info = gl.getExtension("WEBGL_debug_renderer_info");
        if (!info) return null; // Firefox lo bloquea por defecto (resistFingerprinting): sin dato, no se asume nada

        const renderer = gl.getParameter(info.UNMASKED_RENDERER_WEBGL);
        return typeof renderer === "string" ? renderer.toLowerCase() : null;
    } catch {
        return null;
    }
}

function hasLowEndGpu(): boolean {
    const renderer = getGpuRenderer();
    if (!renderer) return false;
    return LOW_END_GPU_PATTERNS.some((pattern) => renderer.includes(pattern));
}

// Señal de accesibilidad, no de rendimiento: si la persona ya pidió menos movimiento a
// nivel de sistema operativo, "lite" es lo correcto independientemente del hardware.
function prefersReducedMotion(): boolean {
    try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
        return false;
    }
}

// Señal de red, no de CPU/GPU: conexiones muy lentas o con Ahorro de datos activado
// suelen coincidir con equipos económicos, y en cualquier caso ahí conviene la versión
// más liviana de todas formas.
function hasSlowConnection(): boolean {
    const conn = (
        navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    if (!conn) return false;
    if (conn.saveData) return true;
    return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

// Distingue "dispositivo táctil puro" (teléfono/tablet) de "tiene mouse" (desktop,
// laptop), sin depender de RAM/núcleos declarados. pointer:coarse = el puntero
// principal es un dedo, no un mouse; hover:none = no hay forma de pasar por encima sin
// tocar. Los dos juntos son el estándar para detectar táctil puro; una laptop con
// pantalla táctil pero con mouse conectado sigue contando como "tiene mouse" aquí, que
// es justo el caso donde no se quiere activar la medición de rendimiento.
export function isTouchPrimaryDevice(): boolean {
    try {
        return (
            window.matchMedia("(pointer: coarse)").matches &&
            window.matchMedia("(hover: none)").matches
        );
    } catch {
        return false;
    }
}

// Respaldo de isTouchPrimaryDevice: en algunos navegadores dentro de apps, o en
// emulaciones parciales (p. ej. throttling de CPU en DevTools sin activar la barra de
// dispositivos), pointer/hover pueden no coincidir aunque el dispositivo sí sea un
// teléfono. Se completa con la señal de "user agent móvil" (UA-CH cuando existe, si no
// el token clásico "Mobi"), que es igual de fija por dispositivo y no depende de si hay
// un mouse conectado en ese momento.
export function isProbablyMobileDevice(): boolean {
    if (isTouchPrimaryDevice()) return true;

    const uaData = (navigator as unknown as { userAgentData?: { mobile?: boolean } }).userAgentData;
    if (typeof uaData?.mobile === "boolean") return uaData.mobile;

    return /Mobi/i.test(navigator.userAgent);
}

function detectCapabilities(): DeviceCapabilities {
    const reasons: string[] = [];
    if (hasKnownLowSpec()) reasons.push("memoria/núcleos bajos");
    if (hasLowEndGpu()) reasons.push("GPU de gama baja");
    if (prefersReducedMotion()) reasons.push("prefers-reduced-motion");
    if (hasSlowConnection()) reasons.push("conexión lenta");
    return { isLowEnd: reasons.length > 0, reasons };
}

// Todo esto es estático por dispositivo: se calcula una sola vez, de forma síncrona,
// sin medir fotogramas ni depender del estado de energía en el momento.
export function useDeviceCapabilities(): DeviceCapabilities {
    const [capabilities] = useState<DeviceCapabilities>(() => detectCapabilities());
    return capabilities;
}