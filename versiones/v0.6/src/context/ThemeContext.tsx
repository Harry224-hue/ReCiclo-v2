import React, { createContext, useContext, useState, useEffect } from "react";
import { useAdaptivePerformance, type PerfTier, type PerfSource } from "../hooks/useAdaptivePerformance";

export type GlassTheme = "solid" | "light" | "heavy";
export type VisualMode = "essential" | "immersive";
export type AccentColor = "emerald" | "blue" | "purple" | "rose";
export type ColorSchemeMode = "light" | "dark" | "system" | "schedule";
type UIElement = "navbar" | "dropdown" | "dock";

// Franja fija por simplicidad: no depende de ubicación ni de la época del año (el
// amanecer/atardecer real varía). Si más adelante se quiere ajustar por ubicación,
// esto es lo que habría que reemplazar por un cálculo de salida/puesta de sol.
const NIGHT_START_HOUR = 19; // 7:00 p.m.
const DAY_START_HOUR = 7; // 7:00 a.m.

function isNightHour(): boolean {
    const hour = new Date().getHours();
    return hour >= NIGHT_START_HOUR || hour < DAY_START_HOUR;
}

interface ThemeContextType {
    glassTheme: GlassTheme;
    setGlassTheme: (theme: GlassTheme) => void;
    visualMode: VisualMode;
    setVisualMode: (mode: VisualMode) => void;
    // Pedir "todos los efectos" en un equipo que el motor clasificó como "lite" no lo
    // activa directo: primero pregunta. Ver pendingPerfWarning / confirmImmersive.
    requestImmersive: () => void;
    pendingPerfWarning: boolean;
    confirmImmersive: () => void;
    cancelPerfWarning: () => void;
    // Quién decidió el visualMode actual: el motor de rendimiento ("auto") o la persona
    // desde Configuración ("user"). LiteModeBadge lo usa para saber cuándo explicarse.
    perfTier: PerfTier;
    perfSource: PerfSource;
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
    getThemeClasses: (element?: UIElement) => string;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    // "light"/"dark" fijan el tema; "system" sigue al sistema operativo en vivo;
    // "schedule" cambia solo según la hora (ver isNightHour). isDarkMode ya refleja
    // el resultado de cualquiera de los cuatro, así que el resto de la app no necesita
    // saber cuál está activo para pintarse correctamente.
    colorSchemeMode: ColorSchemeMode;
    setColorSchemeMode: (mode: ColorSchemeMode) => void;
    resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {

    // Igual que antes: se inicializa leyendo de localStorage
    const [glassTheme, setGlassTheme] = useState<GlassTheme>(() => {
        return (localStorage.getItem("glassTheme") as GlassTheme) || "heavy";
    });

    const [accentColor, setAccentColor] = useState<AccentColor>(() => {
        return (localStorage.getItem("accentColor") as AccentColor) || "emerald";
    });

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
        setAccentColor("emerald");
        setColorSchemeMode("system");
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
                    return `${baseTransition} bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl saturate-[150%] border border-black/5 dark:border-white/10 shadow-2xl text-zinc-900 dark:text-zinc-100`;
                case "heavy":
                    // El piso de opacidad en modo claro se subió de /65 a /80: con 65% se transparentaba
                    // demasiado y el texto oscuro perdía contraste contra lo que hubiera detrás (fondo
                    // oscuro del Hero, backdrop del modal). En modo oscuro no se tocó porque no se reportó
                    // el problema ahí.
                    return `${baseTransition} bg-white/80 dark:bg-zinc-900/65 backdrop-blur-2xl saturate-[200%] border border-black/10 dark:border-white/20 shadow-2xl text-zinc-900 dark:text-zinc-100`;
            }
        }

        if (element === "dock") {
            switch (effectiveGlass) {
                case "solid":
                    return `${baseTransition} bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-none`;
                case "light":
                    return `${baseTransition} bg-white/85 dark:bg-zinc-900/85 backdrop-blur-lg saturate-[150%] border border-black/5 dark:border-white/10 shadow-lg`;
                case "heavy":
                    return `${baseTransition} bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl saturate-[180%] border border-black/10 dark:border-white/20 shadow-lg`;
            }
        }

        switch (effectiveGlass) {
            case "solid":
                return `${baseTransition} bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-md backdrop-blur-none`;
            case "light":
                return `${baseTransition} bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl saturate-[150%] border border-white/60 dark:border-zinc-700/50 shadow-sm`;
            case "heavy":
                return `${baseTransition} bg-white/80 dark:bg-zinc-900/70 backdrop-blur-2xl saturate-[180%] border border-white/40 dark:border-zinc-700/30 shadow-sm`;
        }
    };

    return (
        <ThemeContext.Provider value={{
            glassTheme, setGlassTheme,
            visualMode, setVisualMode,
            requestImmersive, pendingPerfWarning, confirmImmersive, cancelPerfWarning,
            perfTier, perfSource,
            accentColor, setAccentColor,
            getThemeClasses, isDarkMode, toggleDarkMode,
            colorSchemeMode, setColorSchemeMode,
            resetTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme debe usarse dentro de un ThemeProvider");
    return context;
}