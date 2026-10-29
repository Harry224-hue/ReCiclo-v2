import { ArrowRight, Scan, Leaf, Recycle, CheckCircle2, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { LazyMount } from "../components/PerformanceOptimizer.tsx";

const themeStyles = {
  emerald: "bg-emerald-500 hover:bg-emerald-600 text-white",
  blue: "bg-blue-500 hover:bg-blue-600 text-white",
  purple: "bg-purple-500 hover:bg-purple-600 text-white",
  rose: "bg-rose-500 hover:bg-rose-600 text-white"
};

export function ScannerCTA() {
  const { accentColor } = useTheme();
  const currentThemeBg = themeStyles[accentColor];

  return (
      <LazyMount minHeight={620}>
        <section className="py-36 md:py-28 px-4 md:px-16 lg:px-24 xl:px-32 w-full flex flex-col items-center justify-center text-center transition-colors duration-500">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="relative w-full md:max-w-150 h-50 md:h-55 mb-14 flex justify-center items-center overflow-hidden md:overflow-visible group/cta-images select-none">
              
              {/* Tarjeta Visual 1 (Izquierda: Métricas de CO2) */}
              <div className="absolute w-50 md:w-62.75 h-25 md:h-34.75 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white shadow-sm border border-black/5 dark:border-white/10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0 origin-bottom-right -rotate-12 translate-x-[-115px] translate-y-4 group-hover/cta-images:translate-x-[-155px] group-hover/cta-images:rotate-[-16deg] group-hover/cta-images:translate-y-2 opacity-80 flex flex-col justify-between text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                    <Leaf size={14} />
                    <span>Huella Evitada</span>
                  </div>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold tracking-tight text-white">-48g CO₂</div>
                  <span className="text-[10px] text-zinc-400">Envase PET 100% recuperado</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-4/5 rounded-full" />
                </div>
              </div>

              {/* Tarjeta Visual 3 (Derecha: Asignación de Contenedor) */}
              <div className="absolute w-50 md:w-62.75 h-25 md:h-34.75 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white shadow-sm border border-black/5 dark:border-white/10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-0 origin-bottom-left rotate-12 translate-x-[115px] translate-y-4 group-hover/cta-images:translate-x-[155px] group-hover/cta-images:rotate-16 group-hover/cta-images:translate-y-2 opacity-80 flex flex-col justify-between text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                    <Recycle size={14} />
                    <span>Contenedor Amarillo</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">+15 Pts</span>
                </div>
                <div>
                  <div className="text-xs md:text-sm font-semibold text-white">Plásticos y Latas</div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
                    <MapPin size={11} className="text-amber-400" />
                    <span>Punto limpio a 30m</span>
                  </div>
                </div>
                <div className="text-[9px] text-zinc-400 font-mono flex items-center justify-between border-t border-white/10 pt-1.5">
                  <span>Clasificación exacta</span>
                  <span className="text-amber-400 font-semibold">Depósito OK</span>
                </div>
              </div>

              {/* Tarjeta Visual 2 (Centro: Escáner AI Principal) */}
              <div className="absolute w-50 md:w-62.75 h-25 md:h-34.75 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 translate-y-[-10px] group-hover/cta-images:translate-y-[-22px] group-hover/cta-images:scale-105 border-4 border-white dark:border-zinc-800 flex flex-col justify-between text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 blur-2xl pointer-events-none rounded-full" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Scan size={14} className="text-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-400">ReCiclo Vision</span>
                  </div>
                  <span className="text-[9px] font-semibold bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded-full">
                    99.8% IA
                  </span>
                </div>
                <div className="relative z-10">
                  <div className="text-xs md:text-sm font-bold text-white tracking-tight">Polímero PET Detectado</div>
                  <div className="text-[10px] text-zinc-300 flex items-center gap-1 mt-0.5">
                    <Sparkles size={11} className="text-emerald-400" />
                    <span>Listo para escaneo continuo</span>
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-400 border-t border-white/10 pt-1.5 font-mono">
                  <span>Enfocar residuo</span>
                  <span className="text-emerald-400">0.14s</span>
                </div>
              </div>

            </div>

            <motion.h2 className="text-5xl md:text-[56px] font-medium text-zinc-900 dark:text-white tracking-tight max-w-130 mb-5 transition-colors duration-500 leading-tight" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              Tu cámara, el inicio del ciclo.
            </motion.h2>

            <motion.p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-100 mb-10 transition-colors duration-500 font-light" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              Accede a la herramienta y descubre cómo un simple escaneo transforma la gestión de tus materiales.
            </motion.p>

            <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
              <Link to="/escanear" className={`text-sm font-medium px-7 py-4 rounded-full transition-all duration-500 flex items-center gap-3 group cursor-pointer shadow-xl active:scale-95 ${currentThemeBg}`}>
                <span>Abrir Escáner</span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      </LazyMount>
  );
}
