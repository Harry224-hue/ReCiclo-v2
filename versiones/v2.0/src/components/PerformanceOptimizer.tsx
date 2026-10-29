import { ImgHTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

/**
 * Todo lo de "que la página nunca se sienta lenta" en un solo lugar:
 * - useInView: sabe cuándo algo está por entrar (o salir) en pantalla.
 * - LazyMount: no monta una sección (ni corre su JS, ni pide sus datos) hasta que el
 *   usuario está por llegar a ella. Conectado a perfTier (useAdaptivePerformance vía
 *   ThemeContext): en "lite" es más conservador — monta con menos anticipación y
 *   VUELVE a desmontar lo que ya quedó lejos, para no acumular animaciones/DOM montado
 *   para siempre en un equipo que ya sabemos que va justo. En "full" precarga con más
 *   margen y se queda montado una vez visto, para que no "parpadee" al hacer scroll.
 * - LazyImage: reemplazo de <img> con lazy loading, decoding async, prioridad y
 *   srcset, para no bajar una imagen más grande de la que hace falta.
 *
 * Uso típico en cualquier parte de la página:
 *
 *   <LazyMount minHeight={480}>
 *     <LazyImage src="/piezas/motor.jpg" alt="Motor reciclado" widths={[480, 960, 1600]} />
 *   </LazyMount>
 *
 *   // Solo la imagen principal de la primera pantalla:
 *   <LazyImage src="/hero.jpg" alt="ReCiclo" priority />
 *
 *   // Para diferir también el CÓDIGO de una sección pesada, no solo su montaje:
 *   const Galeria3D = React.lazy(() => import("./Galeria3D"));
 *   <LazyMount minHeight={480}>
 *     <Suspense fallback={<div style={{ minHeight: 480 }} />}>
 *       <Galeria3D />
 *     </Suspense>
 *   </LazyMount>
 */

// ---------------------------------------------------------------------------
// useInView: hook base. Envuelve IntersectionObserver, la API del navegador para
// saber cuándo un elemento entra en pantalla sin escuchar el evento de scroll a mano
// (eso sí sería lento: se dispara cientos de veces por segundo).
// ---------------------------------------------------------------------------

interface UseInViewOptions {
    /** Qué tan antes de entrar en pantalla se dispara (margen de anticipación). */
    rootMargin?: string;
    threshold?: number;
    /** Si es true (default), deja de observar en cuanto entró la primera vez — se
     *  queda "inView" para siempre. Si es false, también vuelve a "no inView" cuando
     *  el elemento sale de pantalla (para desmontar y liberar recursos). */
    once?: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInView<T extends HTMLElement = HTMLDivElement>(
    options: UseInViewOptions = {}
) {
    const { rootMargin = "200px", threshold = 0, once = true } = options;
    const ref = useRef<T | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        // Sin soporte de IntersectionObserver (prácticamente inexistente hoy, pero por
        // si acaso): se asume visible de una vez. Mejor mostrar de más que dejar una
        // sección vacía para siempre por falta de la API.
        if (typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setInView(false); // se alejó de pantalla: se desmonta, para liberar recursos
                }
            },
            { rootMargin, threshold }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [rootMargin, threshold, once]);

    return { ref, inView };
}

// ---------------------------------------------------------------------------
// LazyMount: no monta sus hijos hasta que están por entrar en pantalla. Es la pieza
// que responde a "que no esté 100% cargada apenas entra, solo lo que se ve".
// ---------------------------------------------------------------------------

interface LazyMountProps {
    children: ReactNode;
    /** Qué mostrar mientras la sección no ha entrado en pantalla. */
    fallback?: ReactNode;
    /** Alto reservado mientras no está montado, para que la página no "salte" cuando
     *  el contenido real aparece. Ideal: el alto real aproximado de esa sección. */
    minHeight?: number | string;
    /** Qué tan antes de llegar a esa parte de la página se empieza a montar. Si no se
     *  pasa, se decide solo según perfTier (ver arriba). */
    rootMargin?: string;
}

export function LazyMount({ children, fallback, minHeight = 200, rootMargin }: LazyMountProps) {
    const { perfTier } = useTheme();
    const isLite = perfTier === "lite";

    const effectiveRootMargin = rootMargin ?? (isLite ? "80px" : "300px");
    const { ref, inView } = useInView<HTMLDivElement>({
        rootMargin: effectiveRootMargin,
        once: !isLite,
    });

    return (
        <div
            ref={ref}
            style={{
                minHeight: !inView ? minHeight : undefined,
                // Respaldo a nivel CSS del mismo efecto: el navegador se salta el
                // layout/pintado de esto mientras esté lejos de la pantalla, sin
                // depender de que el JS de arriba haya corrido a tiempo.
                contentVisibility: "auto",
                containIntrinsicSize:
                    typeof minHeight === "number" ? `${minHeight}px` : minHeight,
            }}
        >
            {inView ? children : (fallback ?? null)}
        </div>
    );
}

// ---------------------------------------------------------------------------
// LazyImage: envoltorio delgado sobre <img> con lo que de verdad mueve la aguja en
// imágenes, todo nativo del navegador.
// ---------------------------------------------------------------------------

export interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "loading"> {
    src: string;
    alt: string;
    /** true SOLO para la imagen principal de la primera pantalla (el "hero"). */
    priority?: boolean;
    /** Anchos disponibles del mismo archivo, para armar el srcset. */
    widths?: number[];
    sizes?: string;
}

// Asume "foto.jpg" -> "foto-480w.jpg", "foto-960w.jpg". Ajusta esto a como sirvas tus
// imágenes en realidad (CDN con ?w=, servicio de optimización, etc.).
function buildSrcSet(src: string, widths: number[]): string {
    const dot = src.lastIndexOf(".");
    const base = dot === -1 ? src : src.slice(0, dot);
    const ext = dot === -1 ? "" : src.slice(dot);
    return widths.map((w) => `${base}-${w}w${ext} ${w}w`).join(", ");
}

export function LazyImage({ src, alt, priority = false, widths, sizes, ...rest }: LazyImageProps) {
    return (
        <img
            src={src}
            srcSet={widths ? buildSrcSet(src, widths) : undefined}
            sizes={sizes}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            {...rest}
        />
    );
}