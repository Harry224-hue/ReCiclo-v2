import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig, useInView } from "framer-motion";
import { Layers } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* ---------- Estilos (mismos tokens que el resto de la página) ---------- */

// `Compacto` (móvil): menos blur y sin cristal anidado. Apilar blurs de 40px es lo que más
// pesa en un teléfono y hace que las animaciones vayan a tirones.
const getGlassClasses = (theme: string, compact = false) => {
    if (theme === "solid") return "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm backdrop-blur-none";
    if (theme === "light") return "bg-white/90 dark:bg-zinc-900/90 border border-black/5 dark:border-white/10 shadow-md backdrop-blur-md saturate-[150%]";
    if (compact) return "bg-white/70 dark:bg-zinc-900/70 border border-black/10 dark:border-white/10 shadow-xl backdrop-blur-xl";
    return "bg-white/60 dark:bg-zinc-900/60 border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-[40px] saturate-[200%]";
};

// Cristal anidado para lo que va dentro de los paneles principales
const getInnerGlassClasses = (theme: string, compact = false) => {
    if (theme === "solid") return "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800";
    if (theme === "light") return "bg-white/70 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm";
    if (compact) return "bg-white/50 dark:bg-white/5 border border-black/10 dark:border-white/10";
    return "bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-lg backdrop-blur-xl saturate-[180%]";
};

const themeStyles = {
    emerald: {
        text: "text-emerald-600 dark:text-emerald-400",
        gradient: "from-emerald-500 to-teal-700 dark:from-emerald-400 dark:to-teal-300",
        glow: "bg-emerald-500/5 dark:bg-emerald-500/10",
    },
    blue: {
        text: "text-blue-600 dark:text-blue-400",
        gradient: "from-blue-500 to-cyan-700 dark:from-blue-400 dark:to-cyan-300",
        glow: "bg-blue-500/5 dark:bg-blue-500/10",
    },
    purple: {
        text: "text-purple-600 dark:text-purple-400",
        gradient: "from-purple-500 to-fuchsia-700 dark:from-purple-400 dark:to-fuchsia-300",
        glow: "bg-purple-500/5 dark:bg-purple-500/10",
    },
    rose: {
        text: "text-rose-600 dark:text-rose-400",
        gradient: "from-rose-500 to-pink-700 dark:from-rose-400 dark:to-pink-300",
        glow: "bg-rose-500/5 dark:bg-rose-500/10",
    },
};

const FOCUS_RING =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/50 dark:focus-visible:ring-white/60";

// En SVG el box-shadow (ring) no se dibuja: para los elementos del dibujo se usa outline.
const SVG_FOCUS =
    "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900/60 dark:focus-visible:outline-white/70";

/* ---------- Contenedores ---------- */

const bins = {
    verde: { label: "Verde", what: "Orgánicos (alimentos)", body: "bg-emerald-600", ink: "text-white", hex: "#16a34a", inkHex: "#ffffff" },
    amarillo: { label: "Amarillo", what: "Papel, cartón, vidrio y metales", body: "bg-amber-400", ink: "text-amber-950", hex: "#facc15", inkHex: "#422006" },
    negro: { label: "Negro", what: "No reciclables (envoltorios)", body: "bg-zinc-800", ink: "text-white", hex: "#27272a", inkHex: "#ffffff" },
    azul: { label: "Azul", what: "Plásticos, hules y PET", body: "bg-blue-600", ink: "text-white", hex: "#2563eb", inkHex: "#ffffff" },
} as const;

type BinId = keyof typeof bins;

/* ---------- Productos ----------
   Cada producto se dibuja en un lienzo de 420 x 380. Cada parte tiene:
   - offset: cuánto se desplaza al "separar"
   - pin: dónde va el número (coordenadas de la parte armada)
   Los dibujos son sencillos a propósito: puedes sustituir `art` por tus propias ilustraciones. */

interface Part {
    id: string;
    name: string;
    material: string;
    bin: BinId;
    tip: string;
    offset: { x: number; y: number };
    pin: { x: number; y: number };
    art: ReactNode;
}

interface Product {
    id: string;
    tab: string;
    title: string;
    summary: string;
    parts: Part[];
}

const ridges = (x0: number, y1: number, y2: number, n: number, step: number, color: string) =>
    Array.from({ length: n }, (_, i) => (
        <line key={i} x1={x0 + i * step} x2={x0 + i * step} y1={y1} y2={y2} stroke={color} strokeOpacity=".45" strokeWidth="2" strokeLinecap="round" />
    ));

const products: Product[] = [
    {
        id: "frasco",
        tab: "Frasco",
        title: "Frasco de mermelada",
        summary: "Vidrio, papel y metal al contenedor reciclable del ITM.",
        parts: [
            {
                id: "vidrio",
                name: "Frasco",
                material: "Vidrio",
                bin: "amarillo",
                tip: "Enjuágalo y déjalo sin restos.",
                offset: { x: -75, y: 14 },
                pin: { x: 138, y: 190 },
                art: (
                    <>
                        <rect x="140" y="152" width="140" height="170" rx="30" fill="#6ee7b7" fillOpacity=".35" stroke="#10b981" strokeOpacity=".7" strokeWidth="2" />
                        <rect x="156" y="132" width="108" height="26" rx="7" fill="#6ee7b7" fillOpacity=".35" stroke="#10b981" strokeOpacity=".7" strokeWidth="2" />
                        <rect x="147" y="212" width="126" height="103" rx="24" fill="#be123c" fillOpacity=".8" />
                        <rect x="152" y="168" width="7" height="110" rx="3.5" fill="#fff" fillOpacity=".4" />
                    </>
                ),
            },
            {
                id: "etiqueta",
                name: "Etiqueta",
                material: "Papel",
                bin: "amarillo",
                tip: "Si se despega fácil, va con el papel.",
                offset: { x: 105, y: 4 },
                pin: { x: 270, y: 226 },
                art: (
                    <>
                        <rect x="150" y="226" width="120" height="66" rx="8" fill="#fef3c7" stroke="#d97706" strokeOpacity=".5" strokeWidth="1.5" />
                        <rect x="164" y="242" width="60" height="7" rx="3.5" fill="#b45309" fillOpacity=".55" />
                        <rect x="164" y="257" width="92" height="5" rx="2.5" fill="#b45309" fillOpacity=".3" />
                        <rect x="164" y="268" width="76" height="5" rx="2.5" fill="#b45309" fillOpacity=".3" />
                    </>
                ),
            },
            {
                id: "tapa",
                name: "Tapa",
                material: "Metal",
                bin: "amarillo",
                tip: "Sepárala del frasco antes de tirarlo.",
                offset: { x: -75, y: -80 },
                pin: { x: 268, y: 110 },
                art: (
                    <>
                        <rect x="148" y="106" width="124" height="32" rx="9" fill="#a1a1aa" stroke="#71717a" strokeWidth="2" />
                        {ridges(166, 116, 130, 6, 16, "#52525b")}
                        <rect x="148" y="106" width="124" height="8" rx="4" fill="#fff" fillOpacity=".25" />
                    </>
                ),
            },
        ],
    },
    {
        id: "cereal",
        tab: "Cereal",
        title: "Caja de cereal",
        summary: "Cartón por fuera, plástico por dentro.",
        parts: [
            {
                id: "bolsa",
                name: "Bolsa interior",
                material: "Plástico",
                bin: "azul",
                tip: "Si está limpia, va con los plásticos.",
                offset: { x: 105, y: -8 },
                pin: { x: 262, y: 84 },
                art: (
                    <>
                        <rect x="158" y="72" width="104" height="224" rx="12" fill="#bae6fd" fillOpacity=".55" stroke="#38bdf8" strokeWidth="2" />
                        <rect x="158" y="72" width="104" height="14" rx="6" fill="#38bdf8" fillOpacity=".5" />
                        <rect x="168" y="100" width="6" height="150" rx="3" fill="#fff" fillOpacity=".5" />
                    </>
                ),
            },
            {
                id: "caja",
                name: "Caja",
                material: "Cartón",
                bin: "amarillo",
                tip: "Desármala y aplánala.",
                offset: { x: -70, y: 10 },
                pin: { x: 150, y: 104 },
                art: (
                    <>
                        <rect x="146" y="96" width="128" height="204" rx="6" fill="#e9c98f" stroke="#b8893f" strokeWidth="2" />
                        <polygon points="274,96 300,110 300,286 274,300" fill="#cfa568" stroke="#b8893f" strokeWidth="2" />
                        <rect x="146" y="96" width="128" height="14" rx="3" fill="#fff" fillOpacity=".25" />
                        <circle cx="210" cy="190" r="34" fill="#fff" fillOpacity=".75" />
                        <path d="M186 190h48a24 24 0 0 1-48 0z" fill="#f59e0b" />
                        <rect x="162" y="246" width="96" height="10" rx="5" fill="#b45309" fillOpacity=".5" />
                    </>
                ),
            },
        ],
    },
    {
        id: "lata",
        tab: "Lata",
        title: "Lata de conserva",
        summary: "Metal y papel, cada uno por su lado.",
        parts: [
            {
                id: "lata",
                name: "Lata",
                material: "Metal",
                bin: "amarillo",
                tip: "Enjuágala rápido antes de tirarla.",
                offset: { x: -70, y: 8 },
                pin: { x: 156, y: 140 },
                art: (
                    <>
                        <rect x="156" y="132" width="108" height="150" rx="12" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="2" />
                        <ellipse cx="210" cy="132" rx="54" ry="13" fill="#e4e4e7" stroke="#a1a1aa" strokeWidth="2" />
                        <ellipse cx="210" cy="132" rx="40" ry="8" fill="#a1a1aa" fillOpacity=".35" />
                        <path d="M156 152h108M156 262h108" stroke="#a1a1aa" strokeWidth="2" />
                        <rect x="164" y="142" width="6" height="128" rx="3" fill="#fff" fillOpacity=".5" />
                    </>
                ),
            },
            {
                id: "etiqueta",
                name: "Etiqueta",
                material: "Papel",
                bin: "amarillo",
                tip: "Retírala si sale fácil.",
                offset: { x: 105, y: -6 },
                pin: { x: 262, y: 170 },
                art: (
                    <>
                        <rect x="158" y="166" width="104" height="82" rx="6" fill="#ef4444" fillOpacity=".9" />
                        <circle cx="210" cy="207" r="20" fill="#fff" fillOpacity=".9" />
                        <rect x="176" y="176" width="68" height="6" rx="3" fill="#fff" fillOpacity=".7" />
                        <rect x="176" y="232" width="68" height="6" rx="3" fill="#fff" fillOpacity=".7" />
                    </>
                ),
            },
        ],
    },
    {
        id: "botella",
        tab: "Botella",
        title: "Botella de agua",
        summary: "Tres partes, un solo contenedor.",
        parts: [
            {
                id: "botella",
                name: "Botella",
                material: "PET",
                bin: "azul",
                tip: "Aplástala para ahorrar espacio.",
                offset: { x: -75, y: 12 },
                pin: { x: 170, y: 200 },
                art: (
                    <>
                        <path
                            d="M192 96h36v20c0 14 22 24 22 44v122c0 12-10 22-22 22h-36c-12 0-22-10-22-22V160c0-20 22-30 22-44z"
                            fill="#7dd3fc"
                            fillOpacity=".4"
                            stroke="#0ea5e9"
                            strokeOpacity=".7"
                            strokeWidth="2"
                        />
                        <path d="M172 200h76v82c0 12-10 22-22 22h-32c-12 0-22-10-22-22z" fill="#38bdf8" fillOpacity=".35" />
                        <rect x="178" y="170" width="6" height="110" rx="3" fill="#fff" fillOpacity=".45" />
                    </>
                ),
            },
            {
                id: "etiqueta",
                name: "Etiqueta",
                material: "Film plástico",
                bin: "azul",
                tip: "No hace falta quitarla.",
                offset: { x: 105, y: 0 },
                pin: { x: 248, y: 214 },
                art: (
                    <>
                        <rect x="172" y="214" width="76" height="52" rx="6" fill="#e0f2fe" stroke="#0ea5e9" strokeOpacity=".5" strokeWidth="1.5" />
                        <rect x="182" y="226" width="44" height="6" rx="3" fill="#0284c7" fillOpacity=".6" />
                        <rect x="182" y="240" width="56" height="5" rx="2.5" fill="#0284c7" fillOpacity=".3" />
                    </>
                ),
            },
            {
                id: "tapa",
                name: "Tapa",
                material: "Plástico",
                bin: "azul",
                tip: "Ciérrala después de aplastar la botella.",
                offset: { x: -75, y: -64 },
                pin: { x: 232, y: 76 },
                art: (
                    <>
                        <rect x="188" y="72" width="44" height="26" rx="6" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
                        {ridges(198, 78, 92, 5, 7, "#1e3a8a")}
                    </>
                ),
            },
        ],
    },
];

const SPRING = { type: "spring", stiffness: 170, damping: 20 } as const;

const fadeUp = {
    initial: { y: 15, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    viewport: { once: true },
};

// Solo se monta UN layout a la vez (antes se montaban los dos y uno se ocultaba con CSS:
// doble SVG, doble selector y dos layoutId compitiendo).
function useMediaQuery(query: string) {
    return useSyncExternalStore(
        (notify) => {
            const mq = window.matchMedia(query);
            mq.addEventListener("change", notify);
            return () => mq.removeEventListener("change", notify);
        },
        () => window.matchMedia(query).matches,
        () => false,
    );
}

/* ---------- Piezas compartidas ---------- */

function BinChip({ bin, className = "" }: { bin: (typeof bins)[BinId]; className?: string }) {
    return (
        <span
            className={`px-3 py-1.5 rounded-full text-[11px] md:text-xs font-bold tracking-wider uppercase shadow-sm ${bin.body} ${bin.ink} ${className}`}
        >
            <span className="sr-only">Contenedor </span>
            {bin.label}
        </span>
    );
}

// Guía fija: qué material va en cada contenedor. Resalta el de la parte seleccionada.
function BinLegend({ innerGlass, activeBin }: { innerGlass: string; activeBin?: BinId }) {
    return (
        <div role="list" aria-label="Guía de contenedores" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(bins) as BinId[]).map((id) => {
                const bin = bins[id];
                const isActive = activeBin === id;
                return (
                    <div
                        key={id}
                        role="listitem"
                        className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-center transition-[box-shadow] duration-200 ${innerGlass} ${
                            isActive ? "ring-2 ring-zinc-900/30 dark:ring-white/50" : ""
                        }`}
                    >
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${bin.body} ${bin.ink}`}>
                            <span className="sr-only">Contenedor </span>
                            {bin.label}
                        </span>
                        <span className="text-[11px] md:text-xs leading-tight text-zinc-600 dark:text-zinc-300">{bin.what}</span>
                    </div>
                );
            })}
        </div>
    );
}

function ToggleButton({
                          exploded,
                          onClick,
                          className,
                          compact = false,
                      }: {
    exploded: boolean;
    onClick: () => void;
    className: string;
    compact?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={exploded}
            className={`flex items-center gap-2 rounded-full font-medium text-zinc-900 dark:text-white cursor-pointer active:scale-95 transition-transform ${FOCUS_RING} ${className}`}
        >
            <Layers size={16} aria-hidden="true" />
            {exploded ? "Juntar" : compact ? "Separar" : "Separar partes"}
        </button>
    );
}

function ProductTabs({
                         index,
                         onChange,
                         innerGlass,
                         compact = false,
                     }: {
    index: number;
    onChange: (i: number) => void;
    innerGlass: string;
    compact?: boolean;
}) {
    const pillId = useId();
    const refs = useRef<(HTMLButtonElement | null)[]>([]);

    const onKeys = (e: KeyboardEvent<HTMLDivElement>) => {
        const last = products.length - 1;
        let next = index;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = last;
        else return;
        e.preventDefault();
        onChange(next);
        refs.current[next]?.focus();
    };

    return (
        <div
            role="tablist"
            aria-label="Productos"
            onKeyDown={onKeys}
            className={`grid grid-cols-4 gap-1 p-1 rounded-2xl ${innerGlass}`}
        >
            {products.map((p, i) => {
                const isActive = i === index;
                return (
                    <button
                        key={p.id}
                        ref={(el) => {
                            refs.current[i] = el;
                        }}
                        id={`showcase-tab-${p.id}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls="showcase-panel"
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onChange(i)}
                        className={`relative rounded-xl font-medium cursor-pointer transition-colors duration-200 ${
                            compact ? "py-2.5 text-[13px]" : "py-2 text-sm"
                        } ${FOCUS_RING} ${
                            isActive
                                ? "text-zinc-900 dark:text-white"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                    >
                        {isActive && (
                            <motion.span
                                layoutId={`${pillId}-pill`}
                                aria-hidden="true"
                                className="absolute inset-0 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-black/5 dark:border-white/10"
                                transition={{ type: "spring", stiffness: 500, damping: 34 }}
                            />
                        )}
                        <span className="relative z-10">{p.tab}</span>
                    </button>
                );
            })}
        </div>
    );
}

/* Dibujo del producto. Es el mismo en escritorio y móvil; solo cambia el tamaño.
   Cambios frente a la versión anterior:
   - El resorte solo se aplica a x/y; la opacidad usa un fundido corto (un resorte en opacity rebota).
   - Los números aparecen con fundido, sin `scale` + transformBox (falla en Safari iOS).
   - Al cambiar de producto solo hay un fundido, con altura fija: no hay saltos de layout. */
function ProductStage({
                          product,
                          exploded,
                          activePart,
                          compact = false,
                          className,
                          onSelect,
                          onHover,
                          onClear,
                      }: {
    product: Product;
    exploded: boolean;
    activePart: string | null;
    compact?: boolean;
    className: string;
    onSelect: (id: string, viaKeyboard?: boolean) => void;
    onHover?: (id: string | null) => void;
    onClear: () => void;
}) {
    const pinR = compact ? 19 : 16;

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={className}
            >
                <svg
                    viewBox="50 -12 360 372"
                    role="group"
                    aria-label={`${product.title}, separado en ${product.parts.length} partes`}
                    className="w-full h-full block overflow-visible"
                >
                    <ellipse cx="210" cy="338" rx="130" ry="10" className="fill-black/10 dark:fill-black/40" />

                    {product.parts.map((part, i) => {
                        const bin = bins[part.bin];
                        const dim = exploded && activePart !== null && activePart !== part.id;
                        const delay = exploded ? i * 0.06 : 0;
                        return (
                            <motion.g
                                key={part.id}
                                initial={false}
                                animate={{
                                    x: exploded ? part.offset.x : 0,
                                    y: exploded ? part.offset.y : 0,
                                    opacity: dim ? 0.3 : 1,
                                }}
                                transition={{
                                    x: { ...SPRING, delay },
                                    y: { ...SPRING, delay },
                                    opacity: { duration: 0.2 },
                                }}
                                onPointerEnter={onHover ? (e) => e.pointerType === "mouse" && onHover(part.id) : undefined}
                                onPointerLeave={onHover ? (e) => e.pointerType === "mouse" && onHover(null) : undefined}
                                onClick={() => onSelect(part.id)}
                                // Solo con teclado: al tocar con el dedo el foco también se dispara y
                                // provocaba "seleccionar" + "deseleccionar" en el mismo toque.
                                onFocus={(e) => {
                                    if (onHover && exploded && e.currentTarget.matches(":focus-visible")) onHover(part.id);
                                }}
                                onBlur={() => onHover?.(null)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onSelect(part.id, true);
                                    } else if (e.key === "Escape") {
                                        onClear();
                                    }
                                }}
                                tabIndex={exploded ? 0 : -1}
                                role="button"
                                aria-label={`${part.name}, ${part.material}. Va al contenedor ${bin.label}.`}
                                style={{ cursor: "pointer" }}
                                className={SVG_FOCUS}
                            >
                                {part.art}

                                {/* Número con el color de su contenedor */}
                                <motion.g
                                    initial={false}
                                    animate={{ opacity: exploded ? 1 : 0 }}
                                    transition={{ duration: 0.25, delay: exploded ? 0.45 + i * 0.06 : 0 }}
                                    style={{ pointerEvents: "none" }}
                                >
                                    <circle cx={part.pin.x} cy={part.pin.y} r={pinR} fill={bin.hex} stroke="#fff" strokeWidth="2.5" />
                                    <text
                                        x={part.pin.x}
                                        y={part.pin.y}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontSize={pinR}
                                        fontWeight="700"
                                        fill={bin.inkHex}
                                    >
                                        {i + 1}
                                    </text>
                                </motion.g>
                            </motion.g>
                        );
                    })}
                </svg>
            </motion.div>
        </AnimatePresence>
    );
}

/* ---------- Sección ---------- */

export function Showcase() {
    const { glassTheme, accentColor } = useTheme();
    const accent = themeStyles[accentColor as keyof typeof themeStyles] ?? themeStyles.emerald;
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    const glassStyle = getGlassClasses(glassTheme, !isDesktop);
    const innerGlass = getInnerGlassClasses(glassTheme, !isDesktop);

    const [productIndex, setProductIndex] = useState(0);
    // Qué productos están "separados" ahora mismo (se recuerda por producto)
    const [explodedIds, setExplodedIds] = useState<Set<string>>(() => new Set());
    const [activePart, setActivePart] = useState<string | null>(null);

    const stageRef = useRef<HTMLDivElement>(null);
    const pointerKind = useRef("mouse");
    // Productos que ya reprodujeron la apertura automática (no se repite al volver)
    const introPlayed = useRef<Set<string>>(new Set());
    const inView = useInView(stageRef, { amount: 0.3, once: true });

    const product = products[productIndex];
    const exploded = explodedIds.has(product.id);
    const selectedPart = product.parts.find((p) => p.id === activePart) ?? null;

    // La primera vez que se ve cada producto llega armado y, un momento después, se separa solo.
    useEffect(() => {
        setActivePart(null);
        if (!inView || introPlayed.current.has(product.id)) return;
        const t = setTimeout(() => {
            introPlayed.current.add(product.id);
            setExplodedIds((prev) => new Set(prev).add(product.id));
        }, 900);
        return () => clearTimeout(t);
    }, [product.id, inView]);

    const toggleExploded = () => {
        introPlayed.current.add(product.id);
        setActivePart(null);
        setExplodedIds((prev) => {
            const next = new Set(prev);
            if (next.has(product.id)) next.delete(product.id);
            else next.add(product.id);
            return next;
        });
    };

    // Tocar una parte (dibujo, número o fila) también separa el producto si estaba armado.
    // Con mouse basta hover/clic; con dedo o teclado, volver a activarla la deselecciona.
    const select = (id: string, viaKeyboard = false) => {
        introPlayed.current.add(product.id);
        setExplodedIds((prev) => (prev.has(product.id) ? prev : new Set(prev).add(product.id)));
        const toggle = viaKeyboard || pointerKind.current !== "mouse";
        setActivePart((cur) => (toggle && cur === id ? null : id));
    };

    const clearActive = () => setActivePart(null);

    const header = (
        <div className="flex flex-col items-center text-center mb-6 md:mb-10">
            <motion.h2
                id="showcase-title"
                className="text-[2rem] leading-[1.08] sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-zinc-900 dark:text-white max-w-3xl"
                {...fadeUp}
            >
                Un producto. <br className="hidden md:block" />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-colors duration-500 ${accent.gradient}`}>
                    Cada parte, a su lugar.
                </span>
            </motion.h2>

            <motion.p
                className="mt-3 md:mt-4 text-[15px] md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl font-light"
                {...fadeUp}
                transition={{ delay: 0.1 }}
            >
                Casi ningún envase es de un solo material. Al escanearlo, ReCiclo te dice a dónde va cada una de sus partes.
            </motion.p>
        </div>
    );

    /* ===== Escritorio: dos paneles compactos lado a lado ===== */
    const desktop = (
        <motion.div
            className="grid grid-cols-2 gap-6 items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div ref={stageRef} className={`rounded-[1.75rem] p-4 ${glassStyle}`}>
                <ProductStage
                    product={product}
                    exploded={exploded}
                    activePart={activePart}
                    className="h-[300px] w-full"
                    onSelect={select}
                    onHover={setActivePart}
                    onClear={clearActive}
                />
                <div className="mt-2 flex justify-center">
                    <ToggleButton exploded={exploded} onClick={toggleExploded} className={`px-5 py-2.5 text-sm ${innerGlass}`} />
                </div>
            </div>

            <div className={`rounded-[1.75rem] p-4 ${glassStyle}`}>
                <ProductTabs index={productIndex} onChange={setProductIndex} innerGlass={innerGlass} />

                <div id="showcase-panel" role="tabpanel" aria-labelledby={`showcase-tab-${product.id}`}>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.18 }}
                        >
                            <div className="px-1 pt-4 pb-3">
                                <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">{product.title}</h3>
                                <p className="mt-0.5 text-base text-zinc-600 dark:text-zinc-300 font-light">{product.summary}</p>
                            </div>

                            <ul className="flex flex-col gap-2">
                                {product.parts.map((part, i) => {
                                    const bin = bins[part.bin];
                                    const isActive = activePart === part.id;
                                    return (
                                        <li key={part.id}>
                                            <button
                                                type="button"
                                                onClick={() => select(part.id)}
                                                onPointerEnter={(e) => e.pointerType === "mouse" && setActivePart(part.id)}
                                                onPointerLeave={(e) => e.pointerType === "mouse" && setActivePart(null)}
                                                onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActivePart(part.id)}
                                                onBlur={() => setActivePart(null)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left cursor-pointer transition-[box-shadow,transform] duration-200 ${innerGlass} ${
                                                    isActive ? "ring-2 ring-zinc-900/25 dark:ring-white/50 scale-[1.01]" : ""
                                                } ${FOCUS_RING}`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${bin.body} ${bin.ink}`}
                                                >
                                                    {i + 1}
                                                </span>
                                                <span className="flex-1 min-w-0">
                                                    <span className="block text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
                                                        {part.name}
                                                        <span className="ml-2 text-sm font-light text-zinc-500 dark:text-zinc-400">{part.material}</span>
                                                    </span>
                                                    <span className="block text-sm text-zinc-600 dark:text-zinc-400 font-light">{part.tip}</span>
                                                </span>
                                                <BinChip bin={bin} className="shrink-0" />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-3">
                    <BinLegend innerGlass={innerGlass} activeBin={selectedPart?.bin} />
                </div>
            </div>
        </motion.div>
    );

    /* ===== Móvil: un solo panel corto (~500px), sin carrusel ni scroll horizontal =====
       selector → título + botón → dibujo → partes numeradas → tarjeta con el detalle.
       Tocar un número o una pieza del dibujo selecciona la parte; todo cabe en una pantalla. */
    const mobile = (
        <div ref={stageRef} className={`max-w-md sm:max-w-lg mx-auto rounded-[1.75rem] p-3 flex flex-col gap-3 ${glassStyle}`}>
            <ProductTabs index={productIndex} onChange={setProductIndex} innerGlass={innerGlass} compact />

            <div id="showcase-panel" role="tabpanel" aria-labelledby={`showcase-tab-${product.id}`} className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 px-1">
                    <div className="min-w-0">
                        <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white truncate">{product.title}</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{product.summary}</p>
                    </div>
                    <ToggleButton
                        exploded={exploded}
                        onClick={toggleExploded}
                        compact
                        className={`shrink-0 px-4 py-2.5 text-[13px] ${innerGlass}`}
                    />
                </div>

                <ProductStage
                    product={product}
                    exploded={exploded}
                    activePart={activePart}
                    compact
                    className="h-[clamp(190px,54vw,250px)] w-full"
                    onSelect={select}
                    onClear={clearActive}
                />

                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${product.parts.length}, minmax(0, 1fr))` }}>
                    {product.parts.map((part, i) => {
                        const bin = bins[part.bin];
                        const isActive = activePart === part.id;
                        return (
                            <button
                                key={part.id}
                                type="button"
                                onClick={() => select(part.id)}
                                aria-pressed={isActive}
                                className={`flex items-center gap-2 min-h-11 px-2.5 rounded-2xl text-left text-[13px] font-medium cursor-pointer active:scale-[0.97] transition-[transform,box-shadow] duration-150 ${innerGlass} ${
                                    isActive ? "ring-2 ring-zinc-900/30 dark:ring-white/50" : ""
                                } ${FOCUS_RING}`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${bin.body} ${bin.ink}`}
                                >
                                    {i + 1}
                                </span>
                                <span className="truncate text-zinc-900 dark:text-white">{part.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Altura mínima fija: al cambiar de parte el panel no se encoge ni salta */}
                <div className="min-h-[84px]" aria-live="polite">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={`${product.id}-${selectedPart?.id ?? (exploded ? "hint" : "armed")}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className={`min-h-[84px] rounded-2xl p-3.5 flex ${selectedPart ? "items-start" : "items-center"} ${innerGlass}`}
                        >
                            {selectedPart ? (
                                <div className="flex w-full items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
                                            {selectedPart.name}
                                            <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">{selectedPart.material}</span>
                                        </p>
                                        <p className="mt-1 text-sm leading-snug text-zinc-600 dark:text-zinc-300">{selectedPart.tip}</p>
                                    </div>
                                    <BinChip bin={bins[selectedPart.bin]} className="shrink-0" />
                                </div>
                            ) : (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {exploded
                                        ? "Toca una parte para ver a qué contenedor va."
                                        : "Toca una parte o «Separar» para ver a dónde va cada una."}
                                </p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <BinLegend innerGlass={innerGlass} activeBin={selectedPart?.bin} />
            </div>
        </div>
    );

    return (
        <MotionConfig reducedMotion="user">
            <section
                aria-labelledby="showcase-title"
                className="relative isolate py-12 md:py-16 w-full overflow-hidden transition-colors duration-500"
            >
                <div
                    aria-hidden="true"
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[520px] md:h-[520px] blur-3xl md:blur-[110px] rounded-full pointer-events-none -z-10 ${accent.glow}`}
                />

                <div
                    className="max-w-5xl mx-auto px-4 md:px-8 relative z-10"
                    onPointerDownCapture={(e) => {
                        pointerKind.current = e.pointerType;
                    }}
                >
                    {header}
                    {isDesktop ? desktop : mobile}

                    <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400 font-light max-w-2xl mx-auto">
                        * Nota: Los colores de los botes de clasificación son meramente simbólicos. Además, la separación de los productos es una demostración animada y como tal, la forma en que se desarman o separan podría variar en la realidad.
                    </p>

                </div>
            </section>
        </MotionConfig>
    );
}