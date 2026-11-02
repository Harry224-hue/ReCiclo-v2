import React, { createContext, useContext, useState, useEffect } from "react";
import { useAdaptivePerformance, type PerfTier, type PerfSource } from "../hooks/useAdaptivePerformance";

export type GlassTheme = "solid" | "light" | "heavy";
export type VisualMode = "essential" | "immersive";
export type AccentColor = "obsidian" | "emerald" | "blue" | "purple" | "rose" | "amber" | "custom";
export type ColorSchemeMode = "light" | "dark" | "system" | "schedule";
type UIElement = "navbar" | "dropdown" | "dock";

export interface AccentTokens {
    id: AccentColor;
    name: string;
    text: string;
    btn: string;
    btnOutline: string;
    badge: string;
    ring: string;
    border: string;
    glow: string;
    gradient: string;
    hex: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export function createCustomTokens(hex: string): AccentTokens {
    return {
        id: "custom",
        name: "Personalizado",
        text: "text-[var(--accent-color)]",
        btn: "app-btn-primary",
        btnOutline: "app-btn-secondary",
        badge: "app-badge-accent",
        ring: "focus-visible:ring-[var(--accent-color)]",
        border: "border-[var(--accent-color)]",
        glow: "bg-[var(--accent-color)]/15",
        gradient: "from-[var(--accent-color)] to-zinc-800 dark:from-[var(--accent-color)] dark:to-zinc-200",
        hex: hex,
    };
}

// eslint-disable-next-line react-refresh/only-export-components
export const ACCENT_TOKENS: Record<AccentColor, AccentTokens> = {
    obsidian: {
        id: "obsidian",
        name: "Obsidiana",
        text: "text-zinc-900 dark:text-zinc-100",
        btn: "app-btn-primary",
        btnOutline: "app-btn-secondary",
        badge: "app-badge-accent",
        ring: "focus-visible:ring-zinc-900 dark:focus-visible:ring-white",
        border: "border-zinc-900 dark:border-white",
        glow: "bg-zinc-500/10 dark:bg-white/10",
        gradient: "from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400",
        hex: "#27272a",
    },
    emerald: {
        id: "emerald",
        name: "Salvia Mineral",
        text: "text-teal-700 dark:text-teal-300",
        btn: "app-btn-primary",
        btnOutline: "app-btn-secondary",
        badge: "app-badge-accent",
        ring: "focus-visible:ring-teal-600",
        border: "border-teal-600",
        glow: "bg-teal-500/15 dark:bg-teal-500/20",
        gradient: "from-teal-600 to-emerald-700 dark:from-teal-400 dark:to-emerald-300",
        hex: "#0d9488",
    },
    blue: {
        id: "blue",
        name: "Zafiro",
        text: "text-sky-600 dark:text-sky-400",
        btn: "app-btn-primary",
        btnOutline: "app-btn-secondary",
        badge: "app-badge-accent",
        ring: "focus-visible:ring-sky-500",
        border: "border-sky-500",
        glow: "bg-sky-500/15 dark:bg-sky-500/20",
        gradient: "from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-300",
        hex: "#0284c7",
    },
    amber: {
        id: "amber",
        name: "Ámbar Tierra",
        text: "text-amber-600 dark:text-amber-400",
        btn: "app-btn-primary",
        btnOutline: "app-btn-secondary",
        badge: "app-badge-accent",
        ring: "focus-visible:ring-amber-500",
        border: "border-amber-500",
        glow: "bg-amber-500/15 dark:bg-amber-500/20",
        gradient: "from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-300",
        hex: "#d97706",
    },
    purple: {
        id: "purple",
        name: "Amatista",
        text: "text-purple-600 dark:text-purple-400",
        btn: "app-btn-primary",
        btnOutline: "app-btn-secondary",
        badge: "app-badge-accent",
        ring: "focus-visible:ring-purple-500",
        border: "border-purple-500",
        glow: "bg-purple-500/15 dark:bg-purple-500/20",
        gradient: "from-purple-500 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-300",
        hex: "#7c3aed",
    },
    rose: {
        id: "rose",
        name: "Coral",
        text: "text-rose-600 dark:text-rose-400",
        btn: "app-btn-primary",
        btnOutline: "app-btn-secondary",
        badge: "app-badge-accent",
        ring: "focus-visible:ring-rose-500",
        border: "border-rose-500",
        glow: "bg-rose-500/15 dark:bg-rose-500/20",
        gradient: "from-rose-500 to-pink-600 dark:from-rose-400 dark:to-pink-300",
        hex: "#e11d48",
    },
    custom: createCustomTokens("#0284c7"),
};

// Franja fija por simplicidad
const NIGHT_START_HOUR = 19; // 7:00 p.m.
const DAY_START_HOUR = 7; // 7:00 a.m.

function isNightHour(): boolean {
    const hour = new Date().getHours();
    return hour >= NIGHT_START_HOUR || hour < DAY_START_HOUR;
}

const DEFAULT_NOTCH_SHORTCUTS: string[] = ["scan", "map", "tech", "theme", "settings"];

import { CLOUDINARY_HERO_BASE } from "../constants/hero-videos";

interface ThemeContextType {
    glassTheme: GlassTheme;
    setGlassTheme: (theme: GlassTheme) => void;
    visualMode: VisualMode;
    setVisualMode: (mode: VisualMode) => void;
    requestImmersive: () => void;
    pendingPerfWarning: boolean;
    confirmImmersive: () => void;
    cancelPerfWarning: () => void;
    perfTier: PerfTier;
    perfSource: PerfSource;
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
    customHex: string;
    setCustomHex: (hex: string) => void;
    notchShortcuts: string[];
    setNotchShortcuts: (shortcuts: string[]) => void;
    accent: AccentTokens;
    getThemeClasses: (element?: UIElement) => string;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    colorSchemeMode: ColorSchemeMode;
    setColorSchemeMode: (mode: ColorSchemeMode) => void;
    heroVideo: string;
    setHeroVideo: (src: string) => void;
    resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {

    // Liquid glass activo por defecto en la página (el menú desplegable se mantiene sólido)
    const [glassTheme, setGlassTheme] = useState<GlassTheme>(() => {
        const restoredV2 = localStorage.getItem("reciclo_liquid_glass_restored_v2");
        if (!restoredV2) {
            localStorage.setItem("reciclo_liquid_glass_restored_v2", "true");
            localStorage.setItem("glassTheme", "heavy");
            return "heavy";
        }
        const stored = localStorage.getItem("glassTheme");
        if (stored === "solid" || stored === "light" || stored === "heavy") {
            return stored;
        }
        return "heavy";
    });

    const [accentColor, setAccentColor] = useState<AccentColor>(() => {
        const migratedAccent = localStorage.getItem("reciclo_accent_v2_editorial");
        if (!migratedAccent) {
            localStorage.setItem("reciclo_accent_v2_editorial", "true");
            const current = localStorage.getItem("accentColor");
            if (!current || current === "emerald") {
                localStorage.setItem("accentColor", "obsidian");
                return "obsidian";
            }
        }
        return (localStorage.getItem("accentColor") as AccentColor) || "obsidian";
    });

    const [customHex, setCustomHexState] = useState<string>(() => {
        return localStorage.getItem("reciclo_custom_hex") || "#0284c7";
    });

    const setCustomHex = (hex: string) => {
        setCustomHexState(hex);
        localStorage.setItem("reciclo_custom_hex", hex);
        setAccentColor("custom");
    };

    const [notchShortcuts, setNotchShortcutsState] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem("reciclo_notch_shortcuts");
            const migratedTech = localStorage.getItem("reciclo_notch_tech_migrated_v1");
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    if (!migratedTech) {
                        localStorage.setItem("reciclo_notch_tech_migrated_v1", "true");
                        if (!parsed.includes("tech")) {
                            parsed.push("tech");
                            localStorage.setItem("reciclo_notch_shortcuts", JSON.stringify(parsed));
                        }
                    }
                    return parsed as string[];
                }
            }
            localStorage.setItem("reciclo_notch_tech_migrated_v1", "true");
        } catch {
            // localStorage o JSON no disponibles: se usan los accesos por defecto.
            return DEFAULT_NOTCH_SHORTCUTS;
        }
        return DEFAULT_NOTCH_SHORTCUTS;
    });

    const setNotchShortcuts = (shortcuts: string[]) => {
        setNotchShortcutsState(shortcuts);
        localStorage.setItem("reciclo_notch_shortcuts", JSON.stringify(shortcuts));
    };

    const activeAccent: AccentTokens =
        accentColor === "custom"
            ? createCustomTokens(customHex)
            : ACCENT_TOKENS[accentColor] || ACCENT_TOKENS.obsidian;

    // Inyectar variables CSS globales en :root para reactividad instantánea
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--accent-color", activeAccent.hex);
        root.style.setProperty("--accent-glow", `${activeAccent.hex}33`);
    }, [activeAccent]);

    const [colorSchemeMode, setColorSchemeMode] = useState<ColorSchemeMode>(() => {
        const saved = localStorage.getItem("colorSchemeMode");
        if (saved === "light" || saved === "dark" || saved === "system" || saved === "schedule") {
            return saved;
        }
        // Migración desde la versión anterior (solo claro/oscuro manual, sin modos
        // automáticos): si la persona ya había elegido explícitamente, se respeta
        // como preferencia manual en vez de reiniciarla en "system".
        const legacy = localStorage.getItem("isDarkMode");
        if (legacy !== null) {
            return legacy === "true" ? "dark" : "light";
        }
        return "system";
    });

    // El motor mide fotogramas reales y decide "full" o "lite"; si la persona ya eligió
    // a mano (fuera de esta sesión, incluso), esa elección se respeta y se recuerda.
    // Un único hook, una única medición: no se vuelve a llamar en ningún otro componente.
    const { tier: perfTier, source: perfSource, setTier: setPerfTier, clearOverride: clearPerfOverride } = useAdaptivePerformance();

    // visualMode ya no es un estado propio: se deriva del motor. "essential" y "immersive"
    // siguen existiendo para no romper a Hero ni a SettingsModal, que ya hablan en esos términos.
    const visualMode: VisualMode = perfTier === "lite" ? "essential" : "immersive";
    const setVisualMode = (mode: VisualMode) => {
        // Elegir a mano desde Configuración es exactamente lo que hace "user" al motor:
        // gana sobre la medición automática y se recuerda entre visitas.
        setPerfTier(mode === "essential" ? "lite" : "full");
    };

    // Pedir "todos los efectos" desde un equipo que el motor ya clasificó como "lite"
    // no lo activa directo: primero se avisa, porque quien lo pide puede no saber que
    // su equipo ya viene ajustado por rendimiento. Bajar a "essential" nunca necesita
    // aviso, así que ese camino sigue usando setVisualMode directamente.
    const [pendingPerfWarning, setPendingPerfWarning] = useState(false);

    const requestImmersive = () => {
        if (perfTier === "lite") {
            setPendingPerfWarning(true);
            return;
        }
        setVisualMode("immersive");
    };

    const confirmImmersive = () => {
        setPendingPerfWarning(false);
        setVisualMode("immersive");
    };

    const cancelPerfWarning = () => setPendingPerfWarning(false);

    const [heroVideo, setHeroVideo] = useState<string>(() => {
        const saved = localStorage.getItem("heroVideo");
        if (saved && !saved.startsWith("/video-hero")) {
            return saved;
        }
        return `${CLOUDINARY_HERO_BASE}/video-hero.mp4`;
    });

    useEffect(() => {
        localStorage.setItem("heroVideo", heroVideo);
    }, [heroVideo]);

    useEffect(() => {
        localStorage.setItem("glassTheme", glassTheme);
    }, [glassTheme]);

    useEffect(() => {
        localStorage.setItem("accentColor", accentColor);
    }, [accentColor]);

    useEffect(() => {
        localStorage.setItem("colorSchemeMode", colorSchemeMode);
    }, [colorSchemeMode]);

    // "Sistema": escucha el media query y se actualiza sola si la persona cambia el
    // tema de su sistema operativo mientras el sitio sigue abierto, sin recargar.
    const [systemPrefersDark, setSystemPrefersDark] = useState(
        () => window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    // "Horario": se revisa cada minuto y también al volver a la pestaña, para no
    // quedarse con un valor viejo si el sitio estuvo en segundo plano cuando cambió
    // la franja. Solo corre mientras ese modo está activo.
    const [scheduledDark, setScheduledDark] = useState(isNightHour);
    useEffect(() => {
        if (colorSchemeMode !== "schedule") return;
        const update = () => setScheduledDark(isNightHour());
        update();
        const id = setInterval(update, 60 * 1000);
        document.addEventListener("visibilitychange", update);
        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", update);
        };
    }, [colorSchemeMode]);

    // isDarkMode ya no se guarda: es siempre el resultado de aplicar el modo elegido,
    // así que nunca puede quedar desincronizado de "system" o "schedule".
    const isDarkMode =
        colorSchemeMode === "dark"
            ? true
            : colorSchemeMode === "light"
                ? false
                : colorSchemeMode === "system"
                    ? systemPrefersDark
                    : scheduledDark;

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    // El interruptor rápido del menú (y de Configuración) siempre pasa a manual:
    // tocarlo es una elección explícita y le gana a cualquier modo automático activo,
    // igual que elegir "user" le gana al motor de rendimiento en perfTier.
    const toggleDarkMode = () => setColorSchemeMode(isDarkMode ? "light" : "dark");

    // Restablecer valores por defecto también significa devolverle la decisión al motor
    // de rendimiento y al sistema operativo, en vez de forzar una elección fija.
    const resetTheme = () => {
        setGlassTheme("heavy");
        setAccentColor("obsidian");
        setColorSchemeMode("system");
        setHeroVideo(`${CLOUDINARY_HERO_BASE}/video-hero.mp4`);
        setNotchShortcuts(DEFAULT_NOTCH_SHORTCUTS);
        clearPerfOverride();
    };

    const getThemeClasses = (element: UIElement = "navbar") => {
        const baseTransition = visualMode === "immersive" ? "transition-all duration-500 ease-out" : "transition-none";

        // El recorte visual real de "lite" pasa por aquí: si el motor decidió "lite", el cristal
        // se limita a "solid" sin importar qué haya elegido la persona en glassTheme. Su elección
        // no se pierde (glassTheme no cambia), solo deja de aplicarse mientras el equipo lo necesite.
        const effectiveGlass: GlassTheme = perfTier === "lite" ? "solid" : glassTheme;

        if (element === "dropdown") {
            switch (effectiveGlass) {
                case "solid":
                    return `${baseTransition} bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl backdrop-blur-none text-zinc-900 dark:text-zinc-100`;
                case "light":
                    return `${baseTransition} bg-white/95 dark:bg-zinc-900/90 backdrop-blur-xl saturate-[160%] border border-zinc-200/90 dark:border-zinc-800 shadow-2xl text-zinc-900 dark:text-zinc-100`;
                case "heavy":
                    return `${baseTransition} bg-white/90 dark:bg-zinc-900/85 backdrop-blur-2xl saturate-[180%] border border-zinc-200/90 dark:border-zinc-800/90 text-zinc-900 dark:text-zinc-100 shadow-2xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.12)] dark:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.12),0_25px_50px_rgba(0,0,0,0.6)]`;
            }
        }

        if (element === "dock") {
            switch (effectiveGlass) {
                case "solid":
                    return `${baseTransition} bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-none`;
                case "light":
                    return `${baseTransition} bg-white/85 dark:bg-zinc-900/85 backdrop-blur-lg saturate-[150%] border border-black/5 dark:border-white/10 shadow-lg`;
                case "heavy":
                    return `${baseTransition} bg-white/75 dark:bg-zinc-900/70 backdrop-blur-2xl saturate-[180%] border border-black/10 dark:border-white/15 shadow-xl [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.8),0_12px_32px_rgba(0,0,0,0.12)] dark:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.15),0_16px_40px_rgba(0,0,0,0.55)]`;
            }
        }

        switch (effectiveGlass) {
            case "solid":
                return `${baseTransition} bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md backdrop-blur-none`;
            case "light":
                return `${baseTransition} bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl saturate-[150%] border border-white/60 dark:border-zinc-700/50 shadow-sm`;
            case "heavy":
                return `${baseTransition} bg-white/80 dark:bg-zinc-900/75 backdrop-blur-2xl saturate-[180%] border border-white/40 dark:border-zinc-700/30 shadow-md [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.06)] dark:[box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.12),0_12px_28px_rgba(0,0,0,0.4)]`;
        }
    };

    return (
        <ThemeContext.Provider value={{
            glassTheme, setGlassTheme,
            visualMode, setVisualMode,
            requestImmersive, pendingPerfWarning, confirmImmersive, cancelPerfWarning,
            perfTier, perfSource,
            accentColor, setAccentColor,
            customHex, setCustomHex,
            notchShortcuts, setNotchShortcuts,
            accent: activeAccent,
            getThemeClasses, isDarkMode, toggleDarkMode,
            colorSchemeMode, setColorSchemeMode,
            heroVideo, setHeroVideo,
            resetTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme debe usarse dentro de un ThemeProvider");
    return context;
}