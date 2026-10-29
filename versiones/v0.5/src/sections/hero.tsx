import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] w-full px-6 py-24 overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-500">
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-zinc-800 mb-6">
          Versión 0.4 • Escáner Activo
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-[76px] font-medium leading-[1.05] tracking-tight text-zinc-900 dark:text-white mb-6">
          Apunta. Descubre. Recicla.
        </h1>
        <p className="max-w-lg text-base sm:text-lg font-light text-zinc-600 dark:text-zinc-300 mb-10 leading-relaxed">
          Identifica el residuo con tu cámara y conoce su contenedor exacto, tiempo de degradación y huella de carbono.
        </p>
        <div className="flex justify-center">
          <Link
            to="/escanear"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-lg cursor-pointer"
          >
            <ScanLine size={18} />
            Abrir Escáner
          </Link>
        </div>
      </div>
    </section>
  );
}
