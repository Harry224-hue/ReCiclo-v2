import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export interface AuthSuccessOverlayProps {
    show: boolean;
    title?: string;
    subtitle?: string;
    state?: "verifying" | "success" | "error";
    onComplete?: () => void;
    durationMs?: number;
}

const ACCENT_GLOWS = {
    emerald: {
        primary: "#10b981",
        light: "#34d399",
        neon: "#a7f3d0",
        core: "#059669",
        ambientLeft: "rgba(16, 185, 129, 0.16)",
        ambientRight: "rgba(20, 184, 166, 0.12)",
        circleColor: "rgba(52, 211, 153, 0.6)",
        shieldShadow: "drop-shadow(0 0 16px rgba(52, 211, 153, 0.85)) drop-shadow(0 0 32px rgba(16, 185, 129, 0.4))",
        dotColor: "bg-emerald-400",
    },
    blue: {
        primary: "#0284c7",
        light: "#38bdf8",
        neon: "#bae6fd",
        core: "#0369a1",
        ambientLeft: "rgba(14, 165, 233, 0.16)",
        ambientRight: "rgba(99, 102, 241, 0.12)",
        circleColor: "rgba(56, 189, 248, 0.6)",
        shieldShadow: "drop-shadow(0 0 16px rgba(56, 189, 248, 0.85)) drop-shadow(0 0 32px rgba(14, 165, 233, 0.4))",
        dotColor: "bg-cyan-400",
    },
    purple: {
        primary: "#9333ea",
        light: "#c084fc",
        neon: "#f3e8ff",
        core: "#7e22ce",
        ambientLeft: "rgba(147, 51, 234, 0.16)",
        ambientRight: "rgba(217, 70, 239, 0.12)",
        circleColor: "rgba(192, 132, 252, 0.6)",
        shieldShadow: "drop-shadow(0 0 16px rgba(192, 132, 252, 0.85)) drop-shadow(0 0 32px rgba(147, 51, 234, 0.4))",
        dotColor: "bg-purple-400",
    },
    rose: {
        primary: "#e11d48",
        light: "#fb7185",
        neon: "#ffe4e6",
        core: "#be123c",
        ambientLeft: "rgba(225, 29, 72, 0.16)",
        ambientRight: "rgba(236, 72, 153, 0.12)",
        circleColor: "rgba(251, 113, 133, 0.6)",
        shieldShadow: "drop-shadow(0 0 16px rgba(251, 113, 133, 0.85)) drop-shadow(0 0 32px rgba(225, 29, 72, 0.4))",
        dotColor: "bg-rose-400",
    },
    amber: {
        primary: "#d97706",
        light: "#f59e0b",
        neon: "#fef3c7",
        core: "#b45309",
        ambientLeft: "rgba(217, 119, 6, 0.16)",
        ambientRight: "rgba(245, 158, 11, 0.12)",
        circleColor: "rgba(245, 158, 11, 0.6)",
        shieldShadow: "drop-shadow(0 0 16px rgba(245, 158, 11, 0.85)) drop-shadow(0 0 32px rgba(217, 119, 6, 0.4))",
        dotColor: "bg-amber-400",
    },
};

export function AuthSuccessOverlay({
    show,
    title = "Acceso seguro verificado",
    subtitle = "Conexión cifrada • Entrando a ReCiclo...",
    state = "success",
    onComplete,
    durationMs = 1500,
}: AuthSuccessOverlayProps) {
    const { accentColor } = useTheme();
    const themeGlow = ACCENT_GLOWS[accentColor as keyof typeof ACCENT_GLOWS] ?? ACCENT_GLOWS.blue;

    useEffect(() => {
        if (!show || state !== "success") return;
        const timer = setTimeout(() => {
            onComplete?.();
        }, durationMs);

        return () => clearTimeout(timer);
    }, [show, state, durationMs, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm overflow-hidden select-none pointer-events-auto"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {/* Auras ambientales suaves */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div
                            className="absolute top-1/4 -left-28 w-[460px] md:w-[600px] h-[460px] md:h-[600px] rounded-full blur-[140px]"
                            style={{ backgroundColor: themeGlow.ambientLeft }}
                        />
                        <div
                            className="absolute top-1/3 -right-28 w-[460px] md:w-[600px] h-[460px] md:h-[600px] rounded-full blur-[140px]"
                            style={{ backgroundColor: themeGlow.ambientRight }}
                        />
                    </div>

                    {/* Contenedor central del escudo y círculos fluidos continuos */}
                    <div className="relative flex flex-col items-center justify-center z-10 w-full max-w-md px-6">
                        
                        {/* Escenario central donde los círculos y el escudo comparten el centro exacto */}
                        <div className="relative w-44 h-48 flex items-center justify-center">
                            
                            {/* ─── CÍRCULOS FLUIDOS CON DILUCIÓN CONTINUA SIN PARPADEO DE BORDE ─── */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {[0, 1, 2, 3].map((idx) => (
                                    <motion.div
                                        key={`smooth-ripple-${idx}`}
                                        className="absolute rounded-full pointer-events-none"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            boxShadow: `0 0 20px ${themeGlow.primary}20, inset 0 0 15px ${themeGlow.primary}15`,
                                            background: `radial-gradient(circle, transparent 58%, ${themeGlow.circleColor} 70%, transparent 74%)`,
                                        }}
                                        initial={{ scale: 0.6, opacity: 0 }}
                                        animate={{
                                            scale: [0.6, 1.4, 2.3, 3.2],
                                            opacity: [0, 0.45, 0.25, 0],
                                        }}
                                        transition={{
                                            duration: 2.8,
                                            repeat: Infinity,
                                            delay: idx * 0.7,
                                            ease: "easeInOut",
                                            times: [0, 0.35, 0.7, 1], // Entrada y salida totalmente en 0 para evitar parpadeos
                                        }}
                                    />
                                ))}

                                {/* Halo central de luz suave y continua */}
                                <motion.div
                                    animate={{
                                        scale: [0.95, 1.15, 0.95],
                                        opacity: [0.25, 0.45, 0.25],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute w-44 h-44 rounded-full pointer-events-none blur-2xl"
                                    style={{
                                        background: `radial-gradient(circle, ${themeGlow.light}40 0%, ${themeGlow.primary}20 50%, transparent 75%)`,
                                    }}
                                />
                            </div>

                            {/* ─── EL ESCUDO ORIGINAL ELEGANTE CON LUMINOSIDAD ─── */}
                            <motion.div
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={
                                    state === "error"
                                        ? { scale: [1, 1.05, 0.95, 1], x: [0, -8, 8, -6, 6, 0] }
                                        : { scale: 1, opacity: 1 }
                                }
                                transition={{
                                    type: "spring",
                                    stiffness: 380,
                                    damping: 24,
                                    mass: 0.8,
                                }}
                                className="relative w-full h-full flex items-center justify-center z-10"
                                style={{ filter: themeGlow.shieldShadow }}
                            >
                                <svg
                                    viewBox="0 0 140 140"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full h-full"
                                >
                                    <defs>
                                        <linearGradient
                                            id="shieldGradLeft"
                                            x1="20"
                                            y1="24"
                                            x2="60"
                                            y2="118"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor="#ffffff" stopOpacity="0.95" />
                                            <stop offset="0.45" stopColor={themeGlow.light} />
                                            <stop offset="1" stopColor={themeGlow.primary} />
                                        </linearGradient>

                                        <linearGradient
                                            id="shieldGradRight"
                                            x1="120"
                                            y1="24"
                                            x2="80"
                                            y2="118"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor="#ffffff" stopOpacity="0.95" />
                                            <stop offset="0.45" stopColor={themeGlow.light} />
                                            <stop offset="1" stopColor={themeGlow.primary} />
                                        </linearGradient>

                                        <linearGradient
                                            id="coreGrad"
                                            x1="70"
                                            y1="57"
                                            x2="70"
                                            y2="83"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stopColor={themeGlow.light} />
                                            <stop offset="1" stopColor={themeGlow.core} />
                                        </linearGradient>
                                    </defs>

                                    {/* Arco izquierdo del escudo original */}
                                    <motion.path
                                        initial={{ x: -14, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 380, damping: 24, delay: 0.05 }}
                                        d="M 58 24 L 26 38 C 14 74 26 104 58 118"
                                        stroke="url(#shieldGradLeft)"
                                        strokeWidth="6.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    {/* Arco derecho del escudo original */}
                                    <motion.path
                                        initial={{ x: 14, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 380, damping: 24, delay: 0.05 }}
                                        d="M 82 24 L 114 38 C 126 74 114 104 82 118"
                                        stroke="url(#shieldGradRight)"
                                        strokeWidth="6.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    {/* Píldora central vertical luminosa */}
                                    <motion.rect
                                        initial={{ scaleY: 0, opacity: 0 }}
                                        animate={{ scaleY: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.16 }}
                                        x="65"
                                        y="57"
                                        width="10"
                                        height="26"
                                        rx="5"
                                        fill="url(#coreGrad)"
                                        style={{ transformOrigin: "center" }}
                                    />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Textos de confirmación */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.35 }}
                            className="mt-6 text-center space-y-1.5 pointer-events-none w-full"
                        >
                            <h2 className="text-lg md:text-xl font-bold tracking-tight text-white drop-shadow-md text-center">
                                {title}
                            </h2>

                            <div className="text-xs md:text-sm text-zinc-300 flex items-center justify-center gap-2 text-center">
                                <span
                                    className={`inline-block w-2 h-2 rounded-full ${
                                        state === "error" ? "bg-red-400" : themeGlow.dotColor
                                    } animate-pulse shrink-0`}
                                />
                                <span className="font-medium tracking-wide drop-shadow-sm">{subtitle}</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
