import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function Navbar() {
  const { isDarkMode, toggleDarkMode, accentColor, setAccentColor } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/95 dark:bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-white select-none">
          ReCiclo
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900 p-1 rounded-full border border-zinc-800">
            {(["emerald", "blue", "purple", "rose"] as const).map(color => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-4 h-4 rounded-full transition-transform ${
                  color === "emerald" ? "bg-emerald-400" :
                  color === "blue" ? "bg-blue-400" :
                  color === "purple" ? "bg-purple-400" : "bg-rose-400"
                } ${accentColor === color ? "scale-125 ring-2 ring-white" : "opacity-60 hover:opacity-100"}`}
                title={`Acento ${color}`}
              />
            ))}
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            title="Alternar modo claro / oscuro"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link to="/escanear" className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-colors">
            Escanear
          </Link>
        </div>
      </div>
    </header>
  );
}
