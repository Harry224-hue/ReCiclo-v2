import React, { createContext, useContext, useState, useEffect } from "react";

export type GlassTheme = "solid" | "light" | "heavy";
export type VisualMode = "essential" | "immersive";
export type AccentColor = "emerald" | "blue" | "purple" | "rose";
export type ColorSchemeMode = "light" | "dark";
type UIElement = "navbar" | "dropdown" | "dock";

interface ThemeContextType {
  glassTheme: GlassTheme;
  setGlassTheme: (theme: GlassTheme) => void;
  visualMode: VisualMode;
  setVisualMode: (mode: VisualMode) => void;
  requestImmersive: () => void;
  pendingPerfWarning: boolean;
  confirmImmersive: () => void;
  cancelPerfWarning: () => void;
  perfTier: "full" | "lite";
  perfSource: "auto" | "user";
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  getThemeClasses: (element?: UIElement) => string;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colorSchemeMode: ColorSchemeMode;
  setColorSchemeMode: (mode: ColorSchemeMode) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (localStorage.getItem("accentColor") as AccentColor) || "emerald";
  });
  const [colorSchemeMode, setColorSchemeMode] = useState<ColorSchemeMode>(() => {
    return (localStorage.getItem("colorSchemeMode") as ColorSchemeMode) || "dark";
  });
  const [glassTheme, setGlassTheme] = useState<GlassTheme>("light");
  const [visualMode, setVisualMode] = useState<VisualMode>("immersive");

  useEffect(() => {
    localStorage.setItem("accentColor", accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem("colorSchemeMode", colorSchemeMode);
    const root = document.documentElement;
    if (colorSchemeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [colorSchemeMode]);

  const toggleDarkMode = () => {
    setColorSchemeMode(prev => (prev === "dark" ? "light" : "dark"));
  };

  const getThemeClasses = (element: UIElement = "navbar") => {
    if (element === "navbar") {
      return colorSchemeMode === "dark" ? "bg-zinc-950/90 border-zinc-800 text-white" : "bg-white/90 border-zinc-200 text-zinc-900";
    }
    return colorSchemeMode === "dark" ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-900";
  };

  const resetTheme = () => {
    setAccentColor("emerald");
    setColorSchemeMode("dark");
  };

  return (
    <ThemeContext.Provider
      value={{
        glassTheme,
        setGlassTheme,
        visualMode,
        setVisualMode,
        requestImmersive: () => {},
        pendingPerfWarning: false,
        confirmImmersive: () => {},
        cancelPerfWarning: () => {},
        perfTier: "full",
        perfSource: "auto",
        accentColor,
        setAccentColor,
        getThemeClasses,
        isDarkMode: colorSchemeMode === "dark",
        toggleDarkMode,
        colorSchemeMode,
        setColorSchemeMode,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
