import React, { createContext, useContext } from "react";
interface ThemeContextType {
  getThemeClasses: (el?: string) => string;
  accentColor: "emerald";
}
const ThemeContext = createContext<ThemeContextType>({
  getThemeClasses: () => "bg-zinc-900 border border-zinc-800 text-white",
  accentColor: "emerald"
});
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={{ getThemeClasses: () => "bg-zinc-900/90 border border-zinc-800 text-white", accentColor: "emerald" }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
