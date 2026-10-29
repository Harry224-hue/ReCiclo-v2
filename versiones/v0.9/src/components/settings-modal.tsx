import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, type AccentColor, type ColorSchemeMode } from "../context/ThemeContext";
import {
    Paintbrush,
    Sparkles,
    Palette,
    RotateCcw,
    Check,
    X,
    User,
    Shield,
    MonitorSmartphone,
} from "lucide-react";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const accentOptions: {
    id: AccentColor;
    bgClass: string;
    name: string;
}[] = [
    { id: "emerald", bgClass: "bg-emerald-500", name: "Esmeralda" },
    { id: "blue", bgClass: "bg-blue-500", name: "Zafiro" },
    { id: "purple", bgClass: "bg-purple-500", name: "Amatista" },
    { id: "rose", bgClass: "bg-rose-500", name: "Coral" },
];

// Cada modo trae su propia explicación: "Sistema" y "Horario" cambian el tema sin que
// la persona lo pida en el momento, así que conviene que quede claro qué los dispara
// antes de elegirlos, no solo cómo se llaman.
const colorSchemeOptions: {
    id: ColorSchemeMode;
    name: string;
}[] = [
    { id: "light", name: "Claro" },
    { id: "dark", name: "Oscuro" },
];

export function SettingsModal({
                                  isOpen,
                                  onClose,
                              }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState<
        "aspecto" | "cuenta" | "privacidad"
    >("aspecto");

    const {
        colorSchemeMode,
        setColorSchemeMode,
        accentColor,
        setAccentColor,
        visualMode,
        setVisualMode,
        requestImmersive,
        glassTheme,
        setGlassTheme,
        perfTier,
        resetTheme,
        getThemeClasses,
    } = useTheme();

    const windowStyle = getThemeClasses("dropdown");

    /*
     * BLOQUEAR EL SCROLL DEL DOCUMENTO
     * Y CONSERVAR LOS VALORES ANTERIORES
     */
    useEffect(() => {
        if (!isOpen) return;

        const html = document.documentElement;
        const body = document.body;

        const previousHtmlOverflow = html.style.overflow;
        const previousBodyOverflow = body.style.overflow;
        const previousHtmlOverscroll =
            html.style.overscrollBehavior;
        const previousBodyOverscroll =
            body.style.overscrollBehavior;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";

        html.style.overscrollBehavior = "none";
        body.style.overscrollBehavior = "none";

        return () => {
            html.style.overflow = previousHtmlOverflow;
            body.style.overflow = previousBodyOverflow;

            html.style.overscrollBehavior =
                previousHtmlOverscroll;
            body.style.overscrollBehavior =
                previousBodyOverscroll;
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        p-0
                        sm:p-4
                        lg:p-6
                        overscroll-none
                    "
                    data-lenis-prevent
                >
                    {/* BACKDROP */}
                    <motion.div
                        className="
                            absolute
                            inset-0
                            bg-black/40
                            dark:bg-black/60
                            backdrop-blur-sm
                        "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* MODAL */}
                    <motion.div
                        className={`
                            relative
                            z-10
                            w-full
                            h-[100dvh]
                            sm:h-[calc(100dvh-2rem)]
                            lg:h-[600px]
                            lg:max-h-[calc(100dvh-3rem)]
                            lg:max-w-4xl
                            flex
                            flex-col
                            lg:flex-row
                            overflow-hidden
                            rounded-none
                            sm:rounded-[1.5rem]
                            shadow-2xl
                            ${windowStyle}
                        `}
                        initial={{
                            opacity: 0,
                            scale: 0.97,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.97,
                            y: 10,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        onWheel={(e) => e.stopPropagation()}
                    >
                        {/* ================================================= */}
                        {/* HEADER MOBILE */}
                        {/* ================================================= */}

                        <div
                            className="
                                flex
                                lg:hidden
                                shrink-0
                                flex-col
                                border-b
                                border-black/10
                                dark:border-white/10
                                bg-black/5
                                dark:bg-white/5
                            "
                        >
                            {/* TITULO + CERRAR */}
                            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                    Configuración
                                </h2>

                                <button
                                    onClick={onClose}
                                    className="
                                        p-2
                                        rounded-full
                                        bg-black/5
                                        dark:bg-white/10
                                        hover:bg-black/10
                                        dark:hover:bg-white/20
                                        text-zinc-600
                                        dark:text-zinc-400
                                        hover:text-zinc-900
                                        dark:hover:text-white
                                        transition-colors
                                        cursor-pointer
                                    "
                                    title="Cerrar"
                                >
                                    <X
                                        size={20}
                                        strokeWidth={2.5}
                                    />
                                </button>
                            </div>

                            {/* TABS MOBILE */}
                            <div
                                className="
                                    flex
                                    gap-1
                                    px-4
                                    pb-3
                                    overflow-x-auto
                                    overscroll-contain
                                    [&::-webkit-scrollbar]:hidden
                                    [-ms-overflow-style:none]
                                    [scrollbar-width:none]
                                "
                            >
                                <button
                                    onClick={() =>
                                        setActiveTab("aspecto")
                                    }
                                    className={`
                                        shrink-0
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        px-4
                                        py-2.5
                                        rounded-xl
                                        text-sm
                                        font-medium
                                        transition-all
                                        cursor-pointer
                                        ${
                                        activeTab === "aspecto"
                                            ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                                            : "text-zinc-600 dark:text-zinc-400"
                                    }
                                    `}
                                >
                                    <MonitorSmartphone size={17} />
                                    Aspecto
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveTab("cuenta")
                                    }
                                    className={`
                                        shrink-0
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        px-4
                                        py-2.5
                                        rounded-xl
                                        text-sm
                                        font-medium
                                        transition-all
                                        cursor-pointer
                                        ${
                                        activeTab === "cuenta"
                                            ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                                            : "text-zinc-600 dark:text-zinc-400"
                                    }
                                    `}
                                >
                                    <User size={17} />
                                    Cuenta
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveTab(
                                            "privacidad"
                                        )
                                    }
                                    className={`
                                        shrink-0
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        px-4
                                        py-2.5
                                        rounded-xl
                                        text-sm
                                        font-medium
                                        transition-all
                                        cursor-pointer
                                        ${
                                        activeTab ===
                                        "privacidad"
                                            ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                                            : "text-zinc-600 dark:text-zinc-400"
                                    }
                                    `}
                                >
                                    <Shield size={17} />
                                    Privacidad
                                </button>
                            </div>
                        </div>

                        {/* ================================================= */}
                        {/* SIDEBAR DESKTOP */}
                        {/* ================================================= */}

                        <div
                            className="
                                hidden
                                lg:flex
                                w-64
                                shrink-0
                                bg-black/5
                                dark:bg-white/5
                                border-r
                                border-black/10
                                dark:border-white/10
                                flex-col
                                pt-8
                                pb-6
                                px-4
                            "
                        >
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 px-2">
                                Configuración
                            </h2>

                            <div className="flex flex-col gap-1 flex-1">
                                <button
                                    onClick={() =>
                                        setActiveTab("aspecto")
                                    }
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        px-3
                                        py-2.5
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        transition-colors
                                        cursor-pointer
                                        ${
                                        activeTab ===
                                        "aspecto"
                                            ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
                                    }
                                    `}
                                >
                                    <MonitorSmartphone size={18} />
                                    Aspecto
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveTab("cuenta")
                                    }
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        px-3
                                        py-2.5
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        transition-colors
                                        cursor-pointer
                                        ${
                                        activeTab === "cuenta"
                                            ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
                                    }
                                    `}
                                >
                                    <User size={18} />
                                    Cuenta
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveTab(
                                            "privacidad"
                                        )
                                    }
                                    className={`
                                        flex
                                        items-center
                                        gap-3
                                        px-3
                                        py-2.5
                                        rounded-lg
                                        text-sm
                                        font-medium
                                        transition-colors
                                        cursor-pointer
                                        ${
                                        activeTab ===
                                        "privacidad"
                                            ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
                                    }
                                    `}
                                >
                                    <Shield size={18} />
                                    Privacidad
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="
                                    mt-auto
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    w-full
                                    py-3
                                    rounded-xl
                                    bg-zinc-900
                                    dark:bg-white
                                    text-white
                                    dark:text-zinc-900
                                    text-sm
                                    font-semibold
                                    hover:scale-[1.02]
                                    active:scale-[0.98]
                                    transition-all
                                    shadow-md
                                    cursor-pointer
                                "
                            >
                                <X
                                    size={18}
                                    strokeWidth={2.5}
                                />
                                Cerrar ajustes
                            </button>
                        </div>

                        {/* ================================================= */}
                        {/* CONTENIDO */}
                        {/* ================================================= */}

                        <div
                            data-lenis-prevent
                            className="
                                flex-1
                                min-h-0
                                overflow-y-auto
                                overscroll-contain
                                px-5
                                py-6
                                sm:px-8
                                sm:py-8
                                lg:px-8
                                lg:py-8
                                pr-4
                                sm:pr-6
                                [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:bg-transparent
                                [&::-webkit-scrollbar-thumb]:bg-black/10
                                dark:[&::-webkit-scrollbar-thumb]:bg-white/10
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                hover:[&::-webkit-scrollbar-thumb]:bg-black/20
                                dark:hover:[&::-webkit-scrollbar-thumb]:bg-white/20
                            "
                        >
                            <AnimatePresence mode="wait">

                                {/* ================================================= */}
                                {/* ASPECTO */}
                                {/* ================================================= */}

                                {activeTab === "aspecto" && (
                                    <motion.div
                                        key="aspecto"
                                        initial={{
                                            opacity: 0,
                                            x: 10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: -10,
                                        }}
                                        className="
                                            flex
                                            flex-col
                                            gap-7
                                            w-full
                                            max-w-3xl
                                        "
                                    >
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white mb-6">
                                                Aspecto
                                            </h2>

                                            {/* ======================== */}
                                            {/* APARIENCIA */}
                                            {/* ======================== */}

                                            <div className="
                                                flex
                                                flex-col
                                                md:flex-row
                                                md:items-start
                                                md:justify-between
                                                gap-5
                                                mb-7
                                                pb-7
                                                border-b
                                                border-black/5
                                                dark:border-white/10
                                            ">
                                                <div className="flex flex-col gap-1 md:max-w-sm">
                                                    <span className="font-medium text-zinc-900 dark:text-white">
                                                        Apariencia
                                                    </span>
                                                </div>

                                                <div className="
                                                    flex
                                                    flex-col
                                                    gap-2
                                                    w-full
                                                    md:w-[22rem]
                                                ">
                                                    {colorSchemeOptions.map((option) => {
                                                        const active = colorSchemeMode === option.id;
                                                        return (
                                                            <button
                                                                key={option.id}
                                                                onClick={() => setColorSchemeMode(option.id)}
                                                                className={`
                                                                    flex
                                                                    items-center
                                                                    justify-between
                                                                    w-full
                                                                    px-4
                                                                    py-2.5
                                                                    rounded-xl
                                                                    transition-all
                                                                    border
                                                                    text-left
                                                                    cursor-pointer
                                                                    ${
                                                                    active
                                                                        ? "bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/20 shadow-sm text-zinc-900 dark:text-white"
                                                                        : "border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
                                                                }
                                                                `}
                                                            >
                                                                <span className="text-sm font-medium">
                                                                    {option.name}
                                                                </span>
                                                                {active && <Check size={16} />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* ======================== */}
                                            {/* COLOR DE ACENTO */}
                                            {/* ======================== */}

                                            <div className="
                                                flex
                                                flex-col
                                                md:flex-row
                                                md:items-start
                                                md:justify-between
                                                gap-5
                                                mb-7
                                                pb-7
                                                border-b
                                                border-black/5
                                                dark:border-white/10
                                            ">
                                                <div className="flex flex-col gap-1 md:max-w-sm">
                                                    <span className="font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                                                        <Paintbrush size={16} />
                                                        Color de acento
                                                    </span>
                                                </div>

                                                <div className="flex gap-3 self-start">
                                                    {accentOptions.map(
                                                        (color) => (
                                                            <button
                                                                key={
                                                                    color.id
                                                                }
                                                                onClick={() =>
                                                                    setAccentColor(
                                                                        color.id
                                                                    )
                                                                }
                                                                className={`
                                                                    relative
                                                                    w-9
                                                                    h-9
                                                                    rounded-full
                                                                    ${color.bgClass}
                                                                    transition-all
                                                                    shadow-sm
                                                                    cursor-pointer
                                                                    ${
                                                                    accentColor ===
                                                                    color.id
                                                                        ? "ring-2 ring-offset-2 ring-zinc-900 dark:ring-white dark:ring-offset-zinc-900 scale-110"
                                                                        : "hover:scale-105 opacity-80 hover:opacity-100"
                                                                }
                                                                `}
                                                                title={
                                                                    color.name
                                                                }
                                                            >
                                                                {accentColor ===
                                                                    color.id && (
                                                                        <Check
                                                                            size={
                                                                                15
                                                                            }
                                                                            strokeWidth={
                                                                                3
                                                                            }
                                                                            className="
                                                                            absolute
                                                                            top-1/2
                                                                            left-1/2
                                                                            -translate-x-1/2
                                                                            -translate-y-1/2
                                                                            text-white
                                                                        "
                                                                        />
                                                                    )}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            {/* ======================== */}
                                            {/* TRANSPARENCIA */}
                                            {/* ======================== */}

                                            <div className="
                                                flex
                                                flex-col
                                                md:flex-row
                                                md:items-start
                                                md:justify-between
                                                gap-5
                                                mb-7
                                                pb-7
                                                border-b
                                                border-black/5
                                                dark:border-white/10
                                            ">
                                                <div className="flex flex-col gap-1 md:max-w-sm">
                                                    <span className="font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                                                        <Palette size={16} />
                                                        Transparencia
                                                    </span>

                                                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                                        Nivel de transparencia de la interfaz.
                                                    </span>
                                                </div>

                                                <div className="
                                                    flex
                                                    flex-col
                                                    gap-2
                                                    w-full
                                                    md:w-auto
                                                ">
                                                    {perfTier === "lite" ? (
                                                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/5 dark:border-white/10 text-sm text-zinc-600 dark:text-zinc-400">
                                                            <Check size={15} strokeWidth={3} className="shrink-0 text-zinc-500 dark:text-zinc-500" />
                                                            Sólido
                                                        </div>
                                                    ) : (
                                                        (
                                                            [
                                                                "solid",
                                                                "light",
                                                                "heavy",
                                                            ] as const
                                                        ).map((theme) => (
                                                            <button
                                                                key={theme}
                                                                onClick={() =>
                                                                    setGlassTheme(
                                                                        theme
                                                                    )
                                                                }
                                                                className={`
                                                                flex
                                                                items-center
                                                                justify-between
                                                                gap-3
                                                                w-full
                                                                md:w-auto
                                                                px-4
                                                                py-2.5
                                                                rounded-xl
                                                                transition-all
                                                                border
                                                                text-sm
                                                                cursor-pointer
                                                                text-left
                                                                ${
                                                                    glassTheme ===
                                                                    theme
                                                                        ? "bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/20 shadow-sm text-zinc-900 dark:text-white"
                                                                        : "border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5"
                                                                }
                                                            `}
                                                            >
                                                                <span>
                                                                    {theme === "solid"
                                                                        ? "Sólido"
                                                                        : theme === "light"
                                                                            ? "Ligero"
                                                                            : "Profundo"}
                                                                </span>
                                                                {glassTheme === theme && <Check size={16} />}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>

                                            {/* ======================== */}
                                            {/* MOVIMIENTO */}
                                            {/* ======================== */}

                                            <div className="
                                                flex
                                                flex-col
                                                md:flex-row
                                                md:items-start
                                                md:justify-between
                                                gap-5
                                                mb-7
                                                pb-7
                                                border-b
                                                border-black/5
                                                dark:border-white/10
                                            ">
                                                <div className="flex flex-col gap-1 md:max-w-sm">
                                                    <span className="font-medium text-zinc-900 dark:text-white flex items-center gap-2">
                                                        <Sparkles
                                                            size={16}
                                                        />
                                                        Movimiento
                                                    </span>
                                                </div>

                                                <div className="
                                                    flex
                                                    bg-black/5
                                                    dark:bg-white/5
                                                    p-1
                                                    rounded-xl
                                                    self-start
                                                ">
                                                    <button
                                                        onClick={() =>
                                                            setVisualMode(
                                                                "essential"
                                                            )
                                                        }
                                                        className={`
                                                            px-4
                                                            py-2
                                                            text-sm
                                                            font-medium
                                                            rounded-lg
                                                            transition-all
                                                            cursor-pointer
                                                            ${
                                                            visualMode ===
                                                            "essential"
                                                                ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white"
                                                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                                        }
                                                        `}
                                                    >
                                                        Optimizado
                                                    </button>

                                                    <button
                                                        onClick={requestImmersive}
                                                        className={`
                                                            px-4
                                                            py-2
                                                            text-sm
                                                            font-medium
                                                            rounded-lg
                                                            transition-all
                                                            cursor-pointer
                                                            ${
                                                            visualMode ===
                                                            "immersive"
                                                                ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white"
                                                                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                                        }
                                                        `}
                                                    >
                                                        Todos los efectos
                                                    </button>
                                                </div>
                                            </div>

                                            {/* ======================== */}
                                            {/* RESET */}
                                            {/* ======================== */}

                                            <button
                                                onClick={resetTheme}
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    text-red-600
                                                    dark:text-red-400
                                                    hover:underline
                                                    cursor-pointer
                                                    py-2
                                                "
                                            >
                                                <RotateCcw size={14} />
                                                Restaurar valores por defecto
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ================================================= */}
                                {/* CUENTA */}
                                {/* ================================================= */}

                                {activeTab === "cuenta" && (
                                    <motion.div
                                        key="cuenta"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="
                                            flex
                                            flex-col
                                            gap-3
                                            max-w-3xl
                                        "
                                    >
                                        <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">
                                            Cuenta
                                        </h2>
                                    </motion.div>
                                )}

                                {/* ================================================= */}
                                {/* PRIVACIDAD */}
                                {/* ================================================= */}

                                {activeTab ===
                                    "privacidad" && (
                                        <motion.div
                                            key="privacidad"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="
                                            flex
                                            flex-col
                                            gap-3
                                            max-w-3xl
                                        "
                                        >
                                            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-white">
                                                Privacidad
                                            </h2>
                                        </motion.div>
                                    )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}