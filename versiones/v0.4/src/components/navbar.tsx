import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-white select-none">
          ReCiclo
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-300">
          <Link to="/" className="hover:text-emerald-400 transition-colors">
            Inicio
          </Link>
          <Link to="/escanear" className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors">
            Escanear
          </Link>
        </nav>
      </div>
    </header>
  );
}
